#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  'out',
  '.git',
  'coverage',
  '.turbo',
]);

const SCAN_ROOTS = [
  'app',
  'src',
  'pages',
  'components',
  'styles',
  'features',
  'lib',
  'ui',
];

const CODE_EXT = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
  '.scss',
  '.sass',
  '.mjs',
  '.cjs',
]);

const ICON_PACKS = [
  '@heroicons',
  '@solar-icons/react',
  'lucide-react',
  '@radix-ui/react-icons',
];

const NOT_A_COLOR = new Set([
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
  'left',
  'center',
  'right',
  'justify',
  'start',
  'end',
  'top',
  'bottom',
  'middle',
  'nowrap',
  'wrap',
  'clip',
  'ellipsis',
  'truncate',
  'opacity',
  'shadow',
  'none',
  'inherit',
  'solid',
  'dashed',
  'dotted',
  'double',
  'hidden',
  'divide',
  'collapse',
  'separate',
  'auto',
  'cover',
  'contain',
  'repeat',
  'fixed',
  'scroll',
  'blend',
  'gradient',
  'origin',
  'align',
  'decoration',
  'transform',
  'indent',
  'overflow',
  'underline',
  'rendering',
  'size',
  'stroke',
  'color',
  'width',
  'radius',
  'style',
  'spacing',
  'image',
  'x',
  'y',
  't',
  'b',
  'l',
  'r',
  's',
  'e',
  '0',
  '2',
  '4',
  '8',
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'semibold',
  'bold',
  'medium',
  'normal',
  'light',
  'thin',
  'extrabold',
  'black',
  'antialiased',
]);

const COLOR_VAR_HINT =
  /color|bg|fg|primary|secondary|accent|muted|foreground|background|border|fill|stroke|brand|surface|ink|paper|success|warning|danger|error|info|neutral/i;

const PAGE_PATHS = [
  'app/internal/design-system-diagnosis/page.jsx',
  'app/internal/design-system-diagnosis/page.tsx',
  'app/internal/design-system-diagnosis/page.js',
  'app/dev/design-system-diagnosis/page.jsx',
  'app/dev/design-system-diagnosis/page.tsx',
  'app/_lab/design-system-diagnosis/page.jsx',
  'app/_lab/design-system-diagnosis/page.tsx',
  'src/app/internal/design-system-diagnosis/page.jsx',
  'src/app/internal/design-system-diagnosis/page.tsx',
  'pages/internal/design-system-diagnosis.jsx',
  'pages/internal/design-system-diagnosis.tsx',
  'pages/dev/design-system-diagnosis.jsx',
  'pages/_lab/design-system-diagnosis.jsx',
];

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.cwd || process.cwd());
const outPath = path.resolve(root, args.out || 'design-system-diagnosis.json');

const report = scan(root);
writeJson(outPath, report);
printReport(report, outPath);

function scan(dirRoot) {
  const files = collectFiles(dirRoot);
  const colorCounts = new Map();
  const iconCounts = new Map();
  const importTargets = new Map();
  const componentFiles = [];

  for (const file of files) {
    const text = readText(file);
    if (!text) continue;
    const rel = relPath(dirRoot, file);
    extractColors(text, colorCounts);
    extractIcons(text, iconCounts);
    extractImports(text, file, dirRoot, importTargets);
    if (isReusableComponent(rel, text)) {
      componentFiles.push({
        file: rel,
        name: componentName(rel, text),
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    page: findDiagnosisPage(dirRoot),
    colors: rank(colorCounts).slice(0, 40),
    iconLibraries: rank(iconCounts),
    components: rankComponents(componentFiles, importTargets).slice(0, 20),
  };
}

function extractColors(text, counts) {
  for (const raw of text.match(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g) || []) {
    bump(counts, { raw: raw.toUpperCase(), kind: 'hex' });
  }

  for (const raw of text.match(/rgba?\((?:[^()]|\([^)]*\))+\)/gi) || []) {
    bump(counts, { raw: raw.replace(/\s+/g, ' ').trim(), kind: 'rgb' });
  }

  const twRe =
    /(?<![-.\w/])(bg|text|border)-((?:\[[^\]]+\]|[a-zA-Z][\w]*(?:-[\w./]+)*))/g;
  let match;
  while ((match = twRe.exec(text))) {
    if (!isColorClass(match[1], match[2])) continue;
    bump(counts, { raw: `${match[1]}-${match[2]}`, kind: 'tailwind' });
  }

  const varRe = /(?:--([a-zA-Z][\w-]*)\s*:|var\((--[a-zA-Z][\w-]*))/g;
  while ((match = varRe.exec(text))) {
    const name = match[2] || `--${match[1]}`;
    if (!COLOR_VAR_HINT.test(name)) continue;
    bump(counts, { raw: name, kind: 'css-var' });
  }
}

function isColorClass(prefix, rest) {
  if (rest.startsWith('[') && /#|rgb|hsl|var\(/.test(rest)) return true;
  const first = rest.split('-')[0].split('/')[0];
  if (NOT_A_COLOR.has(first)) return false;
  if (/^\d+$/.test(first)) return false;
  return Boolean(prefix);
}

function extractIcons(text, counts) {
  const importRe = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRe.exec(text))) {
    const spec = match[1];
    const name = ICON_PACKS.find(
      (pack) => spec === pack || spec.startsWith(`${pack}/`),
    );
    if (name) bump(counts, { name });
  }
}

function extractImports(text, fromFile, dirRoot, targets) {
  const importRe = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRe.exec(text))) {
    const resolved = resolveImport(match[1], fromFile, dirRoot);
    if (!resolved) continue;
    const key = relPath(dirRoot, resolved);
    targets.set(key, (targets.get(key) || 0) + 1);
  }
}

