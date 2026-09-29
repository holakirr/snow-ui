// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-74134
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Input/RadioGroup.tsx
// component=RadioGroup
import figma from 'figma'
import { type AttrsOf, isOn, jsx, uiImport } from '../../code-connect/helpers'
import type { RadioGroupItemProps, RadioGroupProps } from './RadioGroup'

// Figma "Radio": Select (True / False) × State (Default / Hover: the pointer
// state). One radio is a `RadioGroupItem`; it lives in a `RadioGroup`, whose
// value selects it.
const selected = isOn('Select')

const group = {
  defaultValue: selected ? 'option' : undefined,
  'aria-label': 'Options',
} satisfies AttrsOf<RadioGroupProps>

const item = {
  value: 'option',
  'aria-label': 'Option',
} satisfies AttrsOf<RadioGroupItemProps>

export default {
  example: figma.tsx`${jsx('RadioGroup', group, `\n  ${jsx('RadioGroupItem', item)}\n`)}`,
  imports: [uiImport('RadioGroup', 'RadioGroupItem')],
  id: 'RadioGroup',
  metadata: { nestable: true },
}
