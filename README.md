# Design system skills

An agent skill for frontend design systems. Works in Claude Code, Cursor, and Codex.

Repo: [github.com/viniciuscsr/design-system-skills](https://github.com/viniciuscsr/design-system-skills)

## Install

Run this from the **project you want to work in**, not from this repo:

```bash
cd ~/my-app
npx @vinnycsr/design-system-skills
```

That installs into all three tools at once. Re-run it any time to update.

### Claude Code

```bash
npx @vinnycsr/design-system-skills --claude-only
```

Lands in `.claude/skills/design-system-skill`. Invoke by typing:

```
/design-system-skill create
/design-system-skill diagnose
```

### Cursor

```bash
npx @vinnycsr/design-system-skills --cursor-only
```

Lands in `.cursor/skills/design-system-skill`. Invoke the same way from the Cursor
chat panel — type `/design-system-skill create`. If your Cursor build doesn't show
skills as slash commands, ask for it by name instead: *"run the design-system-skill
create command."*

### Codex

```bash
npx @vinnycsr/design-system-skills --codex-only
```

Lands in `.codex/skills/design-system-skill`, and appends a `## Design system skill`
section to your `AGENTS.md` pointing at it — Codex reads `AGENTS.md` rather than a
skills folder. Re-running replaces that section instead of adding a second one, and
leaves the rest of the file alone.

Invoke by name: *"run design-system-skill create."*

### Options

```bash
npx @vinnycsr/design-system-skills --global      # install for every project
```

`--global` installs to `~/.claude`, `~/.cursor` and `~/.codex` instead of the current
project.

If you have the old `diagnose-design-system` skill from before v1.1.0, installing
removes it.

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

Asks for a brand color (hex) and a theme (light or dark), then writes a working design
system into the project:

- **Tokens** — a `brand.*` Tailwind layer driven by CSS variables, including a 50–900
  scale derived from your color. Nothing is hardcoded in the config; the channels in
  your stylesheet are the source of truth, so rebranding is one block of edits.
- **Components** — ten primitives in `components/ui/`, already wired to the tokens:
  Button, Badge, Card, Dialog, Tabs, Tooltip, Checkbox, Input, Select, Switch. Built on
  [Base UI](https://base-ui.com) and [Heroicons](https://heroicons.com) — both are
  installed for you if missing.
- **Docs** — `design-system/tokens.md` and `README.md`, plus one `.md` per component.
- **Agent rules** — a `## Design system` section added to `CLAUDE.md` or `AGENTS.md`,
  so your AI tool uses the tokens instead of inventing hex values.
- **A preview page** — `/internal/design-system`, rendering every token, type role,
  icon size, and component. 404s in production, `noindex`, and excluded from your
  sitemap.

Requires React (Next.js recommended) with Tailwind v3 or v4. The script checks both
and refuses to write anything if either is missing.

**Will not:** touch any existing page or component, invent a color, or overwrite files
that already exist. Replacing hardcoded colors across an existing app is a separate
job — ask for it after.

### Running it directly

If you'd rather skip the questions:

```bash
node .claude/skills/design-system-skill/scripts/generate.mjs \
  --color "#4BC4BE" --mode light
```

| Flag | |
| --- | --- |
| `--color` | Brand color, six hex digits. Required. |
| `--mode` | `light` or `dark`. Required. |
| `--cwd` | Project root. Defaults to the current directory. |
| `--force` | Overwrite files that already exist. |
| `--skip-install` | Print the dependency install command instead of running it. |

It prints what it wrote, what it skipped, the fragments left to merge, and — for
Tailwind v4 — the exact `@config` line for your stylesheet.
