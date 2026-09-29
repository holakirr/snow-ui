// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33138-1011
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/IconBox/IconBox.tsx
// component=IconBox
import figma from 'figma'
import {
  type AttrsOf,
  iconsImport,
  isOn,
  jsx,
  uiImport,
} from '../../code-connect/helpers'
import type { IconBoxProps } from './IconBox'

// Figma "Icon": the Icon swap × Size (12–80) × Background × Badge. The
// swapped icon isn't connected, so the example shows the kit's placeholder
// icon (DefaultIcon); IconBox stretches its child to `size`.
const instance = figma.selectedInstance

const size =
  instance.getEnum('Size', {
    '12': 12,
    '16': 16,
    '20': 20,
    '24': 24,
    '28': 28,
    '32': 32,
    '40': 40,
    '48': 48,
    '80': 80,
  } satisfies Record<string, IconBoxProps['size']>) ?? 24

const attrs = {
  size: size === 24 ? undefined : size,
  background: isOn('Background'),
  badge: isOn('Badge'),
} satisfies AttrsOf<IconBoxProps>

export default {
  example: figma.tsx`${jsx('IconBox', attrs, '\n  <DefaultIcon />\n')}`,
  imports: [uiImport('IconBox'), iconsImport('DefaultIcon')],
  id: 'IconBox',
  metadata: { nestable: true },
}
