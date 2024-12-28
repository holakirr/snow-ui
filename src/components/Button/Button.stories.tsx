import type { Meta, StoryObj } from '@storybook/react'
import { BUTTON_VARIANTS, ROLES, SIZES } from '../../constants'
import { Text } from '../Text/Text'
import { Button } from './Button'

const leftIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-arrow-left"
    viewBox="0 0 16 16"
    role={ROLES.img}
  >
    <title>Left Icon</title>
    <path
      fillRule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
    />
  </svg>
)

const rightIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-arrow-right"
    viewBox="0 0 16 16"
    role={ROLES.img}
  >
    <title>Right Icon</title>
    <path
      fillRule="evenodd"
      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
    />
  </svg>
)

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: Object.values(BUTTON_VARIANTS),
      control: { type: 'radio' },
    },
    size: {
      options: Object.values(SIZES),
      control: { type: 'radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {
    label: Button.displayName,
    // I use filled to see better in snapshots but the default is borderless
    variant: 'filled',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Borderless: Story = {
  args: {
    variant: 'borderless',
  },
}

export const Gray: Story = {
  args: {
    variant: 'gray',
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export const AllVariants: Story = {
  render: (args) => (
    <div
      className="grid grid-cols-2 gap-4 place-items-center"
      title="Buttons all variants"
    >
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <>
          <Text key={`${variant}-text`}>{variant}</Text>
          <Button key={variant} {...args} variant={variant} />
        </>
      ))}
    </div>
  ),
}

export const Sm: Story = {
  args: {
    size: SIZES.sm,
  },
}

export const Md: Story = {
  args: {
    size: SIZES.md,
  },
}

export const Lg: Story = {
  args: {
    size: SIZES.lg,
  },
}

export const AllSizes: Story = {
  render: ({ ...args }) => (
    <div
      className="grid grid-cols-2 gap-4 place-items-center"
      title="Buttons all sizes"
    >
      {Object.values(SIZES).map((size) => (
        <>
          <Text key={`${size}-text`}>{size}</Text>
          <Button key={size} {...args} size={size} />
        </>
      ))}
    </div>
  ),
}

export const WithChildren: Story = {
  args: {
    children: <p>with-children</p>,
  },
}

export const AsLink: Story = {
  args: {
    as: 'a',
    href: 'https://holakirr.com',
  },
}

export const WithLeftContent: Story = {
  parameters: {},
  args: {
    leftContent: leftIcon,
  },
}

export const WithRightContent: Story = {
  args: {
    rightContent: rightIcon,
  },
}

export const WithLeftAndRightContent: Story = {
  args: {
    leftContent: leftIcon,
    rightContent: rightIcon,
  },
}

export const IconButton: Story = {
  args: {
    leftContent: leftIcon,
    label: '',
    title: 'Icon Button',
  },
}
