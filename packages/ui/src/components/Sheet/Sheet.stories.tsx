import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId } from 'react'

import { Button } from '../Button'
import { Input } from '../Input'
import { Label } from '../Label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet'

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

/** The form of the examples; `useId` keeps the ids of its fields unique. */
const ProfileFields = () => {
  const id = useId()
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-4">
        <Label htmlFor={`${id}-name`} className="text-right">
          Name
        </Label>
        <Input id={`${id}-name`} defaultValue="Pedro Duarte" />
      </div>
      <div className="grid gap-4">
        <Label htmlFor={`${id}-username`} className="text-right">
          Username
        </Label>
        <Input id={`${id}-username`} defaultValue="@peduarte" />
      </div>
    </div>
  )
}

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description:
        'Extends the Dialog component to display content that complements the main content of the screen.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <ProfileFields />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Side: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <ProfileFields />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}

export const Size: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

/** Open on load, to compare the mask and the glass panel in both themes. */
export const Open: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', storyWrapper: false },
  render: () => (
    <div className="h-svh w-full bg-background-1 p-6">
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              You have 3 unread notifications.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Label>Page content under the mask</Label>
    </div>
  ),
}

export const OpenDark: Story = {
  ...Open,
  globals: { theme: 'dark' },
}
