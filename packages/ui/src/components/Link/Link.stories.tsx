import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './Link'

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'The URL that the hyperlink points to.',
    },
    children: {
      control: 'text',
      description: 'The content of the link.',
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes to apply to the link.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Link>

export const Default: Story = {
  args: {
    href: '#',
    children: 'Default Link',
  },
}

export const WithCustomClasses: Story = {
  args: {
    href: '#',
    children: 'Custom Styled Link',
    className: 'text-red-500 font-bold',
  },
}

export const ExternalLink: Story = {
  args: {
    href: 'https://example.com',
    children: 'External Link',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
}
