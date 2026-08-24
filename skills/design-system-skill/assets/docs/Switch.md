# Switch

**Purpose:** turn a setting on or off, taking effect immediately.
**Use when:** flipping it does something right away — enable notifications, dark mode.
**Don't use when:** the value is part of a form the user submits later. Use Checkbox.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `label` | `string` | — | Rendered next to the track, inside the same `label` element |
| `checked` | `boolean` | — | Controlled |
| `defaultChecked` | `boolean` | `false` | Uncontrolled |
| `onCheckedChange` | `(checked: boolean) => void` | — | |
| `disabled` | `boolean` | `false` | Dims the whole row |
| `className` | `string` | `''` | Lands on the track |
| ...rest | Base UI `Switch.Root` props | | |

## Variants

None. Off uses `brand.border`, on uses `brand.primary`, and the thumb is `brand.bg`.

## Do / Don't

- Do: write the label as the thing being turned on ("Email notifications"), not as a
  question or a state ("Notifications on?").
- Do: show the result immediately. If it needs saving, use a Checkbox and a Save button.
- Don't: pair it with Yes/No text — the switch already shows the state.
- Don't: use it to pick between two different things. That's a Select or Tabs.

## Example

```tsx
<Switch label="Email notifications" defaultChecked />
```
