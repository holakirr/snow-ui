import {
  CaretRightIcon,
  IdentificationBadgeIcon,
  IdentificationCardIcon,
  StarIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '../Avatar'
import { IconBox } from '../IconBox'
import { Typography } from '../Text'
import { IconText } from './IconText'

const icon = (
  <IconBox size={16}>
    <StarIcon />
  </IconBox>
)

const meta = {
  title: 'Components/IconText',
  component: IconText,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33302-438',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "IconText" (an icon or avatar plus text; `vertical`, `flip`) and, with `interactive` / `active`, the Figma "Frame" (hover and selected states).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Not in the generated table: the props are generic (polymorphic).
    className: {
      description: "Merged with the component's classes (yours win conflicts).",
      table: { type: { summary: 'string' } },
    },
    vertical: { control: { type: 'boolean' } },
    flip: { control: { type: 'boolean' } },
    interactive: { control: { type: 'boolean' } },
    active: { control: { type: 'boolean' } },
  },
  args: {
    icon,
    children: 'Text',
  },
} satisfies Meta<typeof IconText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Vertical: Story = {
  args: { vertical: true },
}

export const Flip: Story = {
  args: { flip: true },
}

export const VerticalFlip: Story = {
  args: { vertical: true, flip: true },
}

/** `asChild` makes the child element (a `<button>`, a link) the row. */
export const Interactive: Story = {
  args: {
    interactive: true,
    asChild: true,
    children: <button type="button">Text</button>,
  },
}

export const Active: Story = {
  args: {
    interactive: true,
    active: true,
    asChild: true,
    children: <button type="button">Text</button>,
  },
}

const Variants = () => (
  <div className="grid grid-cols-4 items-start gap-8">
    {[
      { label: 'IconText', props: {} },
      { label: 'Flip', props: { flip: true } },
      { label: 'Vertical', props: { vertical: true } },
      { label: 'Vertical + flip', props: { vertical: true, flip: true } },
      { label: 'Static (Frame)', props: { className: 'p-2' } },
      { label: 'Interactive (hover me)', props: { interactive: true } },
      { label: 'Active', props: { active: true } },
      {
        label: 'Vertical interactive',
        props: { vertical: true, interactive: true },
      },
    ].map(({ label, props }) => (
      <div key={label} className="flex flex-col items-start gap-2">
        <Typography size={12} className="text-secondary">
          {label}
        </Typography>
        <IconText icon={icon} {...props}>
          Text
        </IconText>
      </div>
    ))}
  </div>
)

export const AllVariants: Story = {
  render: () => <Variants />,
}

export const AllVariantsDark: Story = {
  render: () => <Variants />,
  globals: { theme: 'dark' },
}

/** The examples from the Figma IconText page. */
export const Examples: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-6">
      <IconText
        interactive
        icon={
          <IconBox size={24}>
            <Avatar>
              <AvatarFallback className="text-static-black">BW</AvatarFallback>
            </Avatar>
          </IconBox>
        }
      >
        ByeWind
      </IconText>

      <IconText
        asChild
        interactive
        flip
        className="w-full justify-between bg-black-4"
        icon={
          <IconBox size={16} className="text-black-20">
            <CaretRightIcon className="rtl:-scale-x-100" />
          </IconBox>
        }
      >
        <button type="button">
          <span className="flex flex-col">
            <Typography size={14}>Email</Typography>
            <Typography size={12} className="text-secondary">
              Set a permanent password to login to your account.
            </Typography>
          </span>
        </button>
      </IconText>

      <nav aria-label="Pages" className="flex flex-col gap-1">
        <IconText
          asChild
          interactive
          active
          icon={
            <IconBox size={20}>
              <IdentificationBadgeIcon weight="duotone" />
            </IconBox>
          }
        >
          <a href="#profile" aria-current="page">
            User Profile
          </a>
        </IconText>
        <IconText
          asChild
          interactive
          icon={
            <IconBox size={20}>
              <IdentificationCardIcon weight="duotone" />
            </IconBox>
          }
        >
          <a href="#account">Account</a>
        </IconText>
      </nav>
    </div>
  ),
}
