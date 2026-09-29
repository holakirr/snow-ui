import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { colorOf } from '../test/colors'
import { parseColor } from '../test/contrast'
import { type Level, type Mode, tokenColor } from '../test/contrast-pairs'
import {
  ColorsPage,
  ContrastPage,
  EffectsPage,
  MotionPage,
  RadiusPage,
  SpacingPage,
  TypographyPage,
} from './docs'
import { animations } from './tokens'

const meta = {
  title: 'Foundations',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=15098-130290',
    },
    layout: 'fullscreen',
    // Reference pages, not components: no dashed component frame, no docs tab.
    storyWrapper: false,
  },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = { render: () => <ColorsPage /> }

export const Typography: Story = { render: () => <TypographyPage /> }

export const Radius: Story = { render: () => <RadiusPage /> }

export const Spacing: Story = { render: () => <SpacingPage /> }

export const Effects: Story = { render: () => <EffectsPage /> }

/**
 * The animation tokens and components with the OS motion setting: the
 * `storybook-prefs` test project emulates `prefers-reduced-motion: reduce`
 * (the other projects don't), so the reduced values are checked there.
 */
export const Motion: Story = {
  render: () => <MotionPage />,
  play: async ({ canvasElement }) => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const sample = (name: string) => {
      const element = canvasElement.querySelector(`[data-motion="${name}"]`)
      if (!element) throw new Error(`No [data-motion="${name}"]`)
      return getComputedStyle(element)
    }
    const transform = 'transform, translate, scale, rotate'

    // The Spinner and Progress tokens keep animating: those components
    // replace their utilities with `motion-reduce:` (checked in their stories).
    for (const { utility, keyframes, reduced: to, via } of animations) {
      await expect(sample(utility).animationName, utility).toBe(
        reduced && via === 'theme' ? to : keyframes,
      )
    }
    await expect(sample('skeleton').animationName).toBe(
      reduced ? 'none' : 'pulse',
    )
    const thumb = canvasElement.querySelector('[data-motion="switch"] > span')
    const chevron = canvasElement.querySelector('[data-motion="accordion"] svg')
    for (const element of [thumb, chevron]) {
      await expect(
        element && getComputedStyle(element).transitionProperty,
      ).toBe(reduced ? 'none' : transform)
    }
  },
}

/**
 * The contrast scopes on real controls: each section pins its contrast and
 * each panel its theme (inside the toolbar's, or the emulated OS preference
 * of the `storybook-prefs` project), so all four combinations are checked in
 * every test project.
 */
export const Contrast: Story = {
  render: () => <ContrastPage />,
  play: async ({ canvasElement }) => {
    const same = (actual: string, expected: string) =>
      expect(parseColor(actual)).toEqual(parseColor(expected))

    for (const level of ['standard', 'more'] as Level[]) {
      for (const mode of ['light', 'dark'] as Mode[]) {
        const panel = canvasElement.querySelector<HTMLElement>(
          `[data-contrast="${level}"] [data-contrast-sample="${mode}"]`,
        )
        if (!panel) throw new Error(`No ${level} ${mode} panel`)
        const canvas = within(panel)
        // The tokens resolve to their value for this theme and contrast…
        const border = colorOf('text-control-border', panel)
        const placeholder = colorOf('text-placeholder', panel)
        await same(border, tokenColor('control-border', mode, level))
        await same(placeholder, tokenColor('placeholder', mode, level))
        await same(
          colorOf('text-control-border-strong', panel),
          tokenColor('control-border-strong', mode, level),
        )

        // …and the controls use them.
        const stroke = level === 'more' ? `${border} 0px 0px 0px 1px inset` : ''
        await expect(
          getComputedStyle(canvas.getByRole('checkbox')).boxShadow,
        ).toContain(`${border} 0px 0px 0px 2px inset`)
        const input = canvas.getByRole('textbox', { name: /Input/ })
        await same(getComputedStyle(input, '::placeholder').color, placeholder)
        const field = input.closest<HTMLElement>('[data-slot="input"]')
        await expect(field && getComputedStyle(field).boxShadow).toContain(
          stroke || `${border} 0px 0px 0px 0.5px inset`,
        )
        const search = canvas.getByRole('searchbox')
        await same(getComputedStyle(search, '::placeholder').color, placeholder)
        // The gray Search field only gets a ring with more contrast.
        const searchField = search.parentElement as HTMLElement
        if (stroke) {
          await expect(getComputedStyle(searchField).boxShadow).toContain(
            stroke,
          )
        } else {
          await expect(getComputedStyle(searchField).boxShadow).not.toContain(
            border,
          )
        }
        const off = canvas.getByRole('switch', { name: /off/ })
        await same(getComputedStyle(off).backgroundColor, border)
        // The thumb: Figma's static white, the per-mode white with more.
        await same(
          getComputedStyle(
            canvas.getByRole('switch', { name: /on,/ })
              .firstElementChild as Element,
          ).backgroundColor,
          colorOf(level === 'more' ? 'text-white' : 'text-static-white', panel),
        )
      }
    }

    // The `light` / `dark` classes (next-themes, shadcn/ui) are theme scopes
    // too, and combine with the contrast scopes the same way.
    const inScope = (
      selector: string,
      className: 'light' | 'dark',
      level: Level,
    ) => {
      const scope = canvasElement.ownerDocument.createElement('div')
      scope.className = className
      canvasElement.querySelector(selector)?.appendChild(scope)
      const color = colorOf('text-control-border', scope)
      scope.remove()
      return same(color, tokenColor('control-border', className, level))
    }
    await inScope('[data-contrast="more"]', 'dark', 'more')
    await inScope(
      '[data-contrast="more"] [data-contrast-sample="dark"]',
      'light',
      'more',
    )
    await inScope('[data-contrast="standard"]', 'dark', 'standard')
  },
}
