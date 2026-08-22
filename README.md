# Design system diagnose skill

Claude skill / agent skill that scans a frontend repo and writes a simple diagnosis page: colors, icon libraries, and reusable components.

## Install

```bash
./scripts/install.sh /path/to/host-repo
```

Or copy `skills/diagnose-design-system` into `.cursor/skills/` and `.claude/skills/`.

## Trigger phrases

- Diagnose my design system
- Audit UI token consistency
- Update the design system diagnosis

## Run the scanner

From the host repo root:

```bash
node .cursor/skills/diagnose-design-system/scripts/diagnose.mjs
```

Writes `design-system-diagnosis.json`. The skill then fills a page at `/internal/design-system-diagnosis` (or `/dev/...` / `/_lab/...`).

## Will / will not

**Will:** list colors, icon libraries, and reusable components found in the repo.

**Will not:** invent tokens, restyle the app, or add type/heading samples.
