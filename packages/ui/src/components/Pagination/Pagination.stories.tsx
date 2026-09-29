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
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=32728-395827',
    },
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
 * pages first and the previous / next buttons last. The links keep their
 * URLs (a new tab, no JavaScript) and `onPageChange` handles plain clicks
 * in the page.
 */
export const TableFooter: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const pages = [1, 2, 3, 4, 5]

    return (
      <Pagination className="w-[892px]" onPageChange={setPage}>
        <PaginationContent className="w-full [&>li]:flex-1 [&>li>a]:w-full">
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href={`#${p}`} page={p} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationPrevious
              href={`#${page - 1}`}
              page={page - 1}
              disabled={page === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`#${page + 1}`}
              page={page + 1}
              disabled={page === pages.length}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
}

const ClientSideExample = () => {
  const [page, setPage] = useState(1)
  const count = 5

  return (
    <div className="flex flex-col items-center gap-4">
      <Typography size={14} role="status">
        Page {page} of {count}
      </Typography>
      <Pagination aria-label="Results pages" onPageChange={setPage}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious page={page - 1} disabled={page === 1} />
          </PaginationItem>
          {Array.from({ length: count }, (_, index) => index + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink page={p} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext page={page + 1} disabled={page === count} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

/**
 * Client-side paging (state, not URLs): `onPageChange` on `Pagination` and a
 * `page` on each item without `href`. The items are buttons, the current one
 * `aria-current="page"`, and previous / next are natively disabled at the
 * ends.
 */
export const ClientSide: Story = {
  render: () => <ClientSideExample />,
  play: async ({ canvas, userEvent, step }) => {
    const status = canvas.getByRole('status')
    const previous = canvas.getByRole('button', { name: 'Go to previous page' })
    const next = canvas.getByRole('button', { name: 'Go to next page' })

    await step('the first page is current; previous is disabled', async () => {
      await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: '1' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      await expect(previous).toBeDisabled()
    })

    await step('a page button changes the page', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '3' }))
      await expect(status).toHaveTextContent('Page 3 of 5')
      await expect(canvas.getByRole('button', { name: '3' })).toHaveAttribute(
        'aria-current',
        'page',
      )
      await expect(previous).toBeEnabled()
    })

    await step(
      'next works from the keyboard, up to the last page',
      async () => {
        next.focus()
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard('{Enter}')
        await expect(status).toHaveTextContent('Page 5 of 5')
        await expect(next).toBeDisabled()
      },
    )

    await step('back to the first page', async () => {
      await userEvent.click(canvas.getByRole('button', { name: '1' }))
      await expect(status).toHaveTextContent('Page 1 of 5')
      // No focus ring in the screenshot.
      ;(document.activeElement as HTMLElement | null)?.blur()
    })
  },
}

export const Dark: Story = {
  render: () => <Template labels />,
  globals: { theme: 'dark' },
}
