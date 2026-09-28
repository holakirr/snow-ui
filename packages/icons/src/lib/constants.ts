import type { IconSize, IconWeight } from './types'

export const ICON_WEIGHTS: { [K in IconWeight]: K } = {
  bold: 'bold',
  duotone: 'duotone',
  fill: 'fill',
  light: 'light',
  regular: 'regular',
  thin: 'thin',
}

export const ICON_SIZES: { [K in IconSize]: K } = {
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  40: 40,
  48: 48,
  80: 80,
}

export const STATUSES = {
  progress: 'progress',
  error: 'error',
  success: 'success',
}
