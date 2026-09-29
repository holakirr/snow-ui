// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=32792-840
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Badge/Badge.tsx
// component=Badge
import figma from 'figma'
import { type AttrsOf, jsx, uiImport } from '../../code-connect/helpers'
import type { BadgeProps } from './Badge'

// Figma "Badge": Type (Dot / Number). `Badge` wraps the element it sits on
// and puts the badge on its top end corner; on an icon, `IconBox`'s `badge`
// prop does the same (the Figma "Icon" Badge variant).
const instance = figma.selectedInstance

const number = instance.getEnum('Type', { Dot: false, Number: true }) ?? false

const attrs = {
  content: number ? '1' : undefined,
} satisfies AttrsOf<BadgeProps>

export default {
  example: figma.tsx`${jsx('Badge', attrs, '\n  {/* the element it sits on */}\n')}`,
  imports: [uiImport('Badge')],
  id: 'Badge',
  metadata: { nestable: true },
}
