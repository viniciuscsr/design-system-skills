# Badge

**Purpose:** a small pill showing status or a count.
**Use when:** labelling state — "Active", "Overdue", "3 new".
**Don't use when:** it's clickable. That's a Button, not a Badge.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `variant` | `'primary' \| 'success' \| 'danger' \| 'neutral'` | `'neutral'` | See below |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `className` | `string` | `''` | Appended last |
| ...rest | `span` attributes | | |

## Variants

| variant | tokens used | when |
|---|---|---|
| `neutral` | `brand.surface`, `brand.fg2` | The default. Counts, plain labels |
| `primary` | `brand.primary` at 10% | Highlighted or selected state |
| `success` | `brand.success-soft`, `brand.success` | Done, active, paid, healthy |
| `danger` | `brand.danger-soft`, `brand.danger` | Failed, overdue, blocked |

## Do / Don't

- Do: keep the text to one or two words.
- Do: reach for `neutral` unless the state genuinely means good or bad.
- Don't: use `danger` for anything that isn't a problem — it loses its meaning.
- Don't: nest a Badge inside a Button.

## Example

```tsx
<Badge variant="success">Active</Badge>
<Badge size="sm">12</Badge>
```
