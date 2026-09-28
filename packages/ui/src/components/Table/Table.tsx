import {
  ArrowLineDownIcon,
  ArrowLineUpDownIcon,
  ArrowLineUpIcon,
} from '@holakirr/snow-ui-icons'
import type { ComponentProps, FC, MouseEventHandler } from 'react'
import { ROLES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'

/*
 * Figma Table: 12 Regular text, 40px rows, cells padded 8/12, a Black/20%
 * line under the header, Black/4% separators between rows, and a Black/4%
 * rounded (12) highlight on hovered and selected rows.
 *
 * The table uses the separate border model (`border-separate border-spacing-0`)
 * because cells can't have rounded corners in the collapsed model, so the
 * lines are drawn on the cells, not on the rows.
 */

type TableProps = ComponentProps<'table'>

const Table: FC<TableProps> = ({ className, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table
      className={twMerge(
        'w-full caption-top border-separate border-spacing-0 text-12 text-black',
        className,
      )}
      {...props}
    />
  </div>
)
Table.displayName = 'Table'

type TableHeaderProps = ComponentProps<'thead'>

const TableHeader: FC<TableHeaderProps> = ({ className, ...props }) => (
  <thead className={className} {...props} />
)
TableHeader.displayName = 'TableHeader'

type TableBodyProps = ComponentProps<'tbody'>

const TableBody: FC<TableBodyProps> = ({ ...props }) => <tbody {...props} />
TableBody.displayName = 'TableBody'

type TableFooterProps = ComponentProps<'tfoot'>

const TableFooter: FC<TableFooterProps> = ({ className, ...props }) => (
  <tfoot
    className={twMerge(
      '[&_td]:border-t [&_td]:border-t-black-20 [&_td]:border-b-0',
      className,
    )}
    {...props}
  />
)
TableFooter.displayName = 'TableFooter'

type TableRowProps = ComponentProps<'tr'>

/**
 * A table row. Hovered rows and rows with `data-state="selected"` get the
 * Figma Black/4% rounded highlight (on their `td` cells; header rows are
 * unaffected).
 */
const TableRow: FC<TableRowProps> = ({ className, ...props }) => (
  <tr
    className={twMerge(
      '[&>td]:transition-colors',
      'hover:[&>td]:bg-black-4 hover:[&>td:first-child]:rounded-l-12 hover:[&>td:last-child]:rounded-r-12',
      'data-[state=selected]:[&>td]:bg-black-4 data-[state=selected]:[&>td:first-child]:rounded-l-12 data-[state=selected]:[&>td:last-child]:rounded-r-12',
      className,
    )}
    {...props}
  />
)
TableRow.displayName = 'TableRow'

type TableSortDirection = 'asc' | 'desc' | false

type TableHeadProps = ComponentProps<'th'> & {
  /**
   * Makes the header a sort button with a sort icon and sets `aria-sort`:
   * `'asc'` / `'desc'` for the sorted column, `false` for a sortable column
   * that isn't sorted, `undefined` for a column that can't be sorted. With
   * TanStack Table pass
   * `column.getCanSort() ? column.getIsSorted() : undefined`.
   */
  sortDirection?: TableSortDirection
  /**
   * Called when the sort button is clicked. With TanStack Table pass
   * `column.getToggleSortingHandler()`.
   */
  onSort?: MouseEventHandler<HTMLButtonElement>
}

const SORT_ICONS = {
  asc: ArrowLineUpIcon,
  desc: ArrowLineDownIcon,
  none: ArrowLineUpDownIcon,
}

const ARIA_SORT = {
  asc: 'ascending',
  desc: 'descending',
  none: 'none',
} as const

const TableHead: FC<TableHeadProps> = ({
  className,
  sortDirection,
  onSort,
  children,
  ...props
}) => {
  const sortable = sortDirection !== undefined
  const sort = sortDirection || 'none'
  const SortIcon = SORT_ICONS[sort]

  return (
    <th
      aria-sort={sortable ? ARIA_SORT[sort] : undefined}
      className={twMerge(
        'h-10 px-3 py-2 text-left align-middle font-normal text-secondary border-b border-black-20',
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={twMerge(
            '-mx-1 inline-flex items-center gap-1 rounded-8 px-1 transition-colors hover:text-black focus-ring',
            sortDirection && 'text-black',
          )}
        >
          {children}
          <SortIcon size={16} className="shrink-0" />
        </button>
      ) : (
        children
      )}
    </th>
  )
}
TableHead.displayName = 'TableHead'

type TableCellProps = ComponentProps<'td'>

const TableCell: FC<TableCellProps> = ({ className, ...props }) => (
  <td
    role={ROLES.cell}
    className={twMerge(
      'h-10 px-3 py-2 align-middle font-normal text-black border-b border-black-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
)
TableCell.displayName = 'TableCell'

type TableCaptionProps = ComponentProps<'caption'>

const TableCaption: FC<TableCaptionProps> = ({ className, ...props }) => (
  <caption
    className={twMerge(
      'mb-1 text-black text-14 font-semibold text-start',
      className,
    )}
    {...props}
  />
)
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableBody,
  type TableBodyProps,
  TableCaption,
  type TableCaptionProps,
  TableCell,
  type TableCellProps,
  TableFooter,
  type TableFooterProps,
  TableHead,
  TableHeader,
  type TableHeaderProps,
  type TableHeadProps,
  type TableProps,
  TableRow,
  type TableRowProps,
  type TableSortDirection,
}
