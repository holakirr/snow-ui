/**
 * SnowUI design tokens, as implemented in `src/index.css`.
 *
 * This list renders the Storybook "Foundations" pages and is checked against
 * `index.css` by `tokens.test.ts`, so the docs can't drift from the CSS.
 * Utility class names are written out in full so Tailwind picks them up.
 */

export interface ColorToken {
  /** Tailwind colour name: `bg-<name>`, `text-<name>`, `border-<name>`… */
  name: string
  /** Figma variable or style name. */
  figma: string
  /** Value in the SnowUI-Light mode. */
  light: string
  /** Value in the SnowUI-Dark mode. */
  dark: string
  /** Swatch class; written out so Tailwind generates it. */
  swatch: string
  /** Computed light/dark colours, for tokens whose value is a formula. */
  resolved?: { light: string; dark: string }
  note?: string
}

export interface ColorGroup {
  title: string
  description: string
  tokens: ColorToken[]
}

const same = (value: string) => ({ light: value, dark: value })

export const colorGroups: ColorGroup[] = [
  {
    title: 'Primary',
    description:
      'Figma "Primary" is an alias: Black/100% in light mode, Secondary/Indigo in dark mode. Figma draws hover states as a White/20% or White/40% overlay on Primary; the two hover tokens are those overlays, precomputed.',
    tokens: [
      {
        name: 'primary',
        figma: 'Primary',
        light: '#000',
        dark: '#adadfb',
        swatch: 'bg-primary',
      },
      {
        name: 'primary-hover',
        figma: 'Primary + White/20%',
        light:
          'color-mix(in srgb, var(--color-primary), var(--color-white) 20%)',
        dark: 'color-mix(in srgb, var(--color-primary), var(--color-white) 20%)',
        swatch: 'bg-primary-hover',
        resolved: { light: '#333', dark: '#8a8ac9' },
        note: 'Filled Button hover',
      },
      {
        name: 'primary-hover-strong',
        figma: 'Primary + White/40%',
        light:
          'color-mix(in srgb, var(--color-primary), var(--color-white) 40%)',
        dark: 'color-mix(in srgb, var(--color-primary), var(--color-white) 40%)',
        swatch: 'bg-primary-hover-strong',
        resolved: { light: '#666', dark: '#686897' },
        note: 'Checked Checkbox / Radio / Switch hover',
      },
    ],
  },
  {
    title: 'Black',
    description:
      'Foreground, strokes and fills. Flips to white in dark mode; Black/10% and Black/4% also get a stronger alpha there (15% and 10%). Tailwind modifiers such as black/10 keep working but use the same alpha in both modes.',
    tokens: [
      {
        name: 'black',
        figma: 'Black/100%',
        light: '#000',
        dark: '#fff',
        swatch: 'bg-black',
      },
      {
        name: 'black-80',
        figma: 'Black/80%',
        light: 'rgb(0 0 0 / 0.8)',
        dark: 'rgb(255 255 255 / 0.8)',
        swatch: 'bg-black-80',
      },
      {
        name: 'black-40',
        figma: 'Black/40%',
        light: 'rgb(0 0 0 / 0.4)',
        dark: 'rgb(255 255 255 / 0.4)',
        swatch: 'bg-black-40',
      },
      {
        name: 'black-20',
        figma: 'Black/20%',
        light: 'rgb(0 0 0 / 0.2)',
        dark: 'rgb(255 255 255 / 0.2)',
        swatch: 'bg-black-20',
      },
      {
        name: 'black-10',
        figma: 'Black/10%',
        light: 'rgb(0 0 0 / 0.1)',
        dark: 'rgb(255 255 255 / 0.15)',
        swatch: 'bg-black-10',
        note: 'Default border colour',
      },
      {
        name: 'black-4',
        figma: 'Black/4%',
        light: 'rgb(0 0 0 / 0.04)',
        dark: 'rgb(255 255 255 / 0.1)',
        swatch: 'bg-black-4',
      },
    ],
  },
  {
    title: 'White',
    description: 'Flips to black in dark mode, with the same alpha steps.',
    tokens: [
      {
        name: 'white',
        figma: 'White/100%',
        light: '#fff',
        dark: '#000',
        swatch: 'bg-white',
      },
      {
        name: 'white-80',
        figma: 'White/80%',
        light: 'rgb(255 255 255 / 0.8)',
        dark: 'rgb(0 0 0 / 0.8)',
        swatch: 'bg-white-80',
      },
      {
        name: 'white-40',
        figma: 'White/40%',
        light: 'rgb(255 255 255 / 0.4)',
        dark: 'rgb(0 0 0 / 0.4)',
        swatch: 'bg-white-40',
      },
      {
        name: 'white-20',
        figma: 'White/20%',
        light: 'rgb(255 255 255 / 0.2)',
        dark: 'rgb(0 0 0 / 0.2)',
        swatch: 'bg-white-20',
      },
      {
        name: 'white-10',
        figma: 'White/10%',
        light: 'rgb(255 255 255 / 0.1)',
        dark: 'rgb(0 0 0 / 0.1)',
        swatch: 'bg-white-10',
      },
      {
        name: 'white-4',
        figma: 'White/4%',
        light: 'rgb(255 255 255 / 0.04)',
        dark: 'rgb(0 0 0 / 0.04)',
        swatch: 'bg-white-4',
      },
    ],
  },
  {
    title: 'Background and surface',
    description:
      'Page backgrounds (Background/1 is the page, Background/2 the dashboard blocks, Background/3 the translucent popups) and surfaces (Surface/1 is the card and input fill).',
    tokens: [
      {
        name: 'background-1',
        figma: 'Background/1',
        light: '#fff',
        dark: '#333',
        swatch: 'bg-background-1',
      },
      {
        name: 'background-2',
        figma: 'Background/2',
        light: '#f9f9fa',
        dark: 'rgb(255 255 255 / 0.04)',
        swatch: 'bg-background-2',
      },
      {
        name: 'background-3',
        figma: 'Background/3',
        light: 'rgb(255 255 255 / 0.9)',
        dark: 'rgb(64 64 64 / 0.9)',
        swatch: 'bg-background-3',
      },
      {
        name: 'surface-1',
        figma: 'Surface/1',
        light: 'rgb(255 255 255 / 0.8)',
        dark: 'rgb(255 255 255 / 0.04)',
        swatch: 'bg-surface-1',
      },
      {
        name: 'surface-2',
        figma: 'Surface/2',
        light: 'rgb(0 0 0 / 0.03)',
        dark: 'rgb(0 0 0 / 0.1)',
        swatch: 'bg-surface-2',
      },
      {
        name: 'surface-3',
        figma: 'Surface/3',
        light: 'rgb(0 0 0 / 0.02)',
        dark: 'rgb(255 255 255 / 0.04)',
        swatch: 'bg-surface-3',
      },
    ],
  },
  {
    title: 'Tints and static colours',
    description:
      'Color 1 / Color 2 are light tints that stay the same in dark mode. Static White / Static Black never flip: use them for text on coloured fills.',
    tokens: [
      {
        name: 'color-1',
        figma: 'Color 1',
        ...same('#e6f1fd'),
        swatch: 'bg-color-1',
      },
      {
        name: 'color-2',
        figma: 'Color 2',
        ...same('#edeefc'),
        swatch: 'bg-color-2',
      },
      {
        name: 'static-white',
        figma: 'Static White/100%',
        ...same('#fff'),
        swatch: 'bg-static-white',
      },
      {
        name: 'static-black',
        figma: 'Static Black/100%',
        ...same('#000'),
        swatch: 'bg-static-black',
      },
    ],
  },
  {
    title: 'Secondary',
    description: 'Accent colours; the same in both modes.',
    tokens: [
      {
        name: 'purple',
        figma: 'Secondary/Purple',
        ...same('#b899eb'),
        swatch: 'bg-purple',
      },
      {
        name: 'indigo',
        figma: 'Secondary/Indigo',
        ...same('#adadfb'),
        swatch: 'bg-indigo',
      },
      {
        name: 'blue',
        figma: 'Secondary/Blue',
        ...same('#7dbbff'),
        swatch: 'bg-blue',
      },
      {
        name: 'cyan',
        figma: 'Secondary/Cyan',
        ...same('#a0bce8'),
        swatch: 'bg-cyan',
      },
      {
        name: 'mint',
        figma: 'Secondary/Mint',
        ...same('#6be6d3'),
        swatch: 'bg-mint',
      },
      {
        name: 'green',
        figma: 'Secondary/Green',
        ...same('#71dd8c'),
        swatch: 'bg-green',
      },
      {
        name: 'yellow',
        figma: 'Secondary/Yellow',
        ...same('#fc0'),
        swatch: 'bg-yellow',
      },
      {
        name: 'orange',
        figma: 'Secondary/Orange',
        ...same('#ffb55b'),
        swatch: 'bg-orange',
      },
      {
        name: 'red',
        figma: 'Secondary/Red',
        ...same('#ff4747'),
        swatch: 'bg-red',
      },
    ],
  },
]

