'use client'

import { useComposedRefs } from '@radix-ui/react-compose-refs'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  type ComponentProps,
  type FC,
  type KeyboardEvent,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import {
  ComboboxAdornments,
  type ComboboxOption,
  ComboboxPopup,
  type ComboboxSharedProps,
  comboboxDisabledClasses,
  comboboxFieldClasses,
  comboboxInputClasses,
  comboboxInvalidClasses,
  comboboxStaticClasses,
  isInvalid,
  useCombobox,
  useListLabel,
} from './listbox'

/**
 * Props for the Combobox component. Everything except the listed props goes
 * to the `<input role="combobox">` (`id`, `aria-*`, `placeholder`, `onBlur`,
 * `ref`…); `className` and `style` style the field.
 */
export type ComboboxProps = Omit<
  ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'children'
> &
  ComboboxSharedProps & {
    /** The selected option's value (controlled); `null` for none. */
    value?: string | null
    /** The initially selected value when uncontrolled. */
    defaultValue?: string | null
    /**
     * Called with the new value when an option is selected, and with `null`
     * when the field is cleared (the clear button, Escape, or emptying the
     * text and leaving the field).
     */
    onValueChange?: (value: string | null) => void
  }

/**
 * Combobox is a text field with a list of options that filters as the user
 * types — the WAI-ARIA combobox with a listbox popup. It looks like the Figma
 * Input with the Select menu. ↓ / ↑ open the list and move the highlight,
 * Enter or a click selects, Escape closes the list (and clears the field
 * when it is closed). Focus stays in the field; the highlighted option is its
 * `aria-activedescendant`.
 */
const Combobox: FC<ComboboxProps> = ({
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  filter,
  onQueryChange,
  open,
  defaultOpen,
  onOpenChange,
  loading = false,
  loadingLabel,
  emptyMessage,
  creatable,
  onCreate,
  createLabel,
  clearable = true,
  clearLabel,
  startContent,
  className,
  style,
  inputClassName,
  contentClassName,
  disabled = false,
  readOnly = false,
  name,
  onKeyDown,
  onBlur,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-invalid': ariaInvalid,
  ...props
}) => {
  const messages = useMessages()
  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = useState(defaultValue)
  const value = isControlled ? valueProp : innerValue
  // The last option picked here, so its label shows even when `options`
  // no longer has it (server results, or a created option not added yet).
  const picked = useRef<ComboboxOption | null>(null)

  const setValue = (next: string | null) => {
    if (next === value) return
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }

  const state = useCombobox({
    options,
    filter,
    onQueryChange,
    open,
    defaultOpen,
    onOpenChange,
    creatable,
    disabled,
    readOnly,
    isSelected: (optionValue) => optionValue === value,
    selectedValue: value ?? undefined,
    onSelectOption: (option) => {
      picked.current = option
      setValue(option.value)
      return false
    },
    onCreateOption: (query) => {
      picked.current = { value: query, label: query }
      onCreate?.(query)
      setValue(query)
      return false
    },
    // Emptying the text and leaving the field clears the value.
    onDismiss: (query) => {
      if (clearable && query?.trim() === '') setValue(null)
    },
  })
  const { inputRef, fieldRef, open: isOpen, query, activeId, listId } = state
  const setInputRef = useComposedRefs(inputRef, ref)
  const listLabel = useListLabel(inputRef, isOpen, ariaLabel)

  const selectedOption =
    value === null
      ? undefined
      : (state.allOptions.find((option) => option.value === value) ??
        (picked.current?.value === value ? picked.current : undefined))
  const selectedLabel =
    value === null ? '' : (selectedOption?.label ?? String(value))
  const canClear =
    clearable && !disabled && !readOnly && (value !== null || !!query)

  const clear = () => {
    setValue(null)
    state.setQuery(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.nativeEvent.isComposing) return
    if (disabled || readOnly) return
    if (state.handleListKeys(event)) return
    // WAI-ARIA: Escape on a closed list clears the field.
    if (event.key === 'Escape' && canClear) {
      event.preventDefault()
      clear()
    }
  }

  return (
    <PopoverPrimitive.Root
      open={isOpen}
      // Escape and clicks outside close the list.
      onOpenChange={(next) => {
        if (!next) state.dismiss()
      }}
    >
      <PopoverPrimitive.Anchor asChild>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: clicks on the field's padding open the list; the input handles the keyboard */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: the input inside handles the keyboard */}
        <div
          ref={fieldRef}
          className={twMerge(
            comboboxFieldClasses,
            comboboxInvalidClasses,
            readOnly && comboboxStaticClasses,
            disabled && comboboxDisabledClasses,
            className,
          )}
          style={style}
          data-slot="combobox"
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          data-invalid={isInvalid(ariaInvalid) || undefined}
          onPointerDown={state.handleFieldPointerDown}
          onClick={state.handleFieldClick}
        >
          {startContent && (
            <span className="flex shrink-0 items-center text-black-40 [&>svg]:size-4 [&>svg]:shrink-0">
              {startContent}
            </span>
          )}
          <input
            {...props}
            ref={setInputRef}
            type="text"
            role="combobox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-invalid={ariaInvalid}
            aria-expanded={isOpen}
            aria-controls={isOpen ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query ?? selectedLabel}
            onChange={state.handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={(event) => {
              onBlur?.(event)
              state.handleInputBlur(event)
            }}
            disabled={disabled}
            readOnly={readOnly}
            className={twMerge(comboboxInputClasses, inputClassName)}
          />
          <ComboboxAdornments
            loading={loading}
            canClear={canClear}
            clearLabel={clearLabel ?? messages.combobox.clear}
            onClear={clear}
          />
          <span role="status" className="sr-only">
            {isOpen && loading
              ? (loadingLabel ?? messages.combobox.loading)
              : isOpen && state.isEmpty
                ? (emptyMessage ?? messages.combobox.empty)
                : ''}
          </span>
          {name !== undefined && (
            <input type="hidden" name={name} value={value ?? ''} />
          )}
        </div>
      </PopoverPrimitive.Anchor>
      <ComboboxPopup
        state={state}
        label={listLabel}
        labelledBy={ariaLabelledBy}
        loading={loading}
        loadingLabel={loadingLabel ?? messages.combobox.loading}
        emptyMessage={emptyMessage ?? messages.combobox.empty}
        createLabel={createLabel ?? messages.combobox.create}
        className={contentClassName}
      />
    </PopoverPrimitive.Root>
  )
}
Combobox.displayName = 'Combobox'

export { Combobox }
