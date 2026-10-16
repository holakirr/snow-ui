---
"@holakirr/snow-ui": patch
---

Smooth component entrance and exit motion without changing resting layout:

- Fix Accordion's 20px padding jump with a padded inner wrapper and remove its competing height transition. Content className customizes the inner wrapper.
- Give Dialog and AlertDialog real fade/95% scale entrance and exit animations so Radix retains the panel until exit finishes. Fade the full-screen mask without scaling it or animating its blur.
- Limit popup slides to 6px, include fading in slide/zoom keyframes, and gate directional entry rules to the open state so they do not compete with exit rules.
- Preserve full-distance Sheet travel while removing its competing transition. Use individual translate/scale animation properties to preserve positioned transforms, including Toast stacks.
- Retain reduced-motion fades and add browser regressions for animation geometry and presence.
