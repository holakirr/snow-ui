'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

export const initialSettings = {
  name: 'ByeWind',
  lastName: '',
  email: 'byewind@twitter.com',
  phone: '+852 19850622',
  company: 'SnowUI',
  website: 'snowui.byewind.com',
  country: 'us',
  active: true,
  twoFactor: false,
  support: true,
  analytics: false,
  autoTimeZone: false,
  timezone: 'utc',
  alwaysEmail: true,
  slack: false,
  fontSize: 16,
  accent: 'indigo',
  cookies: true,
  historyDays: '30',
  voice: 'system',
  defaultPayment: 0,
  payoutInfo: '',
  connected: { SnowUI: true, Figma: true, Twitter: false, Instagram: false },
  emails: {
    payments: true,
    fees: true,
    disputes: true,
    refunds: true,
    invoices: false,
    webhooks: false,
  },
  notifications: {
    notifications: [true, true],
    billing: [true, true],
    members: [true, true],
    projects: [false, true],
    newsletters: [true, false],
  },
}
export type SettingsData = typeof initialSettings
const SettingsContext = createContext<{
  data: SettingsData
  update: (patch: Partial<SettingsData>) => void
} | null>(null)
const STORAGE_KEY = 'snow-demo-settings'

export const SettingsDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(() => structuredClone(initialSettings))
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (saved && typeof saved === 'object') {
        const restored = structuredClone(initialSettings)
        for (const key of [
          'name',
          'lastName',
          'email',
          'phone',
          'company',
          'website',
          'country',
          'timezone',
          'accent',
          'historyDays',
          'voice',
          'payoutInfo',
        ] as const) {
          if (typeof saved[key] === 'string') restored[key] = saved[key]
        }
        for (const key of [
          'active',
          'twoFactor',
          'support',
          'analytics',
          'autoTimeZone',
          'alwaysEmail',
          'slack',
          'cookies',
        ] as const) {
          if (typeof saved[key] === 'boolean') restored[key] = saved[key]
        }
        if ([12, 14, 16, 18, 20].includes(saved.fontSize))
          restored.fontSize = saved.fontSize
        if ([0, 1, 2].includes(saved.defaultPayment))
          restored.defaultPayment = saved.defaultPayment
        for (const key of ['connected', 'emails'] as const) {
          for (const item of Object.keys(initialSettings[key])) {
            if (typeof saved[key]?.[item] === 'boolean')
              Object.assign(restored[key], { [item]: saved[key][item] })
          }
        }
        for (const key of Object.keys(
          initialSettings.notifications,
        ) as (keyof SettingsData['notifications'])[]) {
          const pair = saved.notifications?.[key]
          if (
            Array.isArray(pair) &&
            pair.length === 2 &&
            pair.every((value) => typeof value === 'boolean')
          )
            restored.notifications[key] = pair
        }
        setData(restored)
      }
    } catch {
      /* Storage may be unavailable; the demo still works in memory. */
    }
  }, [])
  const update = (patch: Partial<SettingsData>) =>
    setData((current) => {
      const next = { ...current, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* Keep the in-memory state. */
      }
      return next
    })
  return <SettingsContext value={{ data, update }}>{children}</SettingsContext>
}
export const useSettingsData = () => {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('Use inside SettingsDataProvider')
  return value
}
