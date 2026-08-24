'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Checkbox from '@/components/ui/Checkbox';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Tabs from '@/components/ui/Tabs';
import Tooltip from '@/components/ui/Tooltip';

/**
 * Register a new UI primitive here after adding Foo.tsx + Foo.md.
 * Keep previews as the real component. Do not restyle a fake.
 */
const specimens = [
  {
    name: 'Button',
    file: 'components/ui/Button.tsx',
    preview: (
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='sm'>Small</Button>
        <Button>Primary</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button disabled>Disabled</Button>
      </div>
    ),
  },
  {
    name: 'Badge',
    file: 'components/ui/Badge.tsx',
    preview: (
      <div className='flex flex-wrap items-center gap-2'>
        <Badge>Neutral</Badge>
        <Badge variant='primary'>Primary</Badge>
        <Badge variant='success'>Success</Badge>
        <Badge variant='danger'>Danger</Badge>
        <Badge size='sm'>12</Badge>
      </div>
    ),
  },
  {
    name: 'Card',
    file: 'components/ui/Card.tsx',
    preview: (
      <div className='grid gap-3 sm:grid-cols-2'>
        <Card title='Billing' description='Manage your plan and payment method.'>
          <p className='text-sm text-brand-fg2'>Pro — $20/month</p>
        </Card>
        <Card
          title='With a footer'
          description='Actions sit below the divider.'
          footer={<Button size='sm'>Save</Button>}
        />
      </div>
    ),
  },
  {
    name: 'Input',
    file: 'components/ui/Input.tsx',
    preview: (
      <div className='grid max-w-sm gap-4'>
        <Input label='Email' type='email' placeholder='you@example.com' />
        <Input label='Email' description='We never share this.' />
        <Input label='Email' error='Enter a valid email address' />
      </div>
    ),
  },
  {
    name: 'Select',
    file: 'components/ui/Select.tsx',
    preview: (
      <div className='max-w-sm'>
        <Select
          label='Plan'
          placeholder='Select a plan'
          items={[
            { label: 'Free', value: 'free' },
            { label: 'Pro', value: 'pro' },
            { label: 'Enterprise', value: 'enterprise' },
          ]}
          defaultValue='pro'
        />
      </div>
    ),
  },
  {
    name: 'Checkbox',
    file: 'components/ui/Checkbox.tsx',
    preview: (
      <div className='flex flex-col gap-3'>
        <Checkbox label='Email me about product updates' />
        <Checkbox label='Checked by default' defaultChecked />
        <Checkbox label='Disabled' disabled />
      </div>
    ),
  },
  {
    name: 'Switch',
    file: 'components/ui/Switch.tsx',
    preview: (
      <div className='flex flex-col gap-3'>
        <Switch label='Email notifications' defaultChecked />
        <Switch label='Weekly digest' />
        <Switch label='Disabled' disabled />
      </div>
    ),
  },
  {
    name: 'Tabs',
    file: 'components/ui/Tabs.tsx',
    preview: (
      <Tabs
        tabs={[
          { value: 'overview', label: 'Overview', content: 'The overview panel.' },
          { value: 'activity', label: 'Activity', content: 'The activity panel.' },
          { value: 'settings', label: 'Settings', content: 'The settings panel.' },
        ]}
      />
    ),
  },
  {
    name: 'Dialog',
    file: 'components/ui/Dialog.tsx',
    preview: (
      <Dialog
        triggerLabel='Delete project'
        title='Delete this project?'
        description="This can't be undone."
      >
        <div className='flex justify-end gap-2'>
          <Button variant='outline'>Cancel</Button>
          <Button>Delete</Button>
        </div>
      </Dialog>
    ),
  },
  {
    name: 'Tooltip',
    file: 'components/ui/Tooltip.tsx',
    preview: (
      <Tooltip content='Archive this item'>
        <Button variant='ghost'>Hover me</Button>
      </Tooltip>
    ),
  },
];

export default function Specimens() {
  return (
    <div className='mt-8 space-y-10'>
      {specimens.map((item) => (
        <article
          key={item.name}
          className='rounded-2xl border border-brand-border bg-brand-bg p-6'
        >
          <div className='flex flex-wrap items-baseline justify-between gap-2'>
            <h3 className='text-lg font-semibold text-brand-fg'>{item.name}</h3>
            <p className='text-xs text-brand-muted'>
              {item.file} · {item.file.replace('.tsx', '.md')}
            </p>
          </div>
          <div className='mt-4'>{item.preview}</div>
        </article>
      ))}
    </div>
  );
}
