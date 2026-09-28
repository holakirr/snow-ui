import {
  ArrowLineUpDownIcon,
  SearchIcon,
  XCircleIcon,
} from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { KBD } from '../Text'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

/** Figma "1 row". */
export const Default: Story = {
  args: {
    placeholder: 'Placeholder text',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Input with value',
    defaultValue: 'Initial value',
  },
}

/** Figma "Static": read-only, the stroke doesn't react to hover or focus. */
export const Static: Story = {
  args: {
    title: 'Title',
    defaultValue: 'Read-only value',
    readOnly: true,
  },
}

export const WithCustomClass: Story = {
  args: {
    placeholder: 'Custom class',
    className: 'inset-ring-red',
  },
}

/** Figma "2 row vertical": a static title above the value. */
export const WithTitle: Story = {
  args: {
    placeholder: 'Input with title',
    title: 'Title',
  },
}

export const WithTitleAndValue: Story = {
  args: {
    placeholder: 'Input with title and value',
    title: 'Title',
    defaultValue: 'Initial value',
  },
}

export const WithStartContent: Story = {
  args: {
    placeholder: 'Search',
    startContent: <SearchIcon />,
    endContent: <KBD keys={['/']} variant="border" />,
  },
}

/** A select-style field: the 2-row input with a trailing ArrowLineUpDown. */
export const WithEndContent: Story = {
  args: {
    title: 'Country',
    defaultValue: 'Spain',
    endContent: <ArrowLineUpDownIcon />,
  },
}

/** The Figma Input states (hover and focus the first two fields). */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input placeholder="Text" aria-label="1 row" />
      <Input
        title="Title"
        placeholder="Text"
        endContent={<XCircleIcon />}
        aria-label="2 row"
      />
      <Input title="Static" defaultValue="Text" readOnly />
      <Input title="Disabled" defaultValue="Text" disabled />
    </div>
  ),
}
