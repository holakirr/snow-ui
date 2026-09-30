import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Typography } from '../Text'
import { Separator, type SeparatorCount } from './Separator'

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=32792-1923',
    },
    docs: {
      description: {
        component:
          'Visually or semantically separates content. Defaults to the Black/10% divider of the Figma dashboards; `hairline` draws it 0.5px thick.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
    },
    hairline: {
      control: 'boolean',
      description: 'Draw a 0.5px hairline',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is purely decorative',
    },
    count: {
      control: { type: 'range', min: 1, max: 8 },
    },
    arrow: {
      control: 'select',
      options: [undefined, 'start', 'end', 'left', 'right'],
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Typography>Content above</Typography>
      <Separator {...args} />
      <Typography>Content below</Typography>
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-[100px] items-center gap-4">
      <Typography>Left content</Typography>
      <Separator {...args} />
      <Typography>Right content</Typography>
    </div>
  ),
}

export const Hairline: Story = {
  args: {
    hairline: true,
  },
  render: (args) => (
    <div className="flex w-[240px] flex-col gap-2">
      <Typography>1px (default)</Typography>
      <Separator />
      <Typography>0.5px hairline</Typography>
      <Separator {...args} />
      <Typography>Below content</Typography>
    </div>
  ),
}

export const Dark: Story = {
  ...Hairline,
  globals: { theme: 'dark' },
}

export const CustomStyles: Story = {
  args: {
    className: 'bg-primary',
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Typography>Custom styled separator</Typography>
      <Separator {...args} />
      <Typography>Below content</Typography>
    </div>
  ),
}

const COUNTS: SeparatorCount[] = [1, 2, 3, 4, 5, 6, 7, 8]

const LineMatrix = () => (
  <div className="flex flex-col gap-8 text-black">
    <div className="flex items-start gap-6">
      {COUNTS.map((count) => (
        <Separator key={count} count={count} className="w-20 text-black" />
      ))}
    </div>
    <div className="flex h-20 items-stretch gap-6">
      {COUNTS.map((count) => (
        <Separator
          key={count}
          count={count}
          orientation="vertical"
          className="text-black"
        />
      ))}
    </div>
    <div className="flex w-20 flex-col gap-4">
      <Separator arrow="right" className="text-black" />
      <Separator arrow="left" className="text-black" />
    </div>
  </div>
)

/**
 * The Figma "Line" set: `count` 1 to 8 (stacked, or side by side when
 * vertical, the outer lines 8, 16, 32 or 40px apart) and the Left / Right
 * arrow layouts (`arrow`), in the Figma Black/100% (`text-black`).
 */
export const Lines: Story = {
  render: () => <LineMatrix />,
  play: async ({ canvasElement }) => {
    // Figma: the frame is SPACE_BETWEEN, the outer lines' centres 8, 16, 32,
    // 32, 40, 40 and 40px apart for 2 to 8 lines.
    const spans = { 2: 8, 3: 16, 4: 32, 5: 32, 6: 40, 7: 40, 8: 40 }
    for (const [count, span] of Object.entries(spans)) {
      const [horizontal, vertical] = canvasElement.querySelectorAll(
        `[data-count="${count}"]`,
      )
      for (const [separator, axis] of [
        [horizontal, 'y'],
        [vertical, 'x'],
      ] as const) {
        const lines = [
          ...separator.querySelectorAll('[data-slot="separator-line"]'),
        ].map((line) => line.getBoundingClientRect())
        await expect(lines).toHaveLength(Number(count))
        const centre = (rect: DOMRect) =>
          axis === 'y' ? rect.top + rect.height / 2 : rect.left + rect.width / 2
        // Within half a pixel: WebKit rounds the lines' positions (39.94
        // for 40); the spans differ by 8px or more.
        await expect(
          centre(lines[lines.length - 1]) - centre(lines[0]),
        ).toBeCloseTo(span, 0)
      }
    }
    const arrow = canvasElement.querySelector(
      '[data-slot="separator-arrow"]',
    ) as SVGElement
    const row = arrow.parentElement as HTMLElement
    // Right arrow: the head at the right end.
    await expect(arrow.getBoundingClientRect().right).toBeCloseTo(
      row.getBoundingClientRect().right,
      0,
    )
  },
}

export const LinesDark: Story = {
  render: () => <LineMatrix />,
  globals: { theme: 'dark' },
}

/**
 * Right-to-left text: `end` points left, `start` right; `left` and
 * `right` keep their direction.
 */
export const ArrowsRTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex w-40 flex-col gap-4 text-black">
      {(['end', 'start', 'right', 'left'] as const).map((arrow) => (
        <div key={arrow} className="flex items-center gap-3">
          <Typography size={12} className="w-10 text-secondary">
            {arrow}
          </Typography>
          <Separator arrow={arrow} data-arrow={arrow} className="text-black" />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const headAtLeft = (arrow: string) => {
      const row = canvasElement.querySelector(
        `[data-arrow="${arrow}"]`,
      ) as HTMLElement
      const head = row.querySelector('[data-slot="separator-arrow"]') as Element
      return (
        head.getBoundingClientRect().left < row.getBoundingClientRect().left + 8
      )
    }
    await expect(headAtLeft('end')).toBe(true)
    await expect(headAtLeft('start')).toBe(false)
    await expect(headAtLeft('right')).toBe(false)
    await expect(headAtLeft('left')).toBe(true)
  },
}
