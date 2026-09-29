import { IconBox, ListItem, Typography } from '@holakirr/snow-ui'
import type { ReactNode } from 'react'
import { BroadcastIcon, BugBeetleIcon, UserIcon } from '@/components/icons'
import { InitialsAvatar } from '@/components/initials-avatar'
import {
  activities,
  contacts,
  notificationKinds,
  notificationTimes,
} from '@/lib/data'
import { formatAgo } from '@/lib/format'
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
  <section aria-labelledby={id} className="flex flex-col gap-2">
    <Typography asChild size={14} semibold className="px-1 py-2">
      <h2 id={id}>{title}</h2>
    </Typography>
    <ul className="flex flex-col gap-2">{children}</ul>
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
  lang,
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
            title={title}
            description={formatAgo(
              lang,
              notificationTimes[index],
              dict.app.justNow,
            )}
          >
            <li />
          </ListItem>
        )
      })}
    </Section>
    <Section id="panel-activities" title={dict.panel.activities}>
      {activities.map(({ user, minutesAgo }, index) => (
        <ListItem
          key={user}
          asChild
          icon={<InitialsAvatar name={user} />}
          title={dict.panel.activityItems[index]}
          description={formatAgo(lang, minutesAgo, dict.app.justNow)}
          className="relative"
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
          title={name}
        >
          <li />
        </ListItem>
      ))}
    </Section>
  </>
)
