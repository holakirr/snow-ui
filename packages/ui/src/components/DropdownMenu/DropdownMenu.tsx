'use client'

import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import {
  type ComponentProps,
  createContext,
  type FC,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { TEXT_SIZES } from '../../constants'
import { isComposingKey } from '../../utils/keyboard'
import { twMerge } from '../../utils/tw-merge'
import {
  popoverAnimationClasses,
  popoverChevronClasses,
  popoverHintClasses,
  popoverItemClasses,
  popoverItemDestructiveClasses,
  popoverLabelClasses,
  popoverScrollClasses,
  popoverSeparatorClasses,
  popoverShortcutClasses,
  popoverShortcutEndClasses,
  popoverSurfaceClasses,
} from '../Popover/surface'
import { Search } from '../Search'
import { useMessages, useSnowUI } from '../SnowUIProvider'
import { KBD, type KBDProps } from '../Text'

/**
 * A menu taller than the room on its side scrolls, with the kit's scrollbar
 * (a submenu too). Portal submenus (`DropdownMenuPortal`): the menu clips
 * its content, as it did before it scrolled.
 */
const dropdownMenuContentStyles = twMerge(
  'z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto',
  popoverSurfaceClasses,
  popoverScrollClasses,
  popoverAnimationClasses,
)

/**
 * With a search, the field stays at the top and the items under it scroll:
 * the track ends 12px above the bottom, level with the padding.
 */
const dropdownMenuSearchScrollClasses =
  'scrollbar-snow [&::-webkit-scrollbar-track]:mb-3'

/**
 * Decides whether a menu item matches the search: its text (`textValue`, or
 * the text of its children) and the trimmed, non-empty query.
 */
type DropdownMenuSearchFilter = (text: string, query: string) => boolean

/**
 * The default menu search filter: every word of the query appears in the
 * item's text (case-insensitive), as in CommandPalette.
 */
const defaultDropdownMenuSearchFilter: DropdownMenuSearchFilter = (
  text,
  query,
) => {
  const haystack = text.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

/**
 * The search field of a `DropdownMenuContent` (`search`). Added in 5.2.
 */
type DropdownMenuSearchOptions = {
  /** Controlled query. */
  query?: string
  /** Initial query when uncontrolled (reset every time the menu opens). */
  defaultQuery?: string
  /** Called as the user types (and with `''` when Escape clears the field). */
  onQueryChange?: (query: string) => void
  /**
   * How items are matched.
   * @default defaultDropdownMenuSearchFilter
   */
  filter?: DropdownMenuSearchFilter
  /**
   * Accessible name of the field.
   * @default messages.dropdownMenu.search: "Search"
   */
  label?: string
  /** @default messages.search.placeholder: "Search" */
  placeholder?: string
  /**
   * Shown (and announced) when nothing matches.
   * @default messages.dropdownMenu.empty: "No results"
   */
  emptyMessage?: ReactNode
}

type MenuSearchContextValue = {
  query: string
  filter: DropdownMenuSearchFilter
  /** Counts a matching item while it is shown; returns the cleanup. */
  register: () => () => void
}

/** The search of the menu an item is in; `null` in a submenu. */
const MenuSearchContext = createContext<MenuSearchContextValue | null>(null)

/** The text of a React node: its strings and numbers, words apart. */
const textOf = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join(' ')
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children)
  }
  return ''
}

/** Whether a search is filtering the menu (a non-empty query). */
const useMenuSearchActive = () => {
  const search = useContext(MenuSearchContext)
  return search != null && search.query.trim() !== ''
}

/**
 * Whether an item is shown: always without a search, else when its text
 * matches the query. A shown item is counted, for the empty state.
 */
const useMenuSearchMatch = (
  textValue: string | undefined,
  children: ReactNode,
) => {
  const search = useContext(MenuSearchContext)
  const query = search?.query.trim() ?? ''
  const match =
    search == null ||
    query === '' ||
    search.filter(textValue ?? textOf(children), query)
  const register = search?.register
  // Before paint, so "No results" never flashes while the items update.
  useLayoutEffect(() => {
    if (!register || !match) return
    return register()
  }, [register, match])
  return match
}

/** What the content's Escape handler needs from the field. */
type MenuSearchControl = {
  input: HTMLInputElement | null
  query: string
  clear: () => void
}

