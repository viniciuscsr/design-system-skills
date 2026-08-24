# `/design-system-skill create`

Generate a design system from one brand color: tokens, ten components, docs, and a
preview page.

You should already have the **color** and **theme** from the user — see the input
section in [../SKILL.md](../SKILL.md). If you don't, go get them first. Never guess
either one.

`<skill-root>` is the folder containing `SKILL.md` — one level up from this file.

## 1. Check the project first

Confirm this is a React or Next project using Tailwind. If it isn't, say so and stop.

Work out which Tailwind version, because step 3 differs:

- **v3** — there's a `tailwind.config.js` (or `.ts`), and the CSS has
  `@tailwind base; @tailwind components; @tailwind utilities;`.
- **v4** — `@tailwindcss/postcss` is in `package.json` and the CSS has
  `@import "tailwindcss";`. There's often no config file at all.

Check whether `@base-ui/react` and `@heroicons/react` are installed. The components
need both. If either is missing, tell the user:

```
npm install @base-ui/react @heroicons/react
```

Don't run it yourself — it's their dependency list.

## 2. Run the script

```bash
node <skill-root>/scripts/generate.mjs --color "#4BC4BE" --mode light
```

Add `--cwd <path>` if you're not already in the project root.

It prints three lists: what it wrote, what it skipped because a file already existed,
and the three fragments to merge. Read that output — it tells you exactly what's left
to do.

If files were skipped, tell the user which ones and ask before re-running with
`--force`. Don't overwrite their work on your own judgement.

## 3. Merge the Tailwind colors

Open `design-system/_generated/tailwind-brand.js` and merge its
`theme.extend.colors.brand` object into the project's Tailwind config. Copy the
`channel`, `ramp` and `text` helpers along with it.

**Merge, never replace.** The project's `content`, plugins, and any existing theme
extensions stay exactly as they are.

If the project is **Tailwind v4** and has no config file, create `tailwind.config.js`
from the fragment, then add this to the top of the global stylesheet so v4 loads it:

```css
@import "tailwindcss";
@config "../tailwind.config.js";
```

Adjust that path to wherever the stylesheet sits relative to the config.

## 4. Merge the CSS variables

Open `design-system/_generated/globals-root.css` and copy its `:root` block into the
project's global stylesheet, above the existing styles. If a `:root` block is already
there, merge the variables into it rather than adding a second one.

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

## 6. Clean up and report

Delete the `design-system/_generated/` folder once all three fragments are merged —
they're one-time instructions, not project files. Keep `design-system/tokens.md` and
`design-system/README.md`; those are the permanent docs.

Then tell the user:

- The preview page URL, e.g. `http://localhost:3000/internal/design-system`
- Anything that was skipped because it already existed
- The install command, if `@base-ui/react` or `@heroicons/react` was missing

## Will / will not

**Will:** write the tokens, ten components with their docs, the two design-system
docs, the preview page, and the agent rules block.

**Will not:**

- Change any existing page or component. Replacing hardcoded colors across the app is
  a separate job — if the user wants it, they can ask afterwards.
- Invent a color or default the theme. Both come from the user.
- Overwrite a file the script reported as skipped, unless the user says to.
- Install packages.
