import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import type { Size } from '../../types'
import { Typography } from '../Text'
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
        component:
          'Pagination with page links and previous / next links. The items are the Figma Button Small "Outline" (24px, radius 12, 0.5px Black/10% stroke); the current page has a Black/4% fill.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

const Template = ({
  size = 'sm',
  labels = false,
  label,
}: {
  size?: Size
  labels?: boolean
  /** Several navigation landmarks on a page need distinct names. */
  label?: string
}) => (
  <Pagination aria-label={label}>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious size={size} href="#" disabled>
          {labels && 'Prev'}
        </PaginationPrevious>
      </PaginationItem>
      {[1, 2, 3].map((page) => (
        <PaginationItem key={page}>
          <PaginationLink size={size} href="#" isActive={page === 1}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationEllipsis size={size} />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink size={size} href="#">
          10
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext size={size} href="#">
          {labels && 'Next'}
        </PaginationNext>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)

export const Default: Story = {
  render: () => <Template />,
}

/**
 * Right-to-left text: page 1 is on the right and the previous / next arrows
 * point right / left.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => <Template labels />,
  play: async ({ canvas }) => {
    const previous = canvas.getByRole('link', { name: 'Go to previous page' })
    const next = canvas.getByRole('link', { name: 'Go to next page' })
    await expect(previous.getBoundingClientRect().left).toBeGreaterThan(
      next.getBoundingClientRect().left,
    )
    for (const link of [previous, next]) {
      await expect(
        getComputedStyle(link.querySelector('svg') as SVGElement).scale,
      ).not.toBe('none')
    }
  },
}

/** `asChild` renders router links (here plain `<a>`s) as the page links. */
export const AsChild: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild>
            <a href="#page-1">Prev</a>
          </PaginationPrevious>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink asChild isActive>
            <a href="#page-2">2</a>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext asChild>
            <a href="#page-3">Next</a>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvas }) => {
    const current = canvas.getByRole('link', { name: '2' })
    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(current).toHaveAttribute('href', '#page-2')
    const next = canvas.getByRole('link', { name: 'Go to next page' })
    await expect(next).toHaveAttribute('href', '#page-3')
    await expect(next).toHaveTextContent('Next')
    await expect(next.querySelector('svg')).not.toBeNull()
  },
}

export const WithLabels: Story = {
  render: () => <Template labels />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <Typography size={12} className="text-secondary">
            {size === 'sm'
              ? 'Small (Figma)'
              : size === 'md'
                ? 'Medium'
                : 'Large'}
          </Typography>
          <Template size={size} label={`Pagination, ${size}`} />
        </div>
      ))}
    </div>
  ),
}

/**
 * The Figma table footer: equal-width items stretched across the table, the
 * pages first and the previous / next buttons last.
 */
export const TableFooter: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const pages = [1, 2, 3, 4, 5]

    return (
      <Pagination className="w-[892px]">
        <PaginationContent className="w-full [&>li]:flex-1 [&>li>a]:w-full">
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={`#${p}`}
                isActive={p === page}
                onClick={(event) => {
                  event.preventDefault()
                  setPage(p)
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationPrevious
              href="#prev"
              disabled={page === 1}
              onClick={(event) => {
                event.preventDefault()
                setPage((p) => Math.max(1, p - 1))
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#next"
              disabled={page === pages.length}
              onClick={(event) => {
                event.preventDefault()
                setPage((p) => Math.min(pages.length, p + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
}

export const Dark: Story = {
  render: () => <Template labels />,
  globals: { theme: 'dark' },
}
