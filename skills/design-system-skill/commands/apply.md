# `/design-system-skill apply`

Replace hardcoded colors and raw elements in the host app with the design system's
tokens and components.

You should already have **scope** and **depth** from the user — see the input section
in [../SKILL.md](../SKILL.md). If you don't, go get them first. Never guess either one.
The one question that comes later is *"Which page?"*, in step 3, because it needs the
scan to fill its options.

`<skill-root>` is the folder containing `SKILL.md` — one level up from this file.

## 1. Check the design system exists

```bash
test -f design-system/tokens.md && ls design-system/components
```

If either fails, stop and say:

> No design system found in this project. Run `/design-system-skill create` first.

Do not invent tokens, and do not fall back to colors you find in the app.

## 2. Read the vocabulary

Read `design-system/tokens.md` and list `design-system/components`. These two are the
**only** things you are allowed to replace with. Anything not in them stays untouched.

For component props, read the matching file in `design-system/docs/`. Do not guess a
`variant` or `size` value — use the ones the doc names.

## 3. Scan

```bash
node <skill-root>/scripts/diagnose.mjs --by-file
```

This writes `design-system-diagnosis.json` with a `files` array: every file that has a
color in it, and which colors. The design system's own files are already excluded.

If the scope is **one page**, ask the `Page` follow-up now — **AskUserQuestion**,
question *"Which page?"*, options being the four files with the most colors from the
scan. Then keep only that page's file and the files it imports. Everything else in the
list is out of scope — do not touch it.

## 4. Write the plan, then confirm

Before editing anything, write `design-system/_generated/apply-plan.md`:

```markdown
| Found | In | Count | Becomes |
| --- | --- | --- | --- |
| `#27265D` | `app/page.jsx` | 12 | `text-brand-primary` |
| `bg-[#4BC4BE]` | `app/page.jsx` | 3 | `bg-brand-primary` |
| `<button className="...">` | `app/nav.jsx` | 3 | `<Button variant="primary">` |
| `#8A8A8A` | `app/nav.jsx` | 2 | **unmapped** |
```

Rules for the table:

- One row per value per file. Match by what the token *is*, not by what looks close —
  if a hex isn't in `tokens.md`, mark it **unmapped**. Never round a color to the
  nearest token.
- Component rows only if the depth is **colors and components**. If it's
  **colors only**, the table has color rows and nothing else.
- A raw element only becomes a component when the props line up. A `<button>` with an
  `onClick` and a label maps cleanly; one with custom children, a `ref`, or handlers
  the component doesn't take is **unmapped**.

Show the table to the user, say how many files it touches and how many rows are
unmapped, and ask:

> Apply these changes?

Wait for a yes. If they say no, stop — the plan file stays for them to read.

## 5. Edit, one file at a time

Work down the table file by file. Per file:

- Change **only** `className`, `style`, and imports. If the depth is
  **colors and components**, also swap the element tag and add its import.
- Never change logic, state, props on existing components, JSX structure, or text.
- Never touch a value that isn't a row in the table.
- Apply every row for that file, then move to the next file. Do not batch across files.

If a row turns out not to apply once you see the code, leave the code as it is and move
the row to unmapped. Do not improvise a different replacement.

## 6. Verify

```bash
node <skill-root>/scripts/diagnose.mjs --by-file
```

Compare against the first scan. Hardcoded hex and `bg-[#...]` counts should drop by the
number of rows you applied. If a count didn't move, that file didn't get edited — say so
rather than glossing over it.

Then run the project's build or typecheck if it has one (`npm run build`, `npm run
typecheck`, `tsc --noEmit` — whichever the `package.json` scripts list). If it fails,
report the error. Do not start fixing unrelated things.

## 7. Report

- Files changed, and how many replacements in each
- Colors before → after, from the two scans
- The unmapped list, with why each one was skipped

Leave `design-system/_generated/apply-plan.md` in place — it's the record of what
happened. Delete `design-system-diagnosis.json` if it wasn't there before.

## Will / will not

**Will:** swap hardcoded colors for tokens, and — when asked — raw elements for design
system components, inside the scope the user picked.

**Will not:**

- Run without a design system already in the project.
- Map a color that isn't an exact token. Close is unmapped.
- Change layout, spacing, logic, copy, or anything outside `className`, `style`, and
  imports.
- Touch files outside the chosen scope.
- Edit anything before the user confirms the plan.
