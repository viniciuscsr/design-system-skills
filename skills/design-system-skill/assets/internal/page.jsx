import { notFound } from 'next/navigation';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Specimens from './specimens';

// Never reachable in a deployed build, and never indexed if it somehow is.
// VERCEL_ENV covers Vercel previews vs production; NODE_ENV covers everywhere else.
const IS_PRODUCTION =
  process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

export const metadata = {
  title: 'Design system',
  robots: { index: false, follow: false, nocache: true },
};

const RAMP = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// Full class strings, not `bg-brand-primary-${step}` — Tailwind scans source
// text, so an interpolated class never makes it into the stylesheet.
const PRIMARY_RAMP = {
  50: 'bg-brand-primary-50',
  100: 'bg-brand-primary-100',
  200: 'bg-brand-primary-200',
  300: 'bg-brand-primary-300',
  400: 'bg-brand-primary-400',
  500: 'bg-brand-primary-500',
  600: 'bg-brand-primary-600',
  700: 'bg-brand-primary-700',
  800: 'bg-brand-primary-800',
  900: 'bg-brand-primary-900',
};

const PRIMARY_ALIASES = [
  ['primary', 'bg-brand-primary'],
  ['primary-on', 'bg-brand-primary-on'],
  ['primary-hover', 'bg-brand-primary-hover'],
  ['primary-active', 'bg-brand-primary-active'],
];

const SURFACES = [
  ['bg', 'bg-brand-bg'],
  ['surface', 'bg-brand-surface'],
  ['surface-warm', 'bg-brand-surface-warm'],
  ['border', 'bg-brand-border'],
  ['border-soft', 'bg-brand-border-soft'],
];

const TEXT = [
  ['fg', 'text-brand-fg'],
  ['fg2', 'text-brand-fg2'],
  ['muted', 'text-brand-muted'],
  ['meta', 'text-brand-meta'],
];

const STATUS = [
  ['success', 'bg-brand-success'],
  ['success-soft', 'bg-brand-success-soft'],
  ['success-border', 'bg-brand-success-border'],
  ['danger', 'bg-brand-danger'],
  ['danger-soft', 'bg-brand-danger-soft'],
  ['danger-border', 'bg-brand-danger-border'],
];

const TYPE = [
  ['Display', 'text-5xl md:text-6xl font-bold tracking-tight text-brand-fg'],
  ['Heading 1', 'text-4xl font-bold tracking-tight text-brand-fg'],
  ['Heading 2', 'text-2xl md:text-3xl font-bold tracking-tight text-brand-fg'],
  ['Heading 3', 'text-lg font-semibold text-brand-fg'],
  ['Subhead', 'text-xl text-brand-fg2'],
  ['Body', 'text-base leading-relaxed text-brand-fg2'],
  ['Body sm', 'text-sm text-brand-fg2'],
  ['Caption', 'text-xs text-brand-muted'],
];

const ICONS = [
  ['xs', 'h-3 w-3'],
  ['sm', 'h-4 w-4'],
  ['md', 'h-5 w-5'],
  ['lg', 'h-6 w-6'],
  ['xl', 'h-8 w-8'],
];

function Swatch({ label, className }) {
  return (
    <div className='min-w-0'>
      <div className={`h-12 rounded-md border border-brand-border-soft ${className}`} />
      <p className='mt-1 truncate text-xs text-brand-muted'>{label}</p>
    </div>
  );
}

