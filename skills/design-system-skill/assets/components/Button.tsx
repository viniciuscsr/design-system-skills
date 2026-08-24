'use client';

import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ComponentProps<typeof BaseButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-brand-primary-on hover:bg-brand-primary-hover active:bg-brand-primary-active',
  secondary:
    'bg-brand-surface-warm text-brand-fg hover:bg-brand-surface-warm/60',
  outline:
    'border border-brand-border bg-brand-bg text-brand-fg hover:bg-brand-surface',
  ghost: 'text-brand-fg hover:bg-brand-surface',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const classNames = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2',
    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
    sizeStyles[size],
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <BaseButton className={classNames} {...props} />;
}
