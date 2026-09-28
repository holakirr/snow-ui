/**
 * SnowUI design tokens, for the Storybook "Foundations" pages.
 *
 * The token data comes from `tokens.generated.ts`, which `bun run tokens`
 * generates from the DTCG tokens in `packages/ui/tokens/` (the source of
 * truth, like `src/styles/tokens.generated.css`). This file groups the colours
 * for the docs and lists the Figma values that aren't tokens (spacing, sizes,
 * glass). `tokens.test.ts` checks both against the compiled CSS.
 */

import { type ColorToken, colorTokens } from './tokens.generated'

export * from './tokens.generated'

export interface ColorGroup {
  title: string
  description: string
  tokens: ColorToken[]
}

const group = (
  title: string,
  description: string,
  names: string[],
): ColorGroup => ({
  title,
  description,
  tokens: names.map((name) => {
    const token = colorTokens.find((candidate) => candidate.name === name)
    if (!token) throw new Error(`Unknown colour token: ${name}`)
    return token
  }),
})

export const colorGroups: ColorGroup[] = [
  group(
    'Primary',
    'Figma "Primary" is an alias: Black/100% in light mode, Secondary/Indigo in dark mode. Figma draws hover states as a White/20% or White/40% overlay on Primary; the two hover tokens are those overlays, precomputed.',
    ['primary', 'primary-hover', 'primary-hover-strong'],
  ),
  group(
    'Black',
    'Foreground, strokes and fills. Flips to white in dark mode; Black/10% and Black/4% also get a stronger alpha there (15% and 10%). Tailwind modifiers such as black/10 keep working but use the same alpha in both modes.',
    ['black', 'black-80', 'black-40', 'black-20', 'black-10', 'black-4'],
  ),
  group('White', 'Flips to black in dark mode, with the same alpha steps.', [
    'white',
    'white-80',
    'white-40',
    'white-20',
    'white-10',
    'white-4',
  ]),
  group(
    'Background and surface',
    'Page backgrounds (Background/1 is the page, Background/2 the dashboard blocks, Background/3 the translucent popups) and surfaces (Surface/1 is the card and input fill).',
    [
      'background-1',
      'background-2',
      'background-3',
      'surface-1',
      'surface-2',
      'surface-3',
    ],
  ),
  group(
    'Tints and static colours',
    'Color 1 / Color 2 are light tints that stay the same in dark mode. Static White / Static Black never flip: use them for text on coloured fills.',
    ['color-1', 'color-2', 'static-white', 'static-black'],
  ),
  group('Secondary', 'Accent colours; the same in both modes.', [
    'purple',
    'indigo',
    'blue',
    'cyan',
    'mint',
    'green',
    'yellow',
    'orange',
    'red',
  ]),
  group(
    'Accessibility',
    'Library additions, not in the Figma kit, for text that must meet WCAG contrast. Secondary/Indigo text is 2.07:1 on white, so indigo text uses a darker indigo in light mode.',
    ['indigo-text'],
  ),
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
