---
'@holakirr/snow-ui': minor
---

New **`DatePicker`**: a form field for a date that opens the `Calendar` in a popover. The field looks like the Select trigger with a calendar icon; it is a `<button role="combobox">` that opens a modal dialog with focus on the picked day (or today). The arrow keys move between days, Enter picks one and closes the calendar, Escape closes it without a change; ↓ on the field opens it, Backspace or Delete clears it.

- `value` / `defaultValue` / `onValueChange` (a `Date`, `null` once cleared) and `open` / `defaultOpen` / `onOpenChange`.
- `minDate`, `maxDate` and `disabledDates` (react-day-picker matchers) limit the days; `calendarProps` passes any other `Calendar` prop (`captionLayout`, `showTodayButton`…).
- The date is formatted with date-fns (`dateFormat`, `"PP"` by default) in `SnowUIProvider`'s `locale` (or the `locale` prop); the week starts on Monday, as in `Calendar` (`weekStartsOn`, or `SnowUIProvider`'s, sets another day). `clearable` (on by default) shows a clear button.
- Button props (`id`, `aria-*`, `onBlur`, `ref`) go to the trigger, so it works in `FormControl` and with react-hook-form; `name` submits the date as `yyyy-MM-dd` with a hidden input; `aria-invalid` gives it a red stroke; `required` sets `aria-required`.
- Right-to-left aware, with its strings in the new `messages.datePicker` namespace (`placeholder`, `dialog`, `clear`), optional in the `Messages` type like `messages.combobox`, so a full translation typed as `Messages` for 5.0 keeps compiling.

The deprecated `DatePickerType` and `RangePickerType` types are unrelated to it and unchanged.

**Forms:** `name` submits `yyyy-MM-dd` (empty with no date) with a hidden input that follows `form="id"`; `required` blocks native submission while there is no date; a form reset brings back the initial date. An `Invalid Date` value counts as no date; picking the same day again calls nothing; disabling the field closes the calendar with `onOpenChange(false)`; a month with no day to pick focuses the month navigation.
