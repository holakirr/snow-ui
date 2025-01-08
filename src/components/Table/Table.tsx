import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { ROLES } from '../../constants'

type TableProps = ComponentProps<'table'>

const Table: FC<TableProps> = ({ className, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table
      aria-label="Data Table"
      className={twMerge('w-full caption-top text-xs', className)}
      {...props}
    />
  </div>
)
Table.displayName = 'Table'

type TableHeaderProps = ComponentProps<'thead'>

const TableHeader: FC<TableHeaderProps> = ({ className, ...props }) => (
  <thead
    className={twMerge('[&_tr]:border-b border-black/20', className)}
    {...props}
  />
)
TableHeader.displayName = 'TableHeader'

type TableBodyProps = ComponentProps<'tbody'>

const TableBody: FC<TableBodyProps> = ({ ...props }) => <tbody {...props} />
TableBody.displayName = 'TableBody'

type TableFooterProps = ComponentProps<'tfoot'>

const TableFooter: FC<TableFooterProps> = ({ className, ...props }) => (
  <tfoot
    className={twMerge('[&_tr]:border-t border-t-black/20', className)}
    {...props}
  />
)
TableFooter.displayName = 'TableFooter'

type TableRowProps = ComponentProps<'tr'>

const TableRow: FC<TableRowProps> = ({ ...props }) => <tr {...props} />
TableRow.displayName = 'TableRow'

type TableHeadProps = ComponentProps<'th'>

const TableHead: FC<TableHeadProps> = ({ className, ...props }) => (
  <th
    className={twMerge(
      'h-10 px-3 py-2 text-left align-middle text-black/40 first-of-type:ps-0 font-light',
      className,
    )}
    {...props}
  />
)
TableHead.displayName = 'TableHead'

type TableCellProps = ComponentProps<'td'>

const TableCell: FC<TableCellProps> = ({ className, ...props }) => (
  <td
    role={ROLES.cell}
    className={twMerge(
      'py-2 px-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] first-of-type:ps-0 text-black font-light',
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
      'mb-1 text-black text-sm font-semibold text-start',
      className,
    )}
    {...props}
  />
)
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableBodyProps,
  type TableCaptionProps,
  type TableCellProps,
  type TableFooterProps,
  type TableHeaderProps,
  type TableHeadProps,
  type TableProps,
  type TableRowProps,
}
