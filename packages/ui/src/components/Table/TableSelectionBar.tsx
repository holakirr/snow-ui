'use client'

import { Copy } from '@phosphor-icons/react/dist/csr/Copy'
import { Trash } from '@phosphor-icons/react/dist/csr/Trash'
import {
  type ComponentProps,
  type FC,
  type MouseEventHandler,
  useId,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { Button } from '../Button'
import { Separator } from '../Separator'
import { useMessages } from '../SnowUIProvider'

type TableSelectionBarProps = ComponentProps<'div'> & {
  /** How many rows are selected: "2 Selected". */
  count: number
  /**
   * Shows the Delete button (Trash 16), called when it is clicked. The kit
   * then shows a "Deleted" toast with Undo (`toast()` with an `action`).
   */
  onDelete?: MouseEventHandler<HTMLButtonElement>
  /**
   * Shows the Duplicate button (Copy 16), called when it is clicked. The kit
   * puts the copies under the last selected row and selects them.
   */
  onDuplicate?: MouseEventHandler<HTMLButtonElement>
  /**
   * An action is running (the kit shows its Loading spinner in the function
   * bar meanwhile): the Delete and Duplicate buttons are `aria-disabled` and
   * do nothing, but stay in place and keep the focus.
   */
  busy?: boolean
  /**
   * Accessible name of the Delete button.
   * @default messages.table.delete: "Delete"
   */
  deleteLabel?: string
  /**
   * Accessible name of the Duplicate button.
   * @default messages.table.duplicate: "Duplicate"
   */
  duplicateLabel?: string
}

/**
 * The kit's function bar "when data is selected": a Black/10% divider, the
 * number of selected rows and the Delete and Duplicate buttons, 8px apart.
 * Put it in a `TableToolbar` after the toolbar's buttons while rows are
 * selected; your own actions go in `children`, after the two. It is a
 * `role="group"` named by its count. Added in 5.3.
 */
const TableSelectionBar: FC<TableSelectionBarProps> = ({
  count,
  onDelete,
  onDuplicate,
  busy = false,
  deleteLabel,
  duplicateLabel,
  className,
  children,
  ...props
}) => {
  const messages = useMessages()
  const countId = useId()
  // `aria-disabled` rather than `disabled`, so a busy button keeps the focus.
  const busyProps = busy
    ? {
        'aria-disabled': true,
        className:
          'aria-disabled:cursor-not-allowed aria-disabled:text-black-20 aria-disabled:hover:bg-transparent aria-disabled:active:scale-100',
      }
    : undefined

  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of toolbar controls, not form fields
    <div
      role="group"
      aria-labelledby={countId}
      data-slot="table-selection-bar"
      className={twMerge(
        'flex items-center gap-2 text-12 text-black',
        className,
      )}
      {...props}
    >
      {/* The kit's 12px divider, 16px from the count. */}
      <Separator orientation="vertical" className="me-2 h-3" />
      <span id={countId} className="whitespace-nowrap">
        {messages.table.selected(count)}
      </span>
      {onDelete && (
        <Button
          aria-label={deleteLabel ?? messages.table.delete}
          startContent={<Trash size={16} />}
          onClick={busy ? undefined : onDelete}
          {...busyProps}
        />
      )}
      {onDuplicate && (
        <Button
          aria-label={duplicateLabel ?? messages.table.duplicate}
          startContent={<Copy size={16} />}
          onClick={busy ? undefined : onDuplicate}
          {...busyProps}
        />
      )}
      {children}
    </div>
  )
}
TableSelectionBar.displayName = 'TableSelectionBar'

export { TableSelectionBar, type TableSelectionBarProps }
