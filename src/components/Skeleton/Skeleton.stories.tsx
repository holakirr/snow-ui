import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs', 'a11y'],
  parameters: {
    docs: {
      description: {
        component:
          'Компонент Skeleton используется для отображения состояния загрузки контента.',
      },
    },
  },
  argTypes: {
    className: {
      description: 'Дополнительные CSS классы',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
}
