# Tabs

**Purpose:** switch between views of the same thing without leaving the page.
**Use when:** two to five sections of related content — Overview, Activity, Settings.
**Don't use when:** each section deserves its own URL, or there are more than about five. Use navigation.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `tabs` | `{ value: string; label: string; content: ReactNode }[]` | required | Order here is the order shown |
| `defaultValue` | `string` | first tab's value | Which one opens first |

## Variants

None. The selected tab is `brand.primary` with a matching underline; the rest are
`brand.fg2`.

## Do / Don't

- Do: keep labels to one word where you can.
- Do: make sure every `value` is unique — the underline tracks the selected one.
- Don't: put a form that spans tabs inside one. Users lose work switching away.
- Don't: hide the primary action of a page behind a tab.

## Example

```tsx
<Tabs
  tabs={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'activity', label: 'Activity', content: <Activity /> },
  ]}
/>
```
