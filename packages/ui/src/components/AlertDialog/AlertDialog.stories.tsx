import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { settleLayout } from '../../test/layout'
import { Button } from '../Button'
import { Typography } from '../Text'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A library extension built from the Dialog: its mask, motion and glass popup (Background/3, "Background blur 40", radius 32), as one 448px card with a 24 Semibold title, a `text-secondary` description and two `lg` buttons. Built on Radix AlertDialog (`role="alertdialog"`).',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="md" label="Delete project" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            “SnowUI Dashboard” and its 24 files will be deleted for everyone.
            This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel />
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, step, userEvent }) => {
    // The dialog is portalled to <body>, outside the story's canvas.
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Delete project' })

    await step('opens with the focus on Cancel', async () => {
      await userEvent.click(trigger)
      const dialog = await page.findByRole('alertdialog', {
        name: 'Delete this project?',
      })
      await expect(dialog).toHaveAccessibleDescription(
        "“SnowUI Dashboard” and its 24 files will be deleted for everyone. This can't be undone.",
      )
      await waitFor(() =>
        expect(page.getByRole('button', { name: 'Cancel' })).toHaveFocus(),
      )
    })

    await step('traps Tab between its two buttons', async () => {
      await userEvent.tab()
      await expect(page.getByRole('button', { name: 'Delete' })).toHaveFocus()
      await userEvent.tab()
      await expect(page.getByRole('button', { name: 'Cancel' })).toHaveFocus()
    })

    await step("doesn't close on a click on the mask", async () => {
      const dialog = page.getByRole('alertdialog')
      // The mask is rendered just before the content, in the same portal.
      const mask = dialog.previousElementSibling as HTMLElement
      await userEvent.click(mask)
      await expect(dialog).toBeInTheDocument()
      await expect(page.getByRole('button', { name: 'Cancel' })).toHaveFocus()
    })

    await step('closes with Escape and returns the focus', async () => {
      await userEvent.keyboard('{Escape}')
      await waitFor(() =>
        expect(page.queryByRole('alertdialog')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveFocus()
    })

    await step('closes with the action too', async () => {
      await userEvent.click(trigger)
      await userEvent.click(await page.findByRole('button', { name: 'Delete' }))
      await waitFor(() =>
        expect(page.queryByRole('alertdialog')).not.toBeInTheDocument(),
      )
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
      await expect(trigger).toHaveFocus()
    })
  },
}

type ScreenProps = {
  title: string
  description: string
  cancel?: string
  action: string
  destructive?: boolean
  className?: string
}

/** An open alert dialog over a page, as in the Dialog's "Add data" story. */
const Screen = ({
  title,
  description,
  cancel,
  action,
  destructive = false,
  className,
}: ScreenProps) => (
  <div className="h-svh w-full bg-background-1">
    <AlertDialog defaultOpen>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          <AlertDialogAction variant={destructive ? 'destructive' : 'filled'}>
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Typography className="p-6 text-secondary">
      Page content under the mask
    </Typography>
  </div>
)

const deleteProject = {
  title: 'Delete this project?',
  description:
    '“SnowUI Dashboard” and its 24 files will be deleted for everyone. This can’t be undone.',
  action: 'Delete',
  destructive: true,
}

/** Open: a confirmation with a Filled action. */
export const Open: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <Screen
      title="Publish the report?"
      description="Everyone in the workspace will be able to see the March report."
      action="Publish"
    />
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await expect(
      await page.findByRole('alertdialog', { name: 'Publish the report?' }),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(page.getByRole('button', { name: 'Cancel' })).toHaveFocus(),
    )
  },
}

/**
 * `variant="destructive"` on the action: a red Filled button (`red-text`
 * with the `white` label, 5.21:1 light, 8.65:1 dark).
 */
export const Destructive: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => <Screen {...deleteProject} />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const action = await page.findByRole('button', { name: 'Delete' })
    await expect(action).toHaveAttribute('data-variant', 'destructive')
    await expect(action).toHaveClass('bg-red-text')
  },
}

/**
 * When the buttons don't fit side by side (at 160px each), they stack, the
 * action on top: here a 320px dialog, as on a phone.
 */
export const Narrow: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => <Screen {...deleteProject} className="max-w-80" />,
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const action = await page.findByRole('button', { name: 'Delete' })
    const cancel = page.getByRole('button', { name: 'Cancel' })
    // The final layout, not a frame of the open transition.
    await settleLayout(page.getByRole('alertdialog'))
    await expect(action.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      cancel.getBoundingClientRect().top,
    )
    await expect(action.getBoundingClientRect().width).toBeCloseTo(
      cancel.getBoundingClientRect().width,
      0,
    )
  },
}

/** Right-to-left text: the portalled dialog gets `dir` from `SnowUIProvider`. */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <Screen
      title="حذف هذا المشروع؟"
      description="سيتم حذف المشروع وملفاته للجميع. لا يمكن التراجع عن ذلك."
      cancel="إلغاء"
      action="حذف"
      destructive
    />
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const dialog = await page.findByRole('alertdialog', {
      name: 'حذف هذا المشروع؟',
    })
    await expect(dialog).toHaveAttribute('dir', 'rtl')
    const cancel = within(dialog).getByRole('button', { name: 'إلغاء' })
    const action = within(dialog).getByRole('button', { name: 'حذف' })
    // Cancel first, on the start side: on the right. Measured in the final
    // layout, not a frame of the open transition (it scales the dialog up
    // from its centre).
    await settleLayout(dialog)
    await expect(cancel.getBoundingClientRect().left).toBeGreaterThan(
      action.getBoundingClientRect().right,
    )
  },
}

/** "Cancel" comes from `SnowUIProvider` messages (Russian example). */
export const Localized: Story = {
  tags: ['!autodocs'],
  globals: { locale: 'ru' },
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <div className="h-svh w-full bg-background-1">
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel />
            <AlertDialogAction variant="destructive">Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await expect(
      await page.findByRole('button', { name: 'Отмена' }),
    ).toBeInTheDocument()
  },
}

export const DestructiveDark: Story = {
  ...Destructive,
  globals: { theme: 'dark' },
}
