import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
    expect(next).toHaveClass('pe-2')
    expect(next).toHaveTextContent('Next')
  })

  it('renders a disabled link without href, so it neither navigates nor takes focus', () => {
    const onClick = vi.fn()
    render(<PaginationPrevious href="/page/1" disabled onClick={onClick} />)

    const previous = screen.getByRole('link', { name: 'Go to previous page' })
    expect(previous).not.toHaveAttribute('href')
    expect(previous).toHaveAttribute('aria-disabled', 'true')
    previous.focus()
    expect(previous).not.toHaveFocus()
    fireEvent.click(previous)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('keeps href and onClick on enabled links', () => {
    const onClick = vi.fn()
    render(<PaginationNext href="/page/2" onClick={onClick} />)

    const next = screen.getByRole('link', { name: 'Go to next page' })
    expect(next).toHaveAttribute('href', '/page/2')
    expect(next).not.toHaveAttribute('role')
    fireEvent.click(next)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('hides only the ellipsis glyph from assistive technology', () => {
    render(<PaginationEllipsis />)

    const label = screen.getByText('More pages')
    expect(label).toBeVisible()
    expect(label.closest('[aria-hidden]')).toBeNull()
    expect(screen.getByText('…')).toHaveAttribute('aria-hidden')
  })

  describe('client-side paging (onPageChange)', () => {
    it('renders items with a page and no href as buttons', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination onPageChange={onPageChange}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious page={1} disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink page={1} isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink page={2}>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext page={2} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      )

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      const current = screen.getByRole('button', { name: '1' })
      expect(current).toHaveAttribute('type', 'button')
      expect(current).toHaveAttribute('aria-current', 'page')
      expect(current).toHaveClass('bg-black-4', 'h-6', 'rounded-12')

      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }))
      expect(onPageChange.mock.calls).toEqual([[2], [2]])

      // Disabled with aria-disabled: it ignores clicks but keeps focus.
      const previous = screen.getByRole('button', {
        name: 'Go to previous page',
      })
      expect(previous).not.toBeDisabled()
      expect(previous).toHaveAttribute('aria-disabled', 'true')
      expect(previous).toHaveClass('aria-disabled:text-black-20')
      fireEvent.click(previous)
      expect(onPageChange).toHaveBeenCalledTimes(2)
      previous.focus()
      expect(previous).toHaveFocus()
    })

    it('handles plain clicks on links with a page, and lets modified clicks navigate', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination onPageChange={onPageChange}>
          <PaginationLink href="?page=3" page={3}>
            3
          </PaginationLink>
        </Pagination>,
      )
      const link = screen.getByRole('link', { name: '3' })
      expect(link).toHaveAttribute('href', '?page=3')

      // `fireEvent` returns false when the default action was prevented.
      expect(fireEvent.click(link)).toBe(false)
      expect(onPageChange).toHaveBeenCalledWith(3)

      expect(fireEvent.click(link, { metaKey: true })).toBe(true)
      expect(fireEvent.click(link, { ctrlKey: true })).toBe(true)
      expect(onPageChange).toHaveBeenCalledTimes(1)
    })

    it('lets links with a target or download navigate', () => {
      const onPageChange = vi.fn()
      render(
        <Pagination onPageChange={onPageChange}>
          <PaginationLink href="?page=2" page={2} target="_blank">
            2
          </PaginationLink>
          <PaginationLink href="?page=3" page={3} target="_self">
            3
          </PaginationLink>
          <PaginationLink href="/report.csv" page={4} download>
            4
          </PaginationLink>
          <PaginationLink asChild page={5}>
            <a href="?page=5" target="results">
              5
            </a>
          </PaginationLink>
        </Pagination>,
      )

      for (const name of ['2', '4', '5']) {
        expect(fireEvent.click(screen.getByRole('link', { name }))).toBe(true)
      }
      expect(onPageChange).not.toHaveBeenCalled()
      // `_self` is this window: the click is handled in the page.
      expect(fireEvent.click(screen.getByRole('link', { name: '3' }))).toBe(
        false,
      )
      expect(onPageChange).toHaveBeenCalledWith(3)
    })

    it('hands the ref and onClick the button of a client-side item', () => {
      const ref = createRef<HTMLAnchorElement | HTMLButtonElement>()
      const targets: EventTarget[] = []
      const onClick = vi.fn((event: { currentTarget: EventTarget }) => {
        targets.push(event.currentTarget)
      })
      render(
        <Pagination onPageChange={() => {}}>
          <PaginationLink ref={ref} page={2} onClick={onClick}>
            2
          </PaginationLink>
        </Pagination>,
      )

      fireEvent.click(screen.getByRole('button', { name: '2' }))
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(targets).toEqual([ref.current])
    })

    it("skips onPageChange when the item's onClick prevents the default", () => {
      const onPageChange = vi.fn()
      render(
        <Pagination onPageChange={onPageChange}>
          <PaginationLink page={2} onClick={(event) => event.preventDefault()}>
            2
          </PaginationLink>
        </Pagination>,
      )

      fireEvent.click(screen.getByRole('button', { name: '2' }))
      expect(onPageChange).not.toHaveBeenCalled()
    })

    it('leaves links without a page, and without onPageChange, alone', () => {
      render(
        <Pagination>
          <PaginationLink href="?page=2" page={2}>
            2
          </PaginationLink>
          <PaginationLink href="?page=3">3</PaginationLink>
        </Pagination>,
      )

      expect(fireEvent.click(screen.getByRole('link', { name: '2' }))).toBe(
        true,
      )
      expect(fireEvent.click(screen.getByRole('link', { name: '3' }))).toBe(
        true,
      )
    })
  })
})
