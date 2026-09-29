/**
 * Every user-facing string the components render on their own: accessible
 * names, screen-reader-only text, placeholders and empty states. Grouped by
 * component. Strings with values are functions, so translations can order
 * the words (and inflect them) as their language needs.
 *
 * Pass a translation (or part of one) to `SnowUIProvider`'s `messages`; a
 * component's own label prop (`closeLabel`, `clearLabel`, `aria-label`…)
 * wins over the provider.
 *
 * The namespaces added in 5.1 (`alert`, `alertDialog`, `avatarGroup`,
 * `charts`, `progress`, `spinner`) are optional, so a translation typed as
 * `Messages` before they existed still compiles; the English defaults fill
 * them in, and `useMessages()` always returns every namespace
 * (`Required<Messages>`). They become required in 6.0.
 */
export type Messages = {
  alert?: {
    /** The dismiss button of an `Alert` with `onDismiss`. */
    dismiss: string
    /** Screen-reader text before the content of an `info` alert. */
    info: string
    /** Screen-reader text before the content of a `success` alert. */
    success: string
    /** Screen-reader text before the content of a `warning` alert. */
    warning: string
    /** Screen-reader text before the content of an `error` alert. */
    error: string
  }
  alertDialog?: {
    /** The label of an `AlertDialogCancel` without children. */
    cancel: string
  }
  avatarGroup?: {
    /** Screen-reader text of the "+N" avatar: the avatars not shown. */
    more: (count: number) => string
  }
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
    /**
     * The toolbar's previous / next navigation landmark. Like
     * `previousMonth` and `nextMonth`, the English default gives way to a
     * react-day-picker locale's own label; a translation wins over it.
     */
    navigation: string
    /** The previous-month button. */
    previousMonth: string
    /** The next-month button. */
    nextMonth: string
    /** The toolbar's "Today" action. */
    today: string
    /** The toolbar's "Last selection" action. */
    lastSelection: string
    /** The previous button in the year view. */
    previousYears: (count: number) => string
    /** The next button in the year view. */
    nextYears: (count: number) => string
  }
  /**
   * The charts of `@holakirr/snow-ui-charts` (5.1 and later). Each has a
   * prop that wins over it.
   */
  charts?: {
    /** Shown instead of a chart without data (`emptyMessage`). */
    empty: string
    /** Announced while a chart loads (`loadingLabel`). */
    loading: string
    /**
     * How to move between data points with the keyboard, the description
     * of a chart's plot for screen readers (`keyboardHint`).
     */
    keyboardHint: string
    /** The name of a chart's focusable plot (`navigationLabel`). */
    navigation: string
    /**
     * Header of the value column of the data table of `DonutChart` and
     * `Sparkline` (`valueLabel`).
     */
    value: string
    /** Header of the first column of `Sparkline`'s data table (`categoryLabel`). */
    point: string
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
  progress?: {
    /**
     * Accessible name of a `Progress` or `ProgressCircle` without an
     * `aria-label` or `aria-labelledby`.
     */
    label: string
    /** The value read out (`aria-valuetext`) of a determinate progress bar. */
    value: (value: number, max: number) => string
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
  spinner?: {
    /** The screen-reader text of a `Spinner`. */
    label: string
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
  [Namespace in keyof Messages]?: Partial<NonNullable<Messages[Namespace]>>
}

/** The English messages, used where no `SnowUIProvider` sets others. */
export const defaultMessages: Required<Messages> = {
  alert: {
    dismiss: 'Dismiss',
    info: 'Information',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
  },
  alertDialog: {
    cancel: 'Cancel',
  },
  avatarGroup: {
    more: (count) => `${count} more`,
  },
  badge: {
    label: 'Notification badge',
  },
  breadcrumb: {
    label: 'Breadcrumb',
    more: 'More pages',
  },
  calendar: {
    navigation: 'Month navigation',
    previousMonth: 'Go to the previous month',
    nextMonth: 'Go to the next month',
    today: 'Today',
    lastSelection: 'Last selection',
    previousYears: (count) => `Go to the previous ${count} years`,
    nextYears: (count) => `Go to the next ${count} years`,
  },
  charts: {
    empty: 'No data',
    loading: 'Loading chart',
    keyboardHint:
      'Use the left and right arrow keys to move between data points.',
    navigation: 'Data points',
    value: 'Value',
    point: 'Point',
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
  progress: {
    label: 'Progress',
    value: (value, max) => `${Math.round((value / max) * 100)}%`,
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
  spinner: {
    label: 'Loading',
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

/**
 * `overrides` over `base`, namespace by namespace. A message set to
 * `undefined` keeps the base one, so a partial translation built from
 * optional fields can't blank a string.
 */
export const mergeMessages = (
  base: Required<Messages>,
  overrides?: MessagesOverrides,
): Required<Messages> => {
  if (!overrides) return base
  return Object.fromEntries(
    (Object.keys(base) as (keyof Messages)[]).map((namespace) => [
      namespace,
      {
        ...base[namespace],
        ...Object.fromEntries(
          Object.entries(overrides[namespace] ?? {}).filter(
            ([, message]) => message !== undefined,
          ),
        ),
      },
    ]),
  ) as Required<Messages>
}

/**
 * Whether two `MessagesOverrides` have the same namespaces and the same
 * messages (by identity). Lets the provider keep its context value when a
 * parent re-renders with an equal inline `messages` object.
 */
export const sameOverrides = (
  a: MessagesOverrides | undefined,
  b: MessagesOverrides | undefined,
): boolean => {
  if (a === b) return true
  if (!a || !b) return false
  const namespaces = Object.keys(a) as (keyof Messages)[]
  if (namespaces.length !== Object.keys(b).length) return false
  return namespaces.every((namespace) => {
    const left: Record<string, unknown> = a[namespace] ?? {}
    const right: Record<string, unknown> = b[namespace] ?? {}
    const keys = Object.keys(left)
    return (
      keys.length === Object.keys(right).length &&
      keys.every((key) => left[key] === right[key])
    )
  })
}
