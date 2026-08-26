# `/design-system-skill create`

Generate a design system from one brand color: tokens, ten components, docs, and a
preview page.

You should already have the **color** and **theme** from the user — see the input
section in [../SKILL.md](../SKILL.md). If you don't, go get them first. Never guess
either one.

`<skill-root>` is the folder containing `SKILL.md` — one level up from this file.

## 1. Check with the user before running

The script installs missing dependencies (`@base-ui/react`, `@heroicons/react`) using
whichever package manager the lockfile points to. That touches `node_modules` and the
lockfile, so say so first:

> This adds two packages and creates your design system files. Go ahead?

If they'd rather install by hand, add `--skip-install` and the script will print the
exact command instead.

You do **not** need to check whether this is a React or Tailwind project — the script
does that itself and refuses to write anything if it isn't. If it exits with that
error, relay the message and stop.

## 2. Run the script

```bash
node <skill-root>/scripts/generate.mjs --color "#4BC4BE" --mode light
```

Add `--cwd <path>` if you're not already in the project root. Add `--skip-install` if
the user asked to handle dependencies themselves.

Read the output. It tells you everything left to do:

- what it wrote, and what it skipped because a file already existed
- the three fragments to merge
- which stylesheet it found, and for Tailwind v4 **the exact `@config` line to use**
- whether a sitemap needs editing
- whether dependencies were installed

If files were skipped, tell the user which ones and ask before re-running with
`--force`. Don't overwrite their work on your own judgement.

## 3. Merge the Tailwind colors

Open `design-system/_generated/tailwind-brand.js` and merge its
`theme.extend.colors.brand` object into the project's Tailwind config. Copy the
`channel`, `ramp` and `text` helpers along with it.

**Merge, never replace.** The project's `content`, plugins, and any existing theme
extensions stay exactly as they are.

If the project is **Tailwind v4** and has no config file, create `tailwind.config.js`
from the fragment, then add the two lines to the top of the stylesheet the script
named:

```css
@import "tailwindcss";
@config "...";
```

**Copy the `@config` line verbatim from the script output.** The path is relative to
the stylesheet, not the project root, and the script has already worked it out. Do not
count directories yourself — getting this wrong is the most common way the install
breaks.

## 4. Merge the CSS variables

Open `design-system/_generated/globals-root.css` and copy its `:root` block into that
same stylesheet, above the existing styles. If a `:root` block is already there, merge
the variables into it rather than adding a second one.

These channels are the source of truth for every color. The Tailwind config only
points at them.

## 5. Add the agent rules

Take the contents of `design-system/_generated/AGENTS-snippet.md` and add it under a
`## Design system` heading in the project's AI instructions file. Pick the target in
this order:

1. `CLAUDE.md` exists → append to it.
2. Otherwise `AGENTS.md` exists → append to it.
3. Otherwise a `.claude/` folder exists → create `CLAUDE.md` and append.
4. Otherwise → create `AGENTS.md` and append.

If a `## Design system` heading is already in that file, replace the section instead
of adding a second one.

## 6. Keep the preview page out of production

The page already 404s in production and sets `robots: noindex`. One thing is left, and
only if the script reported a sitemap:

- **`next-sitemap.config.js`** — add `'/internal/*'` to the `exclude` array (create the
  array if it isn't there).
- **`app/sitemap.ts`** (or `.js`, or under `src/`) — filter out any route starting with
  `/internal`.

If the script said "none found", there's nothing to do.

## 7. Clean up and report

Delete the `design-system/_generated/` folder once all three fragments are merged —
they're one-time instructions, not project files. Keep `design-system/tokens.md` and
`design-system/README.md`; those are the permanent docs.

Then tell the user:

- The preview page URL, e.g. `http://localhost:3000/internal/design-system`
- Anything that was skipped because it already existed
- Which dependencies were installed, if any

## Will / will not

**Will:** write the tokens, ten components with their docs, the two design-system
docs, the preview page, and the agent rules block. Install the two required packages
unless told not to.

**Will not:**

- Change any existing page or component. Replacing hardcoded colors across the app is
  a separate job — if the user wants it, they can ask afterwards.
- Invent a color or default the theme. Both come from the user.
- Overwrite a file the script reported as skipped, unless the user says to.
- Write anything into a project that isn't React with Tailwind.
