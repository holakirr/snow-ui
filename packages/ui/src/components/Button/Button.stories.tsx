import { StarIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { BUTTON_VARIANTS, ROLES, SIZES } from '../../constants'
import { Typography } from '../Text/Text'
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

/** Figma "Bare": no box, 40% opacity, 100% on hover. */
export const Bare: Story = {
  args: {
    variant: 'bare',
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center gap-4" title="Disabled buttons">
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <Button key={variant} {...args} variant={variant} disabled />
      ))}
    </div>
  ),
}

export const AllVariants: Story = {
  render: (args) => (
    <div
      className="grid grid-cols-2 gap-4 place-items-center"
      title="Buttons all variants"
    >
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <Fragment key={variant}>
          <Typography>{variant}</Typography>
          <Button {...args} variant={variant} />
        </Fragment>
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
        <Fragment key={size}>
          <Typography>{size}</Typography>
          <Button {...args} size={size} />
        </Fragment>
      ))}
    </div>
  ),
}

/**
 * The Figma Button set: every variant and size, with an icon and a label,
 * a label only, and an icon only (hover a button to see its hover state).
 */
export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div
      className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-8 gap-y-4"
      title="Button matrix"
    >
      <span />
      {Object.values(SIZES).map((size) => (
        <Typography key={size} size={12} className="text-black-40">
          {size}
        </Typography>
      ))}
      {Object.values(BUTTON_VARIANTS).map((variant) => (
        <Fragment key={variant}>
          <Typography size={12} className="text-black-40">
            {variant}
          </Typography>
          {Object.values(SIZES).map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Button
                variant={variant}
                size={size}
                label="Button"
                leftContent={<StarIcon />}
                rightContent={<StarIcon />}
              />
              <Button variant={variant} size={size} label="Button" />
              <Button
                variant={variant}
                size={size}
                label=""
                title="Icon button"
                leftContent={<StarIcon />}
              />
            </div>
          ))}
        </Fragment>
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
