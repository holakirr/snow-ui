import { BroadcastIcon, BugBeetleIcon, UserIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Avatar, AvatarFallback } from '../Avatar'
import { Card } from '../Card'
import { IconBox } from '../IconBox'
import { Typography } from '../Text'
import { ListItem } from './ListItem'

const avatar = (initials: string, className?: string) => (
  <IconBox size={24}>
    <Avatar>
      <AvatarFallback className={className ?? 'text-static-black'}>
        {initials}
      </AvatarFallback>
    </Avatar>
  </IconBox>
)

const tile = (icon: ReactNode, className: string) => (
  <IconBox size={16} background className={`${className} text-static-black`}>
    {icon}
  </IconBox>
)

const meta = {
  title: 'Components/ListItem',
  component: ListItem,
  parameters: {
    layout: 'centered',
    // The Figma Notifications list; Contacts and Activities are in the
    // DashboardLists story.
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-151148',
    },
    docs: {
      description: {
        component:
          'A row of the dashboard lists (Figma Notifications, Activities, Contacts): a 24px icon or avatar, a title and an optional description or timestamp. It is an `IconText`, so `interactive` (hover fill), `active`, `flip` and `as` work the same way.',
      },
    },
  },
  tags: ['autodocs'],
  // The props come through IconText's generic (polymorphic) props, which the
  // docs' docgen can't resolve: it types them `any` and has no `className`.
  argTypes: {
    className: {
      description: "Merged with the row's classes (yours win conflicts).",
      table: { type: { summary: 'string' } },
    },
    interactive: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    active: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
    icon: { table: { type: { summary: 'ReactNode' } } },
    flip: { table: { type: { summary: 'boolean' } } },
    asChild: { table: { type: { summary: 'boolean' } } },
    as: { table: { type: { summary: 'ElementType' } } },
    ref: { table: { type: { summary: 'Ref<HTMLElement>' } } },
  },
  args: {
    icon: tile(<BugBeetleIcon />, 'bg-color-2'),
    title: 'You fixed a bug.',
    description: 'Just now',
    className: 'w-62',
  },
} satisfies Meta<typeof ListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** A clickable row: `asChild` with a link (or a `<button>`) as the child. */
export const Interactive: Story = {
  args: {
    interactive: true,
    asChild: true,
    // biome-ignore lint/a11y/useAnchorContent: the ListItem renders its title inside
    children: <a href="#notification" />,
  },
}

export const Active: Story = {
  args: { interactive: true, active: true },
}

export const TitleOnly: Story = {
  args: {
    icon: avatar('NC'),
    title: 'Natali Craig',
    description: undefined,
  },
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  // Figma: each list is a 248px card with a 14 Semibold title.
  <Card className="w-62">
    <section aria-label={title} className="flex flex-col gap-1">
      <Typography asChild size={14} semibold className="px-1 py-2">
        <h2>{title}</h2>
      </Typography>
      <ul className="flex flex-col gap-1">{children}</ul>
    </section>
  </Card>
)

const notifications = [
  {
    icon: <BugBeetleIcon />,
    tint: 'bg-color-2',
    title: 'You fixed a bug.',
    time: 'Just now',
  },
  {
    icon: <UserIcon />,
    tint: 'bg-color-1',
    title: 'New user registered.',
    time: '59 minutes ago',
  },
  {
    icon: <BugBeetleIcon />,
    tint: 'bg-color-2',
    title: 'You fixed a bug.',
    time: '12 hours ago',
  },
  {
    icon: <BroadcastIcon />,
    tint: 'bg-color-1',
    title: 'Andi Lane subscribed to you.',
    time: 'Today, 11:59 AM',
  },
]

const activities = [
  {
    initials: 'EM',
    tint: 'bg-purple',
    title: 'Changed the style.',
    time: 'Just now',
  },
  {
    initials: 'DC',
    tint: 'bg-blue',
    title: 'Released a new version.',
    time: '59 minutes ago',
  },
  {
    initials: 'AL',
    tint: 'bg-mint',
    title: 'Submitted a bug.',
    time: '12 hours ago',
  },
  {
    initials: 'KO',
    tint: 'bg-orange',
    title: 'Modified A data in Page X.',
    time: 'Today, 11:59 AM',
  },
  {
    initials: 'MM',
    tint: 'bg-green',
    title: 'Deleted a page in Project X.',
    time: 'Feb 2, 2026',
  },
]

const contacts = [
  'Natali Craig',
  'Drew Cano',
  'Andi Lane',
  'Koray Okumus',
  'Kate Morrison',
  'Melody Macy',
]

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

const Lists = () => (
  <div className="flex flex-wrap items-start gap-10">
    <Section title="Notifications">
      {notifications.map((item) => (
        <ListItem
          key={item.time}
          asChild
          interactive
          icon={tile(item.icon, item.tint)}
          title={item.title}
          description={item.time}
        >
          <li />
        </ListItem>
      ))}
    </Section>

    <Section title="Activities">
      {activities.map((item) => (
        <ListItem
          key={item.time}
          asChild
          interactive
          icon={avatar(item.initials, `${item.tint} text-static-black`)}
          title={item.title}
          description={item.time}
        >
          <li />
        </ListItem>
      ))}
    </Section>

    <Section title="Contacts">
      {contacts.map((name) => (
        <ListItem
          key={name}
          asChild
          interactive
          icon={avatar(initialsOf(name))}
          title={name}
        >
          <li />
        </ListItem>
      ))}
    </Section>
  </div>
)

/**
 * The Figma Notifications, Activities and Contacts lists, as the kit's
 * components overview shows them: cards with a semibold title.
 */
export const DashboardLists: Story = {
  render: () => <Lists />,
  parameters: {
    design: [
      {
        name: 'Notifications',
        type: 'figma',
        url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-151148',
      },
      {
        name: 'Contacts',
        type: 'figma',
        url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-138393',
      },
      {
        name: 'Activities (components overview)',
        type: 'figma',
        url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33320-7465',
      },
    ],
  },
}

export const DashboardListsDark: Story = {
  ...DashboardLists,
  globals: { theme: 'dark' },
}
