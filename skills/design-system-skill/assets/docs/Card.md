# Card

**Purpose:** a bordered container that groups related content.
**Use when:** you need a visual box — a list item, a settings panel, a summary tile.
**Don't use when:** the content is the whole page. A page doesn't need a card around it.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `title` | `string` | — | Rendered as `h3` |
| `description` | `string` | — | One line under the title |
| `footer` | `ReactNode` | — | Sits below a `border-soft` divider |
| `children` | `ReactNode` | — | The body, below the description |
| `className` | `string` | `''` | Appended last |
| ...rest | `div` attributes | | |

## Variants

None. One fixed style: `brand.bg` background, `brand.border` outline, `rounded-xl`.

If you need a tinted card, add `className="bg-brand-surface"` — that's the one
override worth making, and it's still a token.

## Do / Don't

- Do: use `title`/`description` rather than putting your own heading in `children` — it
  keeps type consistent across every card in the app.
- Do: put actions in `footer`.
- Don't: nest cards. Use a plain `div` with spacing inside instead.
- Don't: add a shadow. This system uses borders, not elevation.

## Example

```tsx
<Card title="Billing" description="Manage your plan and payment method.">
  <p className="text-sm text-brand-fg2">Pro — $20/month</p>
</Card>
```
