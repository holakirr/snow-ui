import { ArrowLineLeftIcon } from '@holakirr/snow-ui-icons'
import {
  BellIcon,
  BookmarkSimpleIcon,
  ClockCounterClockwiseIcon,
  FolderIcon,
  HouseIcon,
  SidebarIcon,
  StarIcon,
  SunIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import { IconBox } from '../IconBox'
import { IconText } from '../IconText'
import { Typography } from '../Text'
import { Group } from './Group'

const iconButton = (label: string, icon: ReactNode) => (
  <Button
    key={label}
    aria-label={label}
    startContent={<IconBox size={16}>{icon}</IconBox>}
    className="p-1 rounded-12"
  />
)

const buttons = [
  iconButton('Theme', <SunIcon />),
  iconButton('History', <ClockCounterClockwiseIcon />),
  iconButton('Notifications', <BellIcon />),
  iconButton('Toggle sidebar', <SidebarIcon />),
]

const meta = {
  title: 'Components/Group',
  component: Group,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-44048',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Group": lays out any items (icon buttons, IconText rows, tags) in a row or a column, 8px apart by default; `vertical` and `reverse` as in Figma.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    vertical: { control: { type: 'boolean' } },
    reverse: { control: { type: 'boolean' } },
    gap: { options: [0, 4, 8, 12, 16], control: { type: 'radio' } },
  },
  args: {
    'aria-label': 'Toolbar',
    children: buttons,
  },
} satisfies Meta<typeof Group>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Vertical: Story = {
  args: { vertical: true },
}

export const Reverse: Story = {
  args: { reverse: true },
}

export const VerticalReverse: Story = {
  args: { vertical: true, reverse: true },
}

const numbered = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <IconText
      // biome-ignore lint/suspicious/noArrayIndexKey: static demo items
      key={index}
      interactive
      icon={
        <IconBox size={16}>
          <StarIcon />
        </IconBox>
      }
    >
      {String(index + 1)}
    </IconText>
  ))

const Variants = () => (
  <div className="flex flex-col gap-8">
    {[
      { label: 'Row', props: {} },
      { label: 'Row, reverse', props: { reverse: true } },
      { label: 'Gap 4', props: { gap: 4 as const } },
    ].map(({ label, props }) => (
      <div key={label} className="flex flex-col gap-2">
        <Typography size={12} className="text-secondary">
          {label}
        </Typography>
        <Group aria-label={label} className="w-80" {...props}>
          {numbered(3)}
        </Group>
      </div>
    ))}
    <div className="flex gap-10">
      {[
        { label: 'Column', props: { vertical: true } },
        { label: 'Column, reverse', props: { vertical: true, reverse: true } },
      ].map(({ label, props }) => (
        <div key={label} className="flex flex-col gap-2">
          <Typography size={12} className="text-secondary">
            {label}
          </Typography>
          <Group aria-label={label} {...props}>
            {numbered(3)}
          </Group>
        </div>
      ))}
    </div>
  </div>
)

export const AllVariants: Story = {
  render: () => <Variants />,
}

export const AllVariantsDark: Story = {
  render: () => <Variants />,
  globals: { theme: 'dark' },
}

const navItems = [
  { label: 'Home', icon: <HouseIcon /> },
  { label: 'History', icon: <ClockCounterClockwiseIcon /> },
  { label: 'User', icon: <UsersIcon /> },
  { label: 'Folder', icon: <FolderIcon /> },
  { label: 'Bookmark', icon: <BookmarkSimpleIcon /> },
]

// Navigation goes to pages, so the items are links styled as buttons.
const navButtons = (vertical?: boolean) =>
  navItems.map(({ label, icon }, index) => (
    <Button
      key={label}
      asChild
      size="md"
      variant={index === 0 ? 'filled' : 'borderless'}
      startContent={<IconBox size={16}>{icon}</IconBox>}
      className={vertical ? 'justify-start' : undefined}
    >
      <a
        href={`#${label.toLowerCase()}`}
        aria-current={index === 0 ? 'page' : undefined}
      >
        {label}
      </a>
    </Button>
  ))

/*
 * The button groups of the Figma Button and Group pages: Sign up + Sign in
 * (Small, 8px apart), Previous + Submit (Medium, ≈183px wide, 16px apart)
 * and top and side navigation (Medium buttons in a 12px-padded outlined
 * group).
 */
const ButtonGroupSet = () => (
  <div className="flex flex-col items-start gap-8">
    <Group aria-label="Account">
      <Button variant="gray">Sign up</Button>
      <Button variant="filled">Sign in</Button>
    </Group>
    <Group gap={16} aria-label="Form steps">
      <Button
        variant="gray"
        size="md"
        startContent={
          <IconBox size={16}>
            <ArrowLineLeftIcon className="rtl:-scale-x-100" />
          </IconBox>
        }
        className="w-[183px]"
      >
        Previous
      </Button>
      <Button variant="filled" size="md" className="w-[183px]">
        Submit
      </Button>
    </Group>
    <nav aria-label="Top navigation">
      <Group
        gap={4}
        aria-label="Pages"
        className="rounded-20 p-3 inset-ring-[0.5px] inset-ring-black-10"
      >
        {navButtons()}
      </Group>
    </nav>
    <nav aria-label="Side navigation">
      <Group
        vertical
        gap={4}
        aria-label="Pages"
        className="items-stretch rounded-20 p-3 inset-ring-[0.5px] inset-ring-black-10"
      >
        {navButtons(true)}
      </Group>
    </nav>
  </div>
)

export const ButtonGroups: Story = {
  render: () => <ButtonGroupSet />,
}

export const ButtonGroupsDark: Story = {
  render: () => <ButtonGroupSet />,
  globals: { theme: 'dark' },
}
