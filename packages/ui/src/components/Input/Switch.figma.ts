// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33319-52352
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Input/Switch.tsx
// component=Switch
import figma from 'figma'
import { type AttrsOf, isOn, jsx, uiImport } from '../../code-connect/helpers'
import type { Switch } from './Switch'

// Figma "Switch": off / on × Default / Hover (the pointer state). The audit
// of the kit didn't record the name of the on/off variant, so this reads the
// names the kit uses for it elsewhere ("Select" on Checkbox and Radio). Check
// it in Figma before publishing (CONTRIBUTING.md, "Figma Code Connect").
type SwitchProps = Parameters<typeof Switch>[0]

const attrs = {
  defaultChecked: isOn('Select', 'Checked', 'On', 'Active'),
  'aria-label': 'Label',
} satisfies AttrsOf<SwitchProps>

export default {
  example: figma.tsx`${jsx('Switch', attrs)}`,
  imports: [uiImport('Switch')],
  id: 'Switch',
  metadata: { nestable: true },
}
