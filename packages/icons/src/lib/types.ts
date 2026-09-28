import type {
  ComponentPropsWithoutRef,
  FC,
  ReactElement,
  RefAttributes,
} from 'react'

export type IconSize = 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80

export type IconWeight =
  | 'thin'
  | 'light'
  | 'regular'
  | 'bold'
  | 'fill'
  | 'duotone'

/**
 * Preset sizes get autocomplete, but any number (px) or CSS length string is accepted.
 */
export type IconSizeProp = IconSize | (number & {}) | (string & {})

export interface IconProps
  extends ComponentPropsWithoutRef<'svg'>,
    RefAttributes<SVGSVGElement> {
  alt?: string
  color?: string
  size?: IconSizeProp
  weight?: IconWeight
  mirrored?: boolean
}

export type CustomIconWeights = Map<IconWeight, ReactElement>

export interface IconBaseProps extends IconProps {
  weights: CustomIconWeights
}

/**
 * Represents the properties for a custom icon.
 */
export interface CustomIconProps extends IconProps {}

export type Icon = FC<CustomIconProps>

export type BaseIcon = FC<IconBaseProps>

export type Status = 'progress' | 'error' | 'success'
