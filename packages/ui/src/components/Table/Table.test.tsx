import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

describe('Table', () => {
  it('uses the Figma weights and paddings: 12 Regular, cells padded 8/12', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Natali Craig</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByRole('table')).toHaveClass(
      'text-12',
      'border-separate',
      'border-spacing-0',
    )

    const head = screen.getByRole('columnheader', { name: 'Name' })
    expect(head).toHaveClass(
      'font-normal',
      'px-3',
      'border-b',
      'border-black-20',
    )
    expect(head).not.toHaveClass('font-light', 'first-of-type:ps-0')

    const cell = screen.getByRole('cell', { name: 'Natali Craig' })
    expect(cell).toHaveClass(
      'font-normal',
      'h-10',
      'px-3',
      'py-2',
      'border-black-4',
    )
    expect(cell).not.toHaveClass('font-light', 'first-of-type:ps-0')
  })

  it('highlights hovered and selected rows with rounded Black/4% cells', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>Selected</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Plain</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const [selected, plain] = screen.getAllByRole('row')
    expect(selected).toHaveAttribute('data-state', 'selected')
    for (const row of [selected, plain]) {
      expect(row).toHaveClass(
        'hover:[&>td]:bg-black-4',
        'data-[state=selected]:[&>td]:bg-black-4',
        'data-[state=selected]:[&>td:first-child]:rounded-l-12',
        'data-[state=selected]:[&>td:last-child]:rounded-r-12',
      )
    }
    expect(plain).not.toHaveAttribute('data-state')
  })

  it('renders a sortable header as a button and reports aria-sort', () => {
    const onSort = vi.fn()
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection={false} onSort={onSort}>
              Email
            </TableHead>
            <TableHead>Plain</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    )

    const head = screen.getByRole('columnheader', { name: 'Email' })
    expect(head).toHaveAttribute('aria-sort', 'none')
    fireEvent.click(within(head).getByRole('button', { name: 'Email' }))
    expect(onSort).toHaveBeenCalledTimes(1)

    const plain = screen.getByRole('columnheader', { name: 'Plain' })
    expect(plain).not.toHaveAttribute('aria-sort')
    expect(within(plain).queryByRole('button')).toBeNull()

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="desc" onSort={onSort}>
              Email
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    )
    expect(screen.getByRole('columnheader', { name: 'Email' })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
  })
})
