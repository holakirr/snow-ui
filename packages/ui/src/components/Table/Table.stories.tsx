import { DotsThreeOutlineHorizontalIcon } from '@holakirr/snow-ui-icons'
import {
  ArrowDownIcon,
  ArrowsDownUpIcon,
  ArrowUpIcon,
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
  type ReactTable,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { expect, waitFor, within } from 'storybook/test'
import { toast } from '../../hooks'
import { animationsEnded, expectClosed } from '../../test/animations'
import { Avatar, AvatarFallback, AvatarGroup } from '../Avatar'
import { Button } from '../Button'
import { Card } from '../Card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { Checkbox } from '../Input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../Pagination'
import { Search } from '../Search'
import { Spinner } from '../Spinner'
import { ToastAction, Toaster } from '../Toaster'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from './Table'
import { TableCopyButton } from './TableCopyButton'
import { TableLoadMore } from './TableLoadMore'
import { TablePageSize } from './TablePageSize'
import { TableResults } from './TableResults'
import { TableSelectionBar } from './TableSelectionBar'

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
          'Figma Table: 12 Regular text, 40px rows, a Black/20% line under the header, Black/4% row separators and a Black/4% rounded highlight on hovered rows and on rows with `data-state="selected"`. `TableToolbar` is the function bar above the table, `TableCell reveal` shows row controls on hover and `TableHead reveal` the "Select all" while the pointer is over the table. The ready-made parts (5.3) cover the rest of the kit: `TableSelectionBar`, `TableCopyButton`, `TablePageSize`, `TableResults` and `TableLoadMore`.',
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

// The five rows of the kit's Order List, which it repeats.
const KIT_ROWS: Omit<Order, 'id'>[] = [
  {
    user: 'Natali Craig',
    project: 'Landing Page',
    address: 'Meadow Lane Oakland',
    date: 'Just now',
    status: 'In Progress',
  },
  {
    user: 'Kate Morrison',
    project: 'CRM Admin pages',
    address: 'Larry San Francisco',
    date: '1 minute ago',
    status: 'Complete',
  },
  {
    user: 'Drew Cano',
    project: 'Client Project',
    address: 'Bagwell Avenue Ocala',
    date: '1 hour ago',
    status: 'Pending',
  },
  {
    user: 'Orlando Diggs',
    project: 'Admin Dashboard',
    address: 'Washburn Baton Rouge',
    date: 'Yesterday',
    status: 'Approved',
  },
  {
    user: 'Andi Lane',
    project: 'App Landing Page',
    address: 'Nest Lane Olivette',
    date: 'Feb 2, 2026',
    status: 'Rejected',
  },
]

/** `count` orders from the `from`-th: the kit's rows, repeated, with their own IDs. */
const makeOrders = (count: number, from = 0): Order[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `#CM${9801 + from + index}`,
    ...KIT_ROWS[(from + index) % KIT_ROWS.length],
  }))

/** The kit's "105 results". */
const ORDERS = makeOrders(105)
const STATUSES: Order['status'][] = [
  'In Progress',
  'Complete',
  'Pending',
  'Approved',
  'Rejected',
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

type OrdersTable = ReactTable<typeof features, Order>

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
  {
    accessorKey: 'address',
    header: 'Address',
    enableSorting: false,
    // The kit copies the address from a button shown on the cell's hover.
    cell: ({ row }) => (
      <span className="flex items-center gap-1">
        {row.original.address}
        <TableCopyButton
          value={row.original.address}
          aria-label={`Copy the address of ${row.original.id}`}
        />
      </span>
    ),
  },
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
    filterFn: (row, columnId, statuses: Order['status'][]) =>
      statuses.includes(row.getValue(columnId)),
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

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const

/**
 * A sorted header in the kit: the direction arrow before the label, in
 * black, and `aria-sort` on the `<th>`. The sorting itself is the
 * function bar's Sort menu, so the header isn't a button.
 */
const SortedLabel = ({
  direction,
  children,
}: {
  direction: 'asc' | 'desc'
  children: ReactNode
}) => {
  const Arrow = direction === 'asc' ? ArrowUpIcon : ArrowDownIcon
  return (
    <span className="inline-flex items-center gap-1 text-black">
      <Arrow size={16} aria-hidden className="shrink-0" />
      {children}
    </span>
  )
}

/** The header row of the kit's tables: "Select all" shown on hover. */
const OrdersHeader = ({ table }: { table: OrdersTable }) => (
  <TableHeader>
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => {
          const sorted = header.column.getIsSorted()
          const label = header.isPlaceholder ? null : (
            <table.FlexRender header={header} />
          )
          return (
            <TableHead
              key={header.id}
              reveal={header.column.id === 'select'}
              filtered={header.column.getIsFiltered()}
              aria-sort={sorted ? ARIA_SORT[sorted] : undefined}
              className={header.column.id === 'select' ? 'w-8 px-2' : ''}
            >
              {sorted ? (
                <SortedLabel direction={sorted}>{label}</SortedLabel>
              ) : (
                label
              )}
            </TableHead>
          )
        })}
      </TableRow>
    ))}
  </TableHeader>
)

