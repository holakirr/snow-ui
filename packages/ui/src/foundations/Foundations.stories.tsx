import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import {
  ColorsPage,
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

    for (const { utility, keyframes, reduced: to } of animations) {
      await expect(sample(utility).animationName, utility).toBe(
        reduced ? to : keyframes,
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
