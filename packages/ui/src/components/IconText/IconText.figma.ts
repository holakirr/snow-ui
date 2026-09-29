// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33302-438
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/IconText/IconText.tsx
// component=IconText
import figma from 'figma'
import {
  type AttrsOf,
  code,
  iconsImport,
  isOn,
  jsx,
  uiImport,
} from '../../code-connect/helpers'
import type { IconTextProps } from './IconText'

// Figma "IconText": Vertical × Flip, a 16px icon and 14 Regular text. The
// hoverable version is the Figma "Frame" (`interactive`, `active`).
const attrs = {
  icon: code('<IconBox size={16}><DefaultIcon /></IconBox>'),
  vertical: isOn('Vertical'),
  flip: isOn('Flip'),
} satisfies AttrsOf<IconTextProps>

export default {
  example: figma.tsx`${jsx('IconText', attrs, 'Text')}`,
  imports: [uiImport('IconBox', 'IconText'), iconsImport('DefaultIcon')],
  id: 'IconText',
  metadata: { nestable: true },
}
