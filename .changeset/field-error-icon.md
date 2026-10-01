---
"@holakirr/snow-ui": minor
---

The kit's Error icon on text fields, opt-in: `showErrorIcon` on `Input` and `Textarea`. While the field is invalid (`aria-invalid="true"`, as `FormControl` sets it), it shows a 16px `Warning` (Phosphor, regular) at the end of the field, in the red of the stroke (`control-border-invalid`), and an invalid `FormLabel` of the same `FormItem` stays grey, as the kit's title does. The icon is decorative: `aria-invalid` and the `FormMessage` still tell the error.

- `Input`: after the end content, 16px from the end and centred in the field.
- `Textarea`: at the end of the first row; the text stops 8px before it while the field is invalid. Like `showCount`, it wraps the textarea in a `<div>` (`containerClassName`).

Nothing changes without the prop: invalid fields keep the red stroke alone, and an invalid `FormLabel` still turns `red-text`. `FormItem`'s `<div>` gets the `group/form-item` class. Select, InputSmall and Search keep the stroke alone, as the kit draws them.
