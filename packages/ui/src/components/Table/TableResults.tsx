'use client'

import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'

type TableResultsProps = Omit<ComponentProps<'p'>, 'children'> & {
  /** How many rows there are, across every page: "105 results". */
  count: number
}

/**
 * The kit's result count under a table, "105 results": 12/16 text in
 * `text-secondary` (the kit's Black/40% is 2.85:1). A `role="status"`
 * region, so a new count (after a search or a filter) is announced
 * politely. The text is `messages.table.results`. Added in 5.3.
 */
const TableResults: FC<TableResultsProps> = ({
  count,
  className,
  ...props
}) => {
  const messages = useMessages()

  return (
    <p
      role="status"
      data-slot="table-results"
      className={twMerge('whitespace-nowrap text-12 text-secondary', className)}
      {...props}
    >
      {messages.table.results(count)}
    </p>
  )
}
TableResults.displayName = 'TableResults'

export { TableResults, type TableResultsProps }
