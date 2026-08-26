#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(skillRoot, 'assets');

const COMPONENTS = [
  'Button',
  'Badge',
  'Card',
  'Dialog',
  'Tabs',
  'Tooltip',
  'Checkbox',
  'Input',
  'Select',
  'Switch',
];

// ---------------------------------------------------------------- color

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function isValidHex(value) {
  return /^#?[0-9a-fA-F]{6}$/.test(String(value ?? '').trim());
}

function normalizeHex(value) {
  return `#${String(value).trim().replace(/^#/, '').toLowerCase()}`;
}

function hexToRgb(hex) {
  const num = parseInt(normalizeHex(hex).slice(1), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

// h: 0-360, s/l: 0-100
function rgbToHsl([r, g, b]) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return [0, 0, l * 100];

  const s = d / (1 - Math.abs(2 * l - 1));
  let h;
  switch (max) {
    case rn:
      h = ((gn - bn) / d) % 6;
      break;
    case gn:
      h = (bn - rn) / d + 2;
      break;
    default:
      h = (rn - gn) / d + 4;
  }
  h *= 60;
  if (h < 0) h += 360;

  return [h, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let rgb;
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  return rgb.map((v) => Math.round((v + m) * 255));
}

function hsl(h, s, l) {
  return rgbToHex(hslToRgb(h, s, l));
}

function channelLuminance(c) {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]) {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------- tokens

// Steps 50-400 mix the brand color toward white, 600-900 toward black. These
// ratios reproduce a hand-authored ramp exactly (e.g. #27265D -> 600 = #201F4C),
// which is why they're literal rather than an even lightness walk.
const RAMP_STEPS = [
  [50, 'white', 0.92],
  [100, 'white', 0.8],
  [200, 'white', 0.6],
  [300, 'white', 0.4],
  [400, 'white', 0.2],
  [500, 'self', 0],
  [600, 'black', 0.18],
  [700, 'black', 0.36],
  [800, 'black', 0.54],
  [900, 'black', 0.72],
];

function mix(rgb, toward, amount) {
  const target = toward === 'white' ? 255 : 0;
  return rgb.map((c) => Math.round(c + (target - c) * amount));
}

function ramp(hex) {
  const rgb = hexToRgb(hex);
  const out = {};
  for (const [step, toward, amount] of RAMP_STEPS) {
    out[step] = toward === 'self' ? rgb.slice() : mix(rgb, toward, amount);
  }
  return out;
}

function generateTokens(inputHex, mode = 'light') {
  const isDark = mode === 'dark';
  const primary = normalizeHex(inputHex);
  const rgb = hexToRgb(primary);
  const [h, s, l] = rgbToHsl(rgb);

  // Hover/active move away from the background (lighten a dark color,
  // darken a light one) so they stay legible against the page on either side.
  const direction = l < 50 ? 1 : -1;
  const primaryHover = hsl(h, s, clamp(l + direction * 8, 4, 96));
  const primaryActive = hsl(h, s, clamp(l + direction * 14, 4, 96));

  const white = [255, 255, 255];
  const nearBlack = [23, 23, 23];
  const primaryOn =
    contrastRatio(rgb, white) >= contrastRatio(rgb, nearBlack) ? '#ffffff' : '#171717';

  // Same hue-tinted derivation in both modes, walked to the other end of the
  // lightness scale so surfaces stay dark and text stays light.
  const bg = isDark ? hsl(h, Math.min(s, 15), 7) : '#ffffff';
  const surface = hsl(h, Math.min(s, 20), isDark ? 12 : 97);
  const surfaceWarm = hsl(h, Math.min(s, 30), isDark ? 17 : 93);
  const border = hsl(h, Math.min(s, 35), isDark ? 24 : 88);
  const borderSoft = hsl(h, Math.min(s, 25), isDark ? 19 : 93);

  const textRgb = hslToRgb(h, Math.min(s, 25), isDark ? 92 : 14).join(' ');

  return {
    mode,
    bg,
    surface,
    surfaceWarm,
    textRgb,
    fg: `rgb(${textRgb} / 0.95)`,
    fg2: `rgb(${textRgb} / 0.75)`,
    muted: `rgb(${textRgb} / 0.5)`,
    meta: `rgb(${textRgb} / 0.35)`,
    border,
    borderSoft,
    primary,
    primaryOn,
    primaryHover,
    primaryActive,
    primaryRamp: ramp(primary),
    // Fixed, not derived from the input hue.
    success: '#1a432f',
    successSoft: '#e8f0e9',
    successBorder: '#c8dad0',
    danger: '#dc2626',
    dangerText: '#b91c1c',
    dangerSoft: '#fee2e2',
    dangerBorder: '#fecaca',
  };
}

// ---------------------------------------------------------------- files

// Hex -> "r g b" channels, the form Tailwind's <alpha-value> needs.
const ch = (hex) => hexToRgb(hex).join(' ');

function tailwindFragment() {
  return `// Merge \`theme.extend.colors.brand\` into the project's tailwind.config.js.
// Do not replace the whole config.
//
// Colors are POINTERS, not values. Each token compiles to
// \`rgb(var(--x-rgb) / <alpha-value>)\` — a lookup the browser resolves at paint
// time. The real channel values live in globals.css :root.
//
// Why: override any \`--x-rgb\` on an element and everything inside it re-themes.
// That gives you dark mode as one CSS block (no \`dark:\` on every utility), and
// runtime theming without touching a single component.
//
// Channels are space-separated ("39 38 93") so Tailwind's <alpha-value> can fill
// in the slash-alpha — that's what makes \`bg-brand-primary/10\` work. A hex
// stored in a CSS variable cannot do that.
const channel = (name) => \`rgb(var(\${name}) / <alpha-value>)\`;

const ramp = (prefix) => ({
  50: channel(\`--\${prefix}-50-rgb\`),
  100: channel(\`--\${prefix}-100-rgb\`),
  200: channel(\`--\${prefix}-200-rgb\`),
  300: channel(\`--\${prefix}-300-rgb\`),
  400: channel(\`--\${prefix}-400-rgb\`),
  500: channel(\`--\${prefix}-500-rgb\`),
  600: channel(\`--\${prefix}-600-rgb\`),
  700: channel(\`--\${prefix}-700-rgb\`),
  800: channel(\`--\${prefix}-800-rgb\`),
  900: channel(\`--\${prefix}-900-rgb\`),
});

// Text tokens keep baked alpha — one color at four opacities.
const text = (alpha) => \`rgb(var(--text-rgb) / \${alpha})\`;

module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: channel('--bg-rgb'),
          surface: channel('--surface-rgb'),
          'surface-warm': channel('--surface-warm-rgb'),

          fg: text(0.95),
          fg2: text(0.75),
          muted: text(0.5),
          meta: text(0.35),

          border: channel('--border-rgb'),
          'border-soft': channel('--border-soft-rgb'),

          // DEFAULT makes \`bg-brand-primary\` work; the numbered keys give
          // \`bg-brand-primary-50\` through \`-900\`.
          primary: { DEFAULT: channel('--primary-rgb'), ...ramp('primary') },
          'primary-on': channel('--primary-on-rgb'),
          'primary-hover': channel('--primary-hover-rgb'),
          'primary-active': channel('--primary-active-rgb'),

          success: channel('--success-rgb'),
          'success-soft': channel('--success-soft-rgb'),
          'success-border': channel('--success-border-rgb'),
          danger: channel('--danger-rgb'),
          'danger-text': channel('--danger-text-rgb'),
          'danger-soft': channel('--danger-soft-rgb'),
          'danger-border': channel('--danger-border-rgb'),
        },
      },
    },
  },
};
`;
}

function globalsFragment(t) {
  const rampLines = RAMP_STEPS.map(([step]) => {
    const rgb = t.primaryRamp[step];
    return `  --primary-${step}-rgb: ${rgb.join(' ')}; /* ${rgbToHex(rgb).toUpperCase()} */`;
  }).join('\n');

  return `/* Merge this :root block into the project's globals.css, above existing
   styles. If a :root block already exists, merge these variables into it.

   SOURCE OF TRUTH for every brand color. Rebranding = edit these channels.
   Generated for ${t.primary} in ${t.mode} mode. */
:root {
  --bg-rgb: ${ch(t.bg)};
  --surface-rgb: ${ch(t.surface)};
  --surface-warm-rgb: ${ch(t.surfaceWarm)};

  /* One base color; fg/fg2/muted/meta are opacities of it. */
  --text-rgb: ${t.textRgb};

  --border-rgb: ${ch(t.border)};
  --border-soft-rgb: ${ch(t.borderSoft)};

  /* Primary scale. 500 is the color you picked. */
${rampLines}
  --primary-rgb: var(--primary-500-rgb);
  --primary-on-rgb: ${ch(t.primaryOn)};
  --primary-hover-rgb: ${ch(t.primaryHover)};
  --primary-active-rgb: ${ch(t.primaryActive)};

  --success-rgb: ${ch(t.success)};
  --success-soft-rgb: ${ch(t.successSoft)};
  --success-border-rgb: ${ch(t.successBorder)};
  --danger-rgb: ${ch(t.danger)};
  --danger-text-rgb: ${ch(t.dangerText)};
  --danger-soft-rgb: ${ch(t.dangerSoft)};
  --danger-border-rgb: ${ch(t.dangerBorder)};
}

/* Flipping the theme is one block: redefine the channels and every component
   follows. No \`dark:\` variant on a single utility class. Re-run this skill with
   the other mode to get the values. */
`;
}

function tokensMarkdown(t) {
  const rampRows = RAMP_STEPS.map(([step]) => {
    const hex = rgbToHex(t.primaryRamp[step]).toUpperCase();
    const use =
      step < 500
        ? 'Tints: chips, soft fills, selected rows'
        : step === 500
          ? 'Base — the color you picked'
          : 'Shades: dark fills, contrast on light';
    return `| \`brand.primary-${step}\` | \`${hex}\` | ${use} |`;
  }).join('\n');

  return `# UI Tokens

Values live in \`app/globals.css\` \`:root\`. \`tailwind.config.js\` only points at
those channels. This file is the usage layer: what exists and what each token is
_for_.

Always use the \`brand.*\` form (\`text-brand-fg\`, \`bg-brand-primary\`) — never a raw
hex, never a bare Tailwind color like \`gray-500\`. If a token you need isn't listed
here, it doesn't exist yet: stop and ask before inventing one.

Generated from \`${t.primary}\` in **${t.mode}** mode.

## Surface

| Token | Value | Use for |
|---|---|---|
| \`brand.bg\` | \`${t.bg}\` | Page background |
| \`brand.surface\` | \`${t.surface}\` | Section/card surface, one step off \`bg\` |
| \`brand.surface-warm\` | \`${t.surfaceWarm}\` | Tinted surface — soft fills behind primary content |

## Text

One base color at four opacities — \`rgb(${t.textRgb})\`. They inherit the background
underneath, so the same token reads lighter on tinted surfaces.

| Token | Value | Use for |
|---|---|---|
| \`brand.fg\` | \`${t.fg}\` | Headings, primary labels, card titles |
| \`brand.fg2\` | \`${t.fg2}\` | Body copy, descriptions |
| \`brand.muted\` | \`${t.muted}\` | Placeholders, inactive controls, metadata |
| \`brand.meta\` | \`${t.meta}\` | Captions, fine print, disabled labels |

Default body copy → \`brand.fg2\`. Placeholders and timestamps → \`brand.muted\`.
Disabled controls → \`brand.meta\`.

## Border

| Token | Value | Use for |
|---|---|---|
| \`brand.border\` | \`${t.border}\` | Card outlines, input/button borders |
| \`brand.border-soft\` | \`${t.borderSoft}\` | Dividers, subtle outlines |

## Primary

Aliases — use these for buttons, links, and chrome:

| Token | Value | Use for |
|---|---|---|
| \`brand.primary\` | \`${t.primary}\` | Primary actions, links (= \`500\`) |
| \`brand.primary-on\` | \`${t.primaryOn}\` | Text/icon on a \`primary\` fill |
| \`brand.primary-hover\` | \`${t.primaryHover}\` | Hover state |
| \`brand.primary-active\` | \`${t.primaryActive}\` | Pressed state |

Hover and active move away from the page background on purpose. Do not remap them
onto \`600\`/\`700\`.

The numbered scale:

| Token | Value | Use for |
|---|---|---|
${rampRows}

## Status

Fixed values, not derived from the brand color — they have to read as success and
danger regardless of what the brand is.

| Token | Value | Use for |
|---|---|---|
| \`brand.success\` | \`${t.success}\` | Success text/icon |
| \`brand.success-soft\` | \`${t.successSoft}\` | Success background tint |
| \`brand.success-border\` | \`${t.successBorder}\` | Success border |
| \`brand.danger\` | \`${t.danger}\` | Danger text/icon |
| \`brand.danger-text\` | \`${t.dangerText}\` | Darker danger text on \`danger-soft\` |
| \`brand.danger-soft\` | \`${t.dangerSoft}\` | Danger background tint |
| \`brand.danger-border\` | \`${t.dangerBorder}\` | Danger border |

## Typography

One face: \`font-sans\`. Copy the class stack for the role; keep the tag semantic
(\`h1\`…\`p\`). Do not add a Heading component.

| Role | Class stack |
|---|---|
| Display | \`text-5xl md:text-6xl font-bold tracking-tight text-brand-fg\` |
| Heading 1 | \`text-4xl font-bold tracking-tight text-brand-fg\` |
| Heading 2 | \`text-2xl md:text-3xl font-bold tracking-tight text-brand-fg\` |
| Heading 3 | \`text-lg font-semibold text-brand-fg\` |
| Subhead | \`text-xl text-brand-fg2\` |
| Body | \`text-base leading-relaxed text-brand-fg2\` |
| Body sm | \`text-sm text-brand-fg2\` |
| Caption | \`text-xs text-brand-muted\` |

## Icon sizes

Heroicons, to match the components. Size with \`h-* w-*\`. Default is \`md\`.

| Role | Class | px |
|---|---|---|
| xs | \`h-3 w-3\` | 12 |
| sm | \`h-4 w-4\` | 16 |
| md | \`h-5 w-5\` | 20 |
| lg | \`h-6 w-6\` | 24 |
| xl | \`h-8 w-8\` | 32 |

Tint with \`text-brand-*\` (icons inherit \`currentColor\`). Do not hardcode icon hex
values, and do not pick a one-off size.
`;
}

function readmeMarkdown() {
  const rows = COMPONENTS.map(
    (name) =>
      `| [\`${name}\`](../components/ui/${name}.tsx) | [${name}.md](../components/ui/${name}.md) |`,
  ).join('\n');

  return `# Design System

Three pillars. Read in this order when building UI:

1. **Tokens** — [\`tokens.md\`](./tokens.md). What colors/type/icon sizes exist and
   what each is _for_. Values live in \`app/globals.css\` \`:root\`;
   \`tailwind.config.js\` only points at those channels.
2. **Components** — \`components/ui/\`. Reusable primitives, built on
   [Base UI](https://base-ui.com). No business logic lives here — anything that
   fetches data or is specific to one feature belongs in a domain folder, not \`ui/\`.
3. **Documentation** — one \`.md\` file per component, next to its \`.tsx\`. Same
   template every time, so you can scan any one and know what to do.

## Rule for this repo

**Before building new UI, check here first.** If a token or component you need
already exists, use it. If it doesn't, that's a deliberate signal to stop and ask —
don't invent a new hex value, a new button variant, or a new primitive inline. This
system only stays useful if it's the one source of truth, not one of several.

## Components

| Component | Doc |
|---|---|
${rows}

## Internal specimen

\`/internal/design-system\` renders the real tokens and \`components/ui\` primitives.
It 404s when \`VERCEL_ENV=production\`. Not linked in nav.

Do not copy hex values onto that page. Token swatches use \`bg-brand-*\` classes;
type and icon samples use the stacks in [\`tokens.md\`](./tokens.md).

**Adding a UI primitive**

1. \`components/ui/Foo.tsx\` + \`Foo.md\` (same template as the others).
2. Row in the table above.
3. Entry in \`app/internal/design-system/specimens.jsx\` — import \`Foo\` and add a
   \`preview\` that uses the real component, never a lookalike.
`;
}

function agentsSnippet() {
  return `## Design system

Before writing any UI, read \`design-system/tokens.md\`. Every color must be a
\`brand.*\` Tailwind class — never a raw hex value, never a bare Tailwind color
like \`gray-500\`. Reusable primitives live in \`components/ui/\`; check there before
building a new one, and read the component's \`.md\` before changing it.

If the token or component you need isn't already documented, that is a deliberate
signal to stop and ask, not a license to invent a new hex value inline.
`;
}

// ---------------------------------------------------------------- write

const result = { written: [], skipped: [], merge: [] };

function write(root, rel, content, force) {
  const full = path.join(root, rel);
  if (fs.existsSync(full) && !force) {
    result.skipped.push(rel);
    return;
  }
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  result.written.push(rel);
}

function writeFragment(root, rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  result.merge.push(rel);
}

function read(...parts) {
  return fs.readFileSync(path.join(...parts), 'utf8');
}

// Next's App Router lives at app/ or src/app/. Follow whichever the project uses.
function appDir(root) {
  if (fs.existsSync(path.join(root, 'src', 'app'))) return 'src/app';
  if (fs.existsSync(path.join(root, 'app'))) return 'app';
  return fs.existsSync(path.join(root, 'src')) ? 'src/app' : 'app';
}

// `@/` resolves to src/ in a src-layout project and to the root otherwise, and the
// components are imported through that alias — so follow whichever layout is in use.
function uiDir(root) {
  return appDir(root) === 'src/app' ? 'src/components/ui' : 'components/ui';
}

// ------------------------------------------------------- project inspection

function readPackageJson(root) {
  const file = path.join(root, 'package.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function allDeps(pkg) {
  return { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };
}

// Refuse to write into a project this system can't work in. Tokens are Tailwind
// classes and the components are React, so both are hard requirements.
function validateProject(root) {
  const pkg = readPackageJson(root);
  if (!pkg) {
    fail(
      `No readable package.json in ${root}.\n` +
        'This command needs a React project. Run it from the project root, or pass --cwd.',
    );
  }

  const deps = allDeps(pkg);
  if (!deps.react) {
    fail(
      `${pkg.name || 'This project'} does not depend on react.\n` +
        'The design system ships React components, so it can only be installed into a React project (Next.js recommended).',
    );
  }

  const hasTailwind =
    deps.tailwindcss ||
    deps['@tailwindcss/postcss'] ||
    fs.existsSync(path.join(root, 'tailwind.config.js')) ||
    fs.existsSync(path.join(root, 'tailwind.config.ts'));
  if (!hasTailwind) {
    fail(
      `${pkg.name || 'This project'} does not appear to use Tailwind CSS.\n` +
        'Every token in this system is a Tailwind class. Install Tailwind first, then re-run.',
    );
  }

  return { pkg, deps };
}

const PACKAGE_MANAGERS = [
  ['pnpm-lock.yaml', 'pnpm', ['add']],
  ['yarn.lock', 'yarn', ['add']],
  ['bun.lockb', 'bun', ['add']],
  ['package-lock.json', 'npm', ['install']],
];

function detectPackageManager(root) {
  for (const [lockfile, bin, verb] of PACKAGE_MANAGERS) {
    if (fs.existsSync(path.join(root, lockfile))) return { bin, verb };
  }
  return { bin: 'npm', verb: ['install'] };
}

const REQUIRED_DEPS = ['@base-ui/react', '@heroicons/react'];

function missingDeps(deps) {
  return REQUIRED_DEPS.filter((name) => !deps[name]);
}

function installDeps(root, missing) {
  const { bin, verb } = detectPackageManager(root);
  const argv = [...verb, ...missing];
  process.stdout.write(`Installing ${missing.join(' and ')} with ${bin}...\n`);
  const res = spawnSync(bin, argv, { cwd: root, stdio: 'inherit' });
  if (res.error || res.status !== 0) {
    return { ok: false, command: `${bin} ${argv.join(' ')}` };
  }
  return { ok: true, command: `${bin} ${argv.join(' ')}` };
}

// ------------------------------------------------------- stylesheet

const CSS_CANDIDATES = [
  'app/globals.css',
  'src/app/globals.css',
  'styles/globals.css',
  'src/styles/globals.css',
  'app/global.css',
  'src/index.css',
  'src/App.css',
];

// The @config path is relative to the stylesheet, not the project root, and
// getting it wrong is the most common way a v4 install breaks. Compute it here
// so nobody has to count directories.
function findStylesheet(root) {
  const found = CSS_CANDIDATES.find((rel) => fs.existsSync(path.join(root, rel)));
  if (found) return found;

  // Fall back to any stylesheet that pulls Tailwind in.
  const skip = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'out', 'coverage']);
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!skip.has(entry.name) && !entry.name.startsWith('.')) stack.push(full);
        continue;
      }
      if (!entry.name.endsWith('.css')) continue;
      const text = fs.readFileSync(full, 'utf8');
      if (/@import\s+["']tailwindcss["']|@tailwind\s+base/.test(text)) {
        return path.relative(root, full).split(path.sep).join('/');
      }
    }
  }
  return null;
}

