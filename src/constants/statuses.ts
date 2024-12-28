import type { Status, StatusExpanded, StatusNotify } from '../types'

export const STATUSES_NOTIFY: {
  [K in StatusNotify]: K
} = {
  success: 'success',
  error: 'error',
}

export const STATUSES: {
  [K in Status]: K
} = {
  ...STATUSES_NOTIFY,
  progress: 'progress',
}

export const STATUSES_EXPANDED: {
  [K in StatusExpanded]: K
} = {
  ...STATUSES_NOTIFY,
  warning: 'warning',
  default: 'default',
  info: 'info',
}
