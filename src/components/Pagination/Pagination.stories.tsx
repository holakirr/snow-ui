import type { Meta, StoryObj } from '@storybook/react'
import type { Size } from '../../types'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  args: {},
  parameters: {
    docs: {
      description: {
        component: 'Pagination with page navigation, next and previous links.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

const Template = (size: Size) => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious size={size} href="#">
          Prev
        </PaginationPrevious>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink size={size} href="#">
          1
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink size={size} href="#" isActive>
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink size={size} href="#">
          3
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext size={size} href="#">
          Next
        </PaginationNext>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)

export const Default: Story = {
  render: () => Template('md'),
}

export const Sizes: Story = {
  render: () => (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Small</h3>
          <div className="flex flex-col gap-2">{Template('sm')}</div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Medium</h3>
          <div className="flex flex-col gap-2">{Template('md')}</div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Large</h3>
          <div className="flex flex-col gap-2">{Template('lg')}</div>
        </div>
      </div>
    </>
  ),
}
