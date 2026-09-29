/**
 * WCAG 2.2 contrast maths for tests: parse CSS colours, composite
 * translucent layers and compute contrast ratios. Not part of the package.
 */

/** An sRGB colour: channels 0–255, alpha 0–1. */
export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

const channel = (value: string) =>
  value.endsWith('%') ? (Number.parseFloat(value) / 100) * 255 : Number(value)

const alphaOf = (value: string | undefined) =>
  value === undefined
    ? 1
    : value.endsWith('%')
      ? Number.parseFloat(value) / 100
      : Number(value)

/**
 * `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()` / `rgba()` (legacy commas or the
 * space syntax with `/ alpha`) and `color(srgb r g b / a)`, the forms the
 * tokens and `getComputedStyle` use.
 */
export const parseColor = (css: string): Rgba => {
  const value = css.trim().toLowerCase()
  const hex = value.match(/^#([\da-f]{3,8})$/)
  if (hex) {
    const digits =
      hex[1].length <= 4 ? [...hex[1]].map((d) => d + d).join('') : hex[1]
    const [r, g, b, a = 255] = (digits.match(/../g) ?? []).map((d) =>
      Number.parseInt(d, 16),
    )
    return { r, g, b, a: a / 255 }
  }
  const rgb = value.match(/^rgba?\((.+)\)$/)
  if (rgb) {
    const [colour, alpha] = rgb[1].split('/').map((part) => part.trim())
    const parts = colour.split(/[\s,]+/).filter(Boolean)
    const [r, g, b] = parts.slice(0, 3).map(channel)
    return { r, g, b, a: alphaOf(alpha ?? parts[3]) }
  }
  const srgb = value.match(/^color\(srgb (.+)\)$/)
  if (srgb) {
    const [colour, alpha] = srgb[1].split('/').map((part) => part.trim())
    const [r, g, b] = colour
      .split(/\s+/)
      .map((c) => Math.round(alphaOf(c) * 255 * 1000) / 1000)
    return { r, g, b, a: alphaOf(alpha) }
  }
  throw new Error(`Unsupported colour: ${css}`)
}

/**
 * `layers` painted in order (the first one at the bottom, opaque): the colour
 * the eye sees.
 */
export const composite = (...layers: (Rgba | string)[]): Rgba => {
  const [first, ...rest] = layers.map((layer) =>
    typeof layer === 'string' ? parseColor(layer) : layer,
  )
  if (first.a !== 1) {
    throw new Error('composite(): the bottom layer must be opaque')
  }
  return rest.reduce(
    (below, { r, g, b, a }) => ({
      r: r * a + below.r * (1 - a),
      g: g * a + below.g * (1 - a),
      b: b * a + below.b * (1 - a),
      a: 1,
    }),
    first,
  )
}

const linear = (value: number) => {
  const c = value / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance of an opaque colour. */
export const luminance = ({ r, g, b }: Rgba): number =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)

/** WCAG contrast ratio of two opaque colours (1–21). */
export const contrast = (a: Rgba | string, b: Rgba | string): number => {
  const [x, y] = [a, b]
    .map((c) => (typeof c === 'string' ? composite(c) : c))
    .map(luminance)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

/** A ratio rounded down to two decimals, as WCAG checkers report it. */
export const floor2 = (ratio: number): number => Math.floor(ratio * 100) / 100
