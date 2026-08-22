# Design system skills

Agent skills for frontend design systems. Install with `npx` into Cursor or Claude Code.

Repo: [github.com/viniciuscsr/design-system-skills](https://github.com/viniciuscsr/design-system-skills)

## Install

From the **host project** (the app you want to scan):

```bash
npx github:viniciuscsr/design-system-skills
```

That copies `diagnose-design-system` into:

- `.cursor/skills/diagnose-design-system`
- `.claude/skills/diagnose-design-system`

Options:

```bash
npx github:viniciuscsr/design-system-skills --cursor-only
npx github:viniciuscsr/design-system-skills --claude-only
npx github:viniciuscsr/design-system-skills --global
```

`--global` installs to `~/.cursor/skills` and `~/.claude/skills` (every project).

After this package is on npm:

```bash
npx @viniciuscsr/design-system-skills
```

Re-run the same command to overwrite an older install.

## Skills

| Skill | Trigger |
| --- | --- |
| **diagnose-design-system** | “Diagnose my design system”, “Update the design system diagnosis” |

## Diagnose

Scans the host repo and writes a page of colors, icon libraries, and reusable components.

After install, from the host repo root:

```bash
node .cursor/skills/diagnose-design-system/scripts/diagnose.mjs
```

Writes `design-system-diagnosis.json`. The skill then fills `/internal/design-system-diagnosis` (or `/dev/...` / `/_lab/...`).

**Will:** list colors, icon libraries, and reusable components found in the repo.

**Will not:** invent tokens, restyle the app, or add type/heading samples.
