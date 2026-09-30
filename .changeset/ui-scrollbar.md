---
"@holakirr/snow-ui": minor
---

New `scrollbar-snow` utility (in `theme.css`, and in `index.css`): the Figma "Scrollbar" on your scroll containers, with no track: a 4px rounded thumb in `black-10` (the Figma Black/10%) that widens to 8px in `control-border` (the Figma Black/20%) under the pointer and while it is dragged. With more contrast the resting thumb is `control-border` too (3:1 or more). Both colours follow the theme. The thumb stays visible, where the kit shows it only while the pointer is over the scroll area, so keyboard and touch users can find it. Chrome, Edge and Safari draw the kit's thumb in an 8px gutter; Firefox, which can't style a hovered thumb, draws its thin scrollbar at its own width and turns it `control-border` while the pointer is over the container. Nothing animates, and forced-colors mode keeps the system scrollbar. See Foundations › Scrollbar.