function configDirective(root, stylesheetRel) {
  if (!stylesheetRel) return null;
  const from = path.dirname(path.join(root, stylesheetRel));
  const to = path.join(root, 'tailwind.config.js');
  const rel = path.relative(from, to).split(path.sep).join('/');
  return `@config "${rel.startsWith('.') ? rel : `./${rel}`}";`;
}

function isTailwindV4(root, deps) {
  if (deps['@tailwindcss/postcss']) return true;
  const version = deps.tailwindcss;
  return typeof version === 'string' && /^[\^~]?4/.test(version);
}

// ------------------------------------------------------- sitemap

const SITEMAP_FILES = [
  ['next-sitemap.config.js', "add '/internal/*' to the `exclude` array"],
  ['next-sitemap.config.mjs', "add '/internal/*' to the `exclude` array"],
  ['app/sitemap.ts', "filter out any route starting with '/internal'"],
  ['app/sitemap.js', "filter out any route starting with '/internal'"],
  ['src/app/sitemap.ts', "filter out any route starting with '/internal'"],
  ['src/app/sitemap.js', "filter out any route starting with '/internal'"],
];

// The page already 404s in production and sets robots noindex. This only matters
// when the project generates a sitemap that would otherwise list the route.
function sitemapTarget(root) {
  for (const [rel, instruction] of SITEMAP_FILES) {
    if (fs.existsSync(path.join(root, rel))) return { file: rel, instruction };
  }
  return null;
}

