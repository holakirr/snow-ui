---
'@holakirr/snow-ui': minor
---

New **`DatePicker`**: a form field for a date that opens the `Calendar` in a popover. The field looks like the Select trigger with a calendar icon; it is a `<button role="combobox">` that opens a modal dialog with focus on the picked day (or today). The arrow keys move between days, Enter picks one and closes the calendar, Escape closes it without a change; ↓ on the field opens it, Backspace or Delete clears it.

- `value` / `defaultValue` / `onValueChange` (a `Date`, `null` once cleared) and `open` / `defaultOpen` / `onOpenChange`.
- `minDate`, `maxDate` and `disabledDates` (react-day-picker matchers) limit the days; `calendarProps` passes any other `Calendar` prop (`captionLayout`, `showTodayButton`…).
- The date is formatted with date-fns (`dateFormat`, `"PP"` by default) in `SnowUIProvider`'s `locale` (or the `locale` prop); the week starts on Monday unless you pass `weekStartsOn`. `clearable` (on by default) shows a clear button.
- Button props (`id`, `aria-*`, `onBlur`, `ref`) go to the trigger, so it works in `FormControl` and with react-hook-form; `name` submits the date as `yyyy-MM-dd` with a hidden input; `aria-invalid` gives it a red stroke; `required` sets `aria-required`.
- Right-to-left aware, with its strings in the new `messages.datePicker` namespace (`placeholder`, `dialog`, `clear`).

The deprecated `DatePickerType` and `RangePickerType` types are unrelated to it and unchanged.
