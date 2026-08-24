'use client';

import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps
  extends Omit<React.ComponentProps<typeof BaseInput>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-3.5 text-sm',
  lg: 'h-12 px-4 text-base',
};

export default function Input({
  label,
  description,
  error,
  size = 'md',
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const classNames = [
    'w-full rounded-lg border border-brand-border bg-brand-bg text-brand-fg placeholder:text-brand-muted',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className='flex flex-col gap-1.5'>
      {label && (
        <label htmlFor={inputId} className='text-sm font-medium text-brand-fg'>
          {label}
        </label>
      )}
      <BaseInput id={inputId} className={classNames} {...props} />
      {error ? (
        <span className='text-xs text-brand-danger'>{error}</span>
      ) : description ? (
        <span className='text-xs text-brand-muted'>{description}</span>
      ) : null}
    </div>
  );
}
