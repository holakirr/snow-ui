/**
 * Class names that the Calendar shares with the date pickers' panel; not
 * part of the package's API.
 */

// Figma: "Today" / "Last selection" tags, Black/4%, padding 2/4, radius 8.
// They are 20px high: `hit-area` makes the pointer target 24 (WCAG 2.5.8).
export const actionClassName =
  'relative inline-flex h-5 items-center rounded-8 bg-black-4 px-1 text-12 text-black transition-colors hover:bg-black-10 focus-ring hit-area'

/** The Figma DatePicker surface, which the date pickers' panel reuses. */
export const calendarSurfaceClassName =
  'w-fit rounded-16 text-black glass-2 inset-ring inset-ring-surface-1'

/**
 * Today (and the current month, year or hour in the pickers' views): a 4px
 * dot in the text colour under the label. The Secondary/Indigo fill marks
 * today in the kit, but in dark mode a selected day is indigo too; the dot
 * tells them apart there, stays on while today is selected, and keeps the
 * forced text colour with forced colours (where the fills are dropped).
 */
export const todayMarkClassName =
  'relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-[5px] after:mx-auto after:size-1 after:rounded-full after:bg-current forced-colors:after:forced-color-adjust-none'

/**
 * A selected day, month, year or time with forced colours: the system
 * Highlight, as a native selection, since the Primary fill is dropped.
 */
export const selectedForcedClassName =
  'forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:hover:bg-[Highlight]'
