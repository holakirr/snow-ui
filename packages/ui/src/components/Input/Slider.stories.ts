import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { colorOf } from '../../test/colors'

import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Components/Input/Slider',
  component: Slider,
  tags: ['autodocs', 'a11y'],
  args: {
    className: 'w-60',
    // Goes to the thumb (`role="slider"`); a range gets "…, minimum/maximum".
    'aria-label': 'Volume',
  },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33509-205091',
    },
    docs: {
      description: {
        component: 'Slider component',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: {
    defaultValue: [50],
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    disabled: true,
  },
}

export const WithTwoValues: Story = {
  args: {
    defaultValue: [25, 75],
  },
}

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (no Figma state). It goes to the thumbs (the elements with
 * `role="slider"`), with `aria-describedby`; the track gets a 1px
 * Secondary/Red stroke and the thumbs a red border. Pair it with the error
 * text: see Form.
 */
export const Invalid: Story = {
  args: {
    defaultValue: [20, 80],
    'aria-invalid': true,
  },
  play: async ({ canvas, canvasElement }) => {
    const red = colorOf('text-red', canvasElement)
    const thumbs = canvas.getAllByRole('slider')

    for (const thumb of thumbs) {
      await expect(thumb).toBeInvalid()
      await expect(getComputedStyle(thumb).borderColor).toBe(red)
    }
    const track = canvasElement.querySelector(
      '[data-orientation] > span',
    ) as HTMLElement
    await expect(getComputedStyle(track).boxShadow).toContain(
      `${red} 0px 0px 0px 1px`,
    )
  },
}
