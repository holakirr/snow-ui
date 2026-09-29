import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ColorsPage,
  EffectsPage,
  RadiusPage,
  SpacingPage,
  TypographyPage,
} from './docs'

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
