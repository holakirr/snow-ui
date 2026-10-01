---
"@holakirr/snow-ui": patch
---

The `arrow` variant of `Link` draws its arrow as a 12px Phosphor `ArrowUpRight` icon, like the `external` variant's icon, instead of the "↗" text character, whose shape and width changed with the font. It stays decorative (`aria-hidden`), at 40% opacity, full on hover and with more contrast, and mirrored in right-to-left text. The link's text content no longer ends with "↗".
