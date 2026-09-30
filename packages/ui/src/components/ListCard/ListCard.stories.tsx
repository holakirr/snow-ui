import { BroadcastIcon, BugBeetleIcon, UserIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { photos } from '../../test/photos'
import { Avatar, AvatarFallback, AvatarImage } from '../Avatar'
import {
  ActivitiesCard,
  type ActivityItem,
  type ContactItem,
  ContactsCard,
  ListCard,
  type NotificationItem,
  NotificationsCard,
} from './ListCard'

const person = (name: string, photo?: string) => (
  <Avatar size="sm">
    {photo && <AvatarImage src={photo} alt="" />}
    <AvatarFallback className="bg-color-2 text-static-black">
      {name
        .split(' ')
        .map((part) => part[0])
        .join('')}
    </AvatarFallback>
  </Avatar>
)

const notifications: NotificationItem[] = [
  {
    id: 'bug-1',
    icon: <BugBeetleIcon />,
    title: 'You fixed a bug.',
    time: 'Just now',
    href: '#bug-1',
  },
  {
    id: 'user',
    icon: <UserIcon />,
    title: 'New user registered.',
    time: '59 minutes ago',
    href: '#user',
  },
  {
    id: 'bug-2',
    icon: <BugBeetleIcon />,
    title: 'You fixed a bug.',
    time: '12 hours ago',
    href: '#bug-2',
  },
  {
    id: 'subscribed',
    icon: <BroadcastIcon />,
    title: 'Andi Lane subscribed to you.',
    time: 'Today, 11:59 AM',
    href: '#subscribed',
  },
]

const activities: ActivityItem[] = [
  {
    id: 'style',
    avatar: person('Emma Moore', photos[0]),
    title: 'Changed the style.',
    time: 'Just now',
  },
  {
    id: 'release',
    avatar: person('Drew Cano', photos[1]),
    title: 'Released a new version.',
    time: '59 minutes ago',
  },
  {
    id: 'bug',
    avatar: person('Andi Lane', photos[2]),
    title: 'Submitted a bug.',
    time: '12 hours ago',
  },
  {
    id: 'data',
    avatar: person('Koray Okumus', photos[3]),
    title: 'Modified A data in Page X.',
    time: 'Today, 11:59 AM',
  },
  {
    id: 'page',
    avatar: person('Melody Macy'),
    title: 'Deleted a page in Project X.',
    time: 'Feb 2, 2026',
  },
]

const contacts: ContactItem[] = [
  { id: 'byewind', avatar: person('ByeWind', photos[0]), name: 'ByeWind' },
  {
    id: 'natali',
    avatar: person('Natali Craig', photos[1]),
    name: 'Natali Craig',
  },
  { id: 'drew', avatar: person('Drew Cano', photos[2]), name: 'Drew Cano' },
  {
    id: 'orlando',
    avatar: person('Orlando Diggs', photos[3]),
    name: 'Orlando Diggs',
  },
  { id: 'andi', avatar: person('Andi Lane'), name: 'Andi Lane' },
]

const meta = {
  title: 'Components/ListCard',
  component: ListCard,
  parameters: {
    // The Figma Notifications list; Contacts and Activities are in KitCards.
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-151148',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma Notifications, Activities and Contacts cards: a 14 Semibold title and ListItem rows on the popup surface (Background/3 with "Glass 2", radius 24, padding 16), 248px wide. `ListCard` takes any rows; `NotificationsCard`, `ActivitiesCard` and `ContactsCard` take the kit\'s content and a translated default title.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Recent files',
    items: [
      {
        id: 'q3',
        title: 'Q3 report.pdf',
        description: 'Edited 2 hours ago',
        href: '#q3',
      },
      {
        id: 'brand',
        title: 'Brand guidelines.fig',
        description: 'Edited yesterday',
        href: '#brand',
      },
    ],
  },
} satisfies Meta<typeof ListCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region', { name: 'Recent files' })
    await expect(card).toHaveClass('w-62', 'rounded-24', 'p-4', 'glass-2')
    await expect(card.getBoundingClientRect().width).toBe(248)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Recent files' }),
    ).toBeInTheDocument()
    await expect(within(card).getAllByRole('listitem')).toHaveLength(2)
    await expect(
      canvas.getByRole('link', { name: /Q3 report\.pdf/ }),
    ).toHaveAttribute('href', '#q3')
  },
}

const Kit = () => (
  <div className="flex items-start gap-6">
    <ActivitiesCard items={activities} />
    <ContactsCard items={contacts} />
    <NotificationsCard items={notifications} />
  </div>
)

/**
 * The three cards of the kit's components overview: Activities, Contacts
 * and Notifications.
 */
export const KitCards: Story = {
  render: () => <Kit />,
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
  play: async ({ canvas }) => {
    for (const name of ['Activities', 'Contacts', 'Notifications']) {
      await expect(canvas.getByRole('region', { name })).toBeInTheDocument()
    }
    const contactsList = within(
      canvas.getByRole('region', { name: 'Contacts' }),
    ).getByRole('list')
    // Figma: one-line contact rows 8px apart, the others 4px.
    await expect(getComputedStyle(contactsList).rowGap).toBe('8px')
    const notificationsList = within(
      canvas.getByRole('region', { name: 'Notifications' }),
    ).getByRole('list')
    await expect(getComputedStyle(notificationsList).rowGap).toBe('4px')
  },
}

export const KitCardsDark: Story = {
  render: () => <Kit />,
  globals: { theme: 'dark' },
}

/**
 * Rows with `href` are links, with `onSelect` buttons: Tab moves between
 * them, Enter follows or presses.
 */
export const Keyboard: Story = {
  render: () => (
    <ContactsCard
      items={contacts.slice(0, 3).map((contact) => ({
        ...contact,
        onSelect: fn(),
      }))}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button')
    await userEvent.tab()
    await expect(buttons[0]).toHaveFocus()
    await userEvent.tab()
    await expect(buttons[1]).toHaveFocus()
    await expect(buttons[1]).toHaveAccessibleName('Natali Craig')
  },
}

/** The titles come from `SnowUIProvider` messages (Russian example). */
export const Localized: Story = {
  tags: ['!autodocs'],
  globals: { locale: 'ru' },
  render: () => <Kit />,
  play: async ({ canvas }) => {
    for (const name of ['Активность', 'Контакты', 'Уведомления']) {
      await expect(canvas.getByRole('heading', { name })).toBeInTheDocument()
    }
  },
}

/** Right-to-left text: the icons and avatars are on the right. */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  render: () => (
    <NotificationsCard
      title="الإشعارات"
      items={[
        {
          id: 'bug',
          icon: <BugBeetleIcon />,
          title: 'لقد أصلحت خطأ.',
          time: 'الآن',
          href: '#bug',
        },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByRole('link')
    const icon = row.querySelector('[data-size]') as HTMLElement
    await expect(icon.getBoundingClientRect().left).toBeGreaterThan(
      row.getBoundingClientRect().left + row.getBoundingClientRect().width / 2,
    )
  },
}
