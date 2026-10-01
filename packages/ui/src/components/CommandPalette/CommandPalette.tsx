'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { isComposingKey } from '../../utils/keyboard'
import { twMerge } from '../../utils/tw-merge'
import { Search } from '../Search'
import { useMessages, useSnowUI } from '../SnowUIProvider'
import { LoadingRing } from '../Spinner/ring'
import { Typography } from '../Text'

/**
 * The event that selected an item: a click, or Enter in the search field.
 * Check `event.metaKey` / `event.ctrlKey` to open the result in a new tab.
 */
export type CommandPaletteSelectEvent =
  | KeyboardEvent<HTMLElement>
  | MouseEvent<HTMLElement>

/**
 * An item of the CommandPalette list.
 */
export type CommandPaletteItem = {
  /** Unique within its group. */
  id: string
  /** The text shown and matched by the default filter. */
  label: string
  /** A 16px icon or a 24px avatar in front of the label. */
  icon?: ReactNode
  /** Extra words the default filter matches. */
  keywords?: string[]
  /**
   * A second line under the label, in 12/16 `text-secondary`: e.g. the text
   * on the page that matched (the kit's "Text on the page" result). The
   * default filter matches it too; it is the option's description. Added in
   * 5.2.
   */
  snippet?: string
  /** Shown but can't be highlighted or selected. */
  disabled?: boolean
  /** Called when this item is selected (before the palette's `onSelect`). */
  onSelect?: (
    item: CommandPaletteItem,
    event: CommandPaletteSelectEvent,
  ) => void
}

/**
 * A titled section of the CommandPalette list.
 */
export type CommandPaletteGroup = {
  id: string
  /** The section title (14 Regular, `text-secondary`; Figma: Black/40%). */
  heading?: ReactNode
  items: CommandPaletteItem[]
}

/**
 * Decides whether an item matches the (trimmed, non-empty) query.
 */
export type CommandPaletteFilter = (
  item: CommandPaletteItem,
  query: string,
) => boolean

/**
 * The default filter: every word of the query must appear in the label, the
 * keywords or the snippet (case-insensitive).
 */
export const defaultCommandPaletteFilter: CommandPaletteFilter = (
  item,
  query,
) => {
  const haystack = [item.label, ...(item.keywords ?? []), item.snippet ?? '']
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

/**
 * Props for the CommandPalette component.
 */
export type CommandPaletteProps = {
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void

  /** An element that opens the palette (rendered with Radix `asChild`). */
  trigger?: ReactNode

  /**
   * A global shortcut that toggles the palette: a key (`'/'`) or modifiers and
   * a key joined with `+` (`'mod+k'`, where `mod` is ⌘ or Ctrl). A shortcut
   * without modifiers is ignored while the user types in a field.
   */
  hotkey?: string

  /** The sections and their items, in display order. */
  groups: CommandPaletteGroup[]

  /** Called when any item is selected. */
  onSelect?: (
    item: CommandPaletteItem,
    event: CommandPaletteSelectEvent,
  ) => void

  /** Controlled search query. */
  query?: string
  /** Initial query when uncontrolled (reset every time the palette opens). */
  defaultQuery?: string
  /** Called as the user types. */
  onQueryChange?: (query: string) => void

  /**
   * How items are matched. `false` shows `groups` as they are — for results
   * fetched from a server as the user types.
   * @default defaultCommandPaletteFilter
   */
  filter?: CommandPaletteFilter | false

  /**
   * Accessible name of the dialog and the list.
   * @default messages.commandPalette.label: "Search"
   */
  label?: string

  /** @default messages.commandPalette.placeholder: "Search" */
  placeholder?: string

  /**
   * Shown when nothing matches.
   * @default messages.commandPalette.empty: "No results"
   */
  emptyMessage?: ReactNode

  /** Shows a spinner in the search field and marks the list busy. */
  loading?: boolean

  /**
   * Announced while `loading`.
   * @default messages.commandPalette.loading: "Loading"
   */
  loadingLabel?: string

  /**
   * Close the palette after an item is selected.
   * @default true
   */
  closeOnSelect?: boolean

  /**
   * Show the number of results above the list while there is a query (the
   * kit's "105 results"), in 12/16 `text-secondary`, announced politely.
   * Added in 5.2.
   * @default false
   */
  showCount?: boolean

  /**
   * The number `showCount` shows, when the list holds only some of the
   * results (e.g. the first page from a server). Without it, the items shown.
   * Added in 5.2.
   */
  resultCount?: number

  /**
   * Mark the words of the query in each label and snippet with `<mark>`, in
   * `indigo-text` (the kit's Secondary/Indigo match, darker in light mode for
   * 4.5:1). Added in 5.2.
   * @default false
   */
  highlightMatches?: boolean

  /** Class name for the popup. */
  className?: string
}

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  )
}

