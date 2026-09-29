// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-70296
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Input/Select.tsx
// component=Select
import figma from 'figma'
import { type AttrsOf, jsx, uiImport } from '../../code-connect/helpers'
import type { SelectItemProps, SelectTriggerProps } from './Select'

// The kit has no Select set: the field is the 2-row Input with a trailing
// ArrowLineUpDown, and the options are the Figma "Popover" (Count 1–8 option
// slots), which this connects to. The same Popover also draws DropdownMenu
// and ContextMenu menus, so this is one of the snippets Dev Mode offers for
// it.
const instance = figma.selectedInstance

const count =
  instance.getEnum('Count', {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
  }) ?? 3

const trigger = { 'aria-label': 'Option' } satisfies AttrsOf<SelectTriggerProps>

const items = Array.from({ length: count }, (_, index) => {
  const item = {
    value: `option-${index + 1}`,
  } satisfies AttrsOf<SelectItemProps>
  return `\n    ${jsx('SelectItem', item, `Option ${index + 1}`)}`
}).join('')

export default {
  example: figma.tsx`<Select>
  ${jsx('SelectTrigger', trigger, '\n    <SelectValue placeholder="Select" />\n  ')}
  <SelectContent>${items}
  </SelectContent>
</Select>`,
  imports: [
    uiImport(
      'Select',
      'SelectContent',
      'SelectItem',
      'SelectTrigger',
      'SelectValue',
    ),
  ],
  id: 'Select',
  metadata: { nestable: false },
}
