'use client'

import { Check } from '@phosphor-icons/react/dist/csr/Check'
import { ClipboardText } from '@phosphor-icons/react/dist/csr/ClipboardText'
import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'

type TableCopyButtonProps = Omit<
  ComponentProps<'button'>,
  'value' | 'children'
> & {
  /** The text to copy to the clipboard. */
  value: string
  /** Called with `value` once it is on the clipboard. */
  onCopy?: (value: string) => void
}

/** How long the check mark replaces the clipboard icon after a copy. */
const COPIED_DURATION = 2000

/**
 * The kit's copy button in a table cell: a 16px ClipboardText that shows
 * while the pointer is over its cell (`td` or `th`) or while it has the
 * keyboard focus; on devices without hover it always shows. A click copies
 * `value` with the Clipboard API, turns the icon into a check mark for 2
 * seconds and announces "Copied" (`messages.table.copied`). It has a 24px
 * pointer target (WCAG 2.5.8). Added in 5.3.
 */
const TableCopyButton: FC<TableCopyButtonProps> = ({
  value,
  onCopy,
  onClick,
  className,
  'aria-label': ariaLabel,
  ...props
}) => {
  const messages = useMessages()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Denied (no permission, or the page isn't focused): nothing copied.
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_DURATION)
    onCopy?.(value)
  }

  const Icon = copied ? Check : ClipboardText

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel ?? messages.table.copy}
        data-state={copied ? 'copied' : undefined}
        onClick={copy}
        className={twMerge(
          'relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-4 align-middle text-black transition-opacity focus-ring hit-area disabled:cursor-not-allowed disabled:text-black-20',
          // Shown while the pointer is over the cell, or on keyboard focus.
          '[@media(hover:hover)]:[:is(td,th):not(:hover)_&:not(:focus-visible)]:opacity-0',
          className,
        )}
        {...props}
      >
        <Icon size={16} aria-hidden />
      </button>
      {/* Always rendered, so the change to "Copied" is announced. */}
      <span role="status" className="sr-only">
        {copied ? messages.table.copied : ''}
      </span>
    </>
  )
}
TableCopyButton.displayName = 'TableCopyButton'

export { TableCopyButton, type TableCopyButtonProps }