export default function DesignSystemSpecimenPage() {
  if (IS_PRODUCTION) notFound();

  return (
    <main className='min-h-screen bg-brand-bg text-brand-fg'>
      <div className='mx-auto max-w-6xl px-6 py-12'>
        <p className='text-xs font-semibold uppercase tracking-wide text-brand-primary'>
          Internal
        </p>
        <h1 className='mt-2 text-4xl font-bold tracking-tight text-brand-fg'>
          Design system
        </h1>
        <p className='mt-3 max-w-2xl text-base leading-relaxed text-brand-fg2'>
          Visual index of the tokens and{' '}
          <code className='text-sm text-brand-fg'>components/ui</code> primitives.
          Values live in{' '}
          <code className='text-sm text-brand-fg'>app/globals.css</code>. Usage lives
          in{' '}
          <code className='text-sm text-brand-fg'>design-system/tokens.md</code>. This
          page 404s in production and is excluded from the sitemap.
        </p>
        <nav className='mt-6 flex flex-wrap gap-4 text-sm text-brand-fg2'>
          <a href='#color' className='hover:text-brand-primary'>
            Color
          </a>
          <a href='#type' className='hover:text-brand-primary'>
            Type
          </a>
          <a href='#icons' className='hover:text-brand-primary'>
            Icons
          </a>
          <a href='#components' className='hover:text-brand-primary'>
            Components
          </a>
        </nav>

        <section id='color' className='mt-16 space-y-10'>
          <h2 className='text-2xl font-bold tracking-tight text-brand-fg md:text-3xl'>
            Color
          </h2>

          <div>
            <h3 className='text-lg font-semibold text-brand-fg'>Primary scale</h3>
            <div className='mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10'>
              {RAMP.map((step) => (
                <Swatch key={step} label={String(step)} className={PRIMARY_RAMP[step]} />
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-brand-fg'>Primary aliases</h3>
            <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4'>
              {PRIMARY_ALIASES.map(([label, cls]) => (
                <Swatch key={label} label={label} className={cls} />
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-brand-fg'>Surface and border</h3>
            <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5'>
              {SURFACES.map(([label, cls]) => (
                <Swatch key={label} label={label} className={cls} />
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-brand-fg'>Text</h3>
            <div className='mt-3 space-y-1'>
              {TEXT.map(([label, cls]) => (
                <p key={label} className={cls}>
                  {label}: The quick brown fox jumps over the lazy dog
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-brand-fg'>Status</h3>
            <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-6'>
              {STATUS.map(([label, cls]) => (
                <Swatch key={label} label={label} className={cls} />
              ))}
            </div>
          </div>
        </section>

        <section id='type' className='mt-16'>
          <h2 className='text-2xl font-bold tracking-tight text-brand-fg md:text-3xl'>
            Type
          </h2>
          <p className='mt-2 text-sm text-brand-fg2'>
            Copy the class stack onto a semantic tag. Roles are in tokens.md.
          </p>
          <div className='mt-6 space-y-6'>
            {TYPE.map(([role, cls]) => (
              <div key={role}>
                <p className='text-xs text-brand-muted'>{role}</p>
                <p className={cls}>
                  Almost before we knew it, we had left the ground.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id='icons' className='mt-16'>
          <h2 className='text-2xl font-bold tracking-tight text-brand-fg md:text-3xl'>
            Icons
          </h2>
          <p className='mt-2 text-sm text-brand-fg2'>
            Heroicons, tinted with <code className='text-brand-fg'>text-brand-*</code>.
            Size roles from tokens.md.
          </p>
          <div className='mt-6 flex flex-wrap items-end gap-8'>
            {ICONS.map(([role, cls]) => (
              <div key={role} className='text-center'>
                <DocumentTextIcon className={`${cls} text-brand-fg2`} />
                <p className='mt-2 text-xs text-brand-muted'>
                  {role} {cls}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id='components' className='mt-16'>
          <h2 className='text-2xl font-bold tracking-tight text-brand-fg md:text-3xl'>
            Components
          </h2>
          <p className='mt-2 text-sm text-brand-fg2'>
            Register a new primitive in{' '}
            <code className='text-brand-fg'>specimens.jsx</code>.
          </p>
          <Specimens />
        </section>

        <footer className='mt-16 border-t border-brand-border-soft pt-6 text-xs text-brand-muted'>
          Generated by{' '}
          <a
            href='https://uniquel.io/'
            target='_blank'
            rel='noreferrer'
            className='underline hover:text-brand-primary'
          >
            uniquel.io
          </a>
        </footer>
      </div>
    </main>
  );
}