export const colorTokens: ColorToken[] = colorGroups.flatMap(
  (group) => group.tokens,
)

/** Old colour names, kept as aliases until the next major. */
export const deprecatedColors: { name: string; use: string }[] = [
  { name: 'brand', use: 'primary' },
  { name: 'brand-hover', use: 'primary-hover-strong' },
  { name: 'bg1', use: 'background-1' },
  { name: 'bg2', use: 'background-2' },
  { name: 'bg3', use: 'color-1' },
  { name: 'bg4', use: 'color-2' },
  { name: 'bg5', use: 'surface-1' },
  { name: 'background', use: 'background-1' },
  { name: 'foreground', use: 'black' },
  { name: 'muted', use: 'black-4' },
  { name: 'muted-foreground', use: 'black-40' },
  { name: 'accent', use: 'black-10' },
  { name: 'accent-foreground', use: 'black' },
  { name: 'destructive', use: 'red' },
  { name: 'input', use: 'black-10' },
  { name: 'ring', use: 'primary' },
  { name: 'sidebar-border', use: 'black-10' },
  { name: 'white-border', use: 'black-10' },
]

export interface TextStyle {
  /** `size` prop of `Typography`. */
  size: 12 | 14 | 16 | 18 | 24 | 32 | 48 | 64
  /** Line height in px. */
  lineHeight: number
  /** Tailwind utility (sets font size and line height). */
  utility: string
}