const parseHotkey = (hotkey: string) => {
  const parts = hotkey.toLowerCase().split('+')
  // `'+'` itself, or a combination ending in `+` (e.g. `'shift++'`).
  const key = hotkey.endsWith('+') ? '+' : (parts.pop() ?? '')
  const modifiers = new Set(parts.filter(Boolean))
  return { key, modifiers }
}

const matchesHotkey = (
  event: globalThis.KeyboardEvent,
  { key, modifiers }: ReturnType<typeof parseHotkey>,
) => {
  if (event.key.toLowerCase() !== key) return false
  if (modifiers.has('mod')) {
    if (!(event.metaKey || event.ctrlKey)) return false
  } else if (
    event.metaKey !== modifiers.has('meta') ||
    event.ctrlKey !== modifiers.has('ctrl')
  ) {
    return false
  }
  if (event.altKey !== modifiers.has('alt')) return false
  // Shift is only checked when asked for: `?` or `/` may need it.
  if (modifiers.has('shift') && !event.shiftKey) return false
  return true
}

type ListProps = Required<
  Pick<
    CommandPaletteProps,
    | 'groups'
    | 'label'
    | 'placeholder'
    | 'closeOnSelect'
    | 'emptyMessage'
    | 'loadingLabel'
  >
> &
  Pick<
    CommandPaletteProps,
    | 'onSelect'
    | 'query'
    | 'defaultQuery'
    | 'onQueryChange'
    | 'filter'
    | 'loading'
    | 'showCount'
    | 'resultCount'
    | 'highlightMatches'
  > & {
    close: () => void
  }

/**
 * A match in a label or snippet (`highlightMatches`): the kit's
 * Secondary/Indigo text, as `indigo-text` (#5B5BD6: 5.37:1 on the palette,
 * 4.91:1 on the highlighted option). In dark mode #ADADFB is 3.78:1 on the
 * White/10% highlight, so there it is mixed with 30% white (6.47:1 and
 * 4.78:1).
 * No fill: the browser's yellow `<mark>` is replaced. In forced-colors mode,
 * where the colour is dropped (and the transparent fill would hide the
 * system's), the match takes the system `Mark` and `MarkText`.
 */
const commandPaletteMatchClasses =
  'bg-transparent text-indigo-text dark:text-[color:color-mix(in_srgb,var(--color-indigo-text),var(--color-black)_30%)] forced-colors:bg-[Mark] forced-colors:text-[MarkText]'

/** Escapes a string for a `RegExp`. */
const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * `text` with every occurrence of the query's words (case-insensitive) in a
 * `<mark>`: the kit's Secondary/Indigo match, in `indigo-text`.
 */
