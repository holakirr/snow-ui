import { composeStories } from '@storybook/react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { userEvent } from 'storybook/test'
import { describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from './Table'
import * as stories from './Table.stories'

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
        'data-[state=selected]:[&>td:first-child]:rounded-s-12',
        'data-[state=selected]:[&>td:last-child]:rounded-e-12',
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

describe('TableToolbar and TableCell reveal', () => {
  it('draws the function bar: a Background/2 row, radius 12, padded 8px, gap 16', () => {
    render(
      <TableToolbar aria-label="Orders" role="group" className="mb-2">
        <button type="button">Add</button>
      </TableToolbar>,
    )
    const toolbar = screen.getByRole('group', { name: 'Orders' })
    expect(toolbar).toHaveAttribute('data-slot', 'table-toolbar')
    expect(toolbar).toHaveClass(
      'flex',
      'items-center',
      'min-h-11',
      'gap-4',
      'rounded-12',
      'bg-background-2',
      'p-2',
      'mb-2',
    )
    // Figma "Table A function bar": radius 12 and gap 16 (not 16 and 8).
    expect(toolbar).not.toHaveClass('rounded-16')
    expect(toolbar).not.toHaveClass('gap-2')
    expect(
      within(toolbar).getByRole('button', { name: 'Add' }),
    ).toBeInTheDocument()
  })

  it("hides a reveal cell's elements only where the pointer can hover", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell reveal>
              <button type="button">More</button>
            </TableCell>
            <TableCell>Plain</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    const [reveal, plain] = screen.getAllByRole('cell')
    const hide = [...(reveal?.classList ?? [])].find((name) =>
      name.endsWith(':opacity-0'),
    )
    // One rule: hover media, a row that is neither hovered nor selected, a
    // cell without focus, a checked box or an open menu.
    expect(hide).toMatch(/^\[@media\(hover:hover\)\]:/)
    for (const condition of [
      ':hover',
      '[data-state=selected]',
      ':focus-within',
      '[aria-checked=true]',
      '[aria-checked=mixed]',
      // A native checkbox, checked or indeterminate.
      '[type=checkbox]:checked',
      '[type=checkbox]:indeterminate',
      '[aria-expanded=true]',
    ]) {
      expect(hide).toContain(condition)
    }
    expect(reveal).not.toHaveAttribute('reveal')
    expect(plain?.className).not.toContain('opacity-0')
  })
})

describe('TableHead (5.3)', () => {
  it('reveal hides the header elements while the pointer is off the table', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead reveal>
              <input type="checkbox" aria-label="Select all" />
            </TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    )
    const [reveal, plain] = screen.getAllByRole('columnheader')
    const hide = [...(reveal?.classList ?? [])].find((name) =>
      name.endsWith(':opacity-0'),
    )
    // Like TableCell's: hover media, then the table instead of the row.
    expect(hide).toMatch(/^\[@media\(hover:hover\)\]:\[table:not\(:hover\)_&/)
    for (const condition of [
      ':focus-within',
      '[aria-checked=true]',
      '[aria-checked=mixed]',
      '[type=checkbox]:checked',
      '[type=checkbox]:indeterminate',
      '[aria-expanded=true]',
    ]) {
      expect(hide).toContain(condition)
    }
    expect(reveal).not.toHaveAttribute('reveal')
    expect(plain?.className).not.toContain('opacity-0')
  })

  it('filtered puts the funnel before a black label and says "Filtered"', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead filtered>Status</TableHead>
            <TableHead filtered sortDirection="asc" onSort={() => {}}>
              Email
            </TableHead>
            <TableHead>Plain</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    )
    const status = screen.getByRole('columnheader', {
      name: 'Filtered Status',
    })
    expect(status).toHaveClass('text-black')
    // The kit's IconText: FunnelSimple 16, 4px before the label.
    const label = status.firstElementChild as HTMLElement
    expect(label).toHaveClass('inline-flex', 'items-center', 'gap-1')
    const icon = label.firstElementChild
    expect(icon?.tagName.toLowerCase()).toBe('svg')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('width', '16')

    // A sortable header: the mark goes inside its button.
    const email = screen.getByRole('columnheader', { name: 'Filtered Email' })
    expect(
      within(email).getByRole('button', { name: 'Filtered Email' }),
    ).toBeInTheDocument()

    const plain = screen.getByRole('columnheader', { name: 'Plain' })
    expect(plain).not.toHaveClass('text-black')
    expect(plain.querySelector('svg')).toBeNull()
  })

  it('takes "Filtered" from SnowUIProvider', () => {
    render(
      <SnowUIProvider messages={{ table: { filtered: 'Отфильтровано' } }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead filtered>Статус</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </SnowUIProvider>,
    )
    expect(
      screen.getByRole('columnheader', { name: 'Отфильтровано Статус' }),
    ).toBeInTheDocument()
  })

  it('highlights a selected column: data-state="selected" on its cells', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead data-state="selected">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell data-state="selected">Natali Craig</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    // The row highlight, rounded at the top of the header and the bottom of
    // the last row.
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass(
      'data-[state=selected]:bg-black-4',
      'data-[state=selected]:rounded-t-12',
      'data-[state=selected]:text-black',
    )
    expect(screen.getByRole('cell', { name: 'Natali Craig' })).toHaveClass(
      'data-[state=selected]:bg-black-4',
      '[tr:last-child>&]:data-[state=selected]:rounded-b-12',
    )
  })
})

