// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-239816
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Link/Link.tsx
// component=Link
import figma from 'figma'
import { type AttrsOf, jsx, uiImport } from '../../code-connect/helpers'
import type { LinkProps } from './Link'

// Figma "Link": the Text property × Variant (Default / Arrow / External) ×
// State (Default / Hover: the pointer state).
const instance = figma.selectedInstance

const variant =
  instance.getEnum('Variant', {
    Default: 'default',
    Arrow: 'arrow',
    External: 'external',
  } satisfies Record<string, LinkProps['variant']>) ?? 'default'

const text = (() => {
  try {
    return instance.getString('Text') || 'Link'
  } catch {
    return 'Link'
  }
})()

const attrs = {
  href: variant === 'external' ? 'https://example.com' : '/',
  variant: variant === 'default' ? undefined : variant,
} satisfies AttrsOf<LinkProps>

export default {
  example: figma.tsx`${jsx('Link', attrs, text)}`,
  imports: [uiImport('Link')],
  id: 'Link',
  metadata: { nestable: true },
}
