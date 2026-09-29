'use client'

import {
  AddIcon,
  ArrowLineUpDownIcon,
  LoadingAIcon,
  XCircleIcon,
} from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  type ChangeEvent,
  type FocusEvent,
  Fragment,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  popoverItemClasses,
  popoverLabelClasses,
  popoverSurfaceClasses,
} from '../Popover/surface'
import { useSnowUI } from '../SnowUIProvider'

/**
 * An option of a `Combobox` or `MultiSelect`.
 */
export type ComboboxOption = {
  /** What the field stores. Unique across the whole list. */
  value: string
  /** The text shown in the list and in the field, matched by the default filter. */
  label: string
  /** A 16px icon before the label. */
  icon?: ReactNode
  /** Extra words the default filter matches. */
  keywords?: string[]
  /** Shown but can't be highlighted or selected. */
  disabled?: boolean
}

/**
 * A titled section of the list.
 */
export type ComboboxOptionGroup = {
  /** The group title (12/16, `text-secondary`). */
  label: string
  options: ComboboxOption[]
}

/**
 * Decides whether an option matches the (trimmed, non-empty) query.
 */
export type ComboboxFilter = (option: ComboboxOption, query: string) => boolean

/**
 * The default filter: every word of the query must appear in the label or the
 * keywords (case-insensitive), like `CommandPalette`'s.
 */