/** The rows of the current page, or the kit's "No results" row. */
const OrdersBody = ({ table }: { table: OrdersTable }) => {
  const rows = table.getRowModel().rows
  return (
    <TableBody>
      {rows.length ? (
        rows.map((row) => (
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
        ))
      ) : (
        <TableRow>
          {/* The kit: an empty select column, then one 40px row in the
              data columns, at the start, Black/40% (here text-secondary,
              its AA stand-in). */}
          <TableCell className="w-8 px-2" />
          <TableCell colSpan={columns.length - 1} className="text-secondary">
            No results
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}

/**
 * The kit's footer: "20 ∨" rows per page and "105 results" 8px apart, then
 * the pages, 40px after them, filling the rest of the width.
 */
const OrdersFooter = ({ table }: { table: OrdersTable }) => {
  const { pageIndex, pageSize } = table.state.pagination
  return (
    <div className="flex items-center gap-10">
      <div className="flex items-center gap-2">
        <TablePageSize
          value={pageSize}
          onValueChange={(size) => table.setPageSize(size)}
        />
        <TableResults count={table.getPrePaginatedRowModel().rows.length} />
      </div>
      <Pagination
        className="flex-1"
        onPageChange={(page) => table.setPageIndex(page - 1)}
      >
        <PaginationContent className="w-full [&>li]:flex-1 [&>li>a]:w-full">
          {table.getPageOptions().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`#page-${page + 1}`}
                page={page + 1}
                isActive={page === pageIndex}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationPrevious
              href="#previous"
              page={pageIndex}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#next"
              page={pageIndex + 2}
              disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

const SORTABLE = columns.filter(
  (column) => column.enableSorting !== false && 'accessorKey' in column,
) as { accessorKey: keyof Order; header: string }[]

/** The function bar's Filter menu: the statuses to show. */
const FilterMenu = ({ table }: { table: OrdersTable }) => {
  const column = table.getColumn('status')
  const statuses = (column?.getFilterValue() as Order['status'][]) ?? []
  const toggle = (status: Order['status'], checked: boolean) => {
    const next = checked
      ? [...statuses, status]
      : statuses.filter((value) => value !== status)
    column?.setFilterValue(next.length ? next : undefined)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Filter"
          startContent={<FunnelSimpleIcon size={16} />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {STATUSES.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={statuses.includes(status)}
            onCheckedChange={(checked) => toggle(status, checked)}
            // Several statuses in one go: the menu stays open.
            onSelect={(event) => event.preventDefault()}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!statuses.length}
          onSelect={() => column?.setFilterValue(undefined)}
        >
          Clear filter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The function bar's Sort menu: the column, then the direction. */
const SortMenu = ({ table }: { table: OrdersTable }) => {
  const [sorted] = table.state.sorting
  const sortBy = (id: string, desc = sorted?.desc ?? false) =>
    table.setSorting([{ id, desc }])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Sort"
          startContent={<ArrowsDownUpIcon size={16} />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sorted?.id ?? ''}
          onValueChange={(id) => sortBy(id)}
        >
          {SORTABLE.map((column) => (
            <DropdownMenuRadioItem
              key={column.accessorKey}
              value={column.accessorKey}
            >
              {column.header}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sorted ? (sorted.desc ? 'desc' : 'asc') : ''}
          onValueChange={(direction) =>
            sorted && sortBy(sorted.id, direction === 'desc')
          }
        >
          <DropdownMenuRadioItem value="asc" disabled={!sorted}>
            Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc" disabled={!sorted}>
            Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!sorted}
          onSelect={() => table.setSorting([])}
        >
          Clear sort
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** How long the story's fake server takes to duplicate rows. */
const DUPLICATE_DELAY = 300

const TableAExample = () => {
  const [data, setData] = useState(ORDERS)
  const nextId = useRef(ORDERS.length)
  const [duplicating, setDuplicating] = useState(false)
  const duplicateTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(duplicateTimer.current), [])
  const table = useTable({
    features,
    data,
    columns,
    getRowId: (order) => order.id,
    enableRowSelection: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 20 },
      // The kit's selected state: two rows and the "2 Selected" bar.
      rowSelection: { '#CM9807': true, '#CM9808': true },
    },
  })
  const root = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const selection = table.state.rowSelection
  const selected = data.filter((order) => selection[order.id])

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

  // The kit: "After deleting, there will be a Global Notification" with
  // Undo, which puts the rows (and their selection) back.
  const deleteSelected = () => {
    const before = data
    const beforeSelection = selection
    setData(data.filter((order) => !selection[order.id]))
    table.resetRowSelection(true)
    // The bar and its buttons are gone: the focus goes to "Select all".
    root.current?.querySelector<HTMLElement>('thead [role="checkbox"]')?.focus()
    toast({
      status: 'success',
      title: 'Deleted',
      action: (
        <ToastAction
          altText="Undo the deletion"
          onClick={() => {
            setData(before)
            table.setRowSelection(beforeSelection)
          }}
        >
          Undo
        </ToastAction>
      ),
    })
  }

  // The kit: the copies go "below the last choice data" and are selected
  // when they are done; the function bar's Loading spinner shows meanwhile.
  const duplicateSelected = () => {
    setDuplicating(true)
    duplicateTimer.current = setTimeout(() => {
      const copies = selected.map((order) => ({
        ...order,
        id: `#CM${9801 + nextId.current++}`,
      }))
      const last = data.indexOf(selected[selected.length - 1])
      setData([...data.slice(0, last + 1), ...copies, ...data.slice(last + 1)])
      table.setRowSelection(
        Object.fromEntries(copies.map((copy) => [copy.id, true])),
      )
      setDuplicating(false)
    }, DUPLICATE_DELAY)
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: it only handles the "/" of the controls inside
    <div
      ref={root}
      className="flex w-[892px] flex-col gap-4"
      onKeyDown={focusSearch}
    >
      <TableToolbar>
        {/* The kit's group of 24px buttons, 8px apart; the Search is 16px
            after it, at the end. */}
        <div className="flex items-center gap-2">
          <Button
            aria-label="Add order"
            startContent={<PlusIcon size={16} />}
          />
          <FilterMenu table={table} />
          <SortMenu table={table} />
          {duplicating && <Spinner size={16} className="mx-1" />}
          {selected.length > 0 && (
            <TableSelectionBar
              count={selected.length}
              className="ms-2"
              onDelete={deleteSelected}
              onDuplicate={duplicating ? undefined : duplicateSelected}
            />
          )}
        </div>
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
        <OrdersHeader table={table} />
        <OrdersBody table={table} />
      </Table>
      <OrdersFooter table={table} />
      <Toaster />
    </div>
  )
}

/**
 * The Figma "Table A" (Order List), as in its interactive guidance: the
 * function bar (TableToolbar) with Add, a Filter menu (the Status header
 * gets the funnel), a Sort menu (the sorted header gets the arrow and
 * `aria-sort`) and a Search that "/" focuses from within the table;
 * selectable rows whose checkbox and "…" show on hover, a "Select all"
 * shown while the pointer is over the table (TableHead `reveal`); the
 * "2 Selected" bar (TableSelectionBar) whose Delete shows a "Deleted" toast
 * with Undo and whose Duplicate puts the copies under the selection; the
 * address copy button (TableCopyButton), and the footer with rows per page
 * (TablePageSize), the result count (TableResults) and the pages.
 */
export const TableA: Story = {
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const dataRows = () => canvas.getAllByRole('row').slice(1)
    const cellOf = (row: HTMLElement, column: number) =>
      within(row).getAllByRole('cell')[column]
    const opacity = (element: Element) =>
      Number(getComputedStyle(element).opacity)
    const hover = matchMedia('(hover: hover)').matches
    const selectAll = () => canvas.getByRole('checkbox', { name: 'Select all' })
    // Opens a menu (or the rows-per-page list) and picks an item. Until the
    // popup's exit animation ends, Radix keeps the rest of the page
    // aria-hidden, so the rows can't be found by role: wait for it.
    const pick = async (
      trigger: HTMLElement,
      role: 'menuitem' | 'menuitemradio' | 'option',
      name: string,
    ) => {
      await userEvent.click(trigger)
      const item = await page.findByRole(role, { name })
      const popup = item.closest('[role="menu"], [role="listbox"]')
      await userEvent.click(item)
      if (!popup) return
      await expectClosed(popup)
      await waitFor(() => expect(popup).not.toBeInTheDocument())
    }
    const sortButton = () => canvas.getByRole('button', { name: 'Sort' })
    const filterButton = () => canvas.getByRole('button', { name: 'Filter' })

    await step('the kit state: two rows selected, "2 Selected"', async () => {
      await expect(dataRows()).toHaveLength(20)
      await expect(canvas.getByText('105 results')).toBeInTheDocument()
      const bar = canvas.getByRole('group', { name: '2 Selected' })
      await expect(
        within(bar).getByRole('button', { name: 'Delete' }),
      ).toBeInTheDocument()
      await expect(
        within(bar).getByRole('button', { name: 'Duplicate' }),
      ).toBeInTheDocument()
      await expect(selectAll()).toHaveAttribute('aria-checked', 'mixed')
    })

    await step('row controls show on focus and on selected rows', async () => {
      // Hover media only: a device without hover always shows them.
      if (!hover) return
      const row = canvas
        .getByRole('cell', { name: '#CM9801' })
        .closest('tr') as HTMLElement
      const more = within(row).getByRole('button', { name: /More actions/ })
      await expect(opacity(more)).toBe(0)
      await expect(opacity(within(row).getByRole('checkbox'))).toBe(0)
      // The copy button shows on its cell's hover or keyboard focus.
      await expect(
        opacity(within(row).getByRole('button', { name: /^Copy/ })),
      ).toBe(0)
      // A selected row keeps its checkbox.
      await expect(
        opacity(canvas.getByRole('checkbox', { name: 'Select #CM9807' })),
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

    await step('"Select all" selects and clears the page', async () => {
      // Mixed: a click selects every row of the page, the next clears it.
      await userEvent.click(selectAll())
      for (const box of canvas.getAllByRole('checkbox', {
        name: /^Select #/,
      })) {
        await expect(box).toHaveAttribute('aria-checked', 'true')
      }
      await expect(
        canvas.getByRole('group', { name: '20 Selected' }),
      ).toBeInTheDocument()
      await userEvent.click(selectAll())
      for (const box of canvas.getAllByRole('checkbox', {
        name: /^Select #/,
      })) {
        await expect(box).toHaveAttribute('aria-checked', 'false')
      }
      await expect(canvas.queryByRole('group', { name: /Selected/ })).toBeNull()
    })

    await step('"Select all" shows on hover, focus or selection', async () => {
      const all = selectAll()
      all.blur()
      // Nothing selected and no pointer over the table: hidden.
      if (hover) {
        await animationsEnded(all)
        await waitFor(() => expect(opacity(all)).toBe(0))
      }
      all.focus()
      await animationsEnded(all)
      await waitFor(() => expect(opacity(all)).toBe(1))
      all.blur()
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
        await expect(canvas.getByText('21 results')).toBeInTheDocument()
        await expect(dataRows()).toHaveLength(20)
        await userEvent.keyboard('{Escape}')
        await expect(canvas.getByText('105 results')).toBeInTheDocument()
        search.blur()
      },
    )

    await step('the Sort menu sorts; the header shows it', async () => {
      const user = canvas.getByRole('columnheader', { name: 'User' })
      await expect(user).not.toHaveAttribute('aria-sort')
      await pick(sortButton(), 'menuitemradio', 'User')
      await expect(user).toHaveAttribute('aria-sort', 'ascending')
      await expect(cellOf(dataRows()[0], 2)).toHaveTextContent('Andi Lane')
      await pick(sortButton(), 'menuitemradio', 'Descending')
      await expect(user).toHaveAttribute('aria-sort', 'descending')
      await expect(cellOf(dataRows()[0], 2)).toHaveTextContent('Orlando Diggs')
      // The header is text, not a sort button.
      await expect(within(user).queryByRole('button')).toBeNull()
      await pick(sortButton(), 'menuitem', 'Clear sort')
      await expect(user).not.toHaveAttribute('aria-sort')
    })

    await step('the Filter menu filters; the header shows it', async () => {
      await userEvent.click(filterButton())
      await userEvent.click(
        await page.findByRole('menuitemcheckbox', { name: 'Pending' }),
      )
      // A checkbox item leaves the menu open: Escape closes it.
      const menu = page.getByRole('menu')
      await userEvent.keyboard('{Escape}')
      await expectClosed(menu)
      await waitFor(() => expect(menu).not.toBeInTheDocument())
      await expect(canvas.getByText('21 results')).toBeInTheDocument()
      // The funnel, and "Filtered" for screen readers.
      await expect(
        canvas.getByRole('columnheader', { name: 'Filtered Status' }),
      ).toBeInTheDocument()
      await pick(filterButton(), 'menuitem', 'Clear filter')
      await expect(
        canvas.getByRole('columnheader', { name: 'Status' }),
      ).toBeInTheDocument()
      await expect(canvas.getByText('105 results')).toBeInTheDocument()
    })

    await step('rows per page: 20, 50 or 100', async () => {
      const size = canvas.getByRole('combobox', { name: 'Rows per page' })
      await expect(size).toHaveTextContent('20')
      await pick(size, 'option', '50')
      await expect(dataRows()).toHaveLength(50)
      await expect(size).toHaveTextContent('50')
    })

    await step(
      'Duplicate puts selected copies under the selection',
      async () => {
        await userEvent.click(
          canvas.getByRole('checkbox', { name: 'Select #CM9807' }),
        )
        await userEvent.click(
          canvas.getByRole('checkbox', { name: 'Select #CM9808' }),
        )
        const bar = canvas.getByRole('group', { name: '2 Selected' })
        await userEvent.click(
          within(bar).getByRole('button', { name: 'Duplicate' }),
        )
        // The function bar's Loading spinner, while the copies are made.
        await expect(canvas.getByText('Loading')).toBeInTheDocument()
        await waitFor(() =>
          expect(canvas.getByRole('cell', { name: '#CM9906' })).toBeVisible(),
        )
        await expect(
          dataRows()
            .slice(6, 10)
            .map((row) => cellOf(row, 1).textContent),
        ).toEqual(['#CM9807', '#CM9808', '#CM9906', '#CM9907'])
        await expect(
          canvas.getByRole('checkbox', { name: 'Select #CM9906' }),
        ).toHaveAttribute('aria-checked', 'true')
        await expect(
          canvas.getByRole('checkbox', { name: 'Select #CM9807' }),
        ).toHaveAttribute('aria-checked', 'false')
        await expect(canvas.getByText('107 results')).toBeInTheDocument()
      },
    )

    await step('Delete shows "Deleted" with Undo, which restores', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Delete' }))
      await expect(
        canvas.queryByRole('cell', { name: '#CM9906' }),
      ).not.toBeInTheDocument()
      await expect(canvas.getByText('105 results')).toBeInTheDocument()
      // The bar is gone; the focus is on "Select all".
      await expect(canvas.queryByRole('group', { name: /Selected/ })).toBeNull()
      await expect(selectAll()).toHaveFocus()
      // Undo closes the toast, so it doesn't outlive the story; wait for its
      // exit, as it covers the pages below it until then.
      const undo = await page.findByRole('button', { name: 'Undo' })
      const deleted = undo.closest('li') as HTMLElement
      await userEvent.click(undo)
      await expectClosed(deleted)
      await waitFor(() => expect(deleted).not.toBeInTheDocument())
      await waitFor(() =>
        expect(canvas.getByRole('cell', { name: '#CM9906' })).toBeVisible(),
      )
      await expect(
        canvas.getByRole('checkbox', { name: 'Select #CM9906' }),
      ).toHaveAttribute('aria-checked', 'true')
      await expect(canvas.getByText('107 results')).toBeInTheDocument()
      // Back to 20 rows: the kit's state, for the screenshot.
      const size = canvas.getByRole('combobox', { name: 'Rows per page' })
      await pick(size, 'option', '20')
      await expect(dataRows()).toHaveLength(20)
      size.blur()
    })
  },
  render: () => <TableAExample />,
}

export const TableADark: Story = {
  ...TableA,
  globals: { theme: 'dark' },
}

/** The kit's "In progress" search: results come this long after a key. */
const SEARCH_DELAY = 300

/**
 * The Figma "Search results" guidance: the results replace the rows as you
 * type, with the Search "In progress" (`status="progress"`) until they come.
 */
const SearchTable = ({ defaultQuery = '' }: { defaultQuery?: string }) => {
  const [query, setQuery] = useState(defaultQuery)
  const table = useTable({
    features,
    data: ORDERS,
    columns,
    getRowId: (order) => order.id,
    enableRowSelection: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 20 },
      columnFilters: defaultQuery ? [{ id: 'user', value: defaultQuery }] : [],
    },
  })
  const column = table.getColumn('user')
  const applied = (column?.getFilterValue() as string | undefined) ?? ''
  const searching = query !== applied

  // A fake server: the results of the last query, SEARCH_DELAY later.
  useEffect(() => {
    if (!searching) return
    const timer = setTimeout(
      () => column?.setFilterValue(query || undefined),
      SEARCH_DELAY,
    )
    return () => clearTimeout(timer)
  }, [searching, query, column])

  return (
    <div className="flex w-[892px] flex-col gap-4">
      <TableToolbar>
        <div className="flex items-center gap-2">
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
        </div>
        <Search
          variant="outline"
          placeholder="Search"
          aria-label="Search users"
          className="ms-auto w-40"
          status={searching ? 'progress' : undefined}
          value={query}
          onValueChange={setQuery}
        />
      </TableToolbar>
      <Table>
        <OrdersHeader table={table} />
        <OrdersBody table={table} />
      </Table>
      <OrdersFooter table={table} />
    </div>
  )
}

/**
 * Search results: typing a user's name shows the Search "In progress" until
 * the results replace the rows, and the result count follows them.
 */
export const SearchResults: Story = {
  play: async ({ canvas, userEvent }) => {
    const search = canvas.getByRole('searchbox', { name: 'Search users' })
    await userEvent.type(search, 'kate')
    await expect(search).toHaveAttribute('aria-busy', 'true')
    await waitFor(() =>
      expect(canvas.getByText('21 results')).toBeInTheDocument(),
    )
    await expect(search).not.toHaveAttribute('aria-busy')
    for (const row of canvas.getAllByRole('row').slice(1)) {
      await expect(row).toHaveTextContent('Kate Morrison')
    }
  },
  render: () => <SearchTable />,
}

/** Figma "No results": the search matches no row. */
export const NoResults: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('row')).toHaveLength(2)
    await expect(canvas.getByRole('cell', { name: 'No results' })).toBeVisible()
    await expect(canvas.getByText('0 results')).toBeInTheDocument()
  },
  render: () => <SearchTable defaultQuery="Typing" />,
}

const sortableColumns = columns.filter(
  (column) =>
    column.id !== 'select' &&
    column.id !== 'actions' &&
    !('accessorKey' in column && column.accessorKey === 'address'),
)

/**
 * Sort buttons in the headers: `sortDirection` makes a `TableHead` a
 * button with a sort icon and sets `aria-sort`, `onSort` sorts. The kit
 * sorts from the function bar instead (Table A); this is the alternative
 * for a table without one.
 */
export const SortableHeaders: Story = {
  play: async ({ canvas, userEvent }) => {
    const header = canvas.getByRole('columnheader', { name: /Order ID/ })
    const firstId = () =>
      within(canvas.getAllByRole('row')[1]).getAllByRole('cell')[0].textContent
    await expect(header).toHaveAttribute('aria-sort', 'none')
    const sortButton = within(header).getByRole('button', { name: /Order ID/ })
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
  },
  render: () => {
    const table = useTable({
      features,
      data: ORDERS.slice(0, 5),
      columns: sortableColumns,
    })

    return (
      <Table className="w-[720px]" aria-label="Orders">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  sortDirection={
                    header.column.getCanSort()
                      ? header.column.getIsSorted()
                      : undefined
                  }
                  onSort={header.column.getToggleSortingHandler()}
                >
                  <table.FlexRender header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}

/** How many rows the LoadMore story loads at a time, and how fast. */
const LOAD_COUNT = 10
const LOAD_MAX = 40
const LOAD_DELAY = 300

const LoadMoreExample = () => {
  const [rows, setRows] = useState(() => makeOrders(LOAD_COUNT))
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const loadMore = () => {
    setLoading(true)
    timer.current = setTimeout(() => {
      setRows((current) => [
        ...current,
        ...makeOrders(LOAD_COUNT, current.length),
      ])
      setLoading(false)
    }, LOAD_DELAY)
  }

  return (
    // The rows scroll inside the block; the spinner row is right under the
    // last row, as in the kit.
    // A scrolling region the keyboard can reach and scroll.
    <section
      data-testid="scroller"
      aria-label="Order list"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: it scrolls with the arrow keys
      tabIndex={0}
      className="h-[400px] w-[720px] overflow-auto rounded-12 scrollbar-snow focus-ring"
    >
      <Table aria-label="Orders">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.user}</TableCell>
              <TableCell>{order.project}</TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length < LOAD_MAX && (
        <TableLoadMore loading={loading} onLoadMore={loadMore} />
      )}
    </section>
  )
}

/**
 * The kit's "Loading data dynamically": no pages; scrolling to the end of
 * the rows loads the next ones (TableLoadMore), with the spinner under the
 * table meanwhile.
 */
export const LoadMore: Story = {
  play: async ({ canvas }) => {
    const rows = () => canvas.getAllByRole('row').slice(1)
    await expect(rows()).toHaveLength(LOAD_COUNT)
    await expect(canvas.queryByText('Loading more')).toBeNull()
    const scroller = canvas.getByTestId('scroller')
    scroller.scrollTop = scroller.scrollHeight
    await waitFor(() =>
      expect(canvas.getByText('Loading more')).toBeInTheDocument(),
    )
    await waitFor(() => expect(rows()).toHaveLength(LOAD_COUNT * 2), {
      timeout: 3000,
    })
    // The new rows push it out of view: no more loading.
    await expect(canvas.queryByText('Loading more')).toBeNull()
    scroller.scrollTop = 0
  },
  render: () => <LoadMoreExample />,
}

type ColumnId = 'id' | 'user' | 'project' | 'status'

const SELECTABLE_COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'id', label: 'Order ID' },
  { id: 'user', label: 'User' },
  { id: 'project', label: 'Project' },
  { id: 'status', label: 'Status' },
]

const ColumnSelectionExample = () => {
  const [selected, setSelected] = useState<ColumnId[]>([])
  const anchor = useRef<ColumnId | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // The kit: "click the area outside the table to cancel the choice".
  useEffect(() => {
    const clear = (event: PointerEvent) => {
      if (!tableRef.current?.contains(event.target as Node)) setSelected([])
    }
    document.addEventListener('pointerdown', clear)
    return () => document.removeEventListener('pointerdown', clear)
  }, [])

  // As in the system's lists: a click selects one column, Ctrl (⌘ on a
  // Mac) adds or removes one, Shift selects the range from the last one.
  const select = (id: ColumnId, event: MouseEvent) => {
    const ids = SELECTABLE_COLUMNS.map((column) => column.id)
    if (event.shiftKey && anchor.current) {
      const [from, to] = [ids.indexOf(anchor.current), ids.indexOf(id)].sort(
        (a, b) => a - b,
      )
      setSelected(ids.slice(from, to + 1))
      return
    }
    anchor.current = id
    if (event.ctrlKey || event.metaKey) {
      setSelected(
        selected.includes(id)
          ? selected.filter((column) => column !== id)
          : [...selected, id],
      )
      return
    }
    setSelected(selected.length === 1 && selected[0] === id ? [] : [id])
  }
  const state = (id: ColumnId) =>
    selected.includes(id) ? 'selected' : undefined

  return (
    <div ref={tableRef} className="w-[720px]">
      <Table aria-label="Orders">
        <TableHeader>
          <TableRow>
            {SELECTABLE_COLUMNS.map((column) => (
              <TableHead key={column.id} data-state={state(column.id)}>
                {/* The keyboard way to select a column: its header is a
                    toggle button, with the same modifier keys. */}
                <button
                  type="button"
                  aria-pressed={selected.includes(column.id)}
                  onClick={(event) => select(column.id, event)}
                  className="relative -mx-1 rounded-8 px-1 transition-colors hover:text-black focus-ring hit-area"
                >
                  {column.label}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ORDERS.slice(0, 5).map((order) => (
            <TableRow key={order.id}>
              {SELECTABLE_COLUMNS.map((column) => (
                <TableCell
                  key={column.id}
                  data-state={state(column.id)}
                  // The kit: a click "on the blank area in the column",
                  // not on its text. The header's toggle button is the
                  // keyboard way.
                  onClick={(event) => {
                    if (event.target === event.currentTarget)
                      select(column.id, event)
                  }}
                >
                  <span>{order[column.id]}</span>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * The kit's column selection: a click on the blank area of a column (or on
 * its header, which is a toggle button for the keyboard) selects it; Ctrl
 * (⌘) adds a column, Shift a range; a click outside the table clears it.
 * The selected cells have `data-state="selected"`, which gives them the row
 * highlight, rounded at the top of the header and the bottom of the column.
 */
export const ColumnSelection: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const header = (name: string) => canvas.getByRole('button', { name })
    const project = canvas.getAllByRole('cell')[2]
    await userEvent.click(project)
    await expect(header('Project')).toHaveAttribute('aria-pressed', 'true')
    await expect(project).toHaveAttribute('data-state', 'selected')
    await expect(
      canvas.getByRole('columnheader', { name: 'Project' }),
    ).toHaveAttribute('data-state', 'selected')
    // A click on the text isn't on the blank area.
    await userEvent.click(within(canvas.getAllByRole('cell')[0]).getByText(/#/))
    await expect(header('Order ID')).toHaveAttribute('aria-pressed', 'false')

    await userEvent.keyboard('{Control>}')
    await userEvent.click(header('Order ID'))
    await userEvent.keyboard('{/Control}')
    await expect(header('Order ID')).toHaveAttribute('aria-pressed', 'true')
    await expect(header('Project')).toHaveAttribute('aria-pressed', 'true')

    // Shift: the range from the last column clicked (Order ID).
    await userEvent.keyboard('{Shift>}')
    await userEvent.click(header('Project'))
    await userEvent.keyboard('{/Shift}')
    for (const name of ['Order ID', 'User', 'Project']) {
      await expect(header(name)).toHaveAttribute('aria-pressed', 'true')
    }
    await expect(header('Status')).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(canvasElement.ownerDocument.body)
    for (const name of ['Order ID', 'User', 'Project', 'Status']) {
      await expect(header(name)).toHaveAttribute('aria-pressed', 'false')
    }
  },
  render: () => <ColumnSelectionExample />,
}

/**
 * Table B: a compact table inside a dashboard block. Figma: no lines between
 * the rows, the first column's text on the caption's edge, and no total row.
 */
export const TableB: Story = {
  render: () => (
    <Card variant="block" className="w-[560px]">
      <Table className="[&_td]:border-b-0 [&_td:first-child]:ps-0 [&_th:first-child]:ps-0">
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
          <TableRow>
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
      </Table>
    </Card>
  ),
}
