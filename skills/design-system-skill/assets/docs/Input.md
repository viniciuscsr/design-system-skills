# Input

**Purpose:** a single-line text field with its label, help text, and error.
**Use when:** collecting one line of text — email, name, search, a number.
**Don't use when:** the user picks from a fixed list. Use Select.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `label` | `string` | — | Rendered as a `label` wired to the input by id |
| `description` | `string` | — | Help text below. Hidden when `error` is set |
| `error` | `string` | — | Replaces the description and turns the text `brand.danger` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `id` | `string` | auto | Generated with `useId` when not given |
| `className` | `string` | `''` | Lands on the input, not the wrapper |
| ...rest | Base UI `Input` props | | `placeholder`, `type`, `value`, `onChange` |

## Variants

None. State comes from props: `error` for the invalid state, `disabled` for the
inactive one.

## Do / Don't

- Do: always pass a `label`. A placeholder is not a label — it disappears when typing.
- Do: put validation messages in `error` rather than rendering your own text below.
- Don't: set `className` to change the border color. `error` already does that.
- Don't: wrap it in your own `div` with a second label.

## Example

```tsx
<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Email" error="Enter a valid email address" />
```