export const defaultComboboxFilter: ComboboxFilter = (option, query) => {
  const haystack = [option.label, ...(option.keywords ?? [])]
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

/**
 * Props shared by `Combobox` and `MultiSelect`.
 */
export type ComboboxSharedProps = {
  /** The options, flat or in titled groups (or both, in display order). */
  options: readonly (ComboboxOption | ComboboxOptionGroup)[]

  /**
   * How options are matched as the user types. `false` shows `options` as
   * they are — for results fetched from a server with `onQueryChange`.
   * @default defaultComboboxFilter
   */
  filter?: ComboboxFilter | false

  /**
   * Called when the text the list is filtered by changes: as the user types,
   * and with `''` when it resets (after a selection, or when the list closes).
   */
  onQueryChange?: (query: string) => void

  /** Controlled open state of the list. */
  open?: boolean
  /** Initial open state of the list when uncontrolled. */
  defaultOpen?: boolean
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void

  /** Shows a spinner in the field and marks the list busy. */
  loading?: boolean
  /**
   * Shown in the list and announced while `loading`.
   * @default messages.combobox.loading: "Loading"
   */
  loadingLabel?: string

  /**
   * Shown and announced when no option matches.
   * @default messages.combobox.empty: "No results"
   */
  emptyMessage?: string

  /**
   * Offers a "Create" option at the end of the list when the query matches
   * no option's label exactly. Selecting it calls `onCreate` with the
   * trimmed query, which becomes the value: add an option with that value.
   */
  creatable?: boolean
  /** Called with the trimmed query when the "Create" option is selected. */
  onCreate?: (query: string) => void
  /**
   * The text of the "Create" option.
   * @default messages.combobox.create(query): 'Create "{query}"'
   */
  createLabel?: (query: string) => string

  /**
   * Shows a clear button while the field has a value. In a `Combobox`,
   * Escape also clears it while the list is closed.
   * @default true
   */
  clearable?: boolean
  /**
   * Accessible name of the clear button.
   * @default messages.combobox.clear: "Clear"
   */
  clearLabel?: string

  /** Content before the value, e.g. a 16px icon. */
  startContent?: ReactNode

  /** Class name for the `<input>` element. `className` styles the field. */
  inputClassName?: string
  /** Class name for the popup with the list. */
  contentClassName?: string
}

/**
 * Whether a key belongs to an IME composition: `isComposing`, or the
 * `keyCode` 229 WebKit gives the Enter that commits one (it arrives after
 * `compositionend`, with `isComposing` false: WebKit bug 165004).
 */
export const isComposingKey = (event: KeyboardEvent<HTMLElement>) =>
  event.nativeEvent.isComposing || event.keyCode === 229

/** A row the arrow keys can reach: an enabled option, or "Create". */
type Entry = { key: string; option?: ComboboxOption; create?: string }

type VisibleGroup = {
  label?: string
  index: number
  options: ComboboxOption[]
}

// A key no option value can have: `\0` can't be typed into a value by
// accident, and the id escaping below keeps it valid.
const CREATE_KEY = '\0create'

const isGroup = (
  item: ComboboxOption | ComboboxOptionGroup,
): item is ComboboxOptionGroup => 'options' in item

/**
 * Groups the options: titled groups as they are, and consecutive loose
 * options into untitled groups.
 */
const toGroups = (
  items: ComboboxSharedProps['options'],
): { label?: string; options: ComboboxOption[] }[] => {
  const groups: { label?: string; options: ComboboxOption[] }[] = []
  for (const item of items) {
    if (isGroup(item)) {
      groups.push({ label: item.label, options: item.options })
      continue
    }
    const last = groups.at(-1)
    if (last && last.label === undefined) last.options.push(item)
    else groups.push({ options: [item] })
  }
  return groups
}

/**
 * Keeps `element` visible inside the scrolling `list` (without
 * `scrollIntoView`, which would also scroll the page while the popup is
 * still being positioned).
 */
const scrollIntoList = (list: HTMLElement, element: HTMLElement) => {
  const top = element.offsetTop
  const bottom = top + element.offsetHeight
  if (top < list.scrollTop) list.scrollTop = top
  else if (bottom > list.scrollTop + list.clientHeight) {
    list.scrollTop = bottom - list.clientHeight
  }
}

type UseComboboxParams = Pick<
  ComboboxSharedProps,
  | 'options'
  | 'filter'
  | 'onQueryChange'
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'creatable'
> & {
  disabled?: boolean
  readOnly?: boolean
  /** Whether the option with this value is selected (checked). */
  isSelected: (value: string) => boolean
  /** The value highlighted when the list opens without a query. */
  selectedValue?: string
  /** Selects (or toggles) an option. Returns whether the list stays open. */
  onSelectOption: (option: ComboboxOption) => boolean
  /** Creates an option from the query. Returns whether the list stays open. */
  onCreateOption: (query: string) => boolean
  /** Called when the list closes without a selection, with the query. */
  onDismiss?: (query: string | null) => void
  /**
   * The values (and their labels) already picked: "Create" isn't offered
   * for them either, even when `options` doesn't have them (yet).
   */
  picked?: readonly string[]
}

/**
 * The state and keyboard model shared by `Combobox` and `MultiSelect`: the
 * WAI-ARIA combobox pattern with a listbox popup and list autocomplete. Focus
 * stays in the field; the highlighted option is its `aria-activedescendant`.
 */
export const useCombobox = ({
  options,
  filter = defaultComboboxFilter,
  onQueryChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  creatable = false,
  disabled = false,
  readOnly = false,
  isSelected,
  selectedValue,
  onSelectOption,
  onCreateOption,
  onDismiss,
  picked = [],
}: UseComboboxParams) => {
  const baseId = useId()
  const listId = `${baseId}-list`
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  // A disabled or read-only field shows no list and takes no picks.
  const inactive = disabled || readOnly
  const open = (openProp ?? innerOpen) && !inactive
  // `null`: the user hasn't typed since the list opened, so every option
  // shows (and a single Combobox shows the selected label).
  const [query, setQueryState] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState<string>()
  const scrollOnChange = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const setOpen = (next: boolean) => {
    if (next === open) return
    if (openProp === undefined) setInnerOpen(next)
    onOpenChange?.(next)
  }

  const setQuery = (next: string | null) => {
    if ((query ?? '') !== (next ?? '')) onQueryChange?.(next ?? '')
    setQueryState(next)
  }

  // Disabling the field (or making it read-only) closes the list and drops
  // the query, as dismissing it does, but keeps the value: the parent hears
  // `onOpenChange(false)` and `onQueryChange('')`. An uncontrolled list
  // stays closed when the field is enabled again.
  const wasInactive = useRef(inactive)
  useEffect(() => {
    const becameInactive = inactive && !wasInactive.current
    wasInactive.current = inactive
    if (!inactive) return
    if (innerOpen) setInnerOpen(false)
    if (!becameInactive) return
    if (openProp ?? innerOpen) onOpenChange?.(false)
    setQuery(null)
    setActiveKey(undefined)
  })

  const groups = useMemo(() => toGroups(options), [options])
  const allOptions = useMemo(
    () => groups.flatMap((group) => group.options),
    [groups],
  )
  const trimmed = query?.trim() ?? ''

  const visibleGroups = useMemo<VisibleGroup[]>(
    () =>
      groups
        .map((group, index) => ({
          ...group,
          index,
          options: group.options.filter(
            (option) =>
              filter === false || trimmed === '' || filter(option, trimmed),
          ),
        }))
        .filter((group) => group.options.length > 0),
    [groups, filter, trimmed],
  )

  // "Create" is offered unless an option already has this exact label, or a
  // picked value has it as its value or label (case-insensitive): creating
  // it again would call `onCreate` without changing the value.
  const normalized = trimmed.toLowerCase()
  const createQuery =
    creatable &&
    trimmed !== '' &&
    !allOptions.some((option) => option.label.toLowerCase() === normalized) &&
    !picked.some((text) => text.toLowerCase() === normalized)
      ? trimmed
      : undefined

  const entries = useMemo<Entry[]>(() => {
    const list: Entry[] = visibleGroups
      .flatMap((group) => group.options)
      .filter((option) => !option.disabled)
      .map((option) => ({ key: option.value, option }))
    if (createQuery !== undefined) {
      list.push({ key: CREATE_KEY, create: createQuery })
    }
    return list
  }, [visibleGroups, createQuery])

  // Nothing to show: no option matches (disabled ones still show) and there
  // is nothing to create.
  const isEmpty = entries.length === 0 && visibleGroups.length === 0

  const findEntry = (key: string | undefined) =>
    key === undefined ? undefined : entries.find((entry) => entry.key === key)

  // While filtering, the first match is highlighted (Enter picks it);
  // otherwise the selected option, if it is in the list.
  const defaultActive =
    trimmed !== '' ? entries[0] : findEntry(selectedValue ?? undefined)
  const active = findEntry(activeKey) ?? defaultActive

  // Ids come from props: escape everything but [A-Za-z0-9-] so the DOM id is
  // valid in `aria-activedescendant` and collision-free.
  const optionId = (key: string) =>
    `${baseId}-option-${key.replace(/[^A-Za-z0-9-]/g, (char) => `_${char.charCodeAt(0).toString(16)}_`)}`
  const activeId = open && active ? optionId(active.key) : undefined

  useEffect(() => {
    if (!scrollOnChange.current || !activeId) return
    scrollOnChange.current = false
    const list = listRef.current
    const element = document.getElementById(activeId)
    if (list && element) scrollIntoList(list, element)
  }, [activeId])

  const openList = (highlight: 'first' | 'last' | 'selected') => {
    if (disabled || readOnly) return
    const selected = findEntry(selectedValue)
    const target =
      highlight === 'selected'
        ? selected
        : (selected ?? (highlight === 'first' ? entries[0] : entries.at(-1)))
    setActiveKey(target?.key)
    scrollOnChange.current = true
    setOpen(true)
  }

  /**
   * Back to rest, for a form reset: the list closes and the query goes,
   * without `onDismiss` (the caller resets the value).
   */
  const reset = () => {
    setOpen(false)
    setQuery(null)
    setActiveKey(undefined)
  }

  /** Closes the list without a selection; the query is dropped. */
  const dismiss = () => {
    if (!open && query === null) return
    onDismiss?.(query)
    setOpen(false)
    setQuery(null)
    setActiveKey(undefined)
  }

  const activate = (entry: Entry) => {
    if (inactive) return
    const keepOpen =
      entry.create !== undefined
        ? onCreateOption(entry.create)
        : entry.option
          ? onSelectOption(entry.option)
          : false
    setQuery(null)
    if (keepOpen) {
      // The list shows every option again: keep the highlight where it was
      // (a created option takes the value of the query).
      setActiveKey(entry.create ?? entry.key)
    } else {
      setOpen(false)
      setActiveKey(undefined)
    }
  }

  const move = (step: 1 | -1) => {
    if (entries.length === 0) return
    const index = active ? entries.indexOf(active) : -1
    const next =
      index === -1
        ? step === 1
          ? 0
          : entries.length - 1
        : (index + step + entries.length) % entries.length
    scrollOnChange.current = true
    setActiveKey(entries[next]?.key)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setActiveKey(undefined)
    scrollOnChange.current = true
    setOpen(true)
  }

  /**
   * The combobox keys. Returns whether it handled the key; the caller runs
   * its own keys (Escape, Backspace) otherwise.
   */
  const handleListKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) openList(event.altKey ? 'selected' : 'first')
        else if (!event.altKey) move(1)
        return true
      case 'ArrowUp':
        event.preventDefault()
        if (!open) {
          if (!event.altKey) openList('last')
        } else if (event.altKey) dismiss()
        else move(-1)
        return true
      case 'Enter':
        if (!open) return false
        // Never submit the form from an open list, even with nothing
        // highlighted (no match, or results still loading).
        event.preventDefault()
        if (active) activate(active)
        return true
      case 'Escape':
        // Radix closes an open list first (and prevents the event), so this
        // only runs while it is open without a Radix layer, e.g. in tests.
        if (!open) return false
        event.preventDefault()
        dismiss()
        return true
      default:
        return false
    }
  }

  // Focus leaving the input closes the list (the options never take focus;
  // the field's buttons are not part of the combobox).
  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    const next = event.relatedTarget as Node | null
    if (next && listRef.current?.parentElement?.contains(next)) return
    dismiss()
  }

  // A click on the field opens or closes the list; clicks on its buttons
  // (clear, remove) don't. While the user types, a click only moves the caret.
  const handleFieldClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return
    if (disabled || readOnly) return
    if (!open) openList('selected')
    else if (query === null) dismiss()
  }

  // Clicks on the padding or the icons focus the input, as in `Input`.
  const handleFieldPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (disabled || target === inputRef.current) return
    if (target.closest('button, a, input, select, textarea')) return
    event.preventDefault()
    inputRef.current?.focus()
  }

  return {
    reset,
    baseId,
    listId,
    open,
    query,
    setQuery,
    setOpen,
    setActiveKey,
    dismiss,
    activate,
    openList,
    visibleGroups,
    createQuery,
    entries,
    isEmpty,
    active,
    activeId,
    optionId,
    inputRef,
    fieldRef,
    listRef,
    isSelected,
    allOptions,
    handleInputChange,
    handleListKeys,
    handleInputBlur,
    handleFieldClick,
    handleFieldPointerDown,
  }
}

