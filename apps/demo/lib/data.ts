import type { ChartConfig } from '@holakirr/snow-ui-charts'

/*
 * Mock data of the SnowUI "Dashboard" (Figma "Dashboard - Light mode"), read
 * off the drawings like the charts' stories. No real people: the names are
 * the kit's placeholder names, the avatars are initials.
 */

export type KpiKey = 'views' | 'visits' | 'newUsers' | 'activeUsers'

export const kpis: {
  key: KpiKey
  value: number
  change: number
  trend: number[]
  color: 'primary' | 'blue' | 'green' | 'purple'
}[] = [
  {
    key: 'views',
    value: 7265,
    change: 11.01,
    trend: [5, 9, 7, 12, 10, 14, 16],
    color: 'primary',
  },
  {
    key: 'visits',
    value: 3671,
    change: -0.03,
    trend: [9, 8, 10, 7, 9, 8, 8],
    color: 'blue',
  },
  {
    key: 'newUsers',
    value: 256,
    change: 15.03,
    trend: [2, 3, 5, 4, 6, 8, 9],
    color: 'green',
  },
  {
    key: 'activeUsers',
    value: 2318,
    change: 6.08,
    trend: [10, 12, 11, 13, 15, 14, 17],
    color: 'purple',
  },
]

/** "Total Users": this year against last year, per month (0 = January). */
export const totalUsers = [
  { month: 0, thisYear: 12000, lastYear: 5000 },
  { month: 1, thisYear: 8500, lastYear: 13000 },
  { month: 2, thisYear: 14500, lastYear: 20500 },
  { month: 3, thisYear: 24500, lastYear: 7000 },
  { month: 4, thisYear: 28500, lastYear: 14500 },
  { month: 5, thisYear: 21000, lastYear: 25000 },
  { month: 6, thisYear: 24000, lastYear: 29500 },
]

export const totalUsersConfig = {
  thisYear: { color: 'primary' },
  lastYear: { color: 'cyan', dashed: true, opacity: 0 },
} satisfies ChartConfig

/** "Traffic by Website": a share of 6 segments per site. */
export const trafficByWebsite = [
  { site: 'Google', share: 4 },
  { site: 'YouTube', share: 5 },
  { site: 'Instagram', share: 3 },
  { site: 'Pinterest', share: 6 },
  { site: 'Facebook', share: 2 },
  { site: 'Twitter', share: 4 },
]

/** "Traffic by Device": one colour per device. */
export const trafficByDevice = [
  { device: 'Linux', users: 15000 },
  { device: 'Mac', users: 26250 },
  { device: 'iOS', users: 18750 },
  { device: 'Windows', users: 30000 },
  { device: 'Android', users: 11250 },
  { device: 'Other', users: 22500 },
]

export const trafficByDeviceColors = {
  Linux: 'cyan',
  Mac: 'mint',
  iOS: 'primary',
  Windows: 'blue',
  Android: 'purple',
  Other: 'green',
} as const

/** "Traffic by Location": shares of visits, in %. */
export const trafficByLocation = [
  { country: 'United States', visits: 52.1 },
  { country: 'Canada', visits: 22.8 },
  { country: 'Mexico', visits: 13.9 },
  { country: 'Other', visits: 11.2 },
]

export const trafficByLocationColors = {
  'United States': 'primary',
  Canada: 'blue',
  Mexico: 'green',
  Other: 'cyan',
} as const

/** "Marketing & SEO": campaigns per month (0 = January), one colour each. */
export const marketing = [
  16000, 28000, 20000, 32000, 12000, 24000, 18000, 30000, 22000, 34000, 14000,
  26000,
].map((campaigns, month) => ({ month, campaigns }))

export const marketingColors = [
  'purple',
  'cyan',
  'primary',
  'blue',
  'mint',
  'green',
] as const

export type OrderStatus =
  | 'progress'
  | 'complete'
  | 'pending'
  | 'approved'
  | 'rejected'

export type Order = {
  id: string
  user: string
  project: string
  address: string
  /** Minutes before "now" (the demo's clock is fixed, see `ordersNow`). */
  minutesAgo: number
  status: OrderStatus
}

/** The demo's "now": a fixed instant, so the server and client agree. */
export const ordersNow = Date.UTC(2026, 8, 29, 12, 0)

const users = [
  'Natali Craig',
  'Kate Morrison',
  'Drew Cano',
  'Orlando Diggs',
  'Andi Lane',
  'Koray Okumus',
  'Melody Macy',
  'Lana Steiner',
]
const projects = [
  'Landing Page',
  'CRM Admin pages',
  'Client Project',
  'Admin Dashboard',
  'App Landing Page',
  'Blog Redesign',
]
const addresses = [
  'Meadow Lane Oakland',
  'Larry San Francisco',
  'Bagwell Avenue Ocala',
  'Washburn Baton Rouge',
  'Nest Lane Olivette',
  'Sunset Blvd Los Angeles',
]
const statuses: OrderStatus[] = [
  'progress',
  'complete',
  'pending',
  'approved',
  'rejected',
  'complete',
  'progress',
]
const minutes = [0, 1, 60, 60 * 24, 60 * 24 * 3, 60 * 24 * 8]

export const orders: Order[] = Array.from({ length: 24 }, (_, index) => ({
  id: `#CM${9801 + index}`,
  user: users[index % users.length],
  project: projects[(index * 5) % projects.length],
  address: addresses[(index * 7) % addresses.length],
  minutesAgo:
    minutes[index % minutes.length] + Math.floor(index / 6) * 60 * 24 * 11,
  status: statuses[index % statuses.length],
}))

/** Initials of a placeholder name, for the avatars. */
export const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

/** Avatar tints: the kit's secondary colours, with static black initials. */
export const avatarTints = [
  'bg-purple',
  'bg-blue',
  'bg-mint',
  'bg-cyan',
  'bg-green',
  'bg-yellow',
  'bg-orange',
  'bg-indigo',
] as const

export const avatarTint = (name: string) =>
  avatarTints[
    [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      avatarTints.length
  ]

/** Right sidebar. Times are minutes before `ordersNow`. */
export const notificationTimes = [0, 59, 60 * 12, 60 * 12 + 1]
export const notificationKinds = ['bug', 'user', 'bug', 'broadcast'] as const

export const activities = [
  { user: 'Natali Craig', minutesAgo: 0 },
  { user: 'Drew Cano', minutesAgo: 59 },
  { user: 'Orlando Diggs', minutesAgo: 60 * 12 },
  { user: 'Andi Lane', minutesAgo: 60 * 24 },
  { user: 'Kate Morrison', minutesAgo: 60 * 24 * 2 },
]

export const contacts = [
  'Natali Craig',
  'Drew Cano',
  'Orlando Diggs',
  'Andi Lane',
  'Kate Morrison',
  'Koray Okumus',
]
