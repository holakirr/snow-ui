---
"@holakirr/snow-ui": minor
---

New `scrollbar-snow` utility (in `theme.css`, and in `index.css`): the Figma "Scrollbar" on your scroll containers, with no track: a 4px rounded thumb in `black-10` (the Figma Black/10%) that widens to 8px in `control-border` (the Figma Black/20%) while the pointer is over the container. With more contrast the resting thumb is `control-border` too (3:1 or more). Both colours follow the theme. Chrome, Edge and Safari draw the kit's thumb; Firefox its thin scrollbar in the same two colours, at its own width. Nothing animates, and forced-colors mode keeps the system scrollbar. See Foundations › Scrollbar.