const { TableA, SortableHeaders } = composeStories(stories)

// The row of an order, by the text of its ID cell. A role query for the cell
// computed the name of every cell on each call, slowly after a click (see
// src/test/queries.ts): the selection test, with nine of them, went past 5 s
// under coverage on CI. (The TableA story's play function still finds a cell
// by role, in the browser.)
const rowOf = (orderId: string) => {
  const row = screen.getByText(orderId).closest('tr')
  if (!row) throw new Error(`row ${orderId} not found`)
  return row
}

describe('Table stories (TanStack Table)', () => {
  it('cycles aria-sort through ascending, descending and none', () => {
    render(<SortableHeaders />)

    const header = screen.getByRole('columnheader', { name: /user/i })
    const button = within(header).getByRole('button', { name: /user/i })
    expect(header).toHaveAttribute('aria-sort', 'none')

    fireEvent.click(button)
    expect(header).toHaveAttribute('aria-sort', 'ascending')
    expect(
      within(screen.getAllByRole('row')[1]).getByText('Andi Lane'),
    ).toBeInTheDocument()

    fireEvent.click(button)
    expect(header).toHaveAttribute('aria-sort', 'descending')
    expect(
      within(screen.getAllByRole('row')[1]).getByText('Orlando Diggs'),
    ).toBeInTheDocument()

    fireEvent.click(button)
    expect(header).toHaveAttribute('aria-sort', 'none')

    // Columns that can't be sorted stay plain headers.
    const date = screen.getByRole('columnheader', { name: 'Date' })
    expect(date).not.toHaveAttribute('aria-sort')
    expect(within(date).queryByRole('button')).toBeNull()
  })

  it('selects rows with their checkboxes and marks them data-state="selected"', () => {
    render(<TableA />)

    // #CM9807 and #CM9808 start selected (the kit's "2 Selected"), so
    // "Select all" is indeterminate.
    const selectAll = screen.getByRole('checkbox', { name: 'Select all' })
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed')
    expect(screen.getByText('2 Selected')).toBeInTheDocument()
    expect(rowOf('#CM9807')).toHaveAttribute('data-state', 'selected')
    expect(rowOf('#CM9801')).not.toHaveAttribute('data-state')

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select #CM9801' }))
    expect(rowOf('#CM9801')).toHaveAttribute('data-state', 'selected')
    expect(screen.getByText('3 Selected')).toBeInTheDocument()

    fireEvent.click(selectAll)
    for (const id of ['#CM9801', '#CM9805', '#CM9820']) {
      expect(rowOf(id)).toHaveAttribute('data-state', 'selected')
    }
    expect(selectAll).toHaveAttribute('aria-checked', 'true')

    fireEvent.click(selectAll)
    expect(rowOf('#CM9807')).not.toHaveAttribute('data-state')
    expect(selectAll).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByText(/ Selected$/)).toBeNull()
  })

  it('toggles a row with the keyboard', async () => {
    const user = userEvent.setup()
    render(<TableA />)

    const checkbox = screen.getByRole('checkbox', { name: 'Select #CM9802' })
    checkbox.focus()
    await user.keyboard(' ')
    expect(rowOf('#CM9802')).toHaveAttribute('data-state', 'selected')
    await user.keyboard(' ')
    expect(rowOf('#CM9802')).not.toHaveAttribute('data-state')
  })
})