type DropdownMenuSearchSurfaceProps = ComponentProps<'div'> & {
  options: DropdownMenuSearchOptions
  control: RefObject<MenuSearchControl | null>
  loop?: boolean
}

/** The menu items that can take the focus, in order. */
const focusableItems = (menu: HTMLElement | null) =>
  Array.from(
    menu?.querySelectorAll<HTMLElement>(
      '[role^="menuitem"]:not([data-disabled])',
    ) ?? [],
  )

/**
 * The content of a menu with a search: Radix renders it `asChild`, so it
 * gets the content's props. The `role="menu"` (with its name and
 * orientation) goes on the list of items under the field, as a menu may only
 * contain items: the field and the empty state are outside it, in the
 * popover. Mounted only while the menu is open, so the query resets.
 */
const DropdownMenuSearchSurface: FC<DropdownMenuSearchSurfaceProps> = ({
  options,
  control,
  loop,
  // Radix's `role="menu"` and `aria-orientation`: on the list instead.
  role: _role,
  'aria-orientation': _ariaOrientation,
  'aria-labelledby': ariaLabelledBy,
  dir,
  className,
  children,
  onKeyDown,
  ...props
}) => {
  const messages = useMessages()
  const {
    query: queryProp,
    defaultQuery = '',
    onQueryChange,
    filter = defaultDropdownMenuSearchFilter,
    label = messages.dropdownMenu.search,
    placeholder,
    emptyMessage = messages.dropdownMenu.empty,
  } = options
  const [innerQuery, setInnerQuery] = useState(defaultQuery)
  const query = queryProp ?? innerQuery
  const [shown, setShown] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const setQuery = (next: string) => {
    if (queryProp === undefined) setInnerQuery(next)
    onQueryChange?.(next)
  }

  // The field takes the focus when the menu opens (before Radix's focus
  // scope, which then keeps it): type to filter, ArrowDown to the items.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useLayoutEffect(() => {
    control.current = {
      input: inputRef.current,
      query,
      clear: () => setQuery(''),
    }
  })

  const register = useCallback(() => {
    setShown((count) => count + 1)
    return () => setShown((count) => count - 1)
  }, [])
  const search = useMemo(
    () => ({ query, filter, register }),
    [query, filter, register],
  )
  const isEmpty = query.trim() !== '' && shown === 0

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isComposingKey(event)) {
      event.stopPropagation()
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // Into the menu: the first item, or the last one.
      const items = focusableItems(menuRef.current)
      event.preventDefault()
      event.stopPropagation()
      ;(event.key === 'ArrowDown' ? items[0] : items.at(-1))?.focus()
      return
    }
    // Typing filters the menu: keep the keys from its typeahead.
    if (event.key.length === 1) event.stopPropagation()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const input = inputRef.current
    // Keys from this menu, not a submenu (whose events bubble through the
    // portal) or the field.
    const inMenu =
      input != null &&
      target !== input &&
      target.closest('[data-radix-menu-content]') === event.currentTarget
    if (inMenu) {
      const isPrintable =
        event.key.length === 1 &&
        event.key !== ' ' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      if (isPrintable && !event.defaultPrevented) {
        // A letter on an item goes to the field (instead of the typeahead).
        event.preventDefault()
        setQuery(query + event.key)
        input.focus()
      } else if (
        event.key === 'ArrowUp' &&
        !loop &&
        target === focusableItems(menuRef.current)[0]
      ) {
        // Up from the first item: back to the field.
        input.focus()
      }
    }
    onKeyDown?.(event)
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the Radix menu content (focusable, it handles the menu's keys); its role is on the list
    <div {...props} dir={dir} className={className} onKeyDown={handleKeyDown}>
      {/* Figma: the Search (Gray, 28px, padding 4/8, radius 16) in a 44px row
          with 8px of padding, at the top of the menu. */}
      <div className="mx-3 mt-3 shrink-0 p-2">
        <Search
          ref={inputRef}
          aria-label={label}
          aria-controls={menuId}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleFieldKeyDown}
        />
      </div>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={ariaLabelledBy}
        dir={dir}
        // Hidden with no items: a menu needs at least one.
        hidden={isEmpty}
        className={twMerge(
          'min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-3',
          dropdownMenuSearchScrollClasses,
        )}
      >
        <MenuSearchContext.Provider value={search}>
          {children}
        </MenuSearchContext.Provider>
      </div>
      <div role="status" aria-live="polite" className="empty:hidden">
        {isEmpty && (
          <p className="mx-3 mb-3 p-2 text-14 text-secondary">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuPrimitive.Group>

/**
 * 4px margins above and below: next to a separator they merge into its 7
 * and 8px, so two groups stay the Figma 16px apart (7 + the 1px line + 8).
 */
const DropdownMenuGroup: FC<DropdownMenuGroupProps> = ({
  className,
  ...props
}) => {
  // While a search filters the menu, the matches are one list, with no
  // separators and no gaps between groups.
  const filtering = useMenuSearchActive()

  return (
    <DropdownMenuPrimitive.Group
      className={twMerge('my-1', filtering && 'my-0', className)}
      {...props}
    />
  )
}

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

type DropdownMenuSubTriggerProps = ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean
  /**
   * The submenu's current value, shown before the chevron in 12/16
   * `text-secondary` text (Figma: the value hint of a Popover row). It is
   * part of the item's accessible name.
   */
  hint?: ReactNode
}

const DropdownMenuSubTrigger: FC<DropdownMenuSubTriggerProps> = ({
  className,
  inset,
  hint,
  children,
  ...props
}) => {
  const hasHint = hint != null && hint !== false
  const shown = useMenuSearchMatch(props.textValue, children)
  if (!shown) return null

  return (
    <DropdownMenuPrimitive.SubTrigger
      className={twMerge(popoverItemClasses, inset && 'ps-8', className)}
      {...props}
    >
      {children}
      {hasHint && <span className={popoverHintClasses}>{hint}</span>}
      {/* Figma: the submenu item ends in a 16px ArrowLineRight chevron. */}
      <ArrowLineRightIcon
        className={twMerge(popoverChevronClasses, hasHint && 'ms-0')}
      />
    </DropdownMenuPrimitive.SubTrigger>
  )
}
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

type DropdownMenuSubContentProps = ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
>

const DropdownMenuSubContent: FC<DropdownMenuSubContentProps> = ({
  className,
  children,
  ...props
}) => {
  const { theme, contrast } = useSnowUI()

  return (
    <DropdownMenuPrimitive.SubContent
      // For a submenu you put in a `DropdownMenuPortal`.
      data-theme={theme}
      data-contrast={contrast}
      className={twMerge(dropdownMenuContentStyles, className)}
      {...props}
    >
      {/* The parent menu's search doesn't filter a submenu. */}
      <MenuSearchContext.Provider value={null}>
        {children}
      </MenuSearchContext.Provider>
    </DropdownMenuPrimitive.SubContent>
  )
}
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

type DropdownMenuContentProps = ComponentProps<
  typeof DropdownMenuPrimitive.Content
> & {
  /**
   * A search field at the top that filters the items by their text (the
   * kit's Popover search). `true`, or the field's options. The field takes
   * the focus when the menu opens. Added in 5.2.
   */
  search?: boolean | DropdownMenuSearchOptions
}

/**
 * The menu, in a portal. It takes the `theme` of a `SnowUIProvider` or
 * `ThemeScope` (the portal is outside your layout's `data-theme` scope).
 */
const DropdownMenuContent: FC<DropdownMenuContentProps> = ({
  className,
  sideOffset = 4,
  search,
  loop,
  onEscapeKeyDown,
  children,
  ...props
}) => {
  const { theme, contrast } = useSnowUI()
  const control = useRef<MenuSearchControl | null>(null)

  if (!search) {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          data-theme={theme}
          data-contrast={contrast}
          sideOffset={sideOffset}
          loop={loop}
          onEscapeKeyDown={onEscapeKeyDown}
          className={twMerge(dropdownMenuContentStyles, className)}
          {...props}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    )
  }

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        asChild
        data-theme={theme}
        data-contrast={contrast}
        sideOffset={sideOffset}
        loop={loop}
        onEscapeKeyDown={(event) => {
          onEscapeKeyDown?.(event)
          const field = control.current
          if (
            event.defaultPrevented ||
            !field?.input ||
            event.target !== field.input ||
            field.query === ''
          ) {
            return
          }
          // Escape in a field with text clears it; the next one closes.
          event.preventDefault()
          field.clear()
        }}
        {...props}
      >
        <DropdownMenuSearchSurface
          options={search === true ? {} : search}
          control={control}
          loop={loop}
          className={twMerge(
            dropdownMenuContentStyles,
            'flex flex-col overflow-hidden p-0',
            className,
          )}
        >
          {children}
        </DropdownMenuSearchSurface>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

type DropdownMenuItemProps = ComponentProps<
  typeof DropdownMenuPrimitive.Item
> & {
  inset?: boolean
  /**
   * `destructive`: an action that deletes or can't be undone (the kit's red
   * "Delete" row): text and icons in `red-text`, at least 4.5:1 on the menu
   * and its highlight in both modes. Added in 5.2.
   * @default 'default'
   */
  variant?: 'default' | 'destructive'
}

const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  className,
  inset,
  variant = 'default',
  ...props
}) => {
  const shown = useMenuSearchMatch(props.textValue, props.children)
  if (!shown) return null

  return (
    <DropdownMenuPrimitive.Item
      data-variant={variant === 'destructive' ? variant : undefined}
      className={twMerge(
        popoverItemClasses,
        variant === 'destructive' && popoverItemDestructiveClasses,
        inset && 'ps-8',
        className,
      )}
      {...props}
    />
  )
}
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

