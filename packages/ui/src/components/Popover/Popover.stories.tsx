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

/** The Figma Popover, open. */
export const Open: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="h-64">
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="outline" label="Open" />
        </PopoverTrigger>
        {/* PopoverContent is a dialog: name it (here by its title). */}
        <PopoverContent align="start" aria-labelledby="popover-title">
          <div className="flex flex-col gap-2">
            <Typography id="popover-title" semibold>
              Popover
            </Typography>
            <Typography className="text-secondary">
              Padding 12, radius 16, Background/3, a Surface/1 stroke and the
              Glass 2 effect.
            </Typography>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}
