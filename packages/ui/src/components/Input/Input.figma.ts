// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33319-47513
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Input/Input.tsx
// component=Input
import figma from 'figma'
import { type AttrsOf, jsx, uiImport } from '../../code-connect/helpers'
import type { InputProps } from './Input'

// Figma "Input": Type (1 row / 2 row vertical / 2 row horizontal) × State
// (Default / Hover / Focus: pointer and focus states; Static: read-only).
// Both 2-row types are the `title` prop; the library puts the title above
// the value.
const instance = figma.selectedInstance

const rows =
  instance.getEnum('Type', {
    '1 row': 1,
    '2 row vertical': 2,
    '2 row horizontal': 2,
  }) ?? 1

const readOnly = instance.getEnum('State', { Static: true }) ?? false

const attrs = {
  title: rows === 2 ? 'Title' : undefined,
  placeholder: 'Placeholder',
  readOnly,
} satisfies AttrsOf<InputProps>

export default {
  example: figma.tsx`${jsx('Input', attrs)}`,
  imports: [uiImport('Input')],
  id: 'Input',
  metadata: { nestable: true },
}
