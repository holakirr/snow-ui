import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Input>

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

export const WithCustomClass: Story = {
  args: {
    placeholder: 'Custom class',
    className: 'border-2 border-red-500',
  },
}

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
