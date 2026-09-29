import { StatusIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef } from 'react'
import { expect, waitFor } from 'storybook/test'

import { toast } from '../../hooks'
import type { SimpleSize, StatusNotify } from '../../types'
import { Button } from '../Button'
import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast'
import { Toaster } from './Toaster'

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33296-44393',
    },
    docs: {
      description: {
        component:
          'Toasts appear at the bottom and close after 3 seconds ("stay 3s" in the Figma guidance). Call `toast()` from anywhere and render `<Toaster />` once. `toast()` feeds a shared store, so every mounted `<Toaster />` shows its toasts: to run independent toasters, give each an `id` and pass the same `toasterId` to `toast()`.',
      },
      // Each story in its own iframe: the fixed viewport then sits at the
      // bottom of that story, and its toasts don't show up in the others.
      story: { inline: false, iframeHeight: 360 },
    },
  },
}

export default meta
type Story = StoryObj<typeof Toaster>

const variants: { status: StatusNotify; size: SimpleSize; title: string }[] = [
  { status: 'success', size: 'lg', title: 'Done' },
  { status: 'error', size: 'lg', title: 'Something Wrong' },
  { status: 'success', size: 'sm', title: 'Done' },
  { status: 'error', size: 'sm', title: 'Something Wrong' },
]

/** The four Figma variants (State × Big), rendered in place without a timer. */
export const AllVariants: Story = {
  render: () => (
    <ToastProvider duration={Number.POSITIVE_INFINITY}>
      {variants.map(({ status, size, title }) => (
        <Toast key={`${status}-${size}`} size={size} open>
          <StatusIcon
            status={status}
            size={size === 'lg' ? 20 : 16}
            className="shrink-0"
          />
          <ToastTitle size={size}>{title}</ToastTitle>
        </Toast>
      ))}
      <ToastViewport className="static left-auto w-auto translate-x-0 flex-col items-start p-0" />
    </ToastProvider>
  ),
}

export const AllVariantsDark: Story = {
  ...AllVariants,
  globals: { theme: 'dark' },
}

/**
 * Right-to-left text: the status icon is on the right, the close button on
 * the left, and toasts are swiped away to the left.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <ToastProvider duration={Number.POSITIVE_INFINITY}>
      <Toast size="lg" open>
        <StatusIcon status="success" size={20} className="shrink-0" />
        <ToastTitle size="lg">تم الحفظ</ToastTitle>
        <ToastClose size="lg" />
      </Toast>
      <ToastViewport className="static left-auto w-auto translate-x-0 flex-col items-start p-0" />
    </ToastProvider>
  ),
  play: async ({ canvas }) => {
    const title = canvas.getByText('تم الحفظ')
    const close = canvas.getByRole('button', { name: 'Close' })
    await expect(close.getBoundingClientRect().right).toBeLessThanOrEqual(
      title.getBoundingClientRect().left,
    )
    await expect(
      canvas.getByRole('region', { name: /notifications/i }),
    ).toBeInTheDocument()
  },
}

const ToastExample = () => (
  <>
    <Button
      onClick={() =>
        toast({
          title: 'Heads up!',
          description: 'This is a toast message',
        })
      }
      variant="filled"
    >
      Show Toast
    </Button>
    <Toaster />
  </>
)

export const Default: Story = {
  render: () => <ToastExample />,
}

const LargeToastExample = () => (
  <>
    <Button
      onClick={() =>
        toast({
          size: 'lg',
          status: 'success',
          title: 'Done',
        })
      }
      variant="filled"
    >
      Show Large Toast
    </Button>
    <Toaster />
  </>
)

export const Large: Story = {
  render: () => <LargeToastExample />,
}

const ToastWithActionExample = () => (
  <>
    <Button
      onClick={() =>
        toast({
          size: 'lg',
          title: 'Deleted',
          action: (
            <Button
              variant="borderless"
              size="sm"
              className="text-static-white hover:bg-static-white/10"
            >
              Undo
            </Button>
          ),
        })
      }
    >
      Show Toast with action
    </Button>
    <Toaster />
  </>
)

/**
 * A toast with an `action` stays until it is dismissed, with the close
 * button it gets by default, unless you give it a `duration`.
 */
export const WithAction: Story = {
  render: () => <ToastWithActionExample />,
}

const ToastWithStatusExample = () => (
  <div className="flex gap-2">
    <Button onClick={() => toast({ status: 'success', title: 'Done' })}>
      Success
    </Button>
    <Button
      onClick={() => toast({ status: 'error', title: 'Something Wrong' })}
    >
      Failure
    </Button>
    <Toaster />
  </div>
)

export const WithStatus: Story = {
  render: () => <ToastWithStatusExample />,
}

const ClosableExample = () => (
  <>
    <Button
      onClick={() =>
        toast({
          title: 'Stays until closed',
          duration: Number.POSITIVE_INFINITY,
        })
      }
    >
      Show closable toast
    </Button>
    <Toaster />
  </>
)