// ------------------------------------------------------- run

function run(root, hex, mode, force) {
  const tokens = generateTokens(hex, mode);
  const app = appDir(root);

  const ui = uiDir(root);

  for (const name of COMPONENTS) {
    write(root, `${ui}/${name}.tsx`, read(assets, 'components', `${name}.tsx`), force);
    write(root, `${ui}/${name}.md`, read(assets, 'docs', `${name}.md`), force);
  }

  write(root, 'design-system/tokens.md', tokensMarkdown(tokens), force);
  write(root, 'design-system/README.md', readmeMarkdown(), force);

  write(root, `${app}/internal/design-system/page.jsx`, read(assets, 'internal', 'page.jsx'), force);
  write(
    root,
    `${app}/internal/design-system/specimens.jsx`,
    read(assets, 'internal', 'specimens.jsx'),
    force,
  );

  writeFragment(root, 'design-system/_generated/tailwind-brand.js', tailwindFragment());
  writeFragment(root, 'design-system/_generated/globals-root.css', globalsFragment(tokens));
  writeFragment(root, 'design-system/_generated/AGENTS-snippet.md', agentsSnippet());

  return { tokens, app };
}

// ---------------------------------------------------------------- cli

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

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));

// Validation-only mode, used to check the user's answer before committing to a run.
if (args['check-color']) {
  if (!isValidHex(args['check-color'])) {
    fail(`Not a hex color: "${args['check-color']}". Expected # plus six hex digits, e.g. #4BC4BE.`);
  }
  process.stdout.write(`${normalizeHex(args['check-color'])}\n`);
  process.exit(0);
}

