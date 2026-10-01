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
 * `charts`, `combobox`, `datePicker`, `listCards`, `progress`, `spinner`)
 * and 5.2 (`input`) are optional, so a translation typed as `Messages`
 * before they existed still compiles; the English defaults fill them in, and `useMessages()`
 * always returns every namespace (`Required<Messages>`). They become
 * required in 6.0.
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
  /** `Combobox` and `MultiSelect` (5.1 and later). */
  combobox?: {
    /** Shown and announced when no option matches. */
    empty: string
    /** Shown and announced while `loading`. */
    loading: string
    /** The clear button. */
    clear: string
    /** The option that creates one from the query (`creatable`). */
    create: (query: string) => string
    /** `MultiSelect`: describes the field with the labels of the picked options. */
    selected: (labels: string[]) => string
    /** `MultiSelect`: announced when a tag is removed. */
    removed: (label: string) => string
    /**
     * The browser's message for a `required` Combobox with typed text that
     * picked no option (an empty field gets the browser's own message).
     */
    required: string
    /** The browser's message for a `required` MultiSelect with no tag. */
    requiredMultiple: string
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
  /** `DatePicker` and `DateRangePicker` (5.1 and later). */
  datePicker?: {
    /** The field's text while no date is picked (`DatePicker`). */
    placeholder: string
    /** The field's text while no range is picked (`DateRangePicker`). */
    rangePlaceholder: string
    /** The popover with the calendar (`DatePicker`). */
    dialog: string
    /** The popover with the calendar (`DateRangePicker`). */
    rangeDialog: string
    /** The clear button. */
    clear: string
    /**
     * A picked range, from its two formatted dates (`DateRangePicker`). By
     * default a range within one month skips it and writes the month and
     * the year once ("Feb 2 – 10, 2026"); passing your own (or a
     * `dateFormat`, or `withTime`) uses it for every range.
     */
    range: (start: string, end: string) => string
    /** The date field at the top of the calendar (`DatePicker`). */
    date: string
    /** The start date field at the top of the calendar (`DateRangePicker`). */
    startDate: string
    /** The end date field at the top of the calendar (`DateRangePicker`). */
    endDate: string
    /** The time field at the top of the calendar (`withTime`). */
    time: string
    /** The time field of the start date (`DateRangePicker` `withTime`). */
    startTime: string
    /** The time field of the end date (`DateRangePicker` `withTime`). */
    endTime: string
    /** The year segment of the date field, and the years view. */
    year: string
    /** The month segment of the date field, and the months view. */
    month: string
    /** The day segment of the date field. */
    day: string
    /** The hour segment of the time field, and the hours view. */
    hour: string
    /** The minute segment of the time field, and the minutes view. */
    minute: string
    /** The second segment of the time field, and the seconds view. */
    second: string
    /** The AM / PM segment of the time field (12-hour time). */
    dayPeriod: string
    /** What a screen reader hears for an empty segment. */
    empty: string
    /** The months view's action that picks the current month. */
    thisMonth: string
    /** The years view's action that picks the current year. */
    thisYear: string
    /** The time view's action that picks the current time. */
    systemTime: string
    /** The link from the months, years and time views back to the days. */
    back: string
    /** The shown month (e.g. "Feb"), a button to the months view. */
    chooseMonth: (month: string) => string
    /** The shown year, a button to the years view. */
    chooseYear: (year: string) => string
    /** The previous-year button of the months view. */
    previousYear: string
    /** The next-year button of the months view. */
    nextYear: string
  }
  dialog: {
    /** The close button of `DialogHeader`. */
    close: string
  }
  input?: {
    /** The clear button of an `Input` with `clearable`. Added in 5.2. */
    clear: string
    /**
     * Announced when an `Input`'s `status` turns `progress` (the kit's In
     * progress: the value is being checked). Added in 5.2.
     */
    progress: string
    /**
     * Announced when an `Input`'s `status` turns `success` (the kit's Done:
     * the check passed). Added in 5.2.
     */
    success: string
  }
  link: {
    /** Screen-reader text appended to `external` links. */
    external: string
  }
  listCards?: {
    /** The default title of a `NotificationsCard`. */
    notifications: string
    /** The default title of an `ActivitiesCard`. */
    activities: string
    /** The default title of a `ContactsCard`. */
    contacts: string
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
    /**
     * The value a slider shows with `showValue` and its thumbs read out
     * (`aria-valuetext`), unless it has a `valueFormatter`: the value's
     * position between `min` and `max`, in percent. Optional until 6.0, like
     * the namespaces added in 5.1.
     */
    value?: (value: number, min: number, max: number) => string
  }
  spinner?: {
    /** The screen-reader text of a `Spinner`. */
    label: string
  }
  tag: {
    /** The remove button of a `Tag`. */
    remove: (label: string) => string
  }
  textarea?: {
    /**
     * The screen-reader text of a `Textarea`'s character counter, read with
     * the field: "12 of 200 characters", or "12 characters" without a
     * `maxLength`.
     */
    count: (length: number, maxLength?: number) => string
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

/**
 * The English `messages.slider.value`: the value's position between `min`
 * and `max`, in percent ("28%"). Slider also falls back on it.
 */
export const sliderValueText = (
  value: number,
  min: number,
  max: number,
): string =>
  `${Math.round(max > min ? ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100 : 0)}%`

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
  combobox: {
    empty: 'No results',
    loading: 'Loading',
    clear: 'Clear',
    create: (query) => `Create "${query}"`,
    selected: (labels) => `Selected: ${labels.join(', ')}`,
    removed: (label) => `${label} removed`,
    required: 'Select an item in the list.',
    requiredMultiple: 'Select at least one item in the list.',
  },
  commandPalette: {
    label: 'Search',
    placeholder: 'Search',
    empty: 'No results',
    loading: 'Loading',
  },
  datePicker: {
    placeholder: 'Pick a date',
    rangePlaceholder: 'Pick a date range',
    dialog: 'Choose a date',
    rangeDialog: 'Choose a date range',
    clear: 'Clear date',
    range: (start, end) => `${start} – ${end}`,
    date: 'Date',
    startDate: 'Start date',
    endDate: 'End date',
    time: 'Time',
    startTime: 'Start time',
    endTime: 'End time',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    dayPeriod: 'AM/PM',
    empty: 'Empty',
    thisMonth: 'This month',
    thisYear: 'This year',
    systemTime: 'System time',
    back: 'Back',
    chooseMonth: (month) => `${month}, choose a month`,
    chooseYear: (year) => `${year}, choose a year`,
    previousYear: 'Go to the previous year',
    nextYear: 'Go to the next year',
  },
  dialog: {
    close: 'Close',
  },
  input: {
    clear: 'Clear',
    progress: 'Checking',
    success: 'Valid',
  },
  link: {
    external: '(opens in a new tab)',
  },
  listCards: {
    notifications: 'Notifications',
    activities: 'Activities',
    contacts: 'Contacts',
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
    value: sliderValueText,
  },
  spinner: {
    label: 'Loading',
  },
  tag: {
    remove: (label) => `Remove tag ${label}`,
  },
  textarea: {
    count: (length, maxLength) =>
      maxLength === undefined
        ? `${length} ${length === 1 ? 'character' : 'characters'}`
        : `${length} of ${maxLength} characters`,
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
