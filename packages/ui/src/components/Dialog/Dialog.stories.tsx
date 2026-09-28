import { AddIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'

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
            <Input id="name" title="Name" defaultValue="Pedro Duarte" />
            <Input id="username" title="Username" defaultValue="@peduarte" />
          </div>
          <Button type="submit" variant="filled">
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
          <DialogHeader leftContent={<AddIcon size={24} />}>
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
      <Typography className="p-6 text-black-40">
        Page content under the mask
      </Typography>
    </div>
  ),
}

export const AddDataDark: Story = {
  ...AddData,
  globals: { theme: 'dark' },
}
