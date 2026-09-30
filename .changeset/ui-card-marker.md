---
"@holakirr/snow-ui": minor
---

`Card` takes `marker`: the Figma selection mark (the kit's RadioAlt) on the top end corner, as the kit's Hover and Selected cards show it. It is checked when the card is `selected`; when it isn't, it shows empty only while the card is hovered or has the keyboard focus inside, and stays hidden at rest. The card keeps its content clear of the mark. The mark is decorative: say what is selected with `aria-checked` (or a control inside); its empty ring uses the `control-border` tokens, so it meets 3:1 with more contrast.
