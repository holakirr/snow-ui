'use client'

import { SearchIcon, XCircleIcon } from '@holakirr/snow-ui-icons'
import { cva } from 'class-variance-authority'
import {
  type ChangeEvent,
  type ComponentProps,
  type FC,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import { KBD } from '../Text'

export type SearchVariant = 'gray' | 'outline'

export type SearchSize = 'sm' | 'lg'

// Figma "Search" (set 33509:43630): 28px high, padding 4/8, gap 8, radius 16,
// background blur 20 (= 10px in CSS). Gray: Black/4% → Black/10% on hover;
// Outline: Surface/1 with a 0.5px Black/20% stroke → Black/40% on hover. On
// focus both become Surface/1 + 0.5px Black/40% + the Focus ring. Invalid
// (the <input> has `aria-invalid="true"`; no Figma state): a 1px
// Secondary/Red stroke in every state, like Input. The stroke colours are
// the `control-border*` tokens; with more contrast the stroke is 1px and the
// gray field gets one too (its fill alone is 1.1:1, WCAG 1.4.11).
const searchStyles = cva(
  'group/search relative flex items-center gap-2 text-black backdrop-blur-[10px] transition-[background-color,box-shadow] focus-within:bg-surface-1 focus-within:inset-ring-[0.5px] focus-within:inset-ring-control-border-strong focus-within:ring-4 focus-within:ring-focus has-aria-invalid:inset-ring has-aria-invalid:inset-ring-control-border-invalid has-disabled:pointer-events-none has-disabled:opacity-40 contrast-more:inset-ring-1 contrast-more:focus-within:inset-ring-1',
  {
    variants: {
      variant: {
        gray: 'bg-black-4 hover:bg-black-10 contrast-more:inset-ring-control-border',
        outline:
          'bg-surface-1 inset-ring-[0.5px] inset-ring-control-border hover:inset-ring-control-border-strong',
      },
      size: {
        // The input is the field's full height (`h-full`), not 20px inside
        // 4px paddings, so the whole 28px is its target (WCAG 2.5.8).
        sm: 'h-7 rounded-16 px-2 text-14',
        // The 48px field at the top of the Figma SearchPopup.
        lg: 'h-12 rounded-16 px-2 text-18',
      },
    },
    defaultVariants: {
      variant: 'gray',
      size: 'sm',
    },
  },
)

/**
 * Props for the Search component. Everything except the listed props goes to
 * the `<input type="search">`; `className` styles the field.
 */
export type SearchProps = Omit<ComponentProps<'input'>, 'size' | 'type'> & {
  /**
   * Figma `Type`: a gray fill or an outline.
   * @default 'gray'
   */
  variant?: SearchVariant

  /**
   * `sm` is the 28px Figma Search; `lg` is the 48px field of the SearchPopup.
   * @default 'sm'
   */
  size?: SearchSize

  /**
   * Keys of the keyboard shortcut to show as a hint while the field is empty,
   * e.g. `['/']` or `['⌘', 'K']`. It is only a hint: bind the shortcut in your
   * app (CommandPalette has a `hotkey` prop).
   */
  shortcut?: string[]

  /**
   * Called with the new value whenever it changes: as the user types and
   * when the field is cleared. The value-only counterpart of `onChange`,
   * named like the other components' `onValueChange`.
   */
  onValueChange?: (value: string) => void

  /**
   * Called after the clear button (shown while the field has a value) or
   * Escape clears the field. `onChange` and `onValueChange` are also called,
   * with an empty value.
   */
  onClear?: () => void

  /**
   * Accessible name of the clear button.
   * @default messages.search.clear: "Clear search"
   */
  clearLabel?: string

  /**
   * Extra content at the end of the field, before the clear button (e.g. a
   * spinner or a filter button).
   */
  endContent?: ReactNode

  /**
   * Class name for the `<input>` element.
   */
  inputClassName?: string
}

const iconSizes: Record<SearchSize, number> = { sm: 16, lg: 24 }
const clearIconSizes: Record<SearchSize, number> = { sm: 16, lg: 20 }

/**
 * Sets an input's value the way the browser does, so React's `onChange`
 * fires for both controlled and uncontrolled inputs.
 */
const setNativeValue = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

/**
 * Search is a search field with a leading search icon, an optional keyboard
 * shortcut hint and a clear button — the Figma "Search".
 */
const Search: FC<SearchProps> = ({
  variant,
  size = 'sm',
  shortcut,
  onValueChange,
  onClear,
  clearLabel,
  endContent,
  className,
  inputClassName,
  value,
  defaultValue,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  readOnly,
  ref,
  ...props
}) => {
  const messages = useMessages()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const clearName = clearLabel ?? messages.search.clear
  const isControlled = value !== undefined
  const [innerValue, setInnerValue] = useState(() =>
    defaultValue === undefined ? '' : String(defaultValue),
  )
  const currentValue = isControlled ? String(value ?? '') : innerValue
  const canClear = currentValue !== '' && !disabled && !readOnly

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') return ref(node)
      if (ref) ref.current = node
    },
    [ref],
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInnerValue(event.target.value)
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  const clear = () => {
    const input = inputRef.current
    if (!input) return
    setNativeValue(input, '')
    input.focus()
    onClear?.()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'Escape' && canClear) {
      event.preventDefault()
      clear()
    }
  }

  return (
    <div
      data-variant={variant ?? 'gray'}
      data-size={size}
      className={twMerge(searchStyles({ variant, size }), className)}
    >
      <SearchIcon
        size={iconSizes[size]}
        // The placeholder's colour, darker on hover (Figma Black/20% and 40%).
        className="shrink-0 text-placeholder transition-colors group-hover/search:text-control-border-strong group-focus-within/search:text-primary"
      />
      <input
        {...props}
        ref={setRefs}
        type="search"
        value={isControlled ? value : innerValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? messages.search.placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={twMerge(
          'h-full min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-placeholder disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
          inputClassName,
        )}
      />
      {endContent}
      {canClear ? (
        <button
          type="button"
          aria-label={clearName}
          title={clearName}
          onClick={clear}
          // Figma: 40% opacity (2.85:1); 60% meets the 3:1 of a control's icon
          // (WCAG 1.4.11). A 16px icon: `hit-area` makes it 24px (2.5.8).
          className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-full text-black opacity-60 outline-none transition-opacity hit-area hover:opacity-80 focus-visible:opacity-80 focus-visible:ring-2 focus-visible:ring-black-20"
        >
          <XCircleIcon weight="fill" size={clearIconSizes[size]} />
        </button>
      ) : (
        shortcut &&
        shortcut.length > 0 && (
          <KBD
            keys={shortcut}
            separator=""
            aria-hidden
            // Figma: Black/20% text (1.6:1). The hint is text, so `text-secondary`,
            // with no fill of its own: on the hovered dark field a second
            // Black/4% layer took it under 4.5:1.
            className="inline-flex h-4 w-auto shrink-0 items-center rounded-[6px] border-[0.5px] border-black-10 bg-transparent px-1 text-12 text-secondary"
          />
        )
      )}
    </div>
  )
}
Search.displayName = 'Search'

export { Search, searchStyles }