const highlight = (text: string, query: string): ReactNode => {
  const words = query.split(/\s+/).filter(Boolean)
  if (words.length === 0) return text
  // Longer words first, so "bye" doesn't cut "byewind" short.
  const pattern = new RegExp(
    `(${words
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|')})`,
    'gi',
  )
  // With a capturing group, the matches are at the odd indexes.
  return text.split(pattern).map((part, index) =>
    index % 2 === 1 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one string, in order
      <mark key={index} className={commandPaletteMatchClasses}>
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

/**
 * The search field and the list. Mounted only while the palette is open, so the
 * query and the highlighted item reset every time it opens.
 */
const CommandPaletteList: FC<ListProps> = ({
  groups,
  label,
  placeholder,
  closeOnSelect,
  onSelect,
  query: queryProp,
  defaultQuery = '',
  onQueryChange,
  filter = defaultCommandPaletteFilter,
  emptyMessage,
  loading = false,
  loadingLabel,
  showCount = false,
  resultCount,
  highlightMatches = false,
  close,
}) => {
  const messages = useMessages()
  const baseId = useId()
  const listId = `${baseId}-list`
  const [innerQuery, setInnerQuery] = useState(defaultQuery)
  const query = queryProp ?? innerQuery
  const [activeKey, setActiveKey] = useState<string>()
  const scrollOnChange = useRef(false)

  const visibleGroups = useMemo(() => {
    const trimmed = query.trim()
    return groups
      .map((group, groupIndex) => ({
        ...group,
        groupIndex,
        items: group.items
          // Keyed by ids (not positions) so the highlighted item survives
          // `groups` changing, e.g. with server-side results.
          .map((item) => ({ item, key: `${group.id}:${item.id}` }))
          .filter(
            ({ item }) =>
              filter === false || trimmed === '' || filter(item, trimmed),
          ),
      }))
      .filter((group) => group.items.length > 0)
  }, [groups, filter, query])

  const options = useMemo(
    () =>
      visibleGroups
        .flatMap((group) => group.items)
        .filter(({ item }) => !item.disabled),
    [visibleGroups],
  )

  // The first result is highlighted by default.
  const active =
    options.find((option) => option.key === activeKey) ?? options[0]
  // Ids come from props: escape everything but [A-Za-z0-9-] so the DOM id is
  // valid in `aria-activedescendant` (space-separated) and collision-free.
  const optionId = (key: string) =>
    `${baseId}-option-${key.replace(/[^A-Za-z0-9-]/g, (char) => `_${char.charCodeAt(0).toString(16)}_`)}`
  const activeId = active ? optionId(active.key) : undefined

  useEffect(() => {
    if (!scrollOnChange.current || !activeId) return
    scrollOnChange.current = false
    document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' })
  }, [activeId])

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    if (queryProp === undefined) setInnerQuery(next)
    setActiveKey(undefined)
    onQueryChange?.(next)
  }

  const select = (
    item: CommandPaletteItem,
    event: CommandPaletteSelectEvent,
  ) => {
    if (item.disabled) return
    item.onSelect?.(item, event)
    onSelect?.(item, event)
    if (closeOnSelect) close()
  }

  const move = (step: 1 | -1) => {
    if (options.length === 0) return
    const index = active ? options.indexOf(active) : -1
    const next = (index + step + options.length) % options.length
    scrollOnChange.current = true
    setActiveKey(options[next]?.key)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // An IME composition's keys, the Enter that commits one included.
    if (isComposingKey(event)) return
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        move(-1)
        break
      case 'Enter':
        if (!active) return
        event.preventDefault()
        select(active.item, event)
        break
    }
  }

  const isEmpty = options.length === 0 && !loading
  const trimmedQuery = query.trim()
  const shownCount = visibleGroups.reduce(
    (count, group) => count + group.items.length,
    0,
  )
  const count = resultCount ?? shownCount
  const showsCount = showCount && trimmedQuery !== '' && !loading && count > 0
  const mark = (text: string) =>
    highlightMatches ? highlight(text, trimmedQuery) : text

  return (
    <>
      <Search
        size="lg"
        role="combobox"
        aria-label={label}
        aria-expanded
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        value={query}
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        endContent={
          loading ? (
            // The ring of the kit's "Loading A" icon, turned by CSS so it
            // stops for reduced motion (LoadingAIcon's SVG `<animate>`
            // doesn't). The listbox's `aria-busy` and the hidden "Loading"
            // text announce it.
            <LoadingRing className="size-5 shrink-0 text-black-40" />
          ) : undefined
        }
        // The SearchPopup header: no fill, a Black/10% hairline under it.
        className="h-12 shrink-0 rounded-none border-b-[0.5px] border-black-10 bg-transparent px-2 pt-1 pb-4 backdrop-blur-none hover:bg-transparent focus-within:bg-transparent focus-within:ring-0 focus-within:inset-ring-0"
      />
      {showCount && (
        // The kit's "105 results": the number of results for the query.
        <Typography
          asChild
          size={12}
          // The live region stays in the accessibility tree while empty,
          // so its first count is announced; only the padding goes.
          className={showsCount ? 'px-2 pt-2 text-secondary' : 'text-secondary'}
        >
          <p role="status" aria-live="polite">
            {showsCount ? messages.commandPalette.results?.(count) : null}
          </p>
        </Typography>
      )}
      <div
        id={listId}
        role="listbox"
        aria-label={label}
        aria-busy={loading || undefined}
        className="scrollbar-snow -mx-1 max-h-[min(30.25rem,60vh)] overflow-y-auto px-1 pt-2 empty:hidden"
      >
        {visibleGroups.map((group) => {
          const headingId = `${baseId}-group-${group.groupIndex}`
          return (
            // biome-ignore lint/a11y/useSemanticElements: an ARIA group of options inside the listbox
            <div
              key={group.id}
              role="group"
              aria-labelledby={group.heading ? headingId : undefined}
              className="flex flex-col gap-1 pb-2"
            >
              {group.heading && (
                <Typography
                  asChild
                  size={14}
                  className="px-2 py-1 text-secondary"
                >
                  <div id={headingId} role="presentation">
                    {group.heading}
                  </div>
                </Typography>
              )}
              {group.items.map(({ item, key }) => {
                const isActive = active?.key === key
                return (
                  // biome-ignore lint/a11y/useFocusableInteractive: options are highlighted with aria-activedescendant; focus stays in the search field
                  // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled by the combobox (arrow keys and Enter)
                  <div
                    key={key}
                    id={optionId(key)}
                    role="option"
                    aria-selected={isActive}
                    aria-disabled={item.disabled || undefined}
                    data-active={isActive || undefined}
                    aria-describedby={
                      item.snippet ? `${optionId(key)}-snippet` : undefined
                    }
                    onMouseMove={() => {
                      if (!item.disabled && !isActive) setActiveKey(key)
                    }}
                    // Keep the focus (and the caret) in the search field.
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => select(item, event)}
                    // The Black/4% highlight is 1.1:1: with more contrast
                    // the active option also gets the focus-ring colour.
                    className="flex min-h-9 cursor-pointer items-center gap-2 rounded-12 p-2 text-black data-active:bg-black-4 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 contrast-more:data-active:inset-ring-2 contrast-more:data-active:inset-ring-black-80"
                  >
                    {item.icon && (
                      <span className="flex shrink-0 items-center justify-center">
                        {item.icon}
                      </span>
                    )}
                    {item.snippet ? (
                      <span className="flex min-w-0 flex-1 flex-col">
                        <Typography size={14} className="truncate">
                          {mark(item.label)}
                        </Typography>
                        {/* The option's description (not its name): hidden
                            from the name, read through aria-describedby. */}
                        <Typography
                          id={`${optionId(key)}-snippet`}
                          aria-hidden
                          size={12}
                          className="truncate text-secondary"
                        >
                          {mark(item.snippet)}
                        </Typography>
                      </span>
                    ) : (
                      <Typography size={14} className="min-w-0 flex-1 truncate">
                        {mark(item.label)}
                      </Typography>
                    )}
                    {isActive && (
                      <Typography
                        size={14}
                        aria-hidden
                        className="shrink-0 text-secondary"
                      >
                        ↩
                      </Typography>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      {/* Always rendered (not display: none while empty), so "No results" is announced. */}
      <div role="status" aria-live="polite">
        {isEmpty && (
          <Typography
            asChild
            size={14}
            className="px-2 pt-4 pb-2 text-secondary"
          >
            <p>{emptyMessage}</p>
          </Typography>
        )}
        {loading && <span className="sr-only">{loadingLabel}</span>}
      </div>
    </>
  )
}

/**
 * CommandPalette is a searchable list of grouped items in a dialog — the Figma
 * "SearchPopup". Type to filter, move with ↑ / ↓, select with Enter or a click,
 * close with Escape or a click outside. Built on Radix Dialog; the field is a
 * combobox that controls a listbox (`aria-activedescendant`).
 */
const CommandPalette: FC<CommandPaletteProps> = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  hotkey,
  groups,
  onSelect,
  query,
  defaultQuery,
  onQueryChange,
  filter,
  label: labelProp,
  placeholder,
  emptyMessage,
  loading,
  loadingLabel,
  closeOnSelect = true,
  showCount,
  resultCount,
  highlightMatches,
  className,
}) => {
  const { messages, dir, theme, contrast } = useSnowUI()
  const label = labelProp ?? messages.commandPalette.label
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const open = openProp ?? innerOpen
  const openRef = useRef(open)
  openRef.current = open

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange],
  )

  useEffect(() => {
    if (!hotkey) return
    const parsed = parseHotkey(hotkey)
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || !matchesHotkey(event, parsed)) return
      const hasModifier =
        parsed.modifiers.has('mod') ||
        parsed.modifiers.has('meta') ||
        parsed.modifiers.has('ctrl') ||
        parsed.modifiers.has('alt')
      if (!hasModifier && isEditableTarget(event.target)) return
      event.preventDefault()
      setOpen(!openRef.current)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [hotkey, setOpen])

  const close = useCallback(() => setOpen(false), [setOpen])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          dir={dir}
          data-theme={theme}
          data-contrast={contrast}
          aria-describedby={undefined}
          className={twMerge(
            // Figma SearchPopup: 480 wide, padding 16, radius 24, Background/3
            // with the Glass 2 effect.
            'glass-2 fixed top-[15vh] left-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-120 -translate-x-1/2 flex-col rounded-24 p-4 text-black outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {label}
          </DialogPrimitive.Title>
          <CommandPaletteList
            groups={groups}
            label={label}
            placeholder={placeholder ?? messages.commandPalette.placeholder}
            closeOnSelect={closeOnSelect}
            onSelect={onSelect}
            query={query}
            defaultQuery={defaultQuery}
            onQueryChange={onQueryChange}
            filter={filter}
            emptyMessage={emptyMessage ?? messages.commandPalette.empty}
            loading={loading}
            loadingLabel={loadingLabel ?? messages.commandPalette.loading}
            showCount={showCount}
            resultCount={resultCount}
            highlightMatches={highlightMatches}
            close={close}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
CommandPalette.displayName = 'CommandPalette'

export { CommandPalette }
