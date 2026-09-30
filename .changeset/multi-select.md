---
'@holakirr/snow-ui': minor
---

New **`MultiSelect`**: a `Combobox` that picks several values, shown as removable `Tag`s in the field. Enter or a click toggles the highlighted option and the list stays open (`aria-multiselectable`); Backspace in the empty field removes the last tag, and each tag has a remove button. The picked options describe the field for screen readers ("Selected: …", `messages.combobox.selected`) and removals are announced (`messages.combobox.removed`). `value` / `defaultValue` / `onValueChange` take arrays of strings; filtering, groups, server results, `creatable`, `clearable`, forms (`ref`, `name` with one hidden input per value, `aria-invalid`) and right-to-left text work as in `Combobox`.

**Forms:** `name` submits one hidden input per picked value, following `form="id"`; `required` blocks native submission while no tag is picked ("Select at least one item in the list.", `messages.combobox.requiredMultiple`); a form reset brings back the initial values (a controlled field gets `onValueChange` with them; a reset cancelled in `onReset` changes nothing). A removal is announced once (it doesn't come back after "Loading" or "No results").
