'use client';

import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckIcon } from '@heroicons/react/24/outline';

interface CheckboxProps extends React.ComponentProps<typeof BaseCheckbox.Root> {
  label?: string;
}

export default function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className='inline-flex items-center gap-2 text-sm text-brand-fg data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'>
      <BaseCheckbox.Root
        className={[
          'flex h-5 w-5 items-center justify-center rounded border border-brand-border bg-brand-bg',
          'transition-colors data-[checked]:border-brand-primary data-[checked]:bg-brand-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <BaseCheckbox.Indicator className='flex items-center justify-center text-brand-primary-on'>
          <CheckIcon className='h-3.5 w-3.5' strokeWidth={3} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
}
