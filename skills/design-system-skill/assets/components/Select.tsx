'use client';

import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  items: SelectOption[];
  defaultValue?: string;
  className?: string;
}

export default function Select({
  label,
  placeholder = 'Select an option',
  items,
  defaultValue,
  className = '',
}: SelectProps) {
  return (
    <BaseSelect.Root items={items} defaultValue={defaultValue}>
      <div className='flex flex-col gap-1.5'>
        {label && (
          <BaseSelect.Label className='text-sm font-medium text-brand-fg'>
            {label}
          </BaseSelect.Label>
        )}
        <BaseSelect.Trigger
          className={[
            'flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-brand-border bg-brand-bg px-3.5 text-sm text-brand-fg',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary',
            'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <BaseSelect.Value placeholder={placeholder} />
          <BaseSelect.Icon>
            <ChevronDownIcon className='h-4 w-4 text-brand-muted' />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
      </div>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4}>
          <BaseSelect.Popup className='max-h-64 overflow-auto rounded-lg border border-brand-border bg-brand-bg p-1 shadow-lg'>
            {items.map((item) => (
              <BaseSelect.Item
                key={item.value}
                value={item.value}
                className='flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-brand-fg data-[highlighted]:bg-brand-surface'
              >
                <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator>
                  <CheckIcon className='h-4 w-4 text-brand-primary' />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
