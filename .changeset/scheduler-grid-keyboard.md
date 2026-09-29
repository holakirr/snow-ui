---
"@holakirr/snow-ui": patch
---

Keyboard and screen reader support for Scheduler and the Calendar year view.

- **Scheduler:**
  - The week is a `grid` named by its dates in the locale ("September 28 – October 4, 2026"; your `aria-label` or `aria-labelledby` replaces it), with rows of day column headers, hour row headers and a cell per hour holding its button and the events that start in it. The layout doesn't change.
  - It is one tab stop instead of one per hour and event. Tab enters on the last focused hour or event (at first, the current hour of today); the arrow keys move between days (mirrored in right-to-left text, following the `dir` prop or `SnowUIProvider`) and down the day through each hour and its events, Home / End go to the first / last day of the row, Ctrl or ⌘ + Home / End to the first / last hour of the grid, and Page Down / Page Up move six hours. ArrowDown on an event moves on instead of opening its menu; Enter and Space still open it, and Escape returns focus to the event.
  - Today's day label has `aria-current="date"` and is semibold, so it isn't told by its colour alone; the current hour's cell has `aria-current="time"`. The current-time tag is hidden from assistive technology and lets clicks through to the cells below it.
- **Calendar:** the year switcher (the caption label) has `aria-expanded` and `aria-controls`, and picking a year returns the focus to it instead of losing it. The year view is a group named by its years; it was a `grid` named by the month with no rows (the day grid's role, name and `aria-multiselectable` on a list of year buttons).
