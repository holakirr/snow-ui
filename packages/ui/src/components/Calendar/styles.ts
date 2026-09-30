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
