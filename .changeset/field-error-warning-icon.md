---
"@holakirr/snow-ui": minor
---

Invalid text fields get the kit's Error icon. An `Input` or `Textarea` with `aria-invalid="true"` (as `FormControl` sets it) shows a 16px `Warning` icon at the end, next to the red stroke it already had. The icon is decorative: `aria-invalid` and the `FormMessage` tell the error.

- `Input`: an element after the end content, in the stroke's colour (`control-border-invalid`: Secondary/Red, `red-text` with more contrast). If you already put an error icon in `endContent`, hide the new one with `className="[&_[data-slot=input-invalid-icon]]:hidden"`.
- `Textarea`: a background image at the end of the first row, so the `<textarea>` gets no wrapper. While invalid the text stops 40px from the end instead of 16px, so lines may rewrap, and your own background image is covered. Turn it off with `className="aria-invalid:bg-none aria-invalid:pe-4"`. It stays Secondary/Red with more contrast.
- `FormLabel` now stays `text-secondary` on an invalid field, as the kit's title does; it turned `red-text` before.

Select, Combobox, InputSmall and Search keep the stroke without an icon, as the kit draws them.
