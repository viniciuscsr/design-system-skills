# `/design-system-skill diagnose`

Read-only scan, then a simple report page. Do not restyle the host app. Do not invent tokens. Do not add type or heading samples.

## 1. Run the scanner

From the **host repo root**:

```bash
node <skill-root>/scripts/diagnose.mjs
```

`<skill-root>` is the folder containing `SKILL.md` — one level up from this file.

Read stdout and `design-system-diagnosis.json`.

## 2. Choose a page path

Probe existing files. Take the first free path. If all are taken, ask.

1. `/internal/design-system-diagnosis`
2. `/dev/design-system-diagnosis`
3. `/_lab/design-system-diagnosis`

Next App Router files look like `app/internal/design-system-diagnosis/page.jsx`. Prefer `.jsx` unless the host is TypeScript-only.

## 3. Write or update the page

Copy [../templates/page.jsx](../templates/page.jsx). Fill only:

- **Colors** from `colors`
- **Icon libraries** from `iconLibraries`
- **Reusable components** from `components` (show the repo-relative `file` as the caption)

For Tailwind colors use the full class string (`bg-brand-primary`, not `bg-${token}`).

Do not add fonts, type scales, or heading samples.

## 4. Tell the user

Give the local URL, for example `http://localhost:3000/internal/design-system-diagnosis`.

Re-running `/design-system-skill diagnose` updates the page in place.

## Report shape

See [../examples/diagnosis.example.json](../examples/diagnosis.example.json).
