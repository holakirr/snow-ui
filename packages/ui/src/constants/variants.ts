import type { ButtonVariant, Direction, ToggleVariant } from '../types'

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

export const TOGGLE_VARIANTS: { [K in ToggleVariant]: K } = {
  borderless: 'borderless',
  outline: 'outline',
}
