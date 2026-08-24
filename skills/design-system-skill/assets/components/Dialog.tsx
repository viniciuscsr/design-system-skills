'use client';

import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface DialogProps {
  triggerLabel: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function Dialog({
  triggerLabel,
  title,
  description,
  children,
}: DialogProps) {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger render={<Button>{triggerLabel}</Button>} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className='fixed inset-0 bg-[rgb(0_0_0/0.5)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity' />
        <BaseDialog.Popup className='fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-brand-border bg-brand-bg p-6 shadow-xl data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 transition-all'>
          <div className='flex items-start justify-between gap-4'>
            <BaseDialog.Title className='text-lg font-semibold text-brand-fg'>
              {title}
            </BaseDialog.Title>
            <BaseDialog.Close className='text-brand-muted hover:text-brand-fg'>
              <XMarkIcon className='h-5 w-5' />
            </BaseDialog.Close>
          </div>
          {description && (
            <BaseDialog.Description className='mt-2 text-sm text-brand-fg2'>
              {description}
            </BaseDialog.Description>
          )}
          {children && <div className='mt-4'>{children}</div>}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