if (!args.color || args.color === true) fail('Missing --color. Ask the user for a hex value first.');
if (!isValidHex(args.color)) {
  fail(`Not a hex color: "${args.color}". Expected # plus six hex digits, e.g. #4BC4BE.`);
}

const mode = args.mode === true || args.mode === undefined ? null : String(args.mode);
if (!mode) fail("Missing --mode. Ask the user for light or dark first.");
if (mode !== 'light' && mode !== 'dark') fail(`--mode must be "light" or "dark", got "${mode}".`);

const root = path.resolve(args.cwd === true || !args.cwd ? process.cwd() : args.cwd);
if (!fs.existsSync(root)) fail(`No such directory: ${root}`);

// Stop before writing anything if this isn't a project the system can work in.
const { deps } = validateProject(root);

// Dependencies. --skip-install just reports what's missing instead of installing.
const missing = missingDeps(deps);
let installNote = null;
if (missing.length) {
  const { bin, verb } = detectPackageManager(root);
  const command = `${bin} ${verb.join(' ')} ${missing.join(' ')}`;
  if (args['skip-install']) {
    installNote = `missing ${missing.join(' and ')} — install with: ${command}`;
  } else {
    const res = installDeps(root, missing);
    installNote = res.ok
      ? `installed ${missing.join(' and ')} (${res.command})`
      : `could not install ${missing.join(' and ')}. Run it yourself: ${res.command}`;
  }
}

