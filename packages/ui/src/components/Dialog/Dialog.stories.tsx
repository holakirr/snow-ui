import { AddIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { Button } from '../Button'
import { Input } from '../Input'
import { Typography } from '../Text'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=32546-96143',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Add data" popup: a gradient mask with "Background blur 40", a title row and a Background/3 popup (radius 32, padding 80 on desktop, 32 on small screens) with the same blur.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    children: 'Label',
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col items-center gap-4">
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <div className="flex justify-between gap-2">
            {/* With a `title`, Input labels itself with a generated id. */}
            <Input title="Name" defaultValue="Pedro Duarte" />
            <Input title="Username" defaultValue="@peduarte" />
          </div>
          <Button type="submit" variant="filled" size="md">
            Save changes
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    // The dialog is portalled to <body>, outside the story's canvas.
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Edit Profile' })

    await step('opens and moves focus into the dialog', async () => {
      await userEvent.click(trigger)
      const dialog = await page.findByRole('dialog', { name: 'Edit profile' })
      await waitFor(() =>
        expect(dialog).toContainElement(
          canvasElement.ownerDocument.activeElement as HTMLElement,
        ),
      )
      await expect(dialog).toHaveAccessibleDescription(
        "Make changes to your profile here. Click save when you're done.",
      )
    })

    await step('traps Tab inside the dialog', async () => {
      const dialog = page.getByRole('dialog')
      for (let i = 0; i < 6; i++) {
        await userEvent.tab()
        await expect(dialog).toContainElement(
          canvasElement.ownerDocument.activeElement as HTMLElement,
        )
      }
    })

    await step(
      'closes with Escape and returns focus to the trigger',
      async () => {
        await userEvent.keyboard('{Escape}')
        await waitFor(() =>
          expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
        )
        await expect(trigger).toHaveFocus()
      },
    )

    await step('closes with the close button too', async () => {
      await userEvent.click(trigger)
      await userEvent.click(await page.findByRole('button', { name: 'Close' }))
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveFocus()
    })
  },
}

/** The Figma "Add data" screen, open. */
export const AddData: Story = {
  args: {},
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <div className="h-svh w-full bg-background-1">
      <Dialog defaultOpen>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader startContent={<AddIcon size={24} />}>
            <DialogTitle>New</DialogTitle>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-7">
            <div className="flex flex-col gap-4 [&_.relative]:w-full [&_input]:w-full">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input placeholder="Please enter your email" type="email" />
              <Input placeholder="February 24th, 2026 at 8:00 AM" />
            </div>
            <div className="flex gap-4">
              <DialogClose asChild>
                <Button variant="gray" size="lg" className="flex-1">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="filled" size="lg" className="flex-1">
                Save
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
      <Typography className="p-6 text-secondary">
        Page content under the mask
      </Typography>
    </div>
  ),
}

/**
 * Right-to-left text: the portalled dialog gets `dir` from `SnowUIProvider`;
 * the start content is on the right, the close button on the left.
 */
export const RTL: Story = {
  args: {},
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <div className="h-svh w-full bg-background-1">
      <Dialog defaultOpen>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader startContent={<AddIcon size={24} />}>
            <DialogTitle>جديد</DialogTitle>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-7">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="الاسم الأول" />
              <Input placeholder="اسم العائلة" />
            </div>
            <div className="flex gap-4">
              <DialogClose asChild>
                <Button variant="gray" size="lg" className="flex-1">
                  إلغاء
                </Button>
              </DialogClose>
              <Button variant="filled" size="lg" className="flex-1">
                حفظ
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const dialog = await page.findByRole('dialog', { name: 'جديد' })
    await expect(dialog).toHaveAttribute('dir', 'rtl')

    const close = within(dialog).getByRole('button', { name: 'Close' })
    const title = within(dialog).getByText('جديد')
    // After the open animation (it scales the dialog up from its centre).
    await waitFor(() =>
      expect(close.getBoundingClientRect().right).toBeLessThan(
        title.getBoundingClientRect().left,
      ),
    )
  },
}

export const AddDataDark: Story = {
  ...AddData,
  globals: { theme: 'dark' },
}
