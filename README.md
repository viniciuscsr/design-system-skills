# Design system skills

An agent skill for frontend design systems. Install with `npx` into Cursor or Claude Code.

Repo: [github.com/viniciuscsr/design-system-skills](https://github.com/viniciuscsr/design-system-skills)

## Install

From the **host project** (the app you want to work in):

```bash
npx @vinnycsr/design-system-skills
```

That copies `design-system-skill` into:

- `.cursor/skills/design-system-skill`
- `.claude/skills/design-system-skill`

Options:

```bash
npx @vinnycsr/design-system-skills --cursor-only
npx @vinnycsr/design-system-skills --claude-only
npx @vinnycsr/design-system-skills --global
```

`--global` installs to `~/.cursor/skills` and `~/.claude/skills` (every project).

Re-run the same command to overwrite an older install. If you have the old
`diagnose-design-system` skill from before v1.1.0, installing removes it.

## Commands

Slash commands only — nothing runs from ordinary chat.

| Command | What it does |
| --- | --- |
| `/design-system-skill diagnose` | Scan this project and report the colors, icon libraries, and reusable components it already has. |
| `/design-system-skill create` | Generate a design system from one brand color. |

## Diagnose

Scans the repo and writes a page listing colors, icon libraries, and reusable
components — a picture of what's already there.

Writes `design-system-diagnosis.json`, then fills `/internal/design-system-diagnosis`
(or `/dev/...` / `/_lab/...`).

**Will:** list the colors, icon libraries, and reusable components it finds.

**Will not:** invent tokens, restyle the app, or add type/heading samples.

## Create

Asks for a brand color (hex) and a theme (light or dark), then writes a working
design system into the project:

- **Tokens** — a `brand.*` Tailwind layer driven by CSS variables, including a 50–900
  scale derived from your color. Nothing is hardcoded in the config; the channels in
  `globals.css` are the source of truth, so rebranding is one block of edits.
- **Components** — ten primitives in `components/ui/`, already wired to the tokens:
  Button, Badge, Card, Dialog, Tabs, Tooltip, Checkbox, Input, Select, Switch. Built on
  [Base UI](https://base-ui.com) and [Heroicons](https://heroicons.com), so the project
  needs `@base-ui/react` and `@heroicons/react`.
- **Docs** — `design-system/tokens.md` and `README.md`, plus one `.md` per component.
- **Agent rules** — a `## Design system` section added to `CLAUDE.md` or `AGENTS.md`,
  so your AI tool uses the tokens instead of inventing hex values.
- **A preview page** — `/internal/design-system`, rendering every token, type role,
  icon size, and component. 404s on Vercel production.

Requires React (Next.js recommended) with Tailwind v3 or v4.

**Will not:** touch any existing page or component, invent a color, overwrite files
that already exist, or install packages. Replacing hardcoded colors across an existing
app is a separate job — ask for it after.

You can run it directly if you'd rather skip the questions:

```bash
node .claude/skills/design-system-skill/scripts/generate.mjs --color "#4BC4BE" --mode light
```
