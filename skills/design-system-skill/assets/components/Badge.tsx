import * as React from 'react';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-brand-success-soft text-brand-success',
  danger: 'bg-brand-danger-soft text-brand-danger',
  neutral: 'bg-brand-surface text-brand-fg2',
};

export default function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const classNames = [
    'inline-flex items-center rounded-full font-medium',
    sizeStyles[size],
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
}
