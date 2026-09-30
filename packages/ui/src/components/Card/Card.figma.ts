// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-44142
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Card/Card.tsx
// component=Card
import figma from 'figma'
import { type AttrsOf, jsx, uiImport } from '../../code-connect/helpers'
import type { CardProps } from './Card'

// Figma "Card": Count (1–4 rows of content) × State (Static / Default /
// Hover / Selected) × Vertical. Default is the interactive card (Hover is
// its pointer state), Hover drawn at rest is `bordered`. Card has no layout
// props: its content (Count, Vertical) is yours.
const instance = figma.selectedInstance

const state =
  instance.getEnum('State', {
    Static: {},
    Default: { interactive: true },
    Hover: { bordered: true },
    Selected: { selected: true },
  } satisfies Record<
    string,
    Pick<CardProps, 'interactive' | 'bordered' | 'selected'>
  >) ?? {}

const count = instance.getEnum('Count', { '1': 1, '2': 2, '3': 3, '4': 4 }) ?? 1

// The Card stacks its rows 4px apart itself, like the Figma auto-layout.
const attrs = {
  ...state,
} satisfies AttrsOf<CardProps>

const rows = Array.from(
  { length: count },
  (_, index) => `\n  <Typography>Text ${index + 1}</Typography>`,
).join('')

export default {
  example: figma.tsx`${jsx('Card', attrs, `${rows}\n`)}`,
  imports: [uiImport('Card', 'Typography')],
  id: 'Card',
  metadata: { nestable: false },
}