type DropdownMenuCheckboxItemProps = ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
>

const DropdownMenuCheckboxItem: FC<DropdownMenuCheckboxItemProps> = ({
  className,
  children,
  checked,
  ...props
}) => {
  const shown = useMenuSearchMatch(props.textValue, children)
  if (!shown) return null

  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={twMerge(popoverItemClasses, 'pe-8', className)}
      checked={checked}
      {...props}
    >
      {children}
      {/* Figma: a trailing 16px Check on the selected item, as in Select. */}
      <span className="absolute end-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check size={16} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.CheckboxItem>
  )
}
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

type DropdownMenuRadioItemProps = ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem
>

const DropdownMenuRadioItem: FC<DropdownMenuRadioItemProps> = ({
  className,
  children,
  ...props
}) => {
  const shown = useMenuSearchMatch(props.textValue, children)
  if (!shown) return null

  return (
    <DropdownMenuPrimitive.RadioItem
      className={twMerge(popoverItemClasses, 'pe-8', className)}
      {...props}
    >
      {children}
      {/* Figma: the chosen item of a single-choice list ends in the same
        16px Check as Select's (the role says it is a radio item). */}
      <span className="absolute end-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check size={16} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.RadioItem>
  )
}
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

type DropdownMenuLabelProps = ComponentProps<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean
}

