'use client'

import { FunnelSimple } from '@phosphor-icons/react/dist/csr/FunnelSimple'
import { useMessages } from '../SnowUIProvider'

/**
 * The kit's filter mark of a `TableHead` with `filtered`: FunnelSimple 16
 * before the label, and its screen-reader text. A client module of its own,
 * so the table parts stay server components.
 */
export const FilterMark = () => {
  const messages = useMessages()

  return (
    <>
      <FunnelSimple size={16} aria-hidden className="shrink-0" />
      <span className="sr-only">{messages.table.filtered}</span>
      {/* A word of its own in the header's name; the header lays its
          content out in a flex row, which drops this space. */}{' '}
    </>
  )
}
