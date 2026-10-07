import type { Metadata } from 'next'
import { AccountSettings } from '@/components/settings/account-settings'
import { getRequestPreferences } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return { title: dict.settings.title }
}
export default function SettingsPage() {
  return <AccountSettings />
}