export type ComboboxState = ReturnType<typeof useCombobox>

/**
 * The Figma Input field (12/16 padding, a 16px radius, Surface/1 with a
 * 0.5px inside stroke, darker on hover and focus, plus the 4px Focus ring
 * while the input is focused), as in `Input`: the stroke is the
 * `control-border*` tokens, 1px with more contrast. While the list is open
 * (`data-state="open"`) it keeps the focus look, as the Select trigger.
 */
export const comboboxFieldClasses =
  'group/combobox relative flex w-full cursor-text items-center gap-2 rounded-16 bg-surface-1 px-4 py-3 text-14 text-black inset-ring-[0.5px] inset-ring-control-border transition-all hover:inset-ring-control-border-strong focus-within:inset-ring-control-border-strong has-[input:focus]:ring-4 has-[input:focus]:ring-focus data-[state=open]:inset-ring-control-border-strong data-[state=open]:ring-4 data-[state=open]:ring-focus contrast-more:inset-ring-1'

/**
 * Invalid, while the input has `aria-invalid="true"` (`FormControl` sets it):
 * the 1px `control-border-invalid` stroke of `Input`, also while the list is
 * open.
 */
export const comboboxInvalidClasses =
  'has-aria-invalid:inset-ring has-aria-invalid:inset-ring-control-border-invalid has-aria-invalid:data-[state=open]:inset-ring-control-border-invalid'

