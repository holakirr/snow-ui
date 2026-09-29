// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-60046
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Input/Checkbox.tsx
// component=Checkbox
import figma from 'figma'
import { type AttrsOf, code, jsx, uiImport } from '../../code-connect/helpers'
import type { CheckboxProps } from './Checkbox'

// Figma "Checkbox": Select (True / False / Multiple) × State (Default /
// Hover: the pointer state). "Multiple" is the indeterminate state.
const instance = figma.selectedInstance

const checked = instance.getEnum('Select', {
  True: true,
  False: false,
  Multiple: 'indeterminate',
} satisfies Record<string, CheckboxProps['defaultChecked']>)

const attrs = {
  defaultChecked:
    checked === 'indeterminate' ? code("'indeterminate'") : checked,
  'aria-label': 'Label',
} satisfies AttrsOf<CheckboxProps>

export default {
  example: figma.tsx`${jsx('Checkbox', attrs)}`,
  imports: [uiImport('Checkbox')],
  id: 'Checkbox',
  metadata: { nestable: true },
}
