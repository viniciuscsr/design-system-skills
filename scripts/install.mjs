#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_NAME = 'design-system-skill';

// Superseded folder names, removed on install. Before v1.1.0 each command shipped
// as its own skill; leaving the old folder behind gives the user two competing
// slash commands.
const RETIRED_SKILL_NAMES = ['diagnose-design-system'];

// Each tool reads skills from its own folder. Codex has no skills convention —
// it reads AGENTS.md — so it also gets a pointer appended there.
const TOOLS = [
  { key: 'claude', dir: '.claude' },
  { key: 'cursor', dir: '.cursor' },
  { key: 'codex', dir: '.codex' },
];

const AGENTS_HEADING = '## Design system skill';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillSource = path.join(packageRoot, 'skills', SKILL_NAME);

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(path.join(skillSource, 'SKILL.md'))) {
  console.error(`Missing skill files at ${skillSource}`);
  process.exit(1);
}

const host = path.resolve(args.cwd || process.cwd());
const base = args.global ? os.homedir() : host;
const selected = TOOLS.filter((tool) => args[tool.key] !== false);

if (!selected.length) {
  console.error(
    'Nothing to install. Use the default, or one of --claude-only, --cursor-only, --codex-only, --global.',
  );
  process.exit(1);
}

for (const tool of selected) {
  const skillsDir = path.join(base, tool.dir, 'skills');
  const dest = path.join(skillsDir, SKILL_NAME);

  fs.mkdirSync(skillsDir, { recursive: true });

  for (const retired of RETIRED_SKILL_NAMES) {
    const stale = path.join(skillsDir, retired);
    if (!fs.existsSync(stale)) continue;
    fs.rmSync(stale, { recursive: true, force: true });
    console.log(`Removed superseded ${retired} from ${skillsDir}`);
  }

  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(skillSource, dest, { recursive: true });
  console.log(`Installed ${SKILL_NAME} to ${dest}`);

  if (tool.key === 'codex') linkFromAgentsFile(base, dest);
}

// Codex discovers instructions through AGENTS.md, not a skills folder, so point
// it at the two command files. Rewrites its own section rather than duplicating.
function linkFromAgentsFile(dir, dest) {
  const file = path.join(dir, 'AGENTS.md');
  const rel = path.relative(dir, dest).split(path.sep).join('/');
  const section = [
    AGENTS_HEADING,
    '',
    'Design system tooling for this project. Run only when asked by name.',
    '',
    `- \`design-system-skill diagnose\` — scan this project and report the colors, icon`,
    '  libraries, and reusable components it already has.',
    `  Read \`${rel}/commands/diagnose.md\` and follow it.`,
    `- \`design-system-skill create\` — generate a design system from one brand color.`,
    `  Read \`${rel}/SKILL.md\` for the questions to ask, then \`${rel}/commands/create.md\`.`,
    '',
    '',
  ].join('\n');

  let text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

  if (text.includes(AGENTS_HEADING)) {
    // Replace from our heading up to the next same-level heading, or end of file.
    const start = text.indexOf(AGENTS_HEADING);
    const after = text.indexOf('\n## ', start + AGENTS_HEADING.length);
    const end = after === -1 ? text.length : after + 1;
    text = text.slice(0, start) + section + text.slice(end);
  } else {
    if (text && !text.endsWith('\n')) text += '\n';
    if (text) text += '\n';
    text += section;
  }

  fs.writeFileSync(file, text);
  console.log(`Pointed ${path.relative(dir, file) || 'AGENTS.md'} at ${SKILL_NAME}`);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--cwd' && argv[i + 1]) {
      out.cwd = argv[++i];
      continue;
    }
    if (key === '--global') out.global = true;

    // `--x-only` turns off every other tool.
    const only = /^--(claude|cursor|codex)-only$/.exec(key);
    if (only) {
      for (const tool of TOOLS) out[tool.key] = tool.key === only[1];
    }
  }
  return out;
}
