import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { expectClosed } from '../../test/animations'
import { settleLayout } from '../../test/layout'
import { Button } from '../Button'
import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipProvider,
  TooltipShortcut,
  TooltipTitle,
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

/**
 * `tooltip` closes at once, and Radix removes it when its exit animation
 * ends: wait for the animation (a busy runner may take longer than
 * `waitFor`'s timeout to render it), then for the removal.
 */
const expectHidden = async (tooltip: HTMLElement) => {
  const page = within(tooltip.ownerDocument.body)
  await expectClosed(tooltip)
  await waitFor(() =>
    expect(page.queryByRole('tooltip')).not.toBeInTheDocument(),
  )
}

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
      const tooltip = page.getByRole('tooltip')
      await userEvent.keyboard('{Escape}')
      await expectHidden(tooltip)
      await expect(trigger).toHaveFocus()
    })

    await step('it shows again on the next focus', async () => {
      await userEvent.tab({ shift: true })
      await userEvent.tab()
      const tooltip = await page.findByRole('tooltip')
      await expect(tooltip).toHaveTextContent('Add to library')
      await userEvent.tab()
      await expectHidden(tooltip)
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

/**
 * Rich tooltips (added in 5.2), as the kit's examples: a `TooltipTitle` in
 * semibold over a `TooltipDescription`, or a description alone for a
 * multi-line tip. They stack, start-aligned, with an 8px radius, and wrap at
 * 280px. Text only: for links or buttons use a Popover.
 */
export const Rich: Story = {
  args: {},
  parameters: { layout: 'padded' },
  render: () => (
    <TooltipProvider>
      <div className="flex items-start gap-80 ps-40 pe-4 pt-32 pb-2">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" label="Dark" />
          </TooltipTrigger>
          <TooltipContent>
            <TooltipTitle>This is a tooltip</TooltipTitle>
            <TooltipDescription>
              Tooltips are used to describe or identify an element. In most
              scenarios, tooltips help the user understand meaning, function or
              alt-text.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" label="Light" />
          </TooltipTrigger>
          <TooltipContent variant="light">
            <TooltipTitle>This is a tooltip</TooltipTitle>
            <TooltipDescription>
              Tooltips are used to describe or identify an element.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" label="Views" />
          </TooltipTrigger>
          <TooltipContent>
            <TooltipDescription>
              Compared with yesterday, it is up 11.01%
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const title = (await page.findAllByText('This is a tooltip')).find(
      (element) => element.closest('[data-side]') !== null,
    ) as HTMLElement
    const tooltip = title.closest('[data-side]') as HTMLElement
    await settleLayout(tooltip)

    await step('the title is semibold, over the text', async () => {
      await expect(getComputedStyle(title).fontWeight).toBe('600')
      const text = title.nextElementSibling as HTMLElement
      await expect(text).toHaveAttribute('data-slot', 'tooltip-description')
      await expect(
        text.getBoundingClientRect().top - title.getBoundingClientRect().bottom,
      ).toBeCloseTo(4, 0)
      await expect(
        text.getBoundingClientRect().left - title.getBoundingClientRect().left,
      ).toBeCloseTo(0, 0)
    })

    await step('an 8px radius, wrapping at 280px', async () => {
      const style = getComputedStyle(tooltip)
      await expect(style.borderTopLeftRadius).toBe('8px')
      await expect(tooltip.getBoundingClientRect().width).toBeLessThanOrEqual(
        280,
      )
      await expect(tooltip.getBoundingClientRect().height).toBeGreaterThan(48)
    })

    await step(
      'the trigger is described by the title and the text',
      async () => {
        await expect(
          canvas.getByRole('button', { name: 'Dark' }),
        ).toHaveAccessibleDescription(/^This is a tooltip Tooltips are used/)
      },
    )

    await step('a description alone: the multi-line tooltip', async () => {
      const views = (
        await page.findAllByText('Compared with yesterday, it is up 11.01%')
      )
        .find((element) => element.closest('[data-side]') !== null)
        ?.closest('[data-side]') as HTMLElement
      await expect(getComputedStyle(views).borderTopLeftRadius).toBe('8px')
    })
  },
}
