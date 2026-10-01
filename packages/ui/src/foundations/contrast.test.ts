import { describe, expect, it } from 'vitest'
import { composite, contrast, floor2 } from '../test/contrast'
import {
  AA,
  contrastPairs,
  type Level,
  type Mode,
  pairRatio,
  surfaces,
  tokenColor,
} from '../test/contrast-pairs'

// WCAG contrast of the form controls, from the generated tokens, in both
// themes and on every surface they sit on. With more contrast
// (`prefers-contrast: more`, `data-contrast="more"`) every pair meets AA; the
// standard contrast keeps the Figma colours, a documented deviation (ui
// README, "Known gaps"; the Contrast guide lists every ratio). Ratios are
// rounded down, as WCAG checkers do.

const modes: Mode[] = ['light', 'dark']

const cases = contrastPairs.flatMap((pair) =>
  modes.flatMap((mode) =>
    Object.entries(surfaces).map(([surface, layers]) => ({
      pair,
      mode,
      surface,
      ratio: (level: Level) => floor2(pairRatio(pair, layers, mode, level)),
    })),
  ),
)

describe('form controls with more contrast', () => {
  it.each(cases)(
    '$pair.control, $mode, on $surface: WCAG AA',
    ({ pair, ratio }) => {
      expect(ratio('more')).toBeGreaterThanOrEqual(AA[pair.kind])
    },
  )
})

describe('the Select and submenu chevrons', () => {
  // `text-secondary`, not a contrast token: 3:1 in both themes and at both
  // contrast levels, with no known gap.
  const chevrons = cases.filter(({ pair }) => pair.control.includes('chevron'))

  it('are there', () => {
    expect(chevrons).toHaveLength(3 * modes.length * 3)
  })

  it.each(chevrons)(
    '$pair.control, $mode, on $surface: 3:1 at both levels',
    ({ ratio }) => {
      expect(ratio('standard')).toBeGreaterThanOrEqual(AA.nonText)
      expect(ratio('more')).toBeGreaterThanOrEqual(AA.nonText)
    },
  )
})

describe('form controls with the standard (Figma) contrast', () => {
  const ratio = (control: string, mode: Mode) => {
    const found = cases.find(
      (c) =>
        c.pair.control.startsWith(control) &&
        c.mode === mode &&
        c.surface === 'background-1',
    )
    if (!found) throw new Error(`No pair ${control}`)
    return found.ratio('standard')
  }

  it('keeps the ratios the README documents as known gaps', () => {
    // The Black/20% rings, strokes and placeholders: 1.6:1 on white.
    expect(ratio('Checkbox', 'light')).toBe(1.6)
    expect(ratio('Text field / Select stroke vs the surface', 'light')).toBe(
      1.6,
    )
    expect(ratio('Placeholder on the field fill', 'light')).toBe(1.6)
    // Figma's white thumb on the dark-mode indigo track: 2.07:1 (2.069).
    expect(ratio('Switch thumb vs the on track', 'dark')).toBe(2.06)
    // The Figma focus stroke of the text fields: 0.5px Black/40% on white
    // (2.85:1, 2.849); with more contrast a 2px Black/80% one.
    expect(ratio('Hover / focus stroke vs the field fill', 'light')).toBe(2.84)
  })

  it('is under AA where more contrast is needed, and AA with it', () => {
    const failing = cases.filter(
      ({ pair, ratio }) => ratio('standard') < AA[pair.kind],
    )
    expect(failing.length).toBeGreaterThan(0)
    for (const { pair, ratio } of failing) {
      expect(ratio('more')).toBeGreaterThanOrEqual(AA[pair.kind])
    }
  })
})

describe('today in dark mode (Calendar, date picker views)', () => {
  // No fill, so it differs from an indigo selected day: indigo text on the
  // panel, and the `black` (white) text over a `black-4` hover.
  const paint = (layers: string[], level: Level) =>
    composite(
      ...['background-1', 'background-3', ...layers].map((name) =>
        tokenColor(name, 'dark', level),
      ),
    )

  it.each<Level>(['standard', 'more'])(
    'is AA text at the %s level',
    (level) => {
      const panel = paint([], level)
      expect(
        floor2(contrast(paint(['indigo'], level), panel)),
      ).toBeGreaterThanOrEqual(AA.text)
      const hovered = paint(['black-4'], level)
      expect(
        floor2(contrast(paint(['black-4', 'black'], level), hovered)),
      ).toBeGreaterThanOrEqual(AA.text)
    },
  )
})
