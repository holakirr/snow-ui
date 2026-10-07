import { cva } from 'class-variance-authority'

/**
 * Figma Tab "Pill" / "Icon-toggle" container (a blurred Black/4% track) and
 * the "Solid" group, which has no container. Shared by `TabsList` and
 * `ToggleGroup`.
 */
export const segmentedListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      pill: 'bg-black-4 backdrop-blur-[10px]',
      solid: '',
    },
    size: {
      sm: 'gap-0.5',
      md: 'gap-1',
      lg: 'gap-1',
    },
  },
  compoundVariants: [
    { variant: 'pill', size: 'sm', className: 'rounded-16 p-0.5' },
    { variant: 'pill', size: 'md', className: 'rounded-20 p-1' },
    { variant: 'pill', size: 'lg', className: 'rounded-24 p-1' },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})

/**
 * The items of a segmented control: Figma Button instances. The selected item
 * (`data-state="active"` for tabs, `data-state="on"` for toggles) is a Gray
 * button (`solid`), a white, shadowed one (`pill`) or a Filled one (`filled`,
 * 5.2: Primary with the per-mode `white` label); the others are Borderless
 * buttons. Figma dims them to 40% opacity (2.85:1); here their
 * label and icon use `text-secondary` (5.74:1 light, 7.08:1 dark) and turn
 * black on hover, keyboard focus and when selected.
 *
 * The colour is `var(--segment-fg)` and the states only change that
 * property, so a `text-*` class passed as `className` sets the colour in
 * every state (tailwind-merge drops `text-(--segment-fg)`); set
 * `[--segment-fg:…]` instead to change the rest colour and keep the states.
 * Disabled sets `color` itself and wins by specificity, whatever the element
 * (a <button>, or a link with `asChild`). The selected `filled` item sets
 * `color` too, unless disabled, so hover and focus keep its label white.
 *
 * Icons are sized unless they have a `size-*` class. Shared by
 * `TabsTrigger` and `Toggle`.
 */
export const segmentedItemVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap font-normal transition-all',
    'cursor-pointer focus-ring',
    'text-(--segment-fg) [--segment-fg:var(--color-text-secondary)]',
    'hover:[--segment-fg:var(--color-black)] focus-visible:[--segment-fg:var(--color-black)] data-[state=active]:[--segment-fg:var(--color-black)] data-[state=on]:[--segment-fg:var(--color-black)]',
    // Disabled items stay visible: Black/20% content and a 0.5px Black/10%
    // outline so the item's shape shows even when it's off.
    'disabled:cursor-default disabled:bg-black-4 disabled:text-black-20',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        solid: 'data-[state=active]:bg-black-4 data-[state=on]:bg-black-4',
        pill: 'data-[state=active]:bg-white-80 data-[state=active]:shadow-2 data-[state=on]:bg-white-80 data-[state=on]:shadow-2',
        outline:
          'inset-ring-[0.5px] inset-ring-black-10 data-[state=active]:bg-black-4 data-[state=on]:bg-black-4',
        // The kit's navigation and segmented examples: the selected item is
        // a Filled button (black, a white label; indigo with a black label in
        // dark mode, 10.15:1, as the Filled Button).
        filled: [
          'data-[state=active]:not-disabled:bg-primary data-[state=active]:not-disabled:text-white',
          'data-[state=on]:not-disabled:bg-primary data-[state=on]:not-disabled:text-white',
        ],
      },
      // Figma Button sizes; icons next to a label are 12, 16 or 20px.
      size: {
        sm: 'min-h-6 min-w-6 gap-1 rounded-12 px-3 py-1 text-12 [&_svg:not([class*=size-])]:size-3',
        md: 'min-h-9 min-w-9 gap-1.5 rounded-16 px-4 py-2 text-14 [&_svg:not([class*=size-])]:size-4',
        lg: 'min-h-12 min-w-12 gap-2 rounded-20 px-5 py-3 text-16 [&_svg:not([class*=size-])]:size-5',
      },
      // Icon-only items: square, with a 16, 20 or 24px glyph.
      iconOnly: {
        true: '',
      },
    },
    compoundVariants: [
      {
        iconOnly: true,
        size: 'sm',
        className: 'p-1 [&_svg:not([class*=size-])]:size-4',
      },
      {
        iconOnly: true,
        size: 'md',
        className: 'p-2 [&_svg:not([class*=size-])]:size-5',
      },
      {
        iconOnly: true,
        size: 'lg',
        className: 'p-3 [&_svg:not([class*=size-])]:size-6',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
)
