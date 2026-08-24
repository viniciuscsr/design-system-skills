# Select

**Purpose:** pick one option from a list.
**Use when:** there's a fixed set of choices and only one can be picked.
**Don't use when:** there are two choices — use Switch or a pair of radio-style buttons. Or when the user can type their own value — use Input.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `items` | `{ label: string; value: string }[]` | required | The options |
| `label` | `string` | — | Rendered above the trigger |
| `placeholder` | `string` | `'Select an option'` | Shown when nothing is picked |
| `defaultValue` | `string` | — | Must match one of the `items` values |
| `className` | `string` | `''` | Lands on the trigger |

## Variants

None. One size, matching Input's `md` (`h-11`).

## Do / Don't

- Do: keep `items` short. Past about ten options, use a searchable component instead.
- Do: write `label` and `placeholder` as different text — "Country" and "Select a country".
- Don't: pass a `defaultValue` that isn't in `items`; the trigger will render empty.
- Don't: use it for an action menu. This picks a value, it doesn't run commands.

## Example

```tsx
<Select
  label="Plan"
  items={[
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
  ]}
  defaultValue="free"
/>
```
