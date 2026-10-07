# Design resource provenance

The portraits in `avatars/` and vectors in `logos/` were exported on
7 October 2026 from the project's licensed SnowUI Figma copy:
https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/

- Portrait source: `Avatars` (node `30485:156827`), with names matched to
  the resource page's `AvatarNames` examples.
- Logo source: `Logos` (node `30675:732`). Each SVG contains only the named
  logo and its referenced paint definitions, using the original 48px frame.
- Portrait files are the unchanged image bytes embedded in the exported SVG;
  their square framing is preserved and the Avatar component applies the
  circular clip.

These assets belong to the demo, rather than the published component packages.
The original resources describe the portraits as Figma Community / Unsplash
assets and the logos as Figma Community assets and artwork by the kit author.
Third-party artwork and brand marks retain their respective ownership; the
repository's code license does not relicense them.

The five `activity-*.png` images are the original Overview activity artwork from
frame `32546:96098` (AvatarAbstract03, AvatarFemale03, AvatarMale02, Avatar3d03,
AvatarAbstract04). The curve geometry in `source-overview-chart.tsx` is exported
from that frame's ChartMotion `33534:50049`; axis labels remain live text.

The Overview ring paths in `source-donut-artwork.tsx` and the original
`snow-wordmark.svg` are also extracted from frame `32546:96098`. The wordmark
retains its 51×9 vector frame and is scaled for the authentication header.
