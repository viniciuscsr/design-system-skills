'use client';

import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

export default function Tooltip({ content, children }: TooltipProps) {
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={8}>
            <BaseTooltip.Popup className='rounded-md bg-brand-primary px-2.5 py-1.5 text-xs font-medium text-brand-primary-on shadow-lg data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity'>
              <BaseTooltip.Arrow className='fill-brand-primary' />
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
