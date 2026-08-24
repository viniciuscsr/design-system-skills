# Dialog

**Purpose:** a modal window that interrupts the page.
**Use when:** confirming something destructive, or a short focused task that shouldn't lose the page behind it.
**Don't use when:** the content is long or needs its own URL. Use a page.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `triggerLabel` | `string` | required | Text of the Button that opens it |
| `title` | `string` | required | Rendered as the dialog title, read out by screen readers |
| `description` | `string` | — | One line under the title |
| `children` | `ReactNode` | — | Body content, below the description |

## Variants

None. The trigger is always a default `Button`; the popup is `brand.bg` with a
`brand.border` outline over a 50% black backdrop.

If you need a different trigger, compose Base UI's `Dialog` directly rather than
adding a prop here.

## Do / Don't

- Do: put the action buttons in `children`, primary action last.
- Do: keep it to one decision.
- Don't: open a Dialog from inside another Dialog.
- Don't: use it for errors or confirmations that could be a toast.

## Example

```tsx
<Dialog
  triggerLabel="Delete project"
  title="Delete this project?"
  description="This can't be undone."
>
  <div className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Delete</Button>
  </div>
</Dialog>
```
