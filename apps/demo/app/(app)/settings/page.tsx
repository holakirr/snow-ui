import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography,
} from '@holakirr/snow-ui'
import type { Metadata } from 'next'
import { AccountForm } from '@/components/settings/account-form'
import { AppearanceForm } from '@/components/settings/appearance-form'
import { NotificationsForm } from '@/components/settings/notifications-form'
import { ProfileForm } from '@/components/settings/profile-form'
import { getRequestPreferences } from '@/lib/i18n/server'

const TABS = ['profile', 'account', 'notifications', 'appearance'] as const
type Tab = (typeof TABS)[number]

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return { title: dict.settings.title }
}

/**
 * Settings: four tabs of forms. The page and the tabs render on the server
 * (`Tabs` is a client component used from a Server Component, with server
 * children); each form is a client component. `?tab=` opens a tab.
 */
export default async function SettingsPage({
  searchParams,
}: PageProps<'/settings'>) {
  const [{ dict }, params] = await Promise.all([
    getRequestPreferences(),
    searchParams,
  ])
  const requested = typeof params.tab === 'string' ? params.tab : undefined
  const tab: Tab = TABS.includes(requested as Tab)
    ? (requested as Tab)
    : 'profile'

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-7 md:p-7">
      <div className="flex flex-col gap-1">
        <Typography asChild size={24} semibold>
          <h1>{dict.settings.title}</h1>
        </Typography>
        <Typography size={14} className="text-secondary">
          {dict.settings.description}
        </Typography>
      </div>
      <Tabs defaultValue={tab} className="flex flex-col gap-6">
        <TabsList
          aria-label={dict.settings.sections}
          variant="pill"
          className="self-start max-sm:w-full max-sm:overflow-x-auto"
        >
          {TABS.map((value) => (
            <TabsTrigger key={value} value={value}>
              {dict.settings.tabs[value]}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="account">
          <AccountForm />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsForm />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
