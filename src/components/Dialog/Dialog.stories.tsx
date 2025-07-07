import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'
import { Input } from '../Input'
import { Text } from '../Text'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col items-center gap-4">
          <Text>
            Make changes to your profile here. Click save when you're done.
          </Text>
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
