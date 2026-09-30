---
"@holakirr/snow-ui": patch
---

`Avatar` has the Figma kit's hover, by kind, and only in a link or a button (`<a href>`, an enabled `<button>`, `role="button"`): a photo gets a `color-1` underlay (seen through a cut-out picture), an icon fallback (an `<svg>` in `AvatarFallback`) a Black/20% fill (a static gray, like the fallback's `color-2`), and initials turn semibold. It replaces the 105% brightness every avatar had on hover, also where it wasn't interactive. The avatar at rest doesn't change, except that without the filter its initials are anti-aliased like the text around them. Colours fade (`transition-colors` instead of `transition-all`); in forced-colors mode the fills give way to the system colours and the semibold initials stay.
