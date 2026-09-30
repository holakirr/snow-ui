/**
 * A stand-in for a user photo in the stories: a silhouette on a colour of
 * the palette, as an SVG data URI, so the stories and their docs pages load
 * no remote image (a docs page must not depend on the network; see
 * CONTRIBUTING.md#docs-pages-in-the-browser).
 */
export const photo = (background: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="${background}"/><circle cx="32" cy="26" r="12" fill="#fff" fill-opacity=".85"/><rect x="12" y="42" width="40" height="30" rx="15" fill="#fff" fill-opacity=".85"/></svg>`,
  )}`

/** Four people: the palette's purple, blue, mint and orange. */
export const photos = [
  photo('#b899eb'),
  photo('#7dbbff'),
  photo('#6be6d3'),
  photo('#ffb55b'),
] as const

/**
 * A cut-out picture, as the kit's avatars are: a dark silhouette on a
 * transparent background, so what is behind the avatar shows around it.
 */
export const cutout = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="26" r="12" fill="#1c1c1c"/><rect x="12" y="42" width="40" height="30" rx="15" fill="#1c1c1c"/></svg>',
)}`
