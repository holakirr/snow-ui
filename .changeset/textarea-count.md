---
"@holakirr/snow-ui": minor
---

**Textarea:** the Figma character counter. With a `maxLength` (or `showCount`), "12/200" sits in the bottom-end corner next to the resize handle (`text-secondary` instead of the Figma Black/20%, which is 1.6:1). Screen readers get "12 of 200 characters" as the field's description, read when it gets focus rather than on every keystroke (`messages.textarea.count`, a new optional namespace). The textarea and the counter are then wrapped in a `<div data-slot="textarea-field">`, sized with the new `containerClassName`; `className` still styles the `<textarea>`, and `showCount={false}` keeps the old markup. A Textarea without a `maxLength` renders as before.
