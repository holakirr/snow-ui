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
    variant: {
      control: 'radio',
      options: ['default', 'arrow', 'external'],
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

export const Arrow: Story = {
  args: {
    href: '#',
    children: 'Arrow Link',
    variant: 'arrow',
  },
}

export const External: Story = {
  args: {
    href: 'https://example.com',
    children: 'External Link',
    variant: 'external',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
}

/** The Figma Link set (hover a link to see its hover state). */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Link href="#">Link</Link>
      <Link href="#" variant="arrow">
        Link
      </Link>
      <Link href="#" variant="external">
        Link
      </Link>
    </div>
  ),
}

export const WithCustomClasses: Story = {
  args: {
    href: '#',
    children: 'Custom Styled Link',
    className: 'text-red font-semibold',
  },
}
