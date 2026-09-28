import type { DateTypeEnum } from '../types'

export const DATE_TYPES: DateTypeEnum[] = [
  'date',
  'month',
  'year',
  'hours',
  'minutes',
]

export const SCHEDULE_CONFIG = {
  MIN_HOUR: 7,
  MAX_HOUR: 20,
} as const
