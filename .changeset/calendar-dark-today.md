---
"@holakirr/snow-ui": patch
---

`Calendar` and the date pickers' month, year and time views in dark mode: today (the current month, year or hour), unless selected, has no fill, only indigo text (white on hover) and its dot. A selected day is indigo in dark mode, so a selected today and an unselected one looked the same (indigo with the dot); now only the selected one is filled. The light theme and forced colours are unchanged. If you restyle today with `todayClassName`, also override its `dark:` classes (`dark:not-aria-selected:[&>button]:bg-transparent` and `dark:not-aria-selected:[&>button]:text-indigo`), which otherwise keep a dark today unfilled.
