---
"@holakirr/snow-ui": minor
---

**Textarea:** the Figma character counter, opt-in with `showCount`. "12/200" (against the `maxLength`, or "12" without one) sits in the bottom-end corner next to the resize handle, in `text-secondary` instead of the Figma Black/20% (1.6:1), and the text stops above it. Screen readers get "12 of 200 characters" as the field's description, read when it gets focus rather than on every keystroke (`messages.textarea.count`, a new optional namespace). With the counter, the textarea and the counter are wrapped in a `<div data-slot="textarea-field">`, sized with the new `containerClassName`; `className` still styles the `<textarea>`. Without `showCount` (the default), Textarea renders as before, also with a `maxLength`. The text fields' class strings (`basicInputClasses` and the others) now come from a module without `'use client'`, so a `Textarea` in a Server Component no longer gets client references for them.
