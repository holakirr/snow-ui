// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-46913
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Tabs/Tabs.tsx
// component=Tabs
import figma from 'figma'
import {
  type AttrsOf,
  code,
  iconsImport,
  jsx,
  uiImport,
} from '../../code-connect/helpers'
import type { TabsListProps, TabsTriggerProps } from './Tabs'

// Figma "Tab": Size × Variant (Underline / Pill / Icon-toggle / Solid) ×
// State (Active / Inactive / Hover). An Underline instance is one tab; the
// segmented variants are the whole control. Hover is the pointer state.
const instance = figma.selectedInstance

const variant =
  instance.getEnum('Variant', {
    Underline: 'line',
    Pill: 'pill',
    'Icon-toggle': 'icon-toggle',
    Solid: 'solid',
  } satisfies Record<string, TabsListProps['variant']>) ?? 'line'

// The audits recorded the sizes both as Small / Medium / Large and S / M / L.
const size =
  instance.getEnum('Size', {
    Small: 'sm',
    S: 'sm',
    Medium: 'md',
    M: 'md',
    Large: 'lg',
    L: 'lg',
  } satisfies Record<string, TabsListProps['size']>) ?? 'md'

// An inactive Underline tab: another tab is the selected one.
const active = instance.getEnum('State', { Inactive: false }) ?? true

const list = {
  variant: variant === 'line' ? undefined : variant,
  size: size === 'md' ? undefined : size,
  'aria-label': 'Sections',
} satisfies AttrsOf<TabsListProps>

const iconSize = { sm: 12, md: 16, lg: 20 }[size]
const trigger = (value: string, label: string) => {
  const attrs = {
    value,
    icon:
      variant === 'icon-toggle'
        ? code(`<DefaultIcon size={${iconSize}} />`)
        : undefined,
  } satisfies AttrsOf<TabsTriggerProps>
  return jsx('TabsTrigger', attrs, label)
}

const triggers = [trigger('tab-1', 'Tab 1'), trigger('tab-2', 'Tab 2')]
  .map((line) => `\n    ${line}`)
  .join('')

export default {
  example: figma.tsx`<Tabs defaultValue="${active ? 'tab-1' : 'tab-2'}">
  ${jsx('TabsList', list, `${triggers}\n  `)}
  <TabsContent value="tab-1">…</TabsContent>
  <TabsContent value="tab-2">…</TabsContent>
</Tabs>`,
  imports: [
    uiImport('Tabs', 'TabsContent', 'TabsList', 'TabsTrigger'),
    ...(variant === 'icon-toggle' ? [iconsImport('DefaultIcon')] : []),
  ],
  id: 'Tabs',
  metadata: { nestable: false },
}
