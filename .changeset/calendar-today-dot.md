---
"@holakirr/snow-ui": patch
---

`Calendar`: today gets a 4px dot in the text colour under its number, on top of the Secondary/Indigo fill, and keeps it while selected. In dark mode a selected day is indigo too, so today and the selected day differed only on hover; the dot tells them apart. With forced colours (Windows High Contrast), where the fills are dropped, selected days (and range bands) use the system Highlight and today's dot the system text colour.