function resolveImport(spec, fromFile, dirRoot) {
  if (spec.startsWith('@/')) {
    const rest = spec.slice(2);
    return (
      existingModule(path.join(dirRoot, 'src', rest)) ||
      existingModule(path.join(dirRoot, rest))
    );
  }
  if (!spec.startsWith('.')) return null;
  return existingModule(path.resolve(path.dirname(fromFile), spec));
}

function existingModule(base) {
  const tries = [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.js'),
    path.join(base, 'index.jsx'),
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  return tries.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) || null;
}

function isReusableComponent(rel, text) {
  if (!/\.(jsx|tsx|js|ts)$/.test(rel)) return false;
  if (!/export\s+default\b/.test(text)) return false;
  if (!/\b(variant|size)\b/.test(text)) return false;
  if (rel.includes('.test.') || rel.includes('.stories.')) return false;
  return true;
}

function componentName(rel, text) {
  const fn = text.match(/export\s+default\s+function\s+([A-Z][A-Za-z0-9]*)/);
  if (fn) return fn[1];
  const named = text.match(/function\s+([A-Z][A-Za-z0-9]*)\s*\(/);
  if (named) return named[1];
  const base = path.basename(rel, path.extname(rel));
  return base === 'index' ? path.basename(path.dirname(rel)) : base;
}

function rankComponents(candidates, importTargets) {
  return candidates
    .map((item) => ({
      name: item.name,
      file: item.file,
      importCount: importTargets.get(item.file) || 0,
    }))
    .filter((row) => row.importCount >= 3)
    .sort((a, b) => b.importCount - a.importCount || a.name.localeCompare(b.name));
}

function findDiagnosisPage(dirRoot) {
  for (const rel of PAGE_PATHS) {
    if (fs.existsSync(path.join(dirRoot, rel))) return rel;
  }
  return null;
}

function bump(counts, row) {
  const key = row.raw ? `${row.kind}:${row.raw}` : row.name;
  const prev = counts.get(key);
  if (!prev) counts.set(key, { ...row, count: 1 });
  else prev.count += 1;
}

function rank(counts) {
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

function collectFiles(dirRoot) {
  const found = [];
  for (const name of SCAN_ROOTS) walk(path.join(dirRoot, name), found);
  return found;
}

function walk(dir, found) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, found);
      continue;
    }
    if (CODE_EXT.has(path.extname(entry.name))) found.push(full);
  }
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const name = key.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    out[name] = value;
  }
  return out;
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function relPath(dirRoot, file) {
  return path.relative(dirRoot, file).split(path.sep).join('/');
}

function printReport(data, file) {
  const lines = [
    `Wrote ${relPath(process.cwd(), file)}`,
    data.page ? `page: ${data.page}` : 'page: (none)',
    `colors: ${data.colors.length}`,
    `icon libraries: ${data.iconLibraries.map((row) => row.name).join(', ') || '(none)'}`,
    `components: ${data.components.length}`,
  ];
  process.stdout.write(`${lines.join('\n')}\n`);
}
