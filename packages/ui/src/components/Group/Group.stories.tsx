import {
  ArrowLineLeftIcon,
  CloseIcon,
  MaximizeIcon,
  MinimizeIcon,
} from '@holakirr/snow-ui-icons'
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
import { expect } from 'storybook/test'
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

/*
 * The kit's window controls (Component state → IconButton, Button):
 * Minimize, Maximize and Close as Small, icon-only Borderless buttons —
 * 24×24, a 16px glyph — with no gap. Their inner corners are square and the
 * outer ones 12px, so the Black/4% hover fills of neighbours meet; Close
 * hovers Secondary/Red with a white glyph (3.36:1, enough for an icon).
 * Disabled, the glyphs are Black/20%.
 */
const WindowControls = ({ disabled }: { disabled?: boolean }) => (
  <Group gap={0} aria-label="Window">
    <Button
      aria-label="Minimize"
      startContent={<MinimizeIcon size={16} />}
      className="rounded-none rounded-s-12"
      disabled={disabled}
    />
    <Button
      aria-label="Maximize"
      startContent={<MaximizeIcon size={16} />}
      className="rounded-none"
      disabled={disabled}
    />
    <Button
      aria-label="Close"
      startContent={<CloseIcon size={16} />}
      className="rounded-none rounded-e-12 hover:bg-red hover:text-static-white"
      disabled={disabled}
    />
  </Group>
)

/*
 * The buttons are 24×24px, which meets WCAG 2.5.8 with no spacing needed,
 * but share an edge: the check's rim point 0.5px inside one button is
 * hit-tested on the pixel grid and lands on the next one.
 */
const windowTargetSize = {
  targetSize: {
    exceptions: [
      {
        selector: '[aria-label="Minimize"], [aria-label="Maximize"]',
        reason:
          '24×24px, the WCAG 2.5.8 minimum, side by side with no gap (the kit’s window group): the check’s hit test at the shared edge rounds onto the neighbour.',
      },
    ],
  },
}

const WindowControlsSet = () => (
  <div className="flex flex-col items-start gap-4">
    <WindowControls />
    <WindowControls disabled />
  </div>
)

/**
 * The kit's window button group, added to the docs in 5.2: a composition of
 * Group and Button, no new component. Hover a button: Black/4%, Close red.
 */
export const WindowButtons: Story = {
  parameters: windowTargetSize,
  render: () => <WindowControlsSet />,
  play: async ({ canvas }) => {
    const [minimize, maximize, close] = ['Minimize', 'Maximize', 'Close'].map(
      (name) => canvas.getAllByRole('button', { name })[0],
    )
    const boxes = [minimize, maximize, close].map((button) =>
      button.getBoundingClientRect(),
    )
    for (const box of boxes) {
      await expect(box.width).toBeCloseTo(24, 0)
      await expect(box.height).toBeCloseTo(24, 0)
    }
    // No gap: each button starts where the previous one ends.
    await expect(boxes[1].left).toBeCloseTo(boxes[0].right, 0)
    await expect(boxes[2].left).toBeCloseTo(boxes[1].right, 0)
    // 12px outer corners, square inner ones.
    const radius = (element: HTMLElement, corner: string) =>
      getComputedStyle(element).getPropertyValue(`border-${corner}-radius`)
    await expect(radius(minimize, 'top-left')).toBe('12px')
    await expect(radius(minimize, 'top-right')).toBe('0px')
    await expect(radius(maximize, 'top-left')).toBe('0px')
    await expect(radius(close, 'bottom-right')).toBe('12px')
    await expect(radius(close, 'bottom-left')).toBe('0px')
  },
}

export const WindowButtonsDark: Story = {
  parameters: windowTargetSize,
  render: () => <WindowControlsSet />,
  globals: { theme: 'dark' },
}

/**
 * Right-to-left text: the group mirrors, Close on the left, and the
 * rounded corners follow (`rounded-s-12`, `rounded-e-12`).
 */
export const WindowButtonsRTL: Story = {
  parameters: windowTargetSize,
  render: () => <WindowControls />,
  globals: { dir: 'rtl' },
  play: async ({ canvas }) => {
    const minimize = canvas.getByRole('button', { name: 'Minimize' })
    const close = canvas.getByRole('button', { name: 'Close' })
    await expect(close.getBoundingClientRect().right).toBeLessThanOrEqual(
      minimize.getBoundingClientRect().left,
    )
    await expect(getComputedStyle(minimize).borderTopRightRadius).toBe('12px')
    await expect(getComputedStyle(close).borderTopLeftRadius).toBe('12px')
  },
}