const { tokens, app } = run(root, args.color, mode, Boolean(args.force));

const stylesheet = findStylesheet(root);
const directive = configDirective(root, stylesheet);

const lines = [
  `Generated a ${mode} design system from ${tokens.primary}`,
  '',
  `written (${result.written.length}):`,
  ...result.written.map((f) => `  + ${f}`),
];

if (result.skipped.length) {
  lines.push(
    '',
    `already existed, left alone (${result.skipped.length}) — re-run with --force to overwrite:`,
    ...result.skipped.map((f) => `  . ${f}`),
  );
}

lines.push('', 'merge these by hand:', ...result.merge.map((f) => `  ! ${f}`));

lines.push('', `stylesheet: ${stylesheet || '(not found — locate it yourself)'}`);

if (isTailwindV4(root, deps) && directive) {
  lines.push(
    '',
    'Tailwind v4 detected. The config is loaded by a directive in that stylesheet.',
    'Use exactly this line — the path is relative to the stylesheet, not the project root:',
    '',
    `  @import "tailwindcss";`,
    `  ${directive}`,
  );
}

const sitemap = sitemapTarget(root);
if (sitemap) {
  lines.push('', `sitemap: ${sitemap.file} — ${sitemap.instruction}`);
} else {
  lines.push('', 'sitemap: none found, nothing to exclude');
}

if (installNote) lines.push('', `dependencies: ${installNote}`);

lines.push('', `preview page: /internal/design-system  (${app}/internal/design-system/page.jsx)`);

process.stdout.write(`${lines.join('\n')}\n`);
