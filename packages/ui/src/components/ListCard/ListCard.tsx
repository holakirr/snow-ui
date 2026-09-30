'use client'

import { type ComponentProps, type FC, type ReactNode, useId } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { IconBox } from '../IconBox'
import { ListItem } from '../ListItem'
import { useMessages } from '../SnowUIProvider'
import { Typography } from '../Text'

/** A row of a ListCard. */
export type ListCardItem = {
  /** Unique within the list: the row's key. */
  id: string
  /** A 24px icon, avatar or image before the text. */
  icon?: ReactNode
  /** The main line (14 Regular). */
  title: ReactNode
  /** The second line: a timestamp or a short description (12, `text-secondary`). */
  description?: ReactNode
  /** Makes the row a link. */
  href?: string
  /** Makes the row a button (when there is no `href`). */
  onSelect?: () => void
}

/** The heading levels a ListCard title can have. */
export type ListCardHeadingLevel = 2 | 3 | 4 | 5 | 6

/**
 * Props for the ListCard component.
 */
export type ListCardProps = Omit<
  ComponentProps<'section'>,
  'title' | 'children'
> & {
  /** The card's title (18 Semibold), a heading that names the section. */
  title: ReactNode

  /** The rows. */
  items: ListCardItem[]

  /**
   * The level of the title's heading, by the page's outline.
   * @default 2
   */
  headingLevel?: ListCardHeadingLevel
}

/**
 * ListCard is a titled list of ListItem rows on the kit's popup surface —
 * the Figma Notifications, Activities and Contacts cards: 248px wide,
 * Background/3 with the "Glass 2" effect, radius 24, padding 16, an 18
 * Semibold title (44 high) and rows 4px apart. A row with `href` is a link,
 * with `onSelect` a button; both get the Figma "Frame" hover fill.
 * NotificationsCard, ActivitiesCard and ContactsCard are ListCards with the
 * kit's content.
 */
const ListCard: FC<ListCardProps> = ({
  title,
  items,
  headingLevel = 2,
  className,
  ...props
}) => {
  const headingId = useId()
  const Heading = `h${headingLevel}` as const

  return (
    <section
      aria-labelledby={headingId}
      className={twMerge(
        // Figma: the SearchPopup surface, 248 wide (the RightSidebar's 280
        // minus its 16px padding).
        'flex w-62 flex-col gap-1 rounded-24 p-4 text-black glass-2',
        className,
      )}
      {...props}
    >
      {/* Figma: the kit's `Text`, 18 Semibold 18/28 with padding 4/8: 44 high. */}
      <Typography asChild size={18} semibold className="px-1 py-2">
        <Heading id={headingId}>{title}</Heading>
      </Typography>
      <ul className="flex flex-col gap-1">
        {items.map(({ id, icon, title, description, href, onSelect }) => (
          <li key={id} className="flex">
            {href || onSelect ? (
              <ListItem
                asChild
                interactive
                icon={icon}
                title={title}
                description={description}
              >
                {href ? (
                  // biome-ignore lint/a11y/useAnchorContent: the ListItem renders its title inside
                  <a href={href} />
                ) : (
                  <button type="button" onClick={onSelect} />
                )}
              </ListItem>
            ) : (
              // A static row keeps the interactive rows' padding.
              <ListItem
                icon={icon}
                title={title}
                description={description}
                className="p-2"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
ListCard.displayName = 'ListCard'

/** A row of a NotificationsCard. */
export type NotificationItem = Omit<ListCardItem, 'description' | 'icon'> & {
  /** A 16px icon, shown on a 24px tile (a Black/4% IconBox). */
  icon?: ReactNode
  /** When it happened: "Just now", "59 minutes ago". */
  time?: ReactNode
}

/**
 * Props for the NotificationsCard component.
 */
export type NotificationsCardProps = Omit<ListCardProps, 'items' | 'title'> & {
  items: NotificationItem[]
  /**
   * @default messages.listCards.notifications: "Notifications"
   */
  title?: ReactNode
}

/**
 * The Figma "Notifications" card: a 16px icon on a 24px tile, what happened
 * and when.
 */
const NotificationsCard: FC<NotificationsCardProps> = ({
  items,
  title,
  ...props
}) => {
  const messages = useMessages()

  return (
    <ListCard
      title={title ?? messages.listCards.notifications}
      items={items.map(({ icon, time, ...item }) => ({
        ...item,
        description: time,
        icon: icon && (
          <IconBox size={16} background>
            {icon}
          </IconBox>
        ),
      }))}
      {...props}
    />
  )
}
NotificationsCard.displayName = 'NotificationsCard'

/** A row of an ActivitiesCard. */
export type ActivityItem = Omit<ListCardItem, 'description' | 'icon'> & {
  /** Who did it: a 24px avatar (an `Avatar size="sm"`, an `Image size={24}`). */
  avatar?: ReactNode
  /** When: "Just now", "Feb 2, 2026". */
  time?: ReactNode
}

/**
 * Props for the ActivitiesCard component.
 */
export type ActivitiesCardProps = Omit<ListCardProps, 'items' | 'title'> & {
  items: ActivityItem[]
  /**
   * @default messages.listCards.activities: "Activities"
   */
  title?: ReactNode
}

/** The Figma "Activities" card: an avatar, what was done and when. */
const ActivitiesCard: FC<ActivitiesCardProps> = ({
  items,
  title,
  ...props
}) => {
  const messages = useMessages()

  return (
    <ListCard
      title={title ?? messages.listCards.activities}
      items={items.map(({ avatar, time, ...item }) => ({
        ...item,
        icon: avatar,
        description: time,
      }))}
      {...props}
    />
  )
}
ActivitiesCard.displayName = 'ActivitiesCard'

/** A row of a ContactsCard. */
export type ContactItem = Omit<
  ListCardItem,
  'title' | 'description' | 'icon'
> & {
  /**
   * A 28px avatar, as in the Figma card (an `Avatar size="sm"
   * className="size-7"`, an `Image size={28}`): the row is then 44 high.
   */
  avatar?: ReactNode
  /** The person's name. */
  name: ReactNode
}

/**
 * Props for the ContactsCard component.
 */
export type ContactsCardProps = Omit<ListCardProps, 'items' | 'title'> & {
  items: ContactItem[]
  /**
   * @default messages.listCards.contacts: "Contacts"
   */
  title?: ReactNode
}

/**
 * The Figma "Contacts" card: one-line rows of a 28px avatar and a name, 44
 * high.
 */
const ContactsCard: FC<ContactsCardProps> = ({ items, title, ...props }) => {
  const messages = useMessages()

  return (
    <ListCard
      title={title ?? messages.listCards.contacts}
      items={items.map(({ avatar, name, ...item }) => ({
        ...item,
        icon: avatar,
        title: name,
      }))}
      {...props}
    />
  )
}
ContactsCard.displayName = 'ContactsCard'

export { ActivitiesCard, ContactsCard, ListCard, NotificationsCard }
