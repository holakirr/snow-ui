import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['single', 'multiple'],
      control: { type: 'radio' },
    },
  },
  args: {},
  render: (args) => (
    <Accordion className="w-xs" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It&apos;s animated by default.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
}

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
}

export const Dark: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
  },
  globals: { theme: 'dark' },
}

/** Exercise actual layout at the ends of both height animations. */
export const Motion: Story = {
  // Layout is covered by Single/Dark snapshots; this story checks motion.
  tags: ['!dev', '!autodocs', 'skip-visual'],
  args: { type: 'single', collapsible: true },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button') as HTMLButtonElement
    trigger.click()
    const panel = canvasElement.querySelector('[role="region"]') as HTMLElement
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      await waitFor(() =>
        expect(panel.getAnimations().length).toBeGreaterThan(0),
      )
      const animation = panel.getAnimations()[0]
      animation.pause()
      animation.currentTime = 0
      // Padding must disappear with the content instead of jumping in first.
      await expect(panel.getBoundingClientRect().height).toBeLessThan(1)
      animation.finish()
      await animation.finished
    }
    await waitFor(() =>
      expect(panel.getBoundingClientRect().height).toBeGreaterThan(30),
    )
    const expanded = panel.getBoundingClientRect().height
    trigger.click()
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    )
    if (!reduced) {
      await waitFor(() =>
        expect(panel.getAnimations().length).toBeGreaterThan(0),
      )
      const animation = panel.getAnimations()[0]
      animation.pause()
      animation.currentTime = 0
      await expect(panel.getBoundingClientRect().height).toBeCloseTo(
        expanded,
        0,
      )
      const duration = Number(animation.effect?.getTiming().duration)
      animation.currentTime = duration - 1
      // No leftover padding just before Radix removes the closed panel.
      await expect(panel.getBoundingClientRect().height).toBeLessThan(1)
      animation.finish()
      await animation.finished
    }
    await waitFor(() => expect(panel.getBoundingClientRect().height).toBe(0))
    // Interrupt each direction, then make sure the item settles closed.
    trigger.click()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    trigger.click()
    trigger.click()
    trigger.click()
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    )
    await waitFor(() => expect(panel.getBoundingClientRect().height).toBe(0))
  },
}
