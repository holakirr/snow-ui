---
"@holakirr/snow-ui": patch
---

Fixes found while writing the component docs.

- **Toast:** a toast with an `action` no longer closes after the Toaster's 3 seconds: its `duration` defaults to `Number.POSITIVE_INFINITY`, so the user has as long as they need to reach the action (WCAG 2.2.1), and it keeps the close button it gets by default. Pass a `duration` to `toast()` to close it on a timer again; the Toaster's `duration` only applies to toasts without an action.
- **IconText / ListItem:** a focusable row (an `asChild` link or button, `interactive` or `active` or not) shows the `focus-ring` of the other controls on keyboard focus. `interactive` rows had only the faint Figma "Focus" ring (Black/4%, 1.1:1) and no outline, and other links and buttons had no indicator of their own.
- **Scheduler:**
  - Shows the week that contains `currentDate` when it falls before `startOfWeek` in its week (a Sunday with weeks starting on Monday showed the next week).
  - `onDateClick` gets the start of the clicked hour (`hh:00:00.000`); the minutes, seconds and milliseconds of `currentDate` leaked into it and into the cells' names.
  - An event that runs past midnight continues on the next day instead of overflowing the grid, and the part of an event that started the week before is shown.
  - The hours of the grid fit the events of the shown week only; an event that ends on the hour no longer adds an empty row, and one that ends at midnight or is shorter than its one-hour block near the end of the day no longer overflows the grid.
  - Around a daylight saving change, events are as tall as the hours they cover on the clock, and the hour labels no longer depend on today's date (on the day clocks spring forward, 2 AM read "3 AM").
  - The current time shows only in the week that contains today.
  - The hour cells are `<button>` elements next to the events instead of `role="button"` elements around them: a control inside a button isn't exposed to assistive technology (axe `nested-interactive`).
  - An event that ends before it starts is shown as having no duration (the minimum one-hour block).
