// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33257-43265
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Text/KBD.tsx
// component=KBD
import figma from 'figma'
import { type AttrsOf, code, jsx, uiImport } from '../../code-connect/helpers'
import type { KBDProps } from './KBD'

// Figma "Kbd": Variant (Solid / Border).
const instance = figma.selectedInstance

const variant =
  instance.getEnum('Variant', {
    Solid: 'solid',
    Border: 'border',
  } satisfies Record<string, KBDProps['variant']>) ?? 'solid'

const attrs = {
  keys: code("['⌘', 'K']"),
  variant: variant === 'solid' ? undefined : variant,
} satisfies AttrsOf<KBDProps>

export default {
  example: figma.tsx`${jsx('KBD', attrs)}`,
  imports: [uiImport('KBD')],
  id: 'KBD',
  metadata: { nestable: true },
}
