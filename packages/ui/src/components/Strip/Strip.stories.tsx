import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from '../Text'
import { Strip } from './Strip'

const meta = {
  title: 'Components/Strip',
  component: Strip,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=32792-9423',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "Strip": equal segments 8px apart (`count`, `vertical`), 2px thick and Black/100% by default. With `value` it is a segmented progress bar: filled segments stay Black/100%, the rest are Black/10%. Not a separator — use `Separator` for lines.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 12 } },
    value: { control: { type: 'number', min: 0, max: 12 } },
    vertical: { control: { type: 'boolean' } },
    thickness: { options: [2, 4, 6, 8], control: { type: 'radio' } },
    rounded: { control: { type: 'boolean' } },
  },
  args: {
    count: 4,
  },
} satisfies Meta<typeof Strip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Vertical: Story = {
  args: { vertical: true },
}

export const Progress: Story = {
  args: {
    count: 7,
    value: 4,
    thickness: 4,
    rounded: true,
    'aria-label': 'Storage used',
    className: 'w-80',
  },
}

const Variants = () => (
  <div className="flex gap-16">
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4, 5, 6, 7].map((count) => (
        <div key={count} className="flex items-center gap-4">
          <Typography size={12} className="w-4 text-secondary">
            {count}
          </Typography>
          <Strip count={count} />
        </div>
      ))}
    </div>
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5, 6, 7].map((count) => (
        <Strip key={count} count={count} vertical />
      ))}
    </div>
  </div>
)

export const AllCounts: Story = {
  render: () => <Variants />,
}

export const AllCountsDark: Story = {
  render: () => <Variants />,
  globals: { theme: 'dark' },
}

/** The examples from the Figma Strip page. */
const ExampleSet = () => (
  <div className="flex w-96 flex-col gap-8">
    <div className="flex flex-col gap-2">
      <Typography size={12} className="text-black">
        Users <span className="text-secondary">86 of 100 Used</span>
      </Typography>
      <Strip
        count={7}
        value={6}
        thickness={8}
        rounded
        aria-label="Users"
        className="w-full [&>:first-child]:bg-indigo"
      />
    </div>

    <div className="flex flex-col gap-2">
      <Strip
        count={4}
        value={1}
        thickness={4}
        rounded
        role="meter"
        aria-label="Password strength"
        aria-valuetext="Weak"
        className="w-full"
      />
      <Typography size={12} className="text-secondary">
        Use 8 or more characters with a mix of letters, numbers &amp; symbols.
      </Typography>
    </div>

    <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
      {[
        ['Google', 0.7],
        ['YouTube', 0.5],
        ['Instagram', 0.9],
        ['Pinterest', 0.45],
        ['Facebook', 0.6],
      ].map(([label, share]) => (
        <div key={label} className="contents">
          <Typography size={12} className="text-black">
            {label}
          </Typography>
          <Strip
            thickness={6}
            rounded
            style={{ width: `${Number(share) * 100}%` }}
            className={
              label === 'Instagram'
                ? undefined
                : '[&>[data-state=filled]]:bg-black-10'
            }
          />
        </div>
      ))}
    </div>
  </div>
)

export const Examples: Story = {
  render: () => <ExampleSet />,
}

export const ExamplesDark: Story = {
  render: () => <ExampleSet />,
  globals: { theme: 'dark' },
}
