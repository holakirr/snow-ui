import type { Metadata } from 'next'
import { PreferencesPanel } from '@/components/settings/preferences-panel'
import { getRequestPreferences } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return { title: dict.settings.title }
}
const TABS = [
  'profile',
  'theme',
  'language',
  'notifications',
  'privacy',
  'payment',
  'plugins',
]
export default async function PreferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  return (
    <PreferencesPanel
      tab={params.tab && TABS.includes(params.tab) ? params.tab : 'profile'}
    />
  )
}
