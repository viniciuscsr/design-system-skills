#!/usr/bin/env bash
set -euo pipefail

HOST="${1:-.}"
CURSOR="${HOST}/.cursor/skills"
CLAUDE="${HOST}/.claude/skills"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p "$CURSOR" "$CLAUDE"

rm -rf "$CURSOR/diagnose-design-system" "$CLAUDE/diagnose-design-system"
cp -R "$ROOT/skills/diagnose-design-system" "$CURSOR/"
cp -R "$ROOT/skills/diagnose-design-system" "$CLAUDE/"

echo "Installed diagnose-design-system to $CURSOR and $CLAUDE"