/** The disabled look (the design has no Disabled state), as in `Input`. */
export const comboboxDisabledClasses =
  'cursor-not-allowed bg-black-4 text-black-20 inset-ring-0 hover:inset-ring-0'

/** Figma "Static" (read-only): the stroke doesn't react to hover or focus. */
export const comboboxStaticClasses =
  'hover:inset-ring-control-border focus-within:inset-ring-control-border'

export const comboboxInputClasses =
  'min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-placeholder disabled:cursor-not-allowed'

type ComboboxAdornmentsProps = {
  loading: boolean
  canClear: boolean
  clearLabel: string
  onClear: () => void
}

/**
 * The end of the field: the spinner, the clear button (as in `Search`) and
 * the Figma 16px ArrowLineUpDown of the Select trigger.
 */
export const ComboboxAdornments = ({
  loading,
  canClear,
  clearLabel,
  onClear,
}: ComboboxAdornmentsProps) => (
  <>
    {loading && (
      <LoadingAIcon
        size={16}
        // Drawn for a 24×24 box, like CommandPalette's spinner.
        viewBox="0 0 24 24"
        aria-hidden
        className="shrink-0 text-black-40"
      />
    )}
    {canClear && (
      <button
        type="button"
        aria-label={clearLabel}
        title={clearLabel}
        onClick={onClear}
        // Figma: 40% opacity (2.85:1); 60% meets the 3:1 of a control's icon
        // (WCAG 1.4.11). A 16px icon: `hit-area` makes it 24px (2.5.8).
        // Keyboard focus: the `focus-ring` outline, at full opacity.
        className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-full text-black opacity-60 transition-opacity hit-area hover:opacity-80 focus-ring focus-visible:opacity-100"
      >
        <XCircleIcon weight="fill" size={16} />
      </button>
    )}
    <ArrowLineUpDownIcon
      size={16}
      aria-hidden
      className="shrink-0 fill-control-border-strong group-data-[disabled]/combobox:fill-black-20"
    />
  </>
)

