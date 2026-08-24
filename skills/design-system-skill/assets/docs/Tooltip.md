# Tooltip

**Purpose:** a short label that appears on hover or focus.
**Use when:** explaining an icon-only button, or an abbreviation.
**Don't use when:** the information matters. Tooltips are invisible on touch devices and to anyone scanning the page — put important text on the page.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `content` | `ReactNode` | required | What shows in the bubble |
| `children` | `ReactElement` | required | The trigger. Must be a single element that forwards props |

## Variants

None. Always `brand.primary` background with `brand.primary-on` text and a matching arrow.

## Do / Don't

- Do: keep `content` to a few words.
- Do: use it on icon-only buttons — that's the case it exists for.
- Don't: put a link or a button inside `content`. It can't be reached by keyboard.
- Don't: wrap plain text in it. The trigger has to be focusable to work for everyone.

## Example

```tsx
<Tooltip content="Archive">
  <Button variant="ghost" aria-label="Archive">
    <ArchiveBoxIcon className="h-5 w-5" />
  </Button>
</Tooltip>
```
