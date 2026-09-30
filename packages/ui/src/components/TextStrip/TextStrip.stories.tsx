import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { TextStrip } from './TextStrip'

const meta = {
  title: 'Components/TextStrip',
  component: TextStrip,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33305-28879',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "TextStrip": a 160×28 pill of centred 14px text, Black/4% with semibold text, or, with `strip`, Secondary/Indigo. The indigo pill has static black text (10.15:1) where Figma has white (2.07:1).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    strip: { control: 'boolean' },
  },
  args: {
    children: 'Text',
    strip: false,
  },
} satisfies Meta<typeof TextStrip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const strip = canvas.getByText('Text')
    const box = strip.getBoundingClientRect()
    // Figma: 160×28.
    await expect([box.width, box.height]).toEqual([160, 28])
    await expect(strip).toHaveAttribute('data-state', 'off')
    await expect(strip).toHaveClass('bg-black-4', 'font-semibold')
  },
}

/** Figma `Strip`: False and True. */
export const Strip: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <TextStrip strip>Text</TextStrip>
      <TextStrip>Text</TextStrip>
    </div>
  ),
  play: async ({ canvas }) => {
    const [on, off] = canvas.getAllByText('Text')
    await expect(on).toHaveAttribute('data-state', 'on')
    await expect(on).toHaveClass('bg-indigo', 'text-static-black')
    await expect(off).toHaveAttribute('data-state', 'off')
  },
}

export const StripDark: Story = {
  ...Strip,
  globals: { theme: 'dark' },
}

const PLANS = ['Starter', 'Pro', 'Team', 'Enterprise']

const PlanPicker = () => {
  const [plan, setPlan] = useState('Pro')
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">Plan</legend>
      {PLANS.map((name) => (
        <TextStrip key={name} asChild strip={name === plan}>
          <button
            type="button"
            aria-pressed={name === plan}
            onClick={() => setPlan(name)}
            className="cursor-pointer focus-ring"
          >
            {name}
          </button>
        </TextStrip>
      ))}
    </fieldset>
  )
}

/**
 * `asChild` on buttons: the pressed one is the strip. The buttons say
 * which is pressed (`aria-pressed`), not only the colour.
 */
export const AsButtons: Story = {
  render: () => <PlanPicker />,
  play: async ({ canvas, userEvent }) => {
    const team = canvas.getByRole('button', { name: 'Team' })
    await userEvent.click(team)
    await expect(team).toHaveAttribute('aria-pressed', 'true')
    await expect(team).toHaveAttribute('data-state', 'on')
    await expect(canvas.getByRole('button', { name: 'Pro' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

/** Longer text is cut with an ellipsis; a class widens the strip. */
export const LongText: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <TextStrip>Quarterly revenue report</TextStrip>
      <TextStrip className="w-60">Quarterly revenue report</TextStrip>
    </div>
  ),
  play: async ({ canvas }) => {
    const [cut, wide] = canvas.getAllByText('Quarterly revenue report')
    await expect(cut.scrollWidth).toBeGreaterThan(cut.clientWidth)
    await expect(wide.scrollWidth).toBeLessThanOrEqual(wide.clientWidth)
  },
}

/** Right-to-left text: the ellipsis is on the left. */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex flex-col gap-2">
      <TextStrip strip>الخطة الحالية</TextStrip>
      <TextStrip>تقرير الإيرادات الفصلي المفصل</TextStrip>
    </div>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByText('تقرير الإيرادات الفصلي المفصل')
    await expect(getComputedStyle(long).direction).toBe('rtl')
  },
}