/**
 * `closable` adds a close button, which the Figma toast doesn't have. It is
 * on by default for toasts with an `action` or an infinite `duration`.
 */
export const Closable: Story = {
  render: () => <ClosableExample />,
  play: async ({ canvas, userEvent, step }) => {
    await step(
      'the button shows a toast in the notifications region',
      async () => {
        await userEvent.click(
          canvas.getByRole('button', { name: 'Show closable toast' }),
        )
        const toast = await canvas.findByText('Stays until closed')
        await expect(
          canvas.getByRole('region', { name: /notifications/i }),
        ).toContainElement(toast)
      },
    )

    await step('its close button dismisses it', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Close' }))
      await waitFor(() =>
        expect(
          canvas.queryByText('Stays until closed'),
        ).not.toBeInTheDocument(),
      )
    })
  },
}

const stackedToasts: Parameters<typeof toast>[0][] = [
  { status: 'success', title: 'Report exported' },
  { title: 'Invite sent', description: 'Byewind will get an email' },
  { status: 'error', title: 'Sync failed' },
  { status: 'success', title: 'Changes saved' },
]

const StackedExample = () => {
  const shown = useRef<ReturnType<typeof toast>[]>([])
  // Clears the stack when the story is left.
  useEffect(
    () => () => {
      for (const handle of shown.current) handle.dismiss()
    },
    [],
  )

  return (
    <>
      <Button
        variant="filled"
        onClick={() => {
          const next =
            stackedToasts[shown.current.length % stackedToasts.length]
          // Kept until closed, so the stack holds still.
          shown.current.push(
            toast({ ...next, size: 'lg', duration: Number.POSITIVE_INFINITY }),
          )
        }}
      >
        Show toast
      </Button>
      <Toaster limit={3} />
    </>
  )
}

/**
 * `limit={3}`: up to three toasts at once. The newest is in front and the
 * older ones peek out above it, smaller; hover the stack or move focus into
 * it (F8) to spread it into a list, which also pauses their timers. A fourth
 * toast closes the oldest. `expand` keeps the stack spread.
 */
export const Stacked: Story = {
  render: () => <StackedExample />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const body = canvasElement.ownerDocument.body
    const show = canvas.getByRole('button', { name: 'Show toast' })
    const toastOf = (title: string) =>
      canvas.getByText(title).closest('li') as HTMLElement
    const viewport = () =>
      canvas.getByRole('region', { name: /notifications/i }).querySelector('ol')

    await step('three toasts stack, the newest in front', async () => {
      await userEvent.click(show)
      await userEvent.click(show)
      await userEvent.click(show)
      await expect(toastOf('Sync failed')).toHaveAttribute('data-front')
      await expect(toastOf('Invite sent')).toHaveAttribute('data-collapsed')
      await expect(toastOf('Report exported')).toHaveAttribute('data-collapsed')
      // The viewport wraps the stack (its focus outline and hover area).
      const box = (viewport() as HTMLElement).getBoundingClientRect()
      const front = toastOf('Sync failed').getBoundingClientRect()
      await expect(box.left).toBeLessThanOrEqual(front.left)
      await expect(box.right).toBeGreaterThanOrEqual(front.right)
      await expect(box.width).toBeLessThanOrEqual(front.width + 33)
    })

    await step('hovering spreads the stack into a list', async () => {
      await userEvent.hover(toastOf('Sync failed'))
      await waitFor(() => expect(viewport()).toHaveAttribute('data-expanded'))
      await expect(toastOf('Report exported')).not.toHaveAttribute(
        'data-collapsed',
      )
      // The toasts no longer overlap: each sits above the newer one (once
      // the 300ms move has ended).
      await waitFor(() =>
        expect(
          toastOf('Invite sent').getBoundingClientRect().bottom,
        ).toBeLessThanOrEqual(
          toastOf('Sync failed').getBoundingClientRect().top,
        ),
      )
      await userEvent.unhover(toastOf('Sync failed'))
      await userEvent.hover(body)
      await waitFor(() =>
        expect(viewport()).not.toHaveAttribute('data-expanded'),
      )
    })

    await step('F8 moves focus into the stack and spreads it', async () => {
      // Radix's hotkey matches the key's `code`.
      await userEvent.keyboard('[F8]')
      await expect(viewport()).toHaveFocus()
      await waitFor(() => expect(viewport()).toHaveAttribute('data-expanded'))
    })

    await step('a fourth toast closes the oldest', async () => {
      // Focus leaves the stack, which collapses again.
      await userEvent.click(show)
      await waitFor(() =>
        expect(viewport()).not.toHaveAttribute('data-expanded'),
      )
      await waitFor(() =>
        expect(canvas.queryByText('Report exported')).not.toBeInTheDocument(),
      )
      await expect(toastOf('Changes saved')).toHaveAttribute('data-front')
    })
  },
}
