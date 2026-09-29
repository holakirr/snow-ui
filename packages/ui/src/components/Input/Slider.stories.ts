import type { Meta, StoryObj } from '@storybook/react-vite'

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
