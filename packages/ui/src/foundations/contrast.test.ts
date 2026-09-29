import { describe, expect, it } from 'vitest'
import { floor2 } from '../test/contrast'
import {
  AA,
  contrastPairs,
  type Level,
  type Mode,
  pairRatio,
  surfaces,
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
