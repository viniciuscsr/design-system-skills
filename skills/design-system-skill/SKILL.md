---
name: design-system-skill
description: Design system tooling for a React/Tailwind project. Three commands - diagnose (scan and report what exists), create (generate a design system from one brand color), and apply (swap the app's hardcoded colors and raw elements for the design system).
disable-model-invocation: true
---

# Design system skill

Three commands. Read the matching file in `commands/`, then follow it.

| Command | What it does | File |
| --- | --- | --- |
| `diagnose` | Scan this project and report the colors, icon libraries, and reusable components it already has. | [commands/diagnose.md](commands/diagnose.md) |
| `create` | Generate a design system from one brand color: tokens, ten components, docs, and a preview page. | [commands/create.md](commands/create.md) |
| `apply` | Replace the app's hardcoded colors and raw elements with the design system's tokens and components. | [commands/apply.md](commands/apply.md) |

`<skill-root>` in those files is this folder — the one containing this `SKILL.md`.

## Routing

- `diagnose` → read [commands/diagnose.md](commands/diagnose.md).
- `create` → collect the input below **first**, then read [commands/create.md](commands/create.md).
- `apply` → collect the input below **first**, then read [commands/apply.md](commands/apply.md).
- No command → list the three and ask which one they want. Do not pick for them.
- Anything else → say it isn't a command, list the three, and stop. Do not guess at what they meant.

## Asking

Every question below is asked with the **AskUserQuestion** tool, so it comes up as the
native picker. Ask them with the wording and the options exactly as written here —
same question, same order, every run. The only free-text question in this skill is the
brand color.

Take anything the user already gave on the command line and skip that question. Ask
only for what's missing. Never default a missing answer silently.

## Input for `create`

Two values. Neither is ever guessed or defaulted silently.

If the user already gave one on the command line — `/design-system-skill create #4BC4BE dark` —
take it and skip that question. Ask only for what's missing.

### 1. Brand color

The one free-text question. Ask:

> What's your brand color? Paste a hex value, e.g. `#4BC4BE`.

Accept it with or without the leading `#`, upper or lower case. Validate it:

```bash
node <skill-root>/scripts/generate.mjs --check-color "<their answer>"
```

Exit code 0 means valid, and it prints the normalized value to use. Non-zero means invalid —
tell them what was wrong, show the expected shape (`#` plus six hex digits), and ask again.

Never fall back to a default color.

### 2. Theme

**AskUserQuestion** — header `Theme`, question *"Which theme should the design system
use?"*. Two options, **Light first**:

| Option | Description |
| --- | --- |
| **Light** (Recommended) | White page, dark text |
| Dark | Dark page, light text |

Collect both before running anything.

## Input for `apply`

Two picks. Both go through **AskUserQuestion**. Ask them in this order.

### 1. Scope

Header `Scope`, question *"Where should the design system be applied?"*.

| Option | Description |
| --- | --- |
| **One page** (Recommended) | Change a single page and the components it imports |
| Whole app | Change every file that has a hardcoded color |

If they pick **One page**, ask a follow-up — header `Page`, question *"Which page?"* —
listing the files with the most colors from the scan in
[commands/apply.md](commands/apply.md) step 3 as the options. The tool's own "Other"
lets them type a path you didn't list, so run the scan before this follow-up.

### 2. Depth

Header `Depth`, question *"What should be changed?"*.

| Option | Description |
| --- | --- |
| **Colors only** (Recommended) | Swap hardcoded colors for tokens. Lowest risk |
| Colors and components | Also swap raw elements like `<button>` for design system components |
