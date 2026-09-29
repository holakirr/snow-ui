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
import { Tag } from '../Tag'
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
  useCombobox,
  useListLabel,
} from './listbox'

const EMPTY: string[] = []

/**
 * Props for the MultiSelect component. Everything except the listed props
 * goes to the `<input role="combobox">` (`id`, `aria-*`, `placeholder`,
 * `onBlur`, `ref`…); `className` and `style` style the field.
 */
export type MultiSelectProps = Omit<
  ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'children'
> &
  ComboboxSharedProps & {
    /** The selected values (controlled), in the order they were picked. */
    value?: string[]
    /** The initially selected values when uncontrolled. */
    defaultValue?: string[]
    /** Called with the new values when an option is added or removed. */
    onValueChange?: (value: string[]) => void
  }

/**
 * MultiSelect is a Combobox that picks several options, shown as removable
 * `Tag`s in the field. The list stays open while the user picks; Enter or a
 * click toggles the highlighted option, Backspace in the empty field removes
 * the last tag, and each tag has a remove button.
 */
const MultiSelect: FC<MultiSelectProps> = ({
  options,
  value: valueProp,
  defaultValue = EMPTY,
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
  required,
  name,
  placeholder,
  onKeyDown,
  onBlur,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}) => {
  const messages = useMessages()
  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = useState(defaultValue)
  const values = (isControlled ? valueProp : innerValue) ?? EMPTY
  // Options picked here, so their tags keep a label when `options` no longer
  // has them (server results, or a created option not added yet).
  const picked = useRef(new Map<string, ComboboxOption>())
  // What the status region announces: a removed tag.
  const [announcement, setAnnouncement] = useState('')

  const setValues = (next: string[]) => {
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
    isSelected: (optionValue) => values.includes(optionValue),
    onSelectOption: (option) => {
      picked.current.set(option.value, option)
      setAnnouncement('')
      setValues(
        values.includes(option.value)
          ? values.filter((item) => item !== option.value)
          : [...values, option.value],
      )
      return true
    },
    onCreateOption: (query) => {
      picked.current.set(query, { value: query, label: query })
      onCreate?.(query)
      setAnnouncement('')
      if (!values.includes(query)) setValues([...values, query])
      return true
    },
  })
  const { inputRef, fieldRef, open: isOpen, query, activeId, listId } = state
  const setInputRef = useComposedRefs(inputRef, ref)
  const listLabel = useListLabel(inputRef, isOpen, ariaLabel)
  const selectedId = `${state.baseId}-selected`

  const labelOf = (item: string) =>
    state.allOptions.find((option) => option.value === item)?.label ??
    picked.current.get(item)?.label ??
    item
  const labels = values.map(labelOf)
  const canEdit = !disabled && !readOnly
  const canClear = clearable && canEdit && values.length > 0

  const remove = (item: string) => {
    setValues(values.filter((value) => value !== item))
    setAnnouncement(messages.combobox.removed(labelOf(item)))
    inputRef.current?.focus()
  }

  const clear = () => {
    setValues([])
    state.setQuery(null)
    setAnnouncement('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.nativeEvent.isComposing) return
    if (!canEdit) return
    if (state.handleListKeys(event)) return
    // Backspace in the empty field removes the last tag.
    const last = values.at(-1)
    if (
      event.key === 'Backspace' &&
      event.currentTarget.value === '' &&
      last !== undefined
    ) {
      event.preventDefault()
      remove(last)
    }
  }

  const statusText =
    isOpen && loading
      ? (loadingLabel ?? messages.combobox.loading)
      : isOpen && state.isEmpty
        ? (emptyMessage ?? messages.combobox.empty)
        : announcement

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
            // The tags wrap: 4px apart, 20px high, in a field at least as
            // high as the Input (44px).
            'min-h-11',
            comboboxInvalidClasses,
            readOnly && comboboxStaticClasses,
            disabled && comboboxDisabledClasses,
            className,
          )}
          style={style}
          data-slot="multi-select"
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          onPointerDown={state.handleFieldPointerDown}
          onClick={state.handleFieldClick}
        >
          {startContent && (
            <span className="flex shrink-0 items-center self-start py-0.5 text-black-40 [&>svg]:size-4 [&>svg]:shrink-0">
              {startContent}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {values.map((item, index) => (
              <Tag
                key={item}
                label={labels[index] ?? item}
                state="static"
                onRemove={canEdit ? () => remove(item) : undefined}
                className="max-w-full"
              />
            ))}
            <input
              {...props}
              ref={setInputRef}
              type="text"
              role="combobox"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={
                [values.length > 0 ? selectedId : undefined, ariaDescribedBy]
                  .filter(Boolean)
                  .join(' ') || undefined
              }
              aria-invalid={ariaInvalid}
              // Not `required`: the text stays empty while tags are picked.
              aria-required={required || undefined}
              aria-expanded={isOpen}
              aria-controls={isOpen ? listId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query ?? ''}
              placeholder={values.length > 0 ? undefined : placeholder}
              onChange={state.handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={(event) => {
                onBlur?.(event)
                state.handleInputBlur(event)
              }}
              disabled={disabled}
              readOnly={readOnly}
              className={twMerge(
                comboboxInputClasses,
                'min-w-16 basis-16',
                inputClassName,
              )}
            />
          </div>
          <ComboboxAdornments
            loading={loading}
            canClear={canClear}
            clearLabel={clearLabel ?? messages.combobox.clear}
            onClear={clear}
          />
          {values.length > 0 && (
            <span id={selectedId} className="sr-only">
              {messages.combobox.selected(labels)}
            </span>
          )}
          <span role="status" className="sr-only">
            {statusText}
          </span>
          {name !== undefined &&
            values.map((item) => (
              <input key={item} type="hidden" name={name} value={item} />
            ))}
        </div>
      </PopoverPrimitive.Anchor>
      <ComboboxPopup
        state={state}
        multiple
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
MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
