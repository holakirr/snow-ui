/**
 * The colour pairs of the form controls whose contrast depends on the
 * contrast tokens (`control-border`, `control-border-strong`, `placeholder`,
 * `control-border-invalid`),
 * computed from the generated tokens for both themes and both contrast levels.
 * `foundations/contrast.test.ts` asserts them. Not part of the package.
 */

import { colorTokens } from '../foundations/tokens'
import { composite, contrast, parseColor } from './contrast'

export type Mode = 'light' | 'dark'
export type Level = 'standard' | 'more'

/** WCAG 2.2 AA: 1.4.11 for boundaries and states, 1.4.3 for text. */
export const AA = { nonText: 3, text: 4.5 } as const

/**
 * A token's resolved colour in a theme, at a contrast level. `name/60` is
 * the token at 60% of its opacity, like Tailwind's `text-white/60`.
 */
export const tokenColor = (name: string, mode: Mode, level: Level): string => {
  const [base, opacity] = name.split('/')
  const token = colorTokens.find((candidate) => candidate.name === base)
  if (!token) throw new Error(`Unknown colour token: ${base}`)
  const value =
    level === 'more' && token.contrastMore
      ? token.contrastMore[mode]
      : (token.resolved?.[mode] ?? token[mode])
  if (opacity === undefined) return value
  const { r, g, b, a } = parseColor(value)
  return `rgb(${r} ${g} ${b} / ${(a * Number(opacity)) / 100})`
}

/**
 * Where the controls sit: the page (`background-1`), a dashboard block
 * (`background-2` on it) and a popover or dialog (`background-3` on it).
 */
export const surfaces = {
  'background-1': ['background-1'],
  'background-2': ['background-1', 'background-2'],
  popover: ['background-1', 'background-3'],
} as const satisfies Record<string, string[]>

export interface ContrastPair {
  /** What the pair is, for the report. */
  control: string
  /** WCAG threshold with more contrast. */
  kind: keyof typeof AA
  /**
   * The two colours next to each other, as layers painted over the surface
   * (token names). The mode is for a colour that differs in dark mode only
   * (a `dark:` utility).
   */
  foreground: (level: Level, mode: Mode) => string[]
  background: (level: Level, mode: Mode) => string[]
}

/**
 * A destructive menu item's text and icon: `red-text`, mixed with 40% of
 * the per-mode `black` (white) in dark mode, where `red-text` is 4.36:1 on
 * the popover and 3.22:1 on its White/10% highlight.
 */
const destructiveMenuText = (mode: Mode) =>
  mode === 'dark' ? ['red-text', 'black/40'] : ['red-text']

/** The Switch thumb: Figma's static white, the per-mode `white` with more contrast. */
const thumb = (level: Level) => [level === 'more' ? 'white' : 'static-white']

