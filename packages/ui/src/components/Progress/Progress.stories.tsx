import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, waitFor } from 'storybook/test'
import { Button } from '../Button'
import { Typography } from '../Text'
import { Progress, type ProgressThickness } from './Progress'
import { ProgressCircle, type ProgressCircleSize } from './ProgressCircle'

const THICKNESSES: ProgressThickness[] = [2, 4, 6, 8]
const CIRCLE_SIZES: ProgressCircleSize[] = [16, 20, 24, 32, 40, 48]

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A library extension, the continuous sibling of the Figma "Strip": a Black/100% fill on a Black/10% track with rounded ends, 2, 4, 6 or 8px thick. Without a `value` it is indeterminate. `ProgressCircle` draws the same on the ring of the kit\'s "Loading A" icon. Built on Radix Progress (`role="progressbar"`).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    max: { control: { type: 'number', min: 1 } },
    thickness: { options: THICKNESSES, control: { type: 'radio' } },
  },
  args: {
    value: 40,
    'aria-label': 'Uploading report.pdf',
    className: 'w-80',
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', {
      name: 'Uploading report.pdf',
    })
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '100')
    await expect(bar).toHaveAttribute('aria-valuenow', '40')
    await expect(bar).toHaveAttribute('aria-valuetext', '40%')
    await expect(bar).toHaveAttribute('data-state', 'loading')

    const fill = bar.firstElementChild as HTMLElement
    await waitFor(() =>
      expect(fill.getBoundingClientRect().width).toBeCloseTo(
        bar.getBoundingClientRect().width * 0.4,
        0,
      ),
    )
  },
}

/** The Strip's thicknesses: 2, 4 (the default), 6 and 8px. */
export const Thicknesses: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-6">
      {THICKNESSES.map((thickness) => (
        <Progress
          key={thickness}
          {...args}
          thickness={thickness}
          aria-label={`${thickness}px`}
        />
      ))}
    </div>
  ),
}

/**
 * No `value`: a bar crosses the track, from the start side, until the task
 * has a value. For reduced motion the whole track pulses instead.
 */
export const Indeterminate: Story = {
  args: { value: null, 'aria-label': 'Loading the report' },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Loading the report' })
    await expect(bar).toHaveAttribute('data-state', 'indeterminate')
    await expect(bar).not.toHaveAttribute('aria-valuenow')
    await expect(bar).not.toHaveAttribute('aria-valuetext')
    // With reduced motion (the `storybook-prefs` test run) it pulses.
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const fill = bar.firstElementChild as HTMLElement
    await expect(getComputedStyle(fill).animationName).toBe(
      reduced ? 'pulse' : 'progress-indeterminate',
    )
  },
}

/**
 * A visible label and value, like the Strip's "Users" example: the label
 * names the bar (`aria-labelledby`), the value text is what it reads out.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <div className="flex justify-between gap-4">
        <Typography size={12} id="storage-label" className="text-black">
          Storage
        </Typography>
        <Typography size={12} className="text-secondary" aria-hidden>
          86 of 100 GB used
        </Typography>
      </div>
      <Progress
        value={86}
        thickness={8}
        aria-labelledby="storage-label"
        getValueLabel={(value, max) => `${value} of ${max} GB used`}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Storage' })
    await expect(bar).not.toHaveAttribute('aria-label')
    await expect(bar).toHaveAttribute('aria-valuetext', '86 of 100 GB used')
  },
}

/**
 * The fill and track colours are custom properties: here `indigo-text`,
 * which keeps 3:1 against the track in both themes.
 */
export const CustomColor: Story = {
  args: {
    value: 64,
    thickness: 6,
    className: 'w-80 [--progress-fill:var(--color-indigo-text)]',
  },
}

const Uploader = () => {
  const [value, setValue] = useState(0)
  return (
    <div className="flex w-80 flex-col items-start gap-4">
      <Progress value={value} aria-label="Upload" />
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="md"
          label="Add 25%"
          onClick={() => setValue((current) => Math.min(100, current + 25))}
        />
        <Button
          variant="gray"
          size="md"
          label="Reset"
          onClick={() => setValue(0)}
        />
      </div>
    </div>
  )
}

