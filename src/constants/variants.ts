import type { ButtonVariant, Direction } from '../types'

export const BUTTON_VARIANTS: { [K in ButtonVariant]: K } = {
  borderless: 'borderless',
  gray: 'gray',
  outline: 'outline',
  filled: 'filled',
}

export const SEPARATOR_DIRECTIONS: { [K in Direction]: K } = {
  horizontal: 'horizontal',
  vertical: 'vertical',
}
