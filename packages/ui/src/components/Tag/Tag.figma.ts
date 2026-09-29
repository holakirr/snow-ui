// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33307-661
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Tag/Tag.tsx
// component=Tag
import figma from 'figma'
import {
  type AttrsOf,
  code,
  isOn,
  jsx,
  uiImport,
} from '../../code-connect/helpers'
import type { TagProps } from './Tag'

// Figma "Tag": Type (Default / Left arrow / Right arrow) × State (Default /
// Hover / Active / Static) with the Left Icon (the Dot) and Right Icon (the
// close icon) variants. Hover is the pointer state of Default. The arrow
// types have no icons; they map to the shapes that follow the text
// direction.
const instance = figma.selectedInstance

const shape =
  instance.getEnum('Type', {
    Default: 'default',
    'Left arrow': 'arrow-start',
    'Right arrow': 'arrow-end',
  } satisfies Record<string, TagProps['shape']>) ?? 'default'

const state =
  instance.getEnum('State', {
    Default: 'default',
    Hover: 'default',
    Active: 'active',
    Static: 'static',
  } satisfies Record<string, TagProps['state']>) ?? 'default'

const plain = shape === 'default'

const attrs = {
  label: 'Tag',
  shape: plain ? undefined : shape,
  state: state === 'default' ? undefined : state,
  dot: plain && isOn('Left Icon'),
  onRemove: plain && isOn('Right Icon') ? code('() => remove()') : undefined,
} satisfies AttrsOf<TagProps>

export default {
  example: figma.tsx`${jsx('Tag', attrs)}`,
  imports: [uiImport('Tag')],
  id: 'Tag',
  metadata: { nestable: true },
}
