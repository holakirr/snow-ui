import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Typography } from '../Text'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  args: {},
  parameters: {
    docs: {
      description: {
        component: 'Popover with page navigation, next and previous links.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2">
            <Typography>Popover content</Typography>
          </div>
        </PopoverContent>
      </>
    ),
  },
}
