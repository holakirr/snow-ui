---
'@holakirr/snow-ui': minor
---

New **`DateRangePicker`**: the `DatePicker` field for a range of dates, with the `Calendar` in range mode. Every time the calendar opens a new range starts: the first pick is the start, the second the end (the two are put in order), and the calendar closes; while the end is being picked the range follows the pointer, and closing after one pick keeps the previous range. `value` / `defaultValue` / `onValueChange` take a `DateRange` (`{ from, to }`, re-exported from react-day-picker) or `null`; `numberOfMonths` shows several months (one by default); `name` submits an ISO 8601 interval (`2025-01-13/2025-01-16`). Limits, formatting, localization, forms and right-to-left text work as in `DatePicker`; its strings are `rangePlaceholder`, `rangeDialog` and `range(start, end)` in `messages.datePicker`.
