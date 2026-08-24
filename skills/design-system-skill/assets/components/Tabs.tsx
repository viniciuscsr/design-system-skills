'use client';

import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
}

export default function Tabs({ tabs, defaultValue }: TabsProps) {
  return (
    <BaseTabs.Root defaultValue={defaultValue ?? tabs[0]?.value} className='w-full'>
      <BaseTabs.List className='relative flex gap-1 border-b border-brand-border'>
        {tabs.map((tab) => (
          <BaseTabs.Tab
            key={tab.value}
            value={tab.value}
            className='px-4 py-2 text-sm font-medium text-brand-fg2 transition-colors data-[selected]:text-brand-primary'
          >
            {tab.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator className='absolute bottom-0 left-0 h-0.5 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] bg-brand-primary transition-all' />
      </BaseTabs.List>
      {tabs.map((tab) => (
        <BaseTabs.Panel key={tab.value} value={tab.value} className='pt-4 text-sm text-brand-fg2'>
          {tab.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
