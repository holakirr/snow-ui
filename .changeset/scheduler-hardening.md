---
"@holakirr/snow-ui": patch
---

`Scheduler` fixes:

- An invalid `currentDate` (a bad date from a URL) renders "Invalid Date" labels again, as in 5.0, instead of throwing.
- Deleting an event from its own menu (`dropdownContentRenderer`) gives the focus to the event's hour cell instead of the page.
- Today, the current hour and the current-time line follow the browser's clock after hydration, so a server in another time zone no longer leaves a second tab stop or a wrong "today"; they now also move on every minute.
- The rows keep their layout in Chrome and Edge 111–116, which lack CSS `subgrid` (they repeat the grid's columns there).
- The events of an hour are in the order they start, for the arrow keys, Tab and on screen, whatever the order of `events`.
