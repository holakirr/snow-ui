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
 * Today (and the current month, year or hour in the pickers' views): the
 * kit's Secondary/Indigo fill (`currentUnselectedClassName`), plus a 4px dot
 * in the text colour under the label where the fill doesn't tell it apart:
 * in dark mode, where a selected day is indigo too (and today has no fill),
 * and with forced colours, where the fills are dropped (the dot keeps the
 * forced text colour). While selected, the dot shows in both themes too
 * (`todayMarkShownClassName`). In the light theme an unselected today is the
 * fill alone, as in the kit.
 */
export const todayMarkClassName =
  'relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-[5px] after:mx-auto after:hidden after:size-1 after:rounded-full after:bg-current dark:after:block forced-colors:after:block forced-colors:after:forced-color-adjust-none'

/**
 * The current month, year or hour, unselected, in the pickers' views: the
 * kit's Secondary/Indigo fill with static black text (10:1; Figma's white is
 * 2.07:1). In dark mode a selected one is indigo too, so there it has no
 * fill: indigo text (5:1 on the panel; white on the hover fill, where indigo
 * is under 4.5:1), and the dot of `todayMarkClassName`. The Calendar's days
 * spell the same out per cell (`today` in `Calendar.tsx`).
 */
export const currentUnselectedClassName =
  'bg-indigo text-static-black hover:bg-indigo/80 dark:bg-transparent dark:text-indigo dark:hover:bg-black-4 dark:hover:text-black'

/** The today dot of a selected today, whose Primary fill hides the indigo. */
export const todayMarkShownClassName = 'after:block'

/**
 * A selected day, month, year or time with forced colours: the system
 * Highlight, as a native selection, since the Primary fill is dropped.
 */
export const selectedForcedClassName =
  'forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:hover:bg-[Highlight]'
