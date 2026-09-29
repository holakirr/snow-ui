// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-45026
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Tooltip/Tooltip.tsx
// component=Tooltip
import figma from 'figma'
import { type AttrsOf, jsx, uiImport } from '../../code-connect/helpers'
import type { TooltipContentProps } from './Tooltip'

// Figma "Tooltip": Variant (Dark / Light). A `TooltipProvider` must be an
// ancestor (one for the app is enough).
const instance = figma.selectedInstance

const variant =
  instance.getEnum('Variant', {
    Dark: 'dark',
    Light: 'light',
  } satisfies Record<string, TooltipContentProps['variant']>) ?? 'dark'

const content = {
  variant: variant === 'dark' ? undefined : variant,
} satisfies AttrsOf<TooltipContentProps>

export default {
  example: figma.tsx`<Tooltip>
  <TooltipTrigger asChild>
    <Button label="Hover me" />
  </TooltipTrigger>
  ${jsx('TooltipContent', content, 'Tooltip')}
</Tooltip>`,
  imports: [uiImport('Button', 'Tooltip', 'TooltipContent', 'TooltipTrigger')],
  id: 'Tooltip',
  metadata: { nestable: false },
}