type ComboboxPopupProps = {
  state: ComboboxState
  /** `aria-multiselectable` on the listbox. */
  multiple?: boolean
  /** The listbox's accessible name. */
  label?: string
  labelledBy?: string
  loading: boolean
  loadingLabel: string
  emptyMessage: string
  createLabel: (query: string) => string
  className?: string
}

/**
 * The popup: a Radix Popover anchored to the field (it takes the field's
 * width), with the listbox, the "Create" option and the empty or loading
 * message. It takes the `dir` and the `theme` of a `SnowUIProvider` or
 * `ThemeScope` (the portal is outside your `dir` and `data-theme` scopes).
 */
export const ComboboxPopup = ({
  state,
  multiple,
  label,
  labelledBy,
  loading,
  loadingLabel,
  emptyMessage,
  createLabel,
  className,
}: ComboboxPopupProps) => {
  const { dir, theme, contrast } = useSnowUI()
  const {
    listId,
    baseId,
    visibleGroups,
    createQuery,
    active,
    optionId,
    isSelected,
    setActiveKey,
    activate,
    fieldRef,
    listRef,
    isEmpty,
  } = state

  const renderOption = (option: ComboboxOption) => {
    const isActive = active?.key === option.value
    const selected = isSelected(option.value)
    return (
      // biome-ignore lint/a11y/useFocusableInteractive: options are highlighted with aria-activedescendant; focus stays in the field
      // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled by the combobox (arrow keys and Enter)
      <div
        key={option.value}
        id={optionId(option.value)}
        role="option"
        aria-selected={selected}
        aria-disabled={option.disabled || undefined}
        data-highlighted={isActive || undefined}
        data-disabled={option.disabled || undefined}
        onMouseMove={() => {
          if (!option.disabled && !isActive) setActiveKey(option.value)
        }}
        onClick={() => {
          if (!option.disabled) activate({ key: option.value, option })
        }}
        className={twMerge(popoverItemClasses, 'pe-8')}
      >
        {option.icon && (
          <span className="flex shrink-0 items-center justify-center">
            {option.icon}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">{option.label}</span>
        {/* Figma: a trailing 16px Check on the selected item, as in Select. */}
        {selected && (
          <span className="absolute end-2 flex size-4 items-center justify-center">
            <Check aria-hidden />
          </span>
        )}
      </div>
    )
  }

  return (
    <PopoverPrimitive.Portal>
      {/* biome-ignore lint/a11y/useValidAriaRole: `undefined` removes Radix's default role="dialog": the popup only wraps the listbox, and the field keeps the focus */}
      <PopoverPrimitive.Content
        dir={dir}
        // The portal is outside your `data-theme` scope: a `ThemeScope`'s
        // theme follows it.
        data-theme={theme}
        data-contrast={contrast}
        side="bottom"
        align="start"
        sideOffset={4}
        collisionPadding={8}
        role={undefined}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        // The input closes the list when it loses focus (`onBlur`).
        onFocusOutside={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => {
          if (fieldRef.current?.contains(event.target as Node)) {
            event.preventDefault()
          }
        }}
        // Keep the focus (and the caret) in the field, also on the scrollbar.
        onMouseDown={(event) => event.preventDefault()}
        className={twMerge(
          'z-50 flex max-h-[min(22rem,var(--radix-popover-content-available-height,22rem))] w-(--radix-popover-trigger-width) min-w-[8rem] flex-col overflow-hidden outline-none',
          popoverSurfaceClasses,
          // The padding is on the list, so it scrolls inside it.
          'p-0',
          // The popover's zoom in, and no exit animation: like the Select
          // menu, the list goes away at once when an option is picked or
          // the list is dismissed, so it never covers the picked value
          // while it fades, and Radix doesn't keep it mounted waiting for an
          // animation to end.
          'data-[state=open]:animate-zoom-in-95',
          className,
        )}
      >
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={labelledBy ? undefined : label}
          aria-labelledby={labelledBy}
          aria-multiselectable={multiple || undefined}
          aria-busy={loading || undefined}
          className="relative min-h-0 overflow-y-auto p-3 empty:hidden"
        >
          {visibleGroups.map((group) => {
            if (group.label === undefined) {
              return (
                <Fragment key={`group-${group.index}`}>
                  {group.options.map(renderOption)}
                </Fragment>
              )
            }
            const headingId = `${baseId}-group-${group.index}`
            return (
              // biome-ignore lint/a11y/useSemanticElements: an ARIA group of options inside the listbox
              <div
                key={`group-${group.index}`}
                role="group"
                aria-labelledby={headingId}
              >
                <div
                  id={headingId}
                  role="presentation"
                  className={popoverLabelClasses}
                >
                  {group.label}
                </div>
                {group.options.map(renderOption)}
              </div>
            )
          })}
          {createQuery !== undefined && (
            // biome-ignore lint/a11y/useFocusableInteractive: highlighted with aria-activedescendant
            // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled by the combobox
            <div
              id={optionId(CREATE_KEY)}
              role="option"
              aria-selected={false}
              data-highlighted={active?.key === CREATE_KEY || undefined}
              onMouseMove={() => setActiveKey(CREATE_KEY)}
              onClick={() => activate({ key: CREATE_KEY, create: createQuery })}
              className={popoverItemClasses}
            >
              <AddIcon aria-hidden className="fill-current" />
              <span className="min-w-0 flex-1 truncate">
                {createLabel(createQuery)}
              </span>
            </div>
          )}
        </div>
        {(isEmpty || (loading && visibleGroups.length === 0)) && (
          <p className="p-5 text-14 text-secondary">
            {loading ? loadingLabel : emptyMessage}
          </p>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

/**
 * The listbox's accessible name: the `aria-label` / `aria-labelledby` of the
 * field, else the text of the input's `<label>` (read once the list opens).
 */
export const useListLabel = (
  inputRef: RefObject<HTMLInputElement | null>,
  open: boolean,
  ariaLabel: string | undefined,
) => {
  const [labelText, setLabelText] = useState<string>()
  useEffect(() => {
    if (!open || ariaLabel) return
    const text = inputRef.current?.labels?.[0]?.textContent?.trim()
    setLabelText(text || undefined)
  }, [open, ariaLabel, inputRef])
  return ariaLabel ?? labelText
}
