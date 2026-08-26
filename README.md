# Design system skills

An agent skill for frontend design systems. Works in Claude Code, Cursor, and Codex.

Created by [uniquel.io](https://uniquel.io/design-system/design-system-generator) ·
[github.com/viniciuscsr/design-system-skills](https://github.com/viniciuscsr/design-system-skills)

## Install

Run this from the project you want to work in:

### Claude

```bash
npx @vinnycsr/design-system-skills --claude-only
```

### Cursor
```bash
npx @vinnycsr/design-system-skills --cursor-only
```


## Commands

| Command | |
| --- | --- |
| `/design-system-skill diagnose` | Reports the colors, icons, and components already in the project. |
| `/design-system-skill create` | Builds a design system from one brand color. |
| `/design-system-skill apply` | Uses the design system's colors and components across the app's pages. |

Slash commands only — nothing runs from ordinary chat.

## Diagnose

Scans the repo and writes a page listing what's there. Changes nothing else.

## Create

Asks for a brand color and a theme, then writes:

- **Tokens** — a `brand.*` Tailwind layer with a 50–900 scale from your color
- **Components** — ten primitives in `components/ui/`, wired to the tokens
- **Docs** — `design-system/tokens.md`, plus one `.md` per component
- **Agent rules** — a section in `CLAUDE.md` / `AGENTS.md` so your AI tool uses the tokens
- **A preview page** — `/internal/design-system`, showing every token and component

Needs React with Tailwind v3 or v4. Installs `@base-ui/react` and `@heroicons/react`
if missing. Won't touch existing pages, invent a color, or overwrite your files.

### Running it directly

```bash
node .claude/skills/design-system-skill/scripts/generate.mjs \
  --color "#4BC4BE" --mode light
```

| Flag | |
| --- | --- |
| `--color` | Six hex digits. Required. |
| `--mode` | `light` or `dark`. Required. |
| `--cwd` | Project root. Defaults to the current directory. |
| `--force` | Overwrite existing files. |
| `--skip-install` | Print the dependency command instead of running it. |
