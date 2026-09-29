/**
 * Every user-facing string the components render on their own: accessible
 * names, screen-reader-only text, placeholders and empty states. Grouped by
 * component. Strings with values are functions, so translations can order
 * the words (and inflect them) as their language needs.
 *
 * Pass a translation (or part of one) to `SnowUIProvider`'s `messages`; a
 * component's own label prop (`closeLabel`, `clearLabel`, `aria-label`…)
 * wins over the provider.
 */
export type Messages = {
  badge: {
    /** Accessible name of a `Badge` dot without content. */
    label: string
  }
  breadcrumb: {
    /** The `Breadcrumb` navigation landmark. */
    label: string
    /** Screen-reader text of `BreadcrumbEllipsis` (the collapsed items). */
    more: string
  }
  calendar: {
    /** The toolbar's previous / next navigation landmark. */
    navigation: string
    /** The toolbar's "Today" action. */
    today: string
    /** The toolbar's "Last selection" action. */
    lastSelection: string
    /** The previous button in the year view. */
    previousYears: (count: number) => string
    /** The next button in the year view. */
    nextYears: (count: number) => string
  }
  commandPalette: {
    /** Accessible name of the dialog, the search field and the list. */
    label: string
    placeholder: string
    /** Shown when nothing matches. */
    empty: string
    /** Announced while `loading`. */
    loading: string
  }
  dialog: {
    /** The close button of `DialogHeader`. */
    close: string
  }
  link: {
    /** Screen-reader text appended to `external` links. */
    external: string
  }
  pagination: {
    /** The `Pagination` navigation landmark. */
    label: string
    previous: string
    next: string
    /** Screen-reader text of `PaginationEllipsis`. */
    more: string
  }
  search: {
    placeholder: string
    /** The clear button. */
    clear: string
  }
  sheet: {
    /** The close button of `SheetContent`. */
    close: string
  }
  sidebar: {
    /** `SidebarTrigger` and `SidebarRail`. */
    toggle: string
    /** Title of the mobile sidebar sheet (screen readers only). */
    title: string
    /** Description of the mobile sidebar sheet (screen readers only). */
    description: string
  }
  slider: {
    /** The first thumb of a range: `label` is the slider's `aria-label`. */
    minimum: (label: string) => string
    /** The second thumb of a range. */
    maximum: (label: string) => string
    /** A thumb of a slider with three or more thumbs (`position` from 1). */
    thumb: (label: string, position: number, count: number) => string
  }
  tag: {
    /** The remove button of a `Tag`. */
    remove: (label: string) => string
  }
  toast: {
    /** The close button of a toast. */
    close: string
    /** Announced before each toast's content. */
    label: string
    /** The toast region landmark; `{hotkey}` is replaced by its shortcut. */
    region: string
  }
}

/** A partial translation: any namespace, and any message in it. */
export type MessagesOverrides = {
  [Namespace in keyof Messages]?: Partial<Messages[Namespace]>
}

/** The English messages, used where no `SnowUIProvider` sets others. */
export const defaultMessages: Messages = {
  badge: {
    label: 'Notification badge',
  },
  breadcrumb: {
    label: 'Breadcrumb',
    more: 'More pages',
  },
  calendar: {
    navigation: 'Month navigation',
    today: 'Today',
    lastSelection: 'Last selection',
    previousYears: (count) => `Go to the previous ${count} years`,
    nextYears: (count) => `Go to the next ${count} years`,
  },
  commandPalette: {
    label: 'Search',
    placeholder: 'Search',
    empty: 'No results',
    loading: 'Loading',
  },
  dialog: {
    close: 'Close',
  },
  link: {
    external: '(opens in a new tab)',
  },
  pagination: {
    label: 'Pagination',
    previous: 'Go to previous page',
    next: 'Go to next page',
    more: 'More pages',
  },
  search: {
    placeholder: 'Search',
    clear: 'Clear search',
  },
  sheet: {
    close: 'Close',
  },
  sidebar: {
    toggle: 'Toggle Sidebar',
    title: 'Sidebar',
    description: 'Displays the mobile sidebar.',
  },
  slider: {
    minimum: (label) => `${label}, minimum`,
    maximum: (label) => `${label}, maximum`,
    thumb: (label, position, count) => `${label}, ${position} of ${count}`,
  },
  tag: {
    remove: (label) => `Remove tag ${label}`,
  },
  toast: {
    close: 'Close',
    label: 'Notification',
    region: 'Notifications ({hotkey})',
  },
}

/** `overrides` over `base`, namespace by namespace. */
export const mergeMessages = (
  base: Messages,
  overrides?: MessagesOverrides,
): Messages => {
  if (!overrides) return base
  return Object.fromEntries(
    (Object.keys(base) as (keyof Messages)[]).map((namespace) => [
      namespace,
      { ...base[namespace], ...overrides[namespace] },
    ]),
  ) as Messages
}