/** The fill follows `value` with a 300ms transition (none for reduced motion). */
export const Controlled: Story = {
  render: () => <Uploader />,
  play: async ({ canvas, userEvent }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Upload' })
    await expect(bar).toHaveAttribute('aria-valuetext', '0%')

    const add = canvas.getByRole('button', { name: 'Add 25%' })
    for (const expected of ['25%', '50%', '75%', '100%', '100%']) {
      await userEvent.click(add)
      await expect(bar).toHaveAttribute('aria-valuetext', expected)
    }
    await expect(bar).toHaveAttribute('data-state', 'complete')

    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }))
    await expect(bar).toHaveAttribute('aria-valuenow', '0')
  },
}

/** Right-to-left text: the bar fills from the right. */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Progress value={40} aria-label="تحميل" />
      <Progress value={null} aria-label="جارٍ التحميل" />
    </div>
  ),
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'تحميل' })
    const fill = bar.firstElementChild as HTMLElement
    await waitFor(() =>
      expect(fill.getBoundingClientRect().right).toBeCloseTo(
        bar.getBoundingClientRect().right,
        0,
      ),
    )
    await expect(fill.getBoundingClientRect().left).toBeGreaterThan(
      bar.getBoundingClientRect().left,
    )

    // The indeterminate bar starts on the right and moves left.
    const moving = canvas.getByRole('progressbar', { name: 'جارٍ التحميل' })
      .firstElementChild as HTMLElement
    await expect(
      getComputedStyle(moving).getPropertyValue('--progress-direction'),
    ).toBe('-1')
  },
}

/** The value text comes from `SnowUIProvider` messages (Russian example). */
export const Localized: Story = {
  tags: ['!autodocs'],
  globals: { locale: 'ru' },
  args: { 'aria-label': undefined },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Ход выполнения' })
    await expect(bar).toHaveAttribute('aria-valuetext', '40 %')
  },
}

/**
 * `ProgressCircle`: the ring of the "Loading A" icon on a Black/10% track,
 * filled clockwise from the top; without a value it turns like the Spinner.
 */
export const Circle: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {[0, 25, 50, 75, 100].map((value) => (
        <ProgressCircle
          key={value}
          value={value}
          size={32}
          aria-label={`${value} percent`}
        />
      ))}
      <ProgressCircle size={32} aria-label="Loading" />
    </div>
  ),
  play: async ({ canvas }) => {
    const quarter = canvas.getByRole('progressbar', { name: '25 percent' })
    await expect(quarter).toHaveAttribute('aria-valuetext', '25%')
    const arc = quarter.querySelector(
      '[data-slot="progress-circle-value"]',
    ) as SVGCircleElement
    const [dash, gap] = (arc.getAttribute('stroke-dasharray') ?? '')
      .split(' ')
      .map(Number)
    await expect(dash / gap).toBeCloseTo(0.25)

    // No arc (not even a round-capped dot) at 0.
    const empty = canvas.getByRole('progressbar', { name: '0 percent' })
    await expect(
      empty.querySelector('[data-slot="progress-circle-value"]'),
    ).toBeNull()

    const spinning = canvas.getByRole('progressbar', { name: 'Loading' })
    await expect(spinning).toHaveAttribute('data-state', 'indeterminate')
  },
}

/** The kit's icon sizes, 16 to 48px (12 is available too). */
export const CircleSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {CIRCLE_SIZES.map((size) => (
        <ProgressCircle
          key={size}
          value={60}
          size={size}
          aria-label={`${size}px`}
        />
      ))}
    </div>
  ),
}

const Overview = () => (
  <div className="flex w-80 flex-col gap-6">
    <Progress value={40} aria-label="Determinate" />
    <Progress value={null} aria-label="Indeterminate" />
    <Progress
      value={72}
      thickness={8}
      aria-label="Custom colour"
      className="[--progress-fill:var(--color-indigo-text)]"
    />
    <div className="flex items-center gap-6">
      <ProgressCircle value={30} size={32} aria-label="Circle, 30%" />
      <ProgressCircle value={80} size={32} aria-label="Circle, 80%" />
      <ProgressCircle size={32} aria-label="Circle, indeterminate" />
    </div>
  </div>
)

export const OverviewDark: Story = {
  render: () => <Overview />,
  globals: { theme: 'dark' },
}
