---
"@holakirr/snow-ui": major
---

Upgrade `react-day-picker` to v10. `CalendarProps` extends `DayPickerProps`, so the props and APIs react-day-picker v10 removed are no longer accepted by `Calendar`:

- `fromMonth` / `toMonth` / `fromYear` / `toYear` → `startMonth` / `endMonth` (e.g. `startMonth={new Date(2020, 0)}`); `fromDate` / `toDate` → `hidden={{ before: date }}` / `hidden={{ after: date }}`.
- `initialFocus` → `autoFocus`.
- `onDayKeyUp`, `onDayKeyPress`, `onDayPointerEnter`/`Leave`, `onDayTouch*` and `onWeekNumberClick` → a custom `DayButton` / `WeekNumber` in `components`.
- The v8-style `classNames` keys (`DeprecatedUI`) and `components.Button` → the v9 `UI` keys and `PreviousMonthButton` / `NextMonthButton`.

See the [react-day-picker upgrade guide](https://daypicker.dev/upgrading). `captionClassName` is deprecated in favour of `monthCaptionClassName` (it is merged into the month caption, as react-day-picker has no separate `caption` slot).
