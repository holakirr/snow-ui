// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-43615
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Button/Button.tsx
// component=Button
import figma from 'figma'
import {
  type AttrsOf,
  code,
  iconsImport,
  isOn,
  jsx,
  uiImport,
} from '../../code-connect/helpers'
import type { ButtonProps } from './Button'

// Figma "Button": Size × Variant × State (Default / Hover: the pointer
// state, not a prop) with the True / False variants Left Icon, Text and
// Right Icon.
const instance = figma.selectedInstance

const size =
  instance.getEnum('Size', {
    Small: 'sm',
    Medium: 'md',
    Large: 'lg',
  } satisfies Record<string, ButtonProps['size']>) ?? 'sm'

const variant =
  instance.getEnum('Variant', {
    Borderless: 'borderless',
    Gray: 'gray',
    Outline: 'outline',
    Filled: 'filled',
    Bare: 'bare',
  } satisfies Record<string, ButtonProps['variant']>) ?? 'borderless'

const hasLabel = isOn('Text')
const hasStart = isOn('Left Icon')
const hasEnd = isOn('Right Icon')
const iconOnly = hasStart && !hasEnd && !hasLabel

// The Figma icon sizes, next to a label or alone. Library icons set their own
// width, so the size goes to the icon (the kit's placeholder, DefaultIcon).
const iconSizes = iconOnly
  ? { sm: 16, md: 20, lg: 24 }
  : { sm: 12, md: 16, lg: 20 }
const icon = code(`<DefaultIcon size={${iconSizes[size]}} />`)

const attrs = {
  variant: variant === 'borderless' ? undefined : variant,
  size: size === 'sm' ? undefined : size,
  label: hasLabel ? 'Button' : undefined,
  startContent: hasStart ? icon : undefined,
  endContent: hasEnd ? icon : undefined,
  'aria-label': iconOnly ? 'Button' : undefined,
} satisfies AttrsOf<ButtonProps>

export default {
  example: figma.tsx`${jsx('Button', attrs)}`,
  imports: [
    uiImport('Button'),
    ...(hasStart || hasEnd ? [iconsImport('DefaultIcon')] : []),
  ],
  id: 'Button',
  metadata: { nestable: true },
}
