---
"@holakirr/snow-ui": minor
---

`CommandPalette`: the kit's search results, opt-in.

- `showCount` shows the number of results above the list while there is a query ("105 results", 12/16 `text-secondary`), in a polite live region; `resultCount` sets the number when the list holds only some results. New optional message `commandPalette.results(count)` ("1 result", "105 results"), required in 6.0.
- `highlightMatches` marks the words of the query in each label and snippet with `<mark>`, in `indigo-text` (the kit's Secondary/Indigo, 5.37:1; 4.91:1 on the highlighted option). In dark mode it is mixed with 30% white (6.47:1, 4.78:1), as #ADADFB is 3.78:1 on the highlight. The options' names are unchanged.
- An item's new `snippet` is a second line under the label (12/16 `text-secondary`), such as the text on the page that matched; it is the option's description, and `defaultCommandPaletteFilter` matches it too.

Without these props the palette is unchanged.
