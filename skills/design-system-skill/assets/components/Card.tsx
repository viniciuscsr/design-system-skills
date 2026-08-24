import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export default function Card({
  title,
  description,
  footer,
  className = '',
  children,
  ...props
}: CardProps) {
  const classNames = [
    'rounded-xl border border-brand-border bg-brand-bg p-5',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {title && <h3 className='text-base font-semibold text-brand-fg'>{title}</h3>}
      {description && (
        <p className='mt-1.5 text-sm text-brand-fg2'>{description}</p>
      )}
      {children && <div className='mt-4'>{children}</div>}
      {footer && (
        <div className='mt-4 border-t border-brand-border-soft pt-4'>{footer}</div>
      )}
    </div>
  );
}
