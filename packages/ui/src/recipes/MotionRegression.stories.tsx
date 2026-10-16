import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { Button } from '../components/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/Dialog'
import { Popover, PopoverContent, PopoverTrigger } from '../components/Popover'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '../components/Sheet'
import { animationsEnded } from '../test/animations'

const meta = {
  title: 'Recipes/Motion regression',
  tags: ['!autodocs', 'skip-visual'],
  parameters: { layout: 'centered' },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

/** Measure real positioned surfaces at both animation endpoints. */
const entrance = async (
  panel: HTMLElement,
  kind: 'popup' | 'dialog' | 'sheet',
) => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  await waitFor(() =>
    expect(
      panel
        .getAnimations()
        .filter((animation) => animation instanceof CSSAnimation).length,
    ).toBeGreaterThan(0),
  )
  const animation = panel
    .getAnimations()
    .find((animation) => animation instanceof CSSAnimation)
  if (!animation) throw new Error('Expected a CSS animation')
  animation.pause()
  animation.currentTime = 0
  const start = panel.getBoundingClientRect()
  await expect(Number(getComputedStyle(panel).opacity)).toBeLessThan(0.01)
  const duration = Number(animation.effect?.getTiming().duration)
  animation.currentTime = duration
  const end = panel.getBoundingClientRect()
  if (reduced) {
    await expect(start.x).toBeCloseTo(end.x, 0)
    await expect(start.y).toBeCloseTo(end.y, 0)
    await expect(start.width).toBeCloseTo(end.width, 0)
  } else if (kind === 'popup') {
    const distance = Math.hypot(start.x - end.x, start.y - end.y)
    await expect(distance).toBeGreaterThan(0)
    await expect(distance).toBeLessThanOrEqual(8)
  } else if (kind === 'dialog') {
    await expect(start.width / end.width).toBeCloseTo(0.95, 2)
    // Scaling must preserve the centre of an already positioned dialog.
    await expect(start.x + start.width / 2).toBeCloseTo(
      end.x + end.width / 2,
      0,
    )
    await expect(start.y + start.height / 2).toBeCloseTo(
      end.y + end.height / 2,
      0,
    )
  } else {
    await expect(Math.abs(start.x - end.x)).toBeCloseTo(end.width, 0)
  }
  animation.finish()
  await animation.finished
}

const exit = async (panel: HTMLElement, dismiss: () => void) => {
  const expanded = panel.getBoundingClientRect()
  dismiss()
  await waitFor(() => expect(panel).toHaveAttribute('data-state', 'closed'))
  // Radix must retain the real panel until the exit animation completes.
  await expect(panel.isConnected).toBe(true)
  const animation = panel
    .getAnimations()
    .find((animation) => animation instanceof CSSAnimation)
  if (!animation) throw new Error('Expected a CSS animation')
  await expect(animation).toBeDefined()
  animation.pause()
  animation.currentTime = 0
  const start = panel.getBoundingClientRect()
  await expect(start.x).toBeCloseTo(expanded.x, 0)
  await expect(start.y).toBeCloseTo(expanded.y, 0)
  await expect(start.width).toBeCloseTo(expanded.width, 0)
  animation.currentTime = Number(animation.effect?.getTiming().duration) - 1
  await expect(Number(getComputedStyle(panel).opacity)).toBeLessThan(0.01)
  animation.finish()
  await animation.finished
  await waitFor(() => expect(panel.isConnected).toBe(false))
  await animationsEnded(panel.ownerDocument.body)
  await waitFor(() =>
    expect(getComputedStyle(panel.ownerDocument.body).pointerEvents).not.toBe(
      'none',
    ),
  )
  await waitFor(() => {
    const remaining = [
      ...panel.ownerDocument.querySelectorAll('[data-state="closed"]'),
    ].filter((el) => getComputedStyle(el).position === 'fixed')
    expect(remaining).toHaveLength(0)
  })
}

export const DialogPresence: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="md">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Motion dialog</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Check the entrance and exit of a positioned panel.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Open dialog' })
    await userEvent.click(trigger)
    const panel = await page.findByRole('dialog', { name: 'Motion dialog' })
    await entrance(panel, 'dialog')
    await exit(panel, () => page.getByRole('button', { name: 'Close' }).click())
    await expect(trigger).toHaveFocus()
  },
}

export const PopupDistance: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="md">Open popup</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Motion popup">
        A tall popup must move a short distance regardless of its content
        height. It must fade while preserving its anchored position.
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open popup' }))
    const panel = await page.findByRole('dialog', { name: 'Motion popup' })
    await entrance(panel, 'popup')
    await exit(panel, () => {
      panel.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      )
    })
  },
}

export const SheetTravel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="md">Open sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>Motion sheet</SheetTitle>
        <SheetDescription>
          Sheets travel their full width while popups do not.
        </SheetDescription>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open sheet' }))
    const panel = await page.findByRole('dialog', { name: 'Motion sheet' })
    await entrance(panel, 'sheet')
    await exit(panel, () => page.getByRole('button', { name: 'Close' }).click())
  },
}
