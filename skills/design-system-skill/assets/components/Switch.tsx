'use client';

import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';

interface SwitchProps extends React.ComponentProps<typeof BaseSwitch.Root> {
  label?: string;
}

export default function Switch({ label, className = '', ...props }: SwitchProps) {
  return (
    <label className='inline-flex items-center gap-2 text-sm text-brand-fg data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'>
      <BaseSwitch.Root
        className={[
          'relative flex h-6 w-10 shrink-0 items-center rounded-full bg-brand-border p-0.5',
          'transition-colors data-[checked]:bg-brand-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <BaseSwitch.Thumb className='h-5 w-5 rounded-full bg-brand-bg shadow transition-transform data-[checked]:translate-x-4' />
      </BaseSwitch.Root>
      {label}
    </label>
  );
}
