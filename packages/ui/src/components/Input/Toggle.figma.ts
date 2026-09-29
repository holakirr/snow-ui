// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-46913
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Input/Toggle.tsx
// component=Toggle
import figma from 'figma'
import { type AttrsOf, jsx, uiImport } from '../../code-connect/helpers'
import type { ToggleProps } from './Toggle'

// The kit has no Toggle set: a toggle is an item of the Figma "Tab"
// segmented controls (a Borderless button, Gray when on; white with a shadow
// in the Pill control), so this is a second snippet for the Tab set, next to
// `Tabs`. Variant Pill → `pill`, Solid (and the others) → the default
// `borderless`; State Active → pressed.
const instance = figma.selectedInstance

const variant =
  instance.getEnum('Variant', {
    Pill: 'pill',
    'Icon-toggle': 'pill',
    Solid: 'borderless',
    Underline: 'borderless',
  } satisfies Record<string, ToggleProps['variant']>) ?? 'borderless'

// The audits recorded the sizes both as Small / Medium / Large and S / M / L.
const size =
  instance.getEnum('Size', {
    Small: 'sm',
    S: 'sm',
    Medium: 'md',
    M: 'md',
    Large: 'lg',
    L: 'lg',
  } satisfies Record<string, ToggleProps['size']>) ?? 'md'

const attrs = {
  variant: variant === 'borderless' ? undefined : variant,
  size: size === 'md' ? undefined : size,
  defaultPressed: instance.getEnum('State', { Active: true }) ?? false,
} satisfies AttrsOf<ToggleProps>

export default {
  example: figma.tsx`${jsx('Toggle', attrs, 'Label')}`,
  imports: [uiImport('Toggle')],
  id: 'Toggle',
  metadata: { nestable: true },
}
