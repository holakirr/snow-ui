import { DotsThreeOutlineHorizontalIcon } from '@holakirr/snow-ui-icons'
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Figma Table: 12 Regular text, 40px rows, a Black/20% line under the header, Black/4% row separators and a Black/4% rounded highlight on hovered rows and on rows with `data-state="selected"`. `TableHead` becomes a sort button with `sortDirection` / `onSort`.',
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
  date: string
  status: 'In Progress' | 'Complete' | 'Pending' | 'Approved' | 'Rejected'
}

const orders: Order[] = [
  {
    id: '#CM9801',
    user: 'Natali Craig',
    project: 'Landing Page',
    date: 'Just now',
    status: 'In Progress',
  },
  {
    id: '#CM9802',
    user: 'Kate Morrison',
    project: 'CRM Admin pages',
    date: 'A minute ago',
    status: 'Complete',
  },
  {
    id: '#CM9803',
    user: 'Drew Cano',
    project: 'Client Project',
    date: '1 hour ago',
    status: 'Pending',
  },
  {
    id: '#CM9804',
    user: 'Orlando Diggs',
    project: 'Admin Dashboard',
    date: 'Yesterday',
    status: 'Approved',
  },
  {
    id: '#CM9805',
    user: 'Andi Lane',
    project: 'App Landing Page',
    date: 'Feb 2, 2026',
    status: 'Rejected',
  },
  {
    id: '#CM9806',
    user: 'Koray Okumus',
    project: 'Blog Redesign',
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
  // The Figma table checkbox is 16px (the Checkbox component is 28px).
  'size-4 rounded-4 inset-ring-[1.5px] translate-y-0'

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
  { accessorKey: 'date', header: 'Date', enableSorting: false },
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
        className="opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"
        leftContent={<DotsThreeOutlineHorizontalIcon size={16} />}
      />
    ),
    enableSorting: false,
  },
]

/**
 * The Figma "Table A" (Order List): selectable rows (`data-state="selected"`,
 * select-all with an indeterminate state, Space toggles a focused checkbox),
 * sortable headers, a row action on hover and the pagination footer.
 */
export const TableA: Story = {
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

    return (
      <div className="flex w-[892px] flex-col gap-4">
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
                className="group/row"
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
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
                <TableRow key={row.id} className="group/row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
