'use client'

import { useComposedRefs } from '@radix-ui/react-compose-refs'
import {
  type ComponentProps,
  type FC,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import { LoadingRing } from '../Spinner/ring'

type TableLoadMoreProps = ComponentProps<'div'> & {
  /** More rows are loading: shows the spinner and announces it. */
  loading?: boolean
  /**
   * Called when the element scrolls into view while not `loading`: load the
   * next rows, with `loading` set meanwhile. When `loading` turns false
   * with the element still in view (the rows didn't fill the view, or the
   * request failed) it is called again. Leave it out when there are no more
   * rows, or after an error (show a retry button instead).
   */
  onLoadMore?: () => void
  /**
   * Screen-reader text while `loading`.
   * @default messages.table.loadingMore: "Loading more"
   */
  label?: string
}

/**
 * The kit's "loading data dynamically" under a table: a 40px row with a
 * 16px spinner in the middle while more rows load, instead of pages. With
 * `onLoadMore` it loads them as the user scrolls down to it (an
 * IntersectionObserver), so it suits rows loaded in pages from a server. The
 * spinner is announced ("Loading more") through a live region that is always
 * rendered. Added in 5.3.
 */
const TableLoadMore: FC<TableLoadMoreProps> = ({
  loading = false,
  onLoadMore,
  label,
  className,
  ref,
  ...props
}) => {
  const messages = useMessages()
  const nodeRef = useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(nodeRef, ref)
  // The latest callback, so a new function each render doesn't observe anew.
  const onLoadMoreRef = useRef(onLoadMore)
  useLayoutEffect(() => {
    onLoadMoreRef.current = onLoadMore
  })
  const canLoad = Boolean(onLoadMore) && !loading

  useEffect(() => {
    const node = nodeRef.current
    if (!canLoad || !node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting))
        onLoadMoreRef.current?.()
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [canLoad])

  return (
    <div
      ref={composedRef}
      data-slot="table-load-more"
      className={twMerge('flex h-10 items-center justify-center', className)}
      {...props}
    >
      {loading && <LoadingRing className="size-4 text-black" />}
      <span role="status" className="sr-only">
        {loading ? (label ?? messages.table.loadingMore) : ''}
      </span>
    </div>
  )
}
TableLoadMore.displayName = 'TableLoadMore'

export { TableLoadMore, type TableLoadMoreProps }
