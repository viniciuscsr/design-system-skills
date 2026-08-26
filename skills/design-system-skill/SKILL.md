---
name: design-system-skill
description: Design system tooling for a React/Tailwind project. Three commands - diagnose (scan and report what exists), create (generate a design system from one brand color), and apply (use the design system across the app's pages).
disable-model-invocation: true
---

# Design system skill

Three commands. Read the matching file in `commands/`, then follow it.

| Command | What it does | File |
| --- | --- | --- |
| `diagnose` | Scan this project and report the colors, icon libraries, and reusable components it already has. | [commands/diagnose.md](commands/diagnose.md) |
| `create` | Generate a design system from one brand color: tokens, ten components, docs, and a preview page. | [commands/create.md](commands/create.md) |
| `apply` | Use the design system's colors and components across the app's pages. | [commands/apply.md](commands/apply.md) |

`<skill-root>` in those files is this folder — the one containing this `SKILL.md`.

## Routing

- `diagnose` → read [commands/diagnose.md](commands/diagnose.md).
- `create` → collect the input below **first**, then read [commands/create.md](commands/create.md).
- `apply` → check `design-system/tokens.md` exists. If it doesn't, say *"There's no
  design system in this project yet. Run `/design-system-skill create` first."* and
  stop. Otherwise collect the input below, then read [commands/apply.md](commands/apply.md).
- No command → say which three exist and stop. Do not ask them to pick, and do not pick
  for them. They type the one they want.
- Anything else → say it isn't a command, name the three, and stop. Do not guess at what
  they meant.

## Asking

Every question below **except the brand color** is asked with the **AskUserQuestion**
tool, so it comes up as the native picker. Ask them with the wording and the options
exactly as written here — same question, same options, every run.

Keep it plain. No jargon in a question or an option: not "tokens", "scope", "depth",
"variants", "components", or "unmapped". Say "colors", "pages", "buttons and inputs",
"left alone".

Take anything the user already gave on the command line and skip that question. Ask only
for what's missing. Never default a missing answer silently.

## Input for `create`

Two values. Neither is ever guessed or defaulted silently.

If the user already gave one on the command line — `/design-system-skill create #4BC4BE dark` —
take it and skip that question.

### 1. Brand color

Ask this as **plain text**. Do **not** use AskUserQuestion here — there's nothing to
pick from.

> What's your brand color? Paste a hex value, e.g. `#4BC4BE`.

Accept it with or without the leading `#`, upper or lower case. Validate it:

```bash
node <skill-root>/scripts/generate.mjs --check-color "<their answer>"
```

Exit code 0 means valid, and it prints the normalized value to use. Non-zero means
invalid — tell them what was wrong, show the expected shape (`#` plus six hex digits),
and ask again.

Never fall back to a default color.

### 2. Theme

**AskUserQuestion** — header `Theme`, question *"Light or dark?"*.

| Option | Description |
| --- | --- |
| **Light** (Recommended) | White background, dark text |
| Dark | Dark background, light text |

Collect both before running anything.

## Input for `apply`

Two picks. Both go through **AskUserQuestion**, in this order.

### 1. How much

Header `Pages`, question *"How much should I change?"*.

| Option | Description |
| --- | --- |
| **Just one page** (Recommended) | Change a single page and the pieces it uses |
| The whole site | Change every page |

If they pick **Just one page**, ask a follow-up — header `Page`, question *"Which
page?"* — listing the app's main pages as the options. The tool's own "Other" lets them
type a page you didn't list.

### 2. What

Header `Changes`, question *"What should I change?"*.

| Option | Description |
| --- | --- |
| **Just the colors** (Recommended) | Safest. Nothing moves, things only change color |
| Colors, buttons and inputs | Also swap plain buttons and inputs for the new ones |
