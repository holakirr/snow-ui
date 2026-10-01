---
"@holakirr/snow-ui": minor
---

`Input` gets the kit's clear button, opt-in: `clearable`. A focused field with a value shows a 16px `XCircle` (fill, Black/100%) at the end, as the kit's Focus state draws it (before the Warning of an invalid field); it hides while the field is empty, unfocused, disabled or read-only. A `type="search"` input's own clear button is hidden. Clearing sets the value the way typing does (an `input` event), so `onChange` fires with an empty value for controlled and uncontrolled fields and react-hook-form records it; `onClear` runs after, and the focus returns to the input. The button is a tab stop while it shows (Enter or Space clears), named by `clearLabel` or the new optional `messages.input.clear` ("Clear"; the `input` namespace is optional until 6.0, like those added in 5.1).
