#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_NAME = 'diagnose-design-system';
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillSource = path.join(packageRoot, 'skills', SKILL_NAME);

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(path.join(skillSource, 'SKILL.md'))) {
  console.error(`Missing skill files at ${skillSource}`);
  process.exit(1);
}

const host = path.resolve(args.cwd || process.cwd());
const targets = [];

if (args.global) {
  if (args.cursor !== false) {
    targets.push(path.join(os.homedir(), '.cursor', 'skills', SKILL_NAME));
  }
  if (args.claude !== false) {
    targets.push(path.join(os.homedir(), '.claude', 'skills', SKILL_NAME));
  }
} else {
  if (args.cursor !== false) {
    targets.push(path.join(host, '.cursor', 'skills', SKILL_NAME));
  }
  if (args.claude !== false) {
    targets.push(path.join(host, '.claude', 'skills', SKILL_NAME));
  }
}

if (!targets.length) {
  console.error('Nothing to install. Use default, --cursor-only, --claude-only, or --global.');
  process.exit(1);
}

for (const dest of targets) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(skillSource, dest, { recursive: true });
  console.log(`Installed ${SKILL_NAME} to ${dest}`);
}

function parseArgs(argv) {
  const out = { cursor: true, claude: true };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--cwd' && argv[i + 1]) {
      out.cwd = argv[++i];
      continue;
    }
    if (key === '--global') out.global = true;
    if (key === '--cursor-only') {
      out.cursor = true;
      out.claude = false;
    }
    if (key === '--claude-only') {
      out.cursor = false;
      out.claude = true;
    }
  }
  return out;
}
