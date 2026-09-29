// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33509-43630
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Search/Search.tsx
// component=Search
import figma from 'figma'
import { type AttrsOf, code, jsx, uiImport } from '../../code-connect/helpers'
import type { SearchProps } from './Search'

// Figma "Search": Type (Gray / Outline / Typing) × State (Default / Hover /
// Focus: pointer and focus states; Static). "Typing" is the Outline field
// with a value, which shows the clear button instead of the shortcut hint.
const instance = figma.selectedInstance

const type = instance.getEnum('Type', {
  Gray: 'gray',
  Outline: 'outline',
  Typing: 'typing',
})

const variant = (
  type === 'gray' || type === undefined ? 'gray' : 'outline'
) satisfies SearchProps['variant']
const typing = type === 'typing'

const attrs = {
  variant: variant === 'gray' ? undefined : variant,
  shortcut: code("['/']"),
  value: typing ? code('query') : undefined,
  onValueChange: typing ? code('setQuery') : undefined,
  readOnly: instance.getEnum('State', { Static: true }) ?? false,
} satisfies AttrsOf<SearchProps>

export default {
  example: figma.tsx`${jsx('Search', attrs)}`,
  imports: [uiImport('Search')],
  id: 'Search',
  metadata: { nestable: true },
}
