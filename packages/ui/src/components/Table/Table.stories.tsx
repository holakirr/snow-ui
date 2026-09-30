import { DotsThreeOutlineHorizontalIcon } from '@holakirr/snow-ui-icons'
import {
  ArrowsDownUpIcon,
  CalendarBlankIcon,
  FunnelSimpleIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ColumnDef,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { type KeyboardEvent, useRef } from 'react'
import { expect, waitFor, within } from 'storybook/test'
import { animationsEnded } from '../../test/animations'
import { Avatar, AvatarFallback, AvatarGroup } from '../Avatar'
import { Button } from '../Button'
import { Card } from '../Card'
import { Checkbox, Input } from '../Input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../Pagination'
import { Search } from '../Search'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from './Table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25596-130955',
    },
    docs: {
      description: {
        component:
          'Figma Table: 12 Regular text, 40px rows, a Black/20% line under the header, Black/4% row separators and a Black/4% rounded highlight on hovered rows and on rows with `data-state="selected"`. `TableHead` becomes a sort button with `sortDirection` / `onSort`; `TableToolbar` is the function bar above the table, and `TableCell reveal` shows row controls on hover.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Table>

type Order = {
  id: string
  user: string
  project: string
  address: string
  date: string
  status: 'In Progress' | 'Complete' | 'Pending' | 'Approved' | 'Rejected'
}

const orders: Order[] = [
  {
    id: '#CM9801',
    user: 'Natali Craig',
    project: 'Landing Page',
    address: 'Meadow Lane Oakland',
    date: 'Just now',
    status: 'In Progress',
  },
  {
    id: '#CM9802',
    user: 'Kate Morrison',
    project: 'CRM Admin pages',
    address: 'Larry San Francisco',
    date: 'A minute ago',
    status: 'Complete',
  },
  {
    id: '#CM9803',
    user: 'Drew Cano',
    project: 'Client Project',
    address: 'Bagwell Avenue Ocala',
    date: '1 hour ago',
    status: 'Pending',
  },
  {
    id: '#CM9804',
    user: 'Orlando Diggs',
    project: 'Admin Dashboard',
    address: 'Washburn Baton Rouge',
    date: 'Yesterday',
    status: 'Approved',
  },
  {
    id: '#CM9805',
    user: 'Andi Lane',
    project: 'App Landing Page',
    address: 'Nest Lane Olivette',
    date: 'Feb 2, 2026',
    status: 'Rejected',
  },
  {
    id: '#CM9806',
    user: 'Koray Okumus',
    project: 'Blog Redesign',
    address: 'Pine Street Denver',
    date: 'Feb 1, 2026',
    status: 'Complete',
  },
]

// Figma status colours: a dot plus text in the Secondary colour. The
// Secondary colours are 1.7–2.4:1 on white, so only the dot is coloured and
// the text stays black (WCAG 1.4.3); the label carries the meaning (1.4.1).
const STATUS_COLORS: Record<Order['status'], string> = {
  'In Progress': 'bg-purple',
  Complete: 'bg-green',
  Pending: 'bg-blue',
  Approved: 'bg-orange',
  Rejected: 'bg-black-40',
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')

// @tanstack/react-table v9: features and row models are opted into up front.
const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

const checkboxClassName =
  // The Figma table checkbox is 16px (the Checkbox component is 28px), with
  // a 24px pointer target (`hit-area`, WCAG 2.5.8).
  'relative size-4 rounded-4 inset-ring-[1.5px] translate-y-0 hit-area'

const columns: ColumnDef<typeof features, Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className={checkboxClassName}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className={checkboxClassName}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.id}`}
      />
    ),
    enableSorting: false,
  },
  { accessorKey: 'id', header: 'Order ID' },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>{initials(row.original.user)}</AvatarFallback>
        </Avatar>
        {row.original.user}
      </span>
    ),
  },
  { accessorKey: 'project', header: 'Project' },
  { accessorKey: 'address', header: 'Address', enableSorting: false },
  {
    accessorKey: 'date',
    header: 'Date',
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex items-center gap-1">
        <CalendarBlankIcon size={16} aria-hidden className="shrink-0" />
        {row.original.date}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className="flex items-center gap-1">
        <span
          aria-hidden
          className={`size-1.5 rounded-full ${STATUS_COLORS[row.original.status]}`}
        />
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <Button
        aria-label={`More actions for ${row.original.id}`}
        startContent={<DotsThreeOutlineHorizontalIcon size={16} />}
      />
    ),
    enableSorting: false,
  },
]

// The row checkbox and the "…" action show on hover (TableCell `reveal`).
const REVEALED = new Set(['select', 'actions'])

/**
 * The Figma "Table A" (Order List): the function bar (TableToolbar: add,
 * filter and sort buttons, a Search that "/" focuses from within the
 * table), selectable rows (`data-state="selected"`, select-all with an
 * indeterminate state, Space
 * toggles a focused checkbox) whose checkbox and "…" action show on hover,
 * sortable headers and the pagination footer.
 */
export const TableA: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const header = canvas.getByRole('columnheader', { name: /Order ID/ })
    const firstId = () =>
      within(canvas.getAllByRole('row')[1]).getAllByRole('cell')[1].textContent
    const opacity = (element: Element) =>
      Number(getComputedStyle(element).opacity)

    await step('row controls show on focus and on selected rows', async () => {
      // Hover media only: a device without hover always shows them.
      if (!matchMedia('(hover: hover)').matches) return
      const row = canvas
        .getByRole('cell', { name: '#CM9801' })
        .closest('tr') as HTMLElement
      const more = within(row).getByRole('button', { name: /More actions/ })
      await expect(opacity(more)).toBe(0)
      await expect(opacity(within(row).getByRole('checkbox'))).toBe(0)
      // The selected row (#CM9804) keeps its checkbox.
      await expect(
        opacity(canvas.getByRole('checkbox', { name: 'Select #CM9804' })),
      ).toBe(1)
      // It fades in and out: a busy runner may take longer than `waitFor`'s
      // timeout to render the transition.
      more.focus()
      await animationsEnded(more)
      await waitFor(() => expect(opacity(more)).toBe(1))
      more.blur()
      await animationsEnded(more)
      await waitFor(() => expect(opacity(more)).toBe(0))
    })

    await step(
      '"/" in the table focuses the Search, which filters the users',
      async () => {
        const search = canvas.getByRole('searchbox', { name: 'Search users' })
        // Outside the table "/" does nothing (WCAG 2.1.4).
        await userEvent.keyboard('/')
        await expect(search).not.toHaveFocus()
        canvas.getByRole('button', { name: 'Add order' }).focus()
        await userEvent.keyboard('/')
        await expect(search).toHaveFocus()
        await expect(search).toHaveValue('')
        await userEvent.type(search, 'andi')
        await expect(canvas.getAllByRole('row')).toHaveLength(2)
        await userEvent.keyboard('{Escape}')
        await expect(canvas.getAllByRole('row')).toHaveLength(6)
        search.blur()
      },
    )

    await step('a sortable header sorts and sets aria-sort', async () => {
      await expect(header).toHaveAttribute('aria-sort', 'none')
      const sortButton = within(header).getByRole('button', {
        name: /Order ID/,
      })
      await userEvent.click(sortButton)
      const first = header.getAttribute('aria-sort')
      await expect(['ascending', 'descending']).toContain(first)
      const firstRow = firstId()
      await userEvent.click(sortButton)
      await expect(header).toHaveAttribute(
        'aria-sort',
        first === 'ascending' ? 'descending' : 'ascending',
      )
      await expect(firstId()).not.toBe(firstRow)
      // Non-sortable columns have no aria-sort and no button.
      const date = canvas.getByRole('columnheader', { name: 'Date' })
      await expect(date).not.toHaveAttribute('aria-sort')
      await expect(within(date).queryByRole('button')).not.toBeInTheDocument()
    })

    await step('row checkboxes select rows', async () => {
      const all = canvas.getByRole('checkbox', { name: 'Select all' })
      // One row is selected initially: "Select all" is mixed.
      await expect(all).toHaveAttribute('aria-checked', 'mixed')
      const rows = canvas.getAllByRole('checkbox', { name: /^Select #/ })
      const unchecked = rows.find(
        (box) => box.getAttribute('aria-checked') === 'false',
      ) as HTMLElement
      await userEvent.click(unchecked)
      await expect(unchecked).toHaveAttribute('aria-checked', 'true')
      await expect(unchecked.closest('tr')).toHaveAttribute(
        'data-state',
        'selected',
      )

      await userEvent.click(all)
      for (const box of canvas.getAllByRole('checkbox', {
        name: /^Select #/,
      })) {
        await expect(box).toHaveAttribute('aria-checked', 'true')
      }
      await expect(all).toHaveAttribute('aria-checked', 'true')

      await userEvent.click(all)
      for (const box of canvas.getAllByRole('checkbox', {
        name: /^Select #/,
      })) {
        await expect(box).toHaveAttribute('aria-checked', 'false')
      }
    })
  },
  render: () => {
    const table = useTable({
      features,
      data: orders,
      columns,
      enableRowSelection: true,
      initialState: {
        pagination: { pageIndex: 0, pageSize: 5 },
        rowSelection: { '3': true },
      },
    })
    const pageIndex = table.store.state.pagination.pageIndex
    const search = useRef<HTMLInputElement>(null)
    // The "/" hint of the Search is only a hint: the shortcut is bound here,
    // to the table's own region, not the document: a single-character
    // shortcut must only work while its component has focus (WCAG 2.1.4).
    const focusSearch = (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      if (
        event.key !== '/' ||
        target.isContentEditable ||
        target.closest('input, textarea, select')
      )
        return
      event.preventDefault()
      search.current?.focus()
    }

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: it only handles the "/" of the controls inside
      <div className="flex w-[892px] flex-col gap-4" onKeyDown={focusSearch}>
        <TableToolbar>
          <Button
            aria-label="Add order"
            startContent={<PlusIcon size={16} />}
          />
          <Button
            aria-label="Filter"
            startContent={<FunnelSimpleIcon size={16} />}
          />
          <Button
            aria-label="Sort"
            startContent={<ArrowsDownUpIcon size={16} />}
          />
          <Search
            ref={search}
            variant="outline"
            shortcut={['/']}
            placeholder="Search"
            aria-label="Search users"
            className="ms-auto w-40"
            value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('user')?.setFilterValue(event.target.value)
            }
          />
        </TableToolbar>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.id === 'select' ? 'w-8 px-2' : ''}
                    sortDirection={
                      header.column.getCanSort()
                        ? header.column.getIsSorted()
                        : undefined
                    }
                    onSort={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    reveal={REVEALED.has(cell.column.id)}
                    className={cell.column.id === 'select' ? 'w-8 px-2' : ''}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent className="w-full [&>li]:flex-1 [&>li>a]:w-full">
            {table.getPageOptions().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`#page-${page + 1}`}
                  isActive={page === pageIndex}
                  onClick={(event) => {
                    event.preventDefault()
                    table.setPageIndex(page)
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationPrevious
                href="#previous"
                disabled={!table.getCanPreviousPage()}
                onClick={(event) => {
                  event.preventDefault()
                  table.previousPage()
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#next"
                disabled={!table.getCanNextPage()}
                onClick={(event) => {
                  event.preventDefault()
                  table.nextPage()
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  },
}

export const TableADark: Story = {
  ...TableA,
  globals: { theme: 'dark' },
}

/** A filterable list, as in the Figma "Search results" guidance. */
export const Filtered: Story = {
  render: () => {
    const table = useTable({
      features,
      data: orders,
      columns: columns.filter((column) => column.id !== 'select'),
    })

    return (
      <div className="flex w-[720px] flex-col gap-4">
        <Input
          placeholder="Filter projects..."
          value={(table.getColumn('project')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('project')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    <table.FlexRender header={header} />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      reveal={REVEALED.has(cell.column.id)}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-secondary"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  },
}

/** Table B: a compact table inside a dashboard block. */
export const TableB: Story = {
  render: () => (
    <Card variant="block" className="w-[560px]">
      <Table>
        <TableCaption>Tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Assigned to</TableHead>
            <TableHead>Time Spend</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Coffee detail page</TableCell>
            <TableCell>
              <AvatarGroup>
                <Avatar size="sm">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </AvatarGroup>
            </TableCell>
            <TableCell>3hr 20min</TableCell>
            <TableCell>In Progress</TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell>Drinking bottle graphics</TableCell>
            <TableCell>
              <AvatarGroup>
                <Avatar size="sm">
                  <AvatarFallback>GD</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>HD</AvatarFallback>
                </Avatar>
              </AvatarGroup>
            </TableCell>
            <TableCell>3hr 20min</TableCell>
            <TableCell>Complete</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell colSpan={2}>6hr 40min</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  ),
}
