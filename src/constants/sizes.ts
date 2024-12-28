import type { SimpleSize, Size, TextSize } from '../types'

export const SIMPLE_SIZES: { [K in SimpleSize]: K } = {
  sm: 'sm',
  lg: 'lg',
}

export const SIZES: { [K in Size]: K } = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export const TEXT_SIZES: { [K in TextSize]: K } = {
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  24: 24,
  32: 32,
  48: 48,
  64: 64,
}
