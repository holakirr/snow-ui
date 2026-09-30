import type { ChartConfig } from '../config'

/**
 * Data of the SnowUI dashboards (Figma "Dashboard - Light mode"), for the
 * stories and tests. Values are read off the Figma drawings.
 */

/** "Total Users": this year against last year. */
export const totalUsers = [
  { month: 'Jan', thisYear: 12000, lastYear: 5000 },
  { month: 'Feb', thisYear: 8500, lastYear: 13000 },
  { month: 'Mar', thisYear: 14500, lastYear: 20500 },
  { month: 'Apr', thisYear: 24500, lastYear: 7000 },
  { month: 'May', thisYear: 28500, lastYear: 14500 },
  { month: 'Jun', thisYear: 21000, lastYear: 25000 },
  { month: 'Jul', thisYear: 24000, lastYear: 29500 },
]

export const totalUsersConfig = {
  thisYear: { label: 'This year', color: 'primary' },
  lastYear: {
    label: 'Last year',
    // Figma: Secondary/Indigo in light; a neutral grey in dark, where Primary
    // (this year) turns indigo itself.
    color: 'light-dark(var(--color-indigo), var(--color-black-40))',
    dashed: true,
    opacity: 0,
  },
} satisfies ChartConfig

/** "Revenue": the current week, projected after Apr, against the previous week. */
export const revenue = [
  { month: 'Jan', current: 8000, previous: 6000 },
  { month: 'Feb', current: 16000, previous: 11000 },
  { month: 'Mar', current: 11000, previous: 15500 },
  { month: 'Apr', current: 21000, previous: 5500 },
  { month: 'May', current: 20500, previous: 13000 },
  { month: 'Jun', current: 26000, previous: 29000 },
]

export const revenueConfig = {
  current: { label: 'Current week', color: 'primary' },
  previous: { label: 'Previous week', color: 'cyan', dashed: true },
} satisfies ChartConfig

/** "Traffic by Device": one colour per device. */
export const trafficByDevice = [
  { device: 'Linux', users: 15000 },
  { device: 'Mac', users: 26250 },
  { device: 'iOS', users: 18750 },
  { device: 'Windows', users: 30000 },
  { device: 'Android', users: 11250 },
  { device: 'Other', users: 22500 },
]

export const trafficByDeviceConfig = {
  users: { label: 'Users' },
  Linux: { color: 'cyan' },
  Mac: { color: 'mint' },
  iOS: { color: 'primary' },
  Windows: { color: 'blue' },
  Android: { color: 'purple' },
  Other: { color: 'green' },
} satisfies ChartConfig

/** "Projections vs Actuals": the actual value, and the rest of the projection stacked on top. */
export const projections = [
  { month: 'Jan', actual: 11250, remaining: 3750 },
  { month: 'Feb', actual: 22500, remaining: 3750 },
  { month: 'Mar', actual: 15000, remaining: 3750 },
  { month: 'Apr', actual: 26250, remaining: 3750 },
  { month: 'May', actual: 7500, remaining: 3750 },
  { month: 'Jun', actual: 18750, remaining: 3750 },
]

export const projectionsConfig = {
  actual: { label: 'Actual' },
  remaining: { label: 'Rest of projection', opacity: 0.2 },
  Jan: { color: 'cyan' },
  Feb: { color: 'mint' },
  Mar: { color: 'primary' },
  Apr: { color: 'blue' },
  May: { color: 'purple' },
  Jun: { color: 'green' },
} satisfies ChartConfig

/** "Traffic by Location": shares of visits. */
export const trafficByLocation = [
  { country: 'United States', visits: 52.1 },
  { country: 'Canada', visits: 22.8 },
  { country: 'Mexico', visits: 13.9 },
  { country: 'Other', visits: 11.2 },
]

export const trafficByLocationConfig = {
  'United States': { color: 'primary' },
  Canada: { color: 'blue' },
  Mexico: { color: 'green' },
  Other: { color: 'cyan' },
} satisfies ChartConfig

/** Eight series over a week, for the palette. */
export const weekly = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
  (day, index) => ({
    day,
    ...Object.fromEntries(
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((key, series) => [
        key,
        Math.round(
          4000 + series * 2500 + 3000 * Math.sin((index + series) / 1.6),
        ),
      ]),
    ),
  }),
)

export const weeklyConfig: ChartConfig = {
  a: { label: 'Search' },
  b: { label: 'Direct' },
  c: { label: 'Social' },
  d: { label: 'Email' },
  e: { label: 'Referral' },
  f: { label: 'Ads' },
  g: { label: 'Partners' },
  h: { label: 'Other' },
}