/** Figma text styles: each size comes in Regular (400) and Semibold (600). */
export const textStyles: TextStyle[] = [
  { size: 64, lineHeight: 72, utility: 'text-64' },
  { size: 48, lineHeight: 56, utility: 'text-48' },
  { size: 32, lineHeight: 40, utility: 'text-32' },
  { size: 24, lineHeight: 32, utility: 'text-24' },
  { size: 18, lineHeight: 28, utility: 'text-18' },
  { size: 16, lineHeight: 24, utility: 'text-16' },
  { size: 14, lineHeight: 20, utility: 'text-14' },
  { size: 12, lineHeight: 16, utility: 'text-12' },
]

export const fontFeatureSettings = '"ss01" 1, "cv01" 1'

/** Figma "Corner Radius" (Standard mode), in px. */
export const radii: { px: number; utility: string }[] = [
  { px: 4, utility: 'rounded-4' },
  { px: 8, utility: 'rounded-8' },
  { px: 12, utility: 'rounded-12' },
  { px: 16, utility: 'rounded-16' },
  { px: 20, utility: 'rounded-20' },
  { px: 24, utility: 'rounded-24' },
  { px: 28, utility: 'rounded-28' },
  { px: 32, utility: 'rounded-32' },
  { px: 40, utility: 'rounded-40' },
  { px: 48, utility: 'rounded-48' },
  { px: 80, utility: 'rounded-80' },
]

/**
 * Figma "Spacing" (Standard mode), in px. Tailwind's 4px spacing scale
 * already covers every value, so there are no spacing tokens.
 */
export const spacing: { px: number; utility: string }[] = [
  { px: 0, utility: 'p-0 / gap-0' },
  { px: 4, utility: 'p-1 / gap-1' },
  { px: 8, utility: 'p-2 / gap-2' },
  { px: 12, utility: 'p-3 / gap-3' },
  { px: 16, utility: 'p-4 / gap-4' },
  { px: 20, utility: 'p-5 / gap-5' },
  { px: 24, utility: 'p-6 / gap-6' },
  { px: 28, utility: 'p-7 / gap-7' },
  { px: 40, utility: 'p-10 / gap-10' },
  { px: 48, utility: 'p-12 / gap-12' },
]

