# Checkbox

**Purpose:** turn one thing on or off as part of a form.
**Use when:** the value is submitted with a form, or several options can be picked at once.
**Don't use when:** the change takes effect immediately. Use Switch.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `label` | `string` | — | Rendered next to the box, inside the same `label` element |
| `checked` | `boolean` | — | Controlled |
| `defaultChecked` | `boolean` | `false` | Uncontrolled |
| `onCheckedChange` | `(checked: boolean) => void` | — | |
| `disabled` | `boolean` | `false` | Dims the whole row, label included |
| `className` | `string` | `''` | Lands on the box, not the label |
| ...rest | Base UI `Checkbox.Root` props | | |

## Variants

None. Checked state uses `brand.primary` for the fill and `brand.primary-on` for the tick.

## Do / Don't

- Do: pass `label` rather than putting text next to the component — the built-in label
  makes the text clickable too.
- Do: use several checkboxes for "pick any", one Switch for "on or off right now".
- Don't: use it as a toggle for a setting that saves instantly.
- Don't: leave it without a label.

## Example

```tsx
<Checkbox label="Email me about product updates" />
<Checkbox label="Required" defaultChecked disabled />
```
