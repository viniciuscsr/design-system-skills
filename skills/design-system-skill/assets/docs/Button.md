# Button

**Purpose:** the standard clickable action.
**Use when:** anything the user clicks to do something — submit, open, confirm, cancel.
**Don't use when:** it navigates to another page. Use a link styled with `text-brand-primary`.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | See below |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `disabled` | `boolean` | `false` | Base UI sets `data-disabled`; styling follows automatically |
| `className` | `string` | `''` | Appended last, so it wins |
| ...rest | Base UI `Button` props | | Including `render` for polymorphism |

## Variants

| variant | tokens used | when |
|---|---|---|
| `primary` | `brand.primary`, `brand.primary-on`, `-hover`, `-active` | The one main action on a screen |
| `secondary` | `brand.surface-warm`, `brand.fg` | A second action next to a primary one |
| `outline` | `brand.border`, `brand.bg`, `brand.fg` | Low emphasis, still clearly a button |
| `ghost` | `brand.fg`, `brand.surface` | Toolbars, icon buttons, dense rows |

Note `secondary` is a *visual weight*, not the secondary color — this system has no
`brand.secondary` token.

## Do / Don't

- Do: keep one `primary` button per screen area.
- Do: use `render` to make it a link when it navigates — `<Button render={<a href="/x" />}>`.
- Don't: add a color class to override the variant. Add a variant instead.
- Don't: put a loading spinner inside by hand — disable it and change the label.

## Example

```tsx
<Button variant="primary" size="md">Save changes</Button>
<Button variant="outline" onClick={onCancel}>Cancel</Button>
```
