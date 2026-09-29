---
'@holakirr/snow-ui': minor
---

New **`Combobox`**: a text field with a list of options that filters as the user types, for picking one value out of many (countries, time zones, people). It looks like the Input field with the Select menu and follows the WAI-ARIA combobox pattern: focus stays in the field and the highlighted option is its `aria-activedescendant`; ↓ / ↑ open the list and move the highlight, Enter or a click picks, Escape closes the list and then clears the field.

- `options` flat or in titled groups (`{ label, options }`), each `{ value, label, icon?, keywords?, disabled? }`; `defaultComboboxFilter` matches every word in the label or the keywords, `filter` takes your own, `filter={false}` + `onQueryChange` + `loading` serve results from a server.
- `creatable` + `onCreate(query)` offer 'Create "query"'; `clearable` (on by default) shows a clear button; empty and loading messages are shown and announced.
- `value` / `defaultValue` / `onValueChange` (strings, `null` for none) and `open` / `defaultOpen` / `onOpenChange`. Input props (`id`, `aria-*`, `onBlur`, `ref`) go to the `<input>`, so it works in `FormControl` and with react-hook-form (`field.ref` focuses it on errors); `name` submits the value with a hidden input; `aria-invalid` gives it a red stroke.
- Right-to-left aware, with its strings in the new `messages.combobox` namespace (`empty`, `loading`, `clear`, `create(query)`, `selected(labels)`, `removed(label)`). The namespace is optional in the `Messages` type (English defaults fill it in; `useMessages()` returns `Required<Messages>`), so a full translation typed as `Messages` for 5.0 keeps compiling.