export const contrastPairs: ContrastPair[] = [
  {
    control: 'Checkbox / Radio ring (unchecked) vs the surface',
    kind: 'nonText',
    foreground: () => ['background-3', 'control-border'],
    background: () => [],
  },
  {
    control: 'Text field / Select stroke vs the surface',
    kind: 'nonText',
    foreground: () => ['surface-1', 'control-border'],
    background: () => [],
  },
  {
    control: 'Text field / Select stroke vs the field fill',
    kind: 'nonText',
    foreground: () => ['surface-1', 'control-border'],
    background: () => ['surface-1'],
  },
  {
    control: 'Gray field (InputSmall, Search) ring vs its Black/4% fill',
    kind: 'nonText',
    foreground: () => ['black-4', 'control-border'],
    background: () => ['black-4'],
  },
  {
    control: 'Hover / focus stroke vs the field fill',
    kind: 'nonText',
    foreground: () => ['surface-1', 'control-border-strong'],
    background: () => ['surface-1'],
  },
  {
    // With more contrast the focus stroke is 2px: its inner pixel was the
    // fill (the unfocused stroke is 1px), so it is the change of state.
    control: 'Gray field focus stroke vs its unfocused Black/4% fill',
    kind: 'nonText',
    foreground: () => ['surface-1', 'control-border-strong'],
    background: () => ['black-4'],
  },
  {
    control: 'Switch off track vs the surface',
    kind: 'nonText',
    foreground: () => ['control-border'],
    background: () => [],
  },
  {
    control: 'Switch thumb vs the off track',
    kind: 'nonText',
    foreground: thumb,
    background: () => ['control-border'],
  },
  {
    control: 'Switch thumb vs the on track (primary)',
    kind: 'nonText',
    foreground: thumb,
    background: () => ['primary'],
  },
  {
    control: 'Menu switch item: off track on the highlighted item',
    kind: 'nonText',
    foreground: () => ['black-4', 'control-border'],
    background: () => ['black-4'],
  },
  {
    control: 'Menu switch item: on track on the highlighted item',
    kind: 'nonText',
    foreground: () => ['black-4', 'primary'],
    background: () => ['black-4'],
  },
  {
    control: 'Slider bar (Black/4%) vs the surface',
    kind: 'nonText',
    // With more contrast, a `control-border` stroke inside the bar.
    foreground: (level) =>
      level === 'more' ? ['black-4', 'control-border'] : ['black-4'],
    background: () => [],
  },
  {
    control: 'Slider range track vs the surface',
    kind: 'nonText',
    foreground: (level) => [level === 'more' ? 'control-border' : 'black-4'],
    background: () => [],
  },
  {
    control: 'Slider range thumb vs the surface',
    kind: 'nonText',
    // With more contrast, a `control-border-strong` border.
    foreground: (level) =>
      level === 'more'
        ? ['static-white', 'control-border-strong']
        : ['static-white'],
    background: () => [],
  },
  {
    control: 'Slider value on the track',
    kind: 'text',
    foreground: () => ['black-4', 'text-secondary'],
    background: () => ['black-4'],
  },
  {
    control: 'Slider label and handle on the fill',
    kind: 'text',
    // The per-mode `white` on the Primary fill: white on black, black on
    // the dark-mode indigo (the Figma Static White is 2.07:1 there).
    foreground: () => ['primary', 'white'],
    background: () => ['primary'],
  },
  {
    control: 'Slider value on the fill',
    kind: 'text',
    // The per-mode `white` at 70% on the Primary fill: white on black,
    // black on the dark-mode indigo.
    foreground: () => ['primary', 'white/70'],
    background: () => ['primary'],
  },
  {
    control: 'Invalid stroke vs the surface',
    kind: 'nonText',
    foreground: () => ['surface-1', 'control-border-invalid'],
    background: () => [],
  },
  {
    control: 'Invalid stroke vs the field fill',
    kind: 'nonText',
    foreground: () => ['surface-1', 'control-border-invalid'],
    background: () => ['surface-1'],
  },
  {
    control: 'Invalid stroke on the gray field (InputSmall, Search)',
    kind: 'nonText',
    foreground: () => ['black-4', 'control-border-invalid'],
    background: () => ['black-4'],
  },
  {
    // Figma Black/40% (Select) and Black/20% (submenu): `text-secondary`.
    control: 'Select / Combobox chevron on the field fill',
    kind: 'nonText',
    foreground: () => ['surface-1', 'text-secondary'],
    background: () => ['surface-1'],
  },
  {
    control: 'Submenu chevron on the menu',
    kind: 'nonText',
    foreground: () => ['text-secondary'],
    background: () => [],
  },
  {
    control: 'Submenu chevron on the highlighted item',
    kind: 'nonText',
    foreground: () => ['black-4', 'text-secondary'],
    background: () => ['black-4'],
  },
  {
    control: 'Destructive menu item on the menu',
    kind: 'text',
    foreground: (_, mode) => destructiveMenuText(mode),
    background: () => [],
  },
  {
    control: 'Destructive menu item on the highlighted item',
    kind: 'text',
    foreground: (_, mode) => ['black-4', ...destructiveMenuText(mode)],
    background: () => ['black-4'],
  },
  {
    control: 'Placeholder on the field fill (Input, Textarea, outline fields)',
    kind: 'text',
    foreground: () => ['surface-1', 'placeholder'],
    background: () => ['surface-1'],
  },
  {
    control: 'Placeholder on the gray field (InputSmall, Search)',
    kind: 'text',
    foreground: () => ['black-4', 'placeholder'],
    background: () => ['black-4'],
  },
  {
    control: 'Placeholder on the hovered gray field',
    kind: 'text',
    foreground: () => ['black-10', 'placeholder'],
    background: () => ['black-10'],
  },
]

/** The pair's contrast on a surface: each side painted over it. */
export const pairRatio = (
  pair: ContrastPair,
  surface: readonly string[],
  mode: Mode,
  level: Level,
): number => {
  const paint = (layers: string[]) =>
    composite(
      ...[...surface, ...layers].map((name) => tokenColor(name, mode, level)),
    )
  return contrast(
    paint(pair.foreground(level, mode)),
    paint(pair.background(level, mode)),
  )
}
