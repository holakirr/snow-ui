import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'

const renderPagination = () =>
  render(
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#">Next</PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>,
  )

describe('Pagination', () => {
  it('marks the active page with aria-current and the Black/4% fill', () => {
    renderPagination()

    const active = screen.getByRole('link', { name: '1' })
    expect(active).toHaveAttribute('aria-current', 'page')
    expect(active).toHaveClass('bg-black-4')

    const inactive = screen.getByRole('link', { name: '2' })
    expect(inactive).not.toHaveAttribute('aria-current')
    expect(inactive).toHaveClass('bg-transparent', 'hover:bg-black-4')
    expect(inactive).not.toHaveClass('bg-black-4')
  })

  it('uses the Figma Button Small outline for every item', () => {
    renderPagination()

    for (const name of ['1', '2']) {
      expect(screen.getByRole('link', { name })).toHaveClass(
        'h-6',
        'rounded-12',
        'text-12',
        'border-[0.5px]',
        'border-black-10',
      )
    }
  })

  it('renders icon-only previous / next links as squares', () => {
    renderPagination()

    const previous = screen.getByRole('link', { name: 'Go to previous page' })
    expect(previous).toHaveClass('px-1', 'min-w-6')
    expect(previous.querySelector('span')).toBeNull()

    const next = screen.getByRole('link', { name: 'Go to next page' })
    expect(next).toHaveClass('pr-2')
    expect(next).toHaveTextContent('Next')
  })

  it('disables a link with aria-disabled and removes it from the tab order', () => {
    renderPagination()

    const previous = screen.getByRole('link', { name: 'Go to previous page' })
    expect(previous).toHaveAttribute('aria-disabled', 'true')
    expect(previous).toHaveAttribute('tabindex', '-1')
  })
})
