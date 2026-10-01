// The text fields' shared class strings. No 'use client': Textarea, a
// server component without a counter, uses them on the server.

/**
 * The Figma Input field: 12/16 padding, a 16px radius, Surface/1 with a 0.5px
 * Black/20% inside stroke (Black/40% on hover and focus), 14/20 text and a
 * Black/20% placeholder. Shared by `Textarea`. The stroke and placeholder
 * colours are the `control-border*` and `placeholder` tokens: the Figma
 * values, or WCAG AA ones with more contrast, where the stroke is also 1px.
 */
export const basicInputClasses =
  'peer rounded-16 bg-surface-1 px-4 py-3 text-14 text-black inset-ring-[0.5px] inset-ring-control-border transition-all placeholder:text-placeholder hover:inset-ring-control-border-strong contrast-more:inset-ring-1'

/**
 * The disabled look: Black/4% fill, no stroke, Black/20% text, as in the
 * kit's Forms guidance. The kit's Component state draws Disabled as the
 * whole field at 20% opacity with the arrow cursor; that look is planned for
 * 6.0, and 5.x keeps this one and the not-allowed cursor.
 */
export const disabledInputClasses =
  'disabled:cursor-not-allowed disabled:bg-black-4 disabled:text-black-20 disabled:inset-ring-0'

/**
 * Figma "Focus": a Black/40% stroke plus the Focus effect (4px Black/4% ring).
 * Text fields follow the design — the caret and the darker stroke mark focus —
 * instead of the `focus-ring` outline other controls use. That stroke is
 * 0.5px (2.85:1 on the fill), so with more contrast it is 2px: its inner
 * pixel was the fill, so the focused field differs from the unfocused one by
 * at least 5.59:1 (`control-border-strong`: Black/80%; WCAG 2.4.7, 1.4.11).
 */
export const focusInputClasses =
  'focus:inset-ring-control-border-strong focus:ring-4 focus:ring-focus contrast-more:focus:inset-ring-2'

/** Figma "Static" (read-only): the stroke doesn't react to hover or focus. */
export const staticInputClasses =
  'read-only:hover:inset-ring-control-border read-only:focus:inset-ring-control-border'

/**
 * Invalid, while the field has `aria-invalid="true"` (`FormControl` sets it):
 * a 1px `control-border-invalid` stroke in every state: Secondary/Red (3.36:1
 * on white), `red-text` with more contrast: the kit's Error stroke. The kit
 * also puts a 16px `Warning` icon at the end of the field (Input and
 * Textarea draw it, see `invalidTextareaIconClasses`) and keeps the title
 * grey; the error text is the `FormMessage`.
 *
 * The read-only states repeat it, because the Static ones (`read-only:hover:`)
 * would outweigh `aria-invalid:`.
 *
 * Shared by the fields, not exported from the package: for a field of your
 * own, use these utilities directly.
 */
export const invalidInputClasses =
  'aria-invalid:inset-ring aria-invalid:inset-ring-control-border-invalid aria-invalid:read-only:hover:inset-ring-control-border-invalid aria-invalid:read-only:focus:inset-ring-control-border-invalid'

/**
 * The kit's Error icon in a Textarea, while it has `aria-invalid="true"`: the
 * 16px Phosphor `Warning` in Secondary/Red at the end of the first row (16px
 * from the end, 14px from the top), the text kept clear of it (40px end
 * padding). A background image (`--field-warning-icon`, in theme.css), since
 * a bare `<textarea>` can't hold an element. An image keeps one colour, so it
 * stays Secondary/Red with more contrast too, where the stroke turns
 * `red-text`. Input draws the same icon as an element, in the stroke's
 * colour.
 */
export const invalidTextareaIconClasses =
  'aria-invalid:bg-(image:--field-warning-icon) aria-invalid:bg-[length:16px_16px] aria-invalid:bg-no-repeat aria-invalid:bg-[position:right_16px_top_14px] rtl:aria-invalid:bg-[position:left_16px_top_14px] aria-invalid:pe-10'
