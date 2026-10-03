import {
  ArrowLineDownIcon,
  ArrowLineUpDownIcon,
  ArrowLineUpIcon,
} from '@holakirr/snow-ui-icons'
import type { ComponentProps, FC, MouseEventHandler } from 'react'
import { ROLES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
import { FilterMark } from './filter-mark'

/*
 * Figma Table: 12 Regular text, 40px rows, cells padded 8/12, a Black/20%
 * line under the header, Black/4% separators between rows, and a Black/4%
 * rounded (12) highlight on hovered and selected rows. Table A (Order List)
 * adds a function bar above it (TableToolbar), row controls that show on
 * hover (TableCell `reveal`) and a "Select all" that shows while the pointer
 * is over the table (TableHead `reveal`).
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
      'hover:[&>td]:bg-black-4 hover:[&>td:first-child]:rounded-s-12 hover:[&>td:last-child]:rounded-e-12',
      'data-[state=selected]:[&>td]:bg-black-4 data-[state=selected]:[&>td:first-child]:rounded-s-12 data-[state=selected]:[&>td:last-child]:rounded-e-12',
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
  /**
   * Shows the cell's elements only while the pointer is over the table, or
   * while they hold the focus, a checked (or mixed) checkbox or an open
   * menu: the kit's "Select all", shown "when the cursor is over the content
   * block". On devices without hover they always show. Added in 5.3.
   */
  reveal?: boolean
  /**
   * Marks a column with an active filter: the kit's FunnelSimple 16 before
   * the label, the label in black, and "Filtered" for screen readers
   * (`messages.table.filtered`). Added in 5.3.
   */
  filtered?: boolean
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

// A selected column's cells with forced colours, which drop the fill.
const SELECTED_FORCED =
  'forced-colors:data-[state=selected]:outline-2 forced-colors:data-[state=selected]:-outline-offset-2 forced-colors:data-[state=selected]:outline-[Highlight]'

// `reveal` on a header cell: as TableCell's, while the pointer isn't over
// the table.
const HEAD_REVEAL =
  '*:transition-opacity [@media(hover:hover)]:[table:not(:hover)_&:not(:focus-within,:has([aria-checked=true],[aria-checked=mixed],[type=checkbox]:checked,[type=checkbox]:indeterminate,[aria-expanded=true]))>*]:opacity-0'

const TableHead: FC<TableHeadProps> = ({
  className,
  sortDirection,
  onSort,
  reveal,
  filtered,
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
        'h-10 px-3 py-2 text-start align-middle font-normal text-secondary border-b border-black-20',
        // A selected column (`data-state="selected"` on its cells): the
        // row highlight, rounded at the top.
        'data-[state=selected]:rounded-t-12 data-[state=selected]:bg-black-4 data-[state=selected]:text-black',
        // Forced colours drop the fill: a Highlight outline instead.
        SELECTED_FORCED,
        filtered && 'text-black',
        reveal && HEAD_REVEAL,
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={twMerge(
            // 16px high in a 40px header cell: `hit-area` (24px, WCAG 2.5.8).
            'relative -mx-1 inline-flex items-center gap-1 rounded-8 px-1 transition-colors hover:text-black focus-ring hit-area',
            sortDirection && 'text-black',
          )}
        >
          {filtered && <FilterMark />}
          {children}
          <SortIcon size={16} className="shrink-0" />
        </button>
      ) : filtered ? (
        // The kit's IconText: the icon 4px before the label.
        <span className="inline-flex items-center gap-1">
          <FilterMark />
          {children}
        </span>
      ) : (
        children
      )}
    </th>
  )
}
TableHead.displayName = 'TableHead'

type TableCellProps = ComponentProps<'td'> & {
  /**
   * Shows the cell's elements only while their row is hovered or selected
   * (`data-state="selected"`), or while they hold the focus, a checked
   * checkbox or an open menu: the Figma row checkbox and "…" action. On
   * devices without hover they always show.
   */
  reveal?: boolean
}

// `reveal`: one rule with every condition in it, so no other utility has to
// win over it. A checked box is a custom one (`aria-checked`) or a native
// `<input type="checkbox">`. Only where the pointer can hover (touch screens
// can't).
const REVEAL =
  '*:transition-opacity [@media(hover:hover)]:[tr:not(:hover,[data-state=selected])>&:not(:focus-within,:has([aria-checked=true],[aria-checked=mixed],[type=checkbox]:checked,[type=checkbox]:indeterminate,[aria-expanded=true]))>*]:opacity-0'

const TableCell: FC<TableCellProps> = ({ className, reveal, ...props }) => (
  <td
    role={ROLES.cell}
    className={twMerge(
      'h-10 px-3 py-2 align-middle font-normal text-black border-b border-black-4 [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      // A selected column: `data-state="selected"` on the cells of a column
      // gives them the row highlight, rounded at the bottom of the last row.
      'data-[state=selected]:bg-black-4 [tr:last-child>&]:data-[state=selected]:rounded-b-12',
      SELECTED_FORCED,
      reveal && REVEAL,
      className,
    )}
    {...props}
  />
)
TableCell.displayName = 'TableCell'

type TableToolbarProps = ComponentProps<'div'>

/**
 * The Figma table "function bar": a Background/2 strip with radius 12 above
 * the table for its actions (add, filter, sort) and a Search. It is padded
 * 8px and at least 44px high; its children are laid out in a row, 16px
 * apart; `ms-auto` pushes one to the end.
 */
const TableToolbar: FC<TableToolbarProps> = ({ className, ...props }) => (
  <div
    data-slot="table-toolbar"
    className={twMerge(
      'flex min-h-11 flex-wrap items-center gap-4 rounded-12 bg-background-2 p-2 text-black',
      className,
    )}
    {...props}
  />
)
TableToolbar.displayName = 'TableToolbar'

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
  TableToolbar,
  type TableToolbarProps,
}
