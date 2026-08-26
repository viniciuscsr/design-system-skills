# `/design-system-skill apply`

Use the design system in the app, so the pages actually look like it.

You should already have the two answers from the user — see the input section in
[../SKILL.md](../SKILL.md). If you don't, go get them first.

`<skill-root>` is the folder containing `SKILL.md` — one level up from this file.

## 1. Read the design system first

```bash
cat design-system/tokens.md && ls components/ui src/components/ui 2>/dev/null
```

If `design-system/tokens.md` isn't there, stop and say:

> There's no design system in this project yet. Run `/design-system-skill create` first.

Read `tokens.md` and the `.md` file next to each component. This is the whole point of
the command: you use the real color names and the real prop values instead of guessing
them. Only use names that appear in those files.

## 2. Make the changes

If they chose one page, change that page and the pieces it uses. If they chose the
whole site, work through the pages one file at a time.

In each file:

- Replace hardcoded colors — `#27265D`, `bg-[#27265D]`, `dark:bg-[#27265D]`,
  `from-[#27265D]`, `rgb(...)` — with the matching color name from `tokens.md`.
- If they also chose buttons and inputs: replace plain `<button>`, `<input>`,
  `<select>` and card-like `<div>`s with the matching component, and import it from
  `@/components/ui/<Name>`.

Leave the text, the layout, and how the page works exactly as they are. If a color has
no good match in the design system, leave it and mention it at the end.

## 3. Check it works and tell them

Run the project's build or typecheck if it has one (`npm run build`, `npm run
typecheck`, `tsc --noEmit` — whichever is in `package.json`). If it fails, fix what you
broke. Don't start fixing unrelated things.

Then tell the user, in plain words:

- Which files you changed
- Anything you left alone, and why
- The page to open and look at, e.g. `http://localhost:3000`

## Will / will not

**Will:** use the colors and components from the design system across the pages they
picked, and check the project still builds.

**Will not:**

- Run when there's no design system yet.
- Change text, layout, or how anything works.
- Use a color or a prop value that isn't in the design system's own files.
- Touch pages outside what they picked.