const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  className,
  inset,
  ...props
}) => {
  // Hidden while a search filters the menu: the matches are one list.
  if (useMenuSearchActive()) return null

  return (
    <DropdownMenuPrimitive.Label
      className={twMerge(popoverLabelClasses, inset && 'ps-8', className)}
      {...props}
    />
  )
}
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

type DropdownMenuSeparatorProps = ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>

const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = ({
  className,
  ...props
}) => {
  if (useMenuSearchActive()) return null

  return (
    <DropdownMenuPrimitive.Separator
      className={twMerge(popoverSeparatorClasses, className)}
      {...props}
    />
  )
}
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

type DropdownMenuShortcutProps = KBDProps

/**
 * A `<kbd>` at the end of the item, in the kit's plain `text-secondary`
 * text. Pass a `variant` (`solid`, `border`) for the `KBD` badge.
 */
const DropdownMenuShortcut: FC<DropdownMenuShortcutProps> = ({
  className,
  variant,
  ...props
}) => (
  <KBD
    className={twMerge(
      popoverShortcutEndClasses,
      variant == null && popoverShortcutClasses,
      className,
    )}
    variant={variant}
    size={TEXT_SIZES[12]}
    {...props}
  />
)
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  type DropdownMenuCheckboxItemProps,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuGroup,
  type DropdownMenuGroupProps,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  DropdownMenuLabel,
  type DropdownMenuLabelProps,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type DropdownMenuRadioItemProps,
  type DropdownMenuSearchFilter,
  type DropdownMenuSearchOptions,
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
  DropdownMenuShortcut,
  type DropdownMenuShortcutProps,
  DropdownMenuSub,
  DropdownMenuSubContent,
  type DropdownMenuSubContentProps,
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  DropdownMenuTrigger,
  defaultDropdownMenuSearchFilter,
  dropdownMenuContentStyles,
}
