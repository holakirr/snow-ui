// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33296-44393
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Toaster/Toaster.tsx
// component=Toaster
import figma from 'figma'
import { isOn, uiImport } from '../../code-connect/helpers'
import type { toast } from '../../hooks/use-toast'

// Figma "Toast": State (Failure / Successful) × Big. A toast is shown with
// `toast()`; `<Toaster />` renders them, once in the app.
type ToastOptions = Parameters<typeof toast>[0]

const instance = figma.selectedInstance

const status = instance.getEnum('State', {
  Failure: 'error',
  Successful: 'success',
} satisfies Record<string, ToastOptions['status']>)

const size = (isOn('Big') ? 'lg' : 'sm') satisfies ToastOptions['size']

const options = [
  status && `status: '${status}'`,
  size === 'lg' && `size: 'lg'`,
  status === 'error' ? `title: 'Something went wrong'` : `title: 'Saved'`,
]
  .filter(Boolean)
  .join(', ')

export default {
  example: figma.tsx`toast({ ${options} })

// Once, in the app layout:
<Toaster />`,
  imports: [uiImport('toast', 'Toaster')],
  id: 'Toaster',
  metadata: { nestable: false },
}
