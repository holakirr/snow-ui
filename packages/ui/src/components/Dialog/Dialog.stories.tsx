import { AddIcon } from '@holakirr/snow-ui-icons'
import { CalendarBlankIcon, UserIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { settleLayout } from '../../test/layout'
import { Button } from '../Button'
import { IconBox } from '../IconBox'
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

/**
 * The Figma "Add data" title row's start icon: a 48px Add icon, Black/100%.
 * The kit's plus is 36px; our AddIcon at size 48 draws a 30px one (our icon
 * set's inset).
 */
const addDataIcon = (
  <span className="flex size-12 items-center justify-center text-black">
    <AddIcon size={48} />
  </span>
)

/*
 * The Figma "Add data" form: an 80px avatar, the name fields 56px high and
 * the titled Email and Date fields 88px high, all with 20px side padding;
 * the Date value has a CalendarBlank icon before it, under the title.
 */
const nameField = 'h-14 px-5'
const titledField = 'h-22 px-5'

/** The Figma "Add data" screen, open. */
export const AddData: Story = {
  args: {},
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <div className="h-svh w-full bg-background-1">
      <Dialog defaultOpen>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader startContent={addDataIcon}>
            <DialogTitle>New</DialogTitle>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-7">
            <span
              aria-hidden
              className="flex size-20 items-center justify-center rounded-full bg-black-4 text-black"
            >
              <UserIcon size={40} />
            </span>
            <div className="flex flex-col gap-4 [&_.relative]:w-full [&_input]:w-full">
              <div className="grid grid-cols-2 gap-4">
                {/* No title in Figma: the placeholder is not a label. */}
                <Input
                  aria-label="First name"
                  placeholder="First Name"
                  className={nameField}
                />
                <Input
                  aria-label="Last name"
                  placeholder="Last Name"
                  className={nameField}
                />
              </div>
              <Input
                title="Email"
                placeholder="Please enter your email address."
                type="email"
                className={titledField}
              />
              <Input
                title="Date"
                placeholder="February 24th, 2026 at 8:00 AM"
                // The icon sits on the value row (22px from the bottom),
                // under the title, not before both rows.
                startContent={
                  <IconBox size={20}>
                    <CalendarBlankIcon />
                  </IconBox>
                }
                className={`${titledField} *:first:absolute *:first:start-5 *:first:bottom-[22px]`}
                inputClassName="ps-7"
              />
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
          <DialogHeader startContent={addDataIcon}>
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
    // The final layout, not a frame of the open transition (it scales the
    // dialog up from its centre).
    await settleLayout(dialog)
    await expect(close.getBoundingClientRect().right).toBeLessThan(
      title.getBoundingClientRect().left,
    )
  },
}

export const AddDataDark: Story = {
  ...AddData,
  globals: { theme: 'dark' },
}

/**
 * A long title next to the 48px start icon: the start slot keeps its width
 * (it doesn't shrink back to 40px under the icon) and the title wraps.
 */
export const LongTitle: Story = {
  args: {},
  tags: ['!autodocs', 'skip-visual'],
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <div className="h-svh w-full bg-background-1">
      <Dialog defaultOpen>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader startContent={addDataIcon}>
            <DialogTitle>Add a new customer to the orders list</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Input placeholder="Please enter your email" type="email" />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const dialog = await page.findByRole('dialog', {
      name: 'Add a new customer to the orders list',
    })
    await settleLayout(dialog)
    const title = within(dialog).getByRole('heading')
    const slot = title.previousElementSibling as HTMLElement
    const icon = slot.querySelector('svg') as SVGSVGElement
    await expect(slot.getBoundingClientRect().width).toBe(48)
    await expect(icon.getBoundingClientRect().right).toBeLessThanOrEqual(
      title.getBoundingClientRect().left,
    )
  },
}
