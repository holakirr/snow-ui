import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { Button } from '../Button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipShortcut,
  TooltipTrigger,
} from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs', 'a11y'],
  args: {},
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-45026',
    },
    docs: {
      description: {
        component: 'Tooltip component',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {},
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Hover' })

    await step(
      'keyboard focus shows it as the trigger description',
      async () => {
        await userEvent.tab()
        await expect(trigger).toHaveFocus()
        const tooltip = await page.findByRole('tooltip')
        await expect(tooltip).toHaveTextContent('Add to library')
        await expect(trigger).toHaveAccessibleDescription('Add to library')
      },
    )

    await step('Escape hides it and keeps the focus', async () => {
      await userEvent.keyboard('{Escape}')
      await waitFor(() =>
        expect(page.queryByRole('tooltip')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveFocus()
    })

    await step('it shows again on the next focus', async () => {
      await userEvent.tab({ shift: true })
      await userEvent.tab()
      await expect(await page.findByRole('tooltip')).toHaveTextContent(
        'Add to library',
      )
      await userEvent.tab()
      await waitFor(() =>
        expect(page.queryByRole('tooltip')).not.toBeInTheDocument(),
      )
    })
  },
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const FromBottom: Story = {
  args: {},
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Light: Story = {
  args: {},
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent variant="light">
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

/**
 * The Figma Tooltip set, open: Dark and Light, with a shortcut in the
 * secondary (40%) text.
 */
export const Variants: Story = {
  args: {},
  parameters: { layout: 'padded' },
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-24 px-4 pt-10 pb-2">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" label="Dark" />
          </TooltipTrigger>
          <TooltipContent>
            Tooltip <TooltipShortcut>⌘K</TooltipShortcut>
          </TooltipContent>
        </Tooltip>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" label="Light" />
          </TooltipTrigger>
          <TooltipContent variant="light">
            Tooltip <TooltipShortcut>⌘K</TooltipShortcut>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}
