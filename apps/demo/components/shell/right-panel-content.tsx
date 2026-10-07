import { IconBox, ListItem, Typography } from '@holakirr/snow-ui'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { BroadcastIcon, BugBeetleIcon, UserIcon } from '@/components/icons'
import { InitialsAvatar } from '@/components/initials-avatar'
import { activities, contacts, notificationKinds } from '@/lib/data'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Lang } from '@/lib/preferences'

const Section = ({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) => (
  <section aria-labelledby={id} className="flex flex-col gap-1">
    <Typography asChild size={14} className="px-1 py-2">
      <h2 id={id}>{title}</h2>
    </Typography>
    <ul className="flex flex-col gap-1">{children}</ul>
  </section>
)

const NOTIFICATION_ICONS = {
  bug: { icon: <BugBeetleIcon />, tint: 'bg-color-2' },
  user: { icon: <UserIcon />, tint: 'bg-color-1' },
  broadcast: { icon: <BroadcastIcon />, tint: 'bg-color-1' },
}

/**
 * The right sidebar's lists (Server Component): `ListItem` rows with an
 * icon or an initials avatar, a title and a `text-secondary` time.
 */
export const RightPanelContent = ({
  dict,
}: {
  dict: Dictionary
  lang: Lang
}) => (
  <>
    <Section id="panel-notifications" title={dict.panel.notifications}>
      {dict.panel.notificationItems.map((title, index) => {
        const { icon, tint } = NOTIFICATION_ICONS[notificationKinds[index]]
        return (
          <ListItem
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list
            key={index}
            asChild
            icon={
              <IconBox
                size={16}
                background
                className={`${tint} text-static-black`}
                aria-hidden
              >
                {icon}
              </IconBox>
            }
            className="p-2"
            title={title}
            description={dict.panel.sourceTimes[index]}
          >
            <li />
          </ListItem>
        )
      })}
    </Section>
    <Section id="panel-activities" title={dict.panel.activities}>
      {activities.map(({ user }, index) => (
        <ListItem
          key={user}
          asChild
          icon={
            <Image
              src={`/avatars/activity-${index + 1}.png`}
              width={24}
              height={24}
              alt=""
              aria-hidden
              className="size-6 rounded-full"
            />
          }
          title={dict.panel.activityItems[index]}
          description={dict.panel.sourceTimes[index]}
          className="relative p-2"
        >
          <li>
            {index < activities.length - 1 && (
              <span
                aria-hidden
                className="absolute start-[19.5px] top-[39px] h-[17px] w-px bg-black-10"
              />
            )}
          </li>
        </ListItem>
      ))}
    </Section>
    <Section id="panel-contacts" title={dict.panel.contacts}>
      {contacts.map((name) => (
        <ListItem
          key={name}
          asChild
          icon={<InitialsAvatar name={name} />}
          className="p-2"
          title={name}
        >
          <li />
        </ListItem>
      ))}
    </Section>
  </>
)
