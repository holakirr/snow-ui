import type { Meta, StoryObj } from '@storybook/react-vite'

import { toast } from '../../hooks'
import { Button } from '../Button'
import { Toaster } from './Toaster'

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
}

export default meta
type Story = StoryObj<typeof Toaster>

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
          title: 'Heads up!',
          description: 'This is a large toast message',
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
          size: 'sm',
          title: 'Heads up!',
          description: 'This is a toast message with action',
          action: (
            <Button variant="filled" size="sm">
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

export const WithAction: Story = {
  render: () => <ToastWithActionExample />,
}

const ToastWithStatusExample = () => (
  <>
    <Button
      onClick={() =>
        toast({
          status: 'error',
          title: 'Heads up!',
        })
      }
    >
      Show Toast with status
    </Button>
    <Toaster />
  </>
)

export const WithStatus: Story = {
  render: () => <ToastWithStatusExample />,
}
