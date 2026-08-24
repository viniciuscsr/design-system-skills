---
name: design-system-skill
description: Design system tooling for a React/Tailwind project. Two commands - diagnose (scan and report what exists) and create (generate a design system from one brand color).
disable-model-invocation: true
---

# Design system skill

Two commands. Read the matching file in `commands/`, then follow it.

| Command | What it does | File |
| --- | --- | --- |
| `diagnose` | Scan this project and report the colors, icon libraries, and reusable components it already has. | [commands/diagnose.md](commands/diagnose.md) |
| `create` | Generate a design system from one brand color: tokens, ten components, docs, and a preview page. | [commands/create.md](commands/create.md) |

`<skill-root>` in those files is this folder — the one containing this `SKILL.md`.

## Routing

- `diagnose` → read [commands/diagnose.md](commands/diagnose.md).
- `create` → collect the input below **first**, then read [commands/create.md](commands/create.md).
- No command → list the two and ask which one they want. Do not pick for them.
- Anything else → say it isn't a command, list the two, and stop. Do not guess at what they meant.

## Input for `create`

Two values. Neither is ever guessed or defaulted silently.

If the user already gave one on the command line — `/design-system-skill create #4BC4BE dark` —
take it and skip that question. Ask only for what's missing.

### 1. Brand color

Ask as free text:

> What's your brand color? Paste a hex value, e.g. `#4BC4BE`.

Accept it with or without the leading `#`, upper or lower case. Validate it:

```bash
node <skill-root>/scripts/generate.mjs --check-color "<their answer>"
```

Exit code 0 means valid, and it prints the normalized value to use. Non-zero means invalid —
tell them what was wrong, show the expected shape (`#` plus six hex digits), and ask again.

Never fall back to a default color.

### 2. Theme

Ask as a pick, not free text. Two options, **Light preselected**:

| Option | Meaning |
| --- | --- |
| **Light** (default) | White page, dark text |
| Dark | Dark page, light text |

Collect both before running anything.