/** Figma "Size" (Standard mode), in px: Tailwind `size-*` covers it too. */
export const sizes: { px: number; utility: string }[] = [
  { px: 12, utility: 'size-3' },
  { px: 16, utility: 'size-4' },
  { px: 20, utility: 'size-5' },
  { px: 24, utility: 'size-6' },
  { px: 28, utility: 'size-7' },
  { px: 32, utility: 'size-8' },
  { px: 40, utility: 'size-10' },
  { px: 48, utility: 'size-12' },
  { px: 56, utility: 'size-14' },
  { px: 64, utility: 'size-16' },
  { px: 72, utility: 'size-18' },
  { px: 80, utility: 'size-20' },
]

export interface EffectToken {
  /** CSS variable. */
  variable: string
  figma: string
  value: string
  /** Tailwind utility; written out so Tailwind generates it. */
  utility: string
  note?: string
}

/** Figma effect styles. Their colours are raw values: they don't flip in dark mode. */
export const shadows: EffectToken[] = [
  {
    variable: '--shadow-1',
    figma: 'Drop shadow 1',
    value: '0 0.5px 0.5px 0 rgb(0 0 0 / 0.1)',
    utility: 'shadow-1',
  },
  {
    variable: '--shadow-2',
    figma: 'Drop shadow 2',
    value: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
    utility: 'shadow-2',
  },
  {
    variable: '--shadow-focus',
    figma: 'Focus',
    value: '0 0 0 4px rgb(0 0 0 / 0.04)',
    utility: 'shadow-focus',
    note: 'or ring-4 ring-focus, which composes with other shadows',
  },
  {
    variable: '--shadow-glow',
    figma: 'Glow',
    value: '0 0 12px 8px rgb(255 255 255 / 0.2), 0 0 12px 8px rgb(0 0 0 / 0.2)',
    utility: 'shadow-glow',
  },
  {
    variable: '--shadow-glass-1',
    figma: 'Glass 1 (drop shadow part)',
    value: '0 4px 16px 0 rgb(0 0 0 / 0.04)',
    utility: 'shadow-glass-1',
  },
  {
    variable: '--shadow-glass-2',
    figma: 'Glass 2 (drop shadow part)',
    value: '0 8px 28px 0 rgb(0 0 0 / 0.1)',
    utility: 'shadow-glass-2',
  },
  {
    variable: '--inset-shadow-inner',
    figma: 'Inner shadow',
    value:
      'inset 1px 1.5px 4px 0 rgb(0 0 0 / 0.1), inset 1px 1.5px 4px 0 rgb(0 0 0 / 0.08), inset 0 -0.5px 1px 0 rgb(255 255 255 / 0.25), inset 0 -0.5px 1px 0 rgb(255 255 255 / 0.3)',
    utility: 'inset-shadow-inner',
  },
]

export const focusRing: EffectToken = {
  variable: '--ring-color-focus',
  figma: 'Focus',
  value: 'rgb(0 0 0 / 0.04)',
  utility: 'ring-4 ring-focus',
}

/** Figma background blurs: CSS blur is half the Figma value. */
export const blurs: EffectToken[] = [
  {
    variable: '--blur-bg-40',
    figma: 'Background blur 40',
    value: '20px',
    utility: 'backdrop-blur-bg-40',
  },
  {
    variable: '--blur-bg-100',
    figma: 'Background blur 100',
    value: '50px',
    utility: 'backdrop-blur-bg-100',
  },
]

/** Approximations of Figma's Glass effects (utilities in index.css). */
export const glass: { utility: string; figma: string; recipe: string }[] = [
  {
    utility: 'glass-1',
    figma: 'Glass 1',
    recipe: 'bg-white-20 backdrop-blur-[8px] shadow-glass-1',
  },
  {
    utility: 'glass-2',
    figma: 'Glass 2',
    recipe: 'bg-background-3 backdrop-blur-bg-40 shadow-glass-2',
  },
  {
    utility: 'glass',
    figma: 'Glass 2',
    recipe: 'Same as glass-2',
  },
]
