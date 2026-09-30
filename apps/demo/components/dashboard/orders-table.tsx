'use client'

import {
  Button,
  Checkbox,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Search,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableSortDirection,
  TableToolbar,
  Typography,
  toast,
} from '@holakirr/snow-ui'
import { DotsThreeOutlineHorizontalIcon } from '@holakirr/snow-ui-icons'
import { useMemo, useState } from 'react'
import { usePreferences } from '@/app/providers'
import { InitialsAvatar } from '@/components/initials-avatar'
import { type Order, type OrderStatus, orders } from '@/lib/data'
import { formatAgo } from '@/lib/format'
import { intlLocale } from '@/lib/preferences'

const PAGE_SIZE = 6

type SortKey = 'id' | 'user' | 'project' | 'address' | 'minutesAgo' | 'status'
type Sort = { key: SortKey; direction: 'asc' | 'desc' } | null

// Figma status colours: a dot in the Secondary colour. They are 1.7–2.4:1 on
// white, so the label stays black (WCAG 1.4.3) and carries the meaning.
const STATUS_DOTS: Record<OrderStatus, string> = {
  progress: 'bg-purple',
  complete: 'bg-green',
  pending: 'bg-blue',
  approved: 'bg-orange',
  rejected: 'bg-black-40',
}

// The Figma table checkbox is 16px (the Checkbox component is 28px).
const checkboxClassName = 'size-4 rounded-4 inset-ring-[1.5px] translate-y-0'

/**
 * Figma "Table A" (Order List): sortable headers (`aria-sort`), selectable
 * rows (select-all with an indeterminate state), a search filter and
 * pagination. Plain React state; the library's Table parts also work with
 * TanStack Table.
 */
export const OrdersTable = ({ captionId }: { captionId: string }) => {
  const { lang, dict } = usePreferences()
  const t = dict.orders
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>(null)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set(['#CM9804']),
  )

  const collator = useMemo(() => new Intl.Collator(intlLocale(lang)), [lang])

  const rows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(intlLocale(lang))
    const filtered = needle
      ? orders.filter((order) =>
          [
            order.id,
            order.user,
            order.project,
            order.address,
            t.status[order.status],
          ]
            .join(' ')
            .toLocaleLowerCase(intlLocale(lang))
            .includes(needle),
        )
      : orders
    if (!sort) return filtered
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const key = sort.key
      if (key === 'minutesAgo') return (a[key] - b[key]) * factor
      const left = key === 'status' ? t.status[a.status] : a[key]
      const right = key === 'status' ? t.status[b.status] : b[key]
      return collator.compare(left, right) * factor
    })
  }, [query, sort, lang, t, collator])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const pageRows = rows.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)
  const pageSelected = pageRows.filter((row) => selected.has(row.id)).length
  const allOnPage = pageRows.length > 0 && pageSelected === pageRows.length

  const sortDirection = (key: SortKey): TableSortDirection =>
    sort?.key === key ? sort.direction : false

  const toggleSort = (key: SortKey) => {
    setSort((previous) =>
      previous?.key !== key
        ? { key, direction: 'asc' }
        : previous.direction === 'asc'
          ? { key, direction: 'desc' }
          : null,
    )
    setPage(0)
  }

  const toggleRow = (id: string, checked: boolean) =>
    setSelected((previous) => {
      const next = new Set(previous)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })

  const togglePage = (checked: boolean) =>
    setSelected((previous) => {
      const next = new Set(previous)
      for (const row of pageRows) {
        if (checked) next.add(row.id)
        else next.delete(row.id)
      }
      return next
    })

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: 'id', label: t.columns.id },
    { key: 'user', label: t.columns.user },
    { key: 'project', label: t.columns.project, className: 'max-md:hidden' },
    { key: 'address', label: t.columns.address, className: 'max-lg:hidden' },
    { key: 'minutesAgo', label: t.columns.date, className: 'max-sm:hidden' },
    { key: 'status', label: t.columns.status },
  ]

  const cell = (order: Order, key: SortKey) => {
    switch (key) {
      case 'user':
        return (
          <span className="flex items-center gap-2">
            <InitialsAvatar name={order.user} />
            {order.user}
          </span>
        )
      case 'minutesAgo':
        return formatAgo(lang, order.minutesAgo, dict.app.justNow)
      case 'status':
        return (
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={`size-1.5 shrink-0 rounded-full ${STATUS_DOTS[order.status]}`}
            />
            {t.status[order.status]}
          </span>
        )
      default:
        return order[key]
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <TableToolbar className="justify-between">
        <Typography
          size={12}
          className="px-2 text-secondary"
          role="status"
          aria-live="polite"
        >
          {selected.size > 0 ? t.selected(selected.size) : ''}
        </Typography>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <Button
              variant="outline"
              label={t.clearSelection}
              onClick={() => setSelected(new Set())}
            />
          )}
          <Search
            variant="outline"
            aria-label={t.filter}
            placeholder={t.filter}
            value={query}
            onValueChange={(value) => {
              setQuery(value)
              setPage(0)
            }}
            className="w-40"
          />
        </div>
      </TableToolbar>
      <div className="overflow-x-auto">
        <Table aria-labelledby={captionId} className="text-12">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 px-2">
                <Checkbox
                  className={checkboxClassName}
                  checked={
                    allOnPage || (pageSelected > 0 ? 'indeterminate' : false)
                  }
                  onCheckedChange={(value) => togglePage(value === true)}
                  aria-label={t.selectAll}
                />
              </TableHead>
              {columns.map(({ key, label, className }) => (
                <TableHead
                  key={key}
                  className={className}
                  sortDirection={sortDirection(key)}
                  onSort={() => toggleSort(key)}
                >
                  {label}
                </TableHead>
              ))}
              <TableHead className="w-10">
                <span className="sr-only">{t.columns.actions}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((order) => {
              const isSelected = selected.has(order.id)
              return (
                <TableRow
                  key={order.id}
                  data-state={isSelected ? 'selected' : undefined}
                >
                  {/* Figma: the row checkbox and "…" show on hover. */}
                  <TableCell reveal className="w-8 px-2">
                    <Checkbox
                      className={checkboxClassName}
                      checked={isSelected}
                      onCheckedChange={(value) =>
                        toggleRow(order.id, value === true)
                      }
                      aria-label={`${t.select} ${order.id}`}
                    />
                  </TableCell>
                  {columns.map(({ key, className }) => (
                    <TableCell key={key} className={className}>
                      {cell(order, key)}
                    </TableCell>
                  ))}
                  <TableCell reveal className="w-10">
                    <Button
                      aria-label={`${t.moreActions} ${order.id}`}
                      startContent={
                        <DotsThreeOutlineHorizontalIcon size={16} />
                      }
                      onClick={() =>
                        toast({ title: order.id, description: order.project })
                      }
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`#orders-page-${current}`}
              disabled={current === 0}
              onClick={(event) => {
                event.preventDefault()
                setPage(current - 1)
              }}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: pages are indexes
            <PaginationItem key={index}>
              <PaginationLink
                href={`#orders-page-${index + 1}`}
                isActive={index === current}
                onClick={(event) => {
                  event.preventDefault()
                  setPage(index)
                }}
              >
                {(index + 1).toLocaleString(intlLocale(lang))}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`#orders-page-${current + 2}`}
              disabled={current >= pageCount - 1}
              onClick={(event) => {
                event.preventDefault()
                setPage(current + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
