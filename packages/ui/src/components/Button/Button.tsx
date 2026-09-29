import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, JSX, ReactNode, Ref } from 'react'
import { SIZES, TEXT_SIZES } from '../../constants'
import type {
  ButtonVariant,
  PolymorphicProps,
  Size,
  TextSize,
} from '../../types'
import { warnIfUnnamedIconOnly } from '../../utils/accessible-name'
import { warnAsDeprecated, warnDeprecated } from '../../utils/deprecation'
import { slotted } from '../../utils/slot'
import { twMerge } from '../../utils/tw-merge'
import { Typography } from '../Text'

const defaultTag = 'button'

/**
 * Props for the Button component.
 */
type ButtonProps<C extends ElementType = typeof defaultTag> =
  PolymorphicProps<C> &
    VariantProps<typeof buttonVariants> & {
      /**
       * Render the only child element instead of a `<button>`, e.g. a router
       * link: it gets the button's classes (merged with its own, which win
       * conflicts), props, ref and event handlers, and the `label`,
       * `startContent` and `endContent` are rendered inside it, around its
       * own children.
       * @example <Button asChild label="Home"><a href="/" /></Button>
       * @default false
       */
      asChild?: boolean

      /**
       * The element to render instead of a `<button>`.
       * @deprecated Use `asChild`: `<Button asChild><a href="/">…</a></Button>`.
       * `as` will be removed in the next major version.
       */
      as?: C

      /**
       * The label text or number displayed on the button.
       */
      label?: string

      /**
       * Content before the label (on the left in left-to-right text, on the
       * right in right-to-left text), e.g. an icon. An icon without a
       * `label` or `endContent` makes a square icon-only button.
       */
      startContent?: ReactNode

      /**
       * Content after the label (on the right in left-to-right text).
       */
      endContent?: ReactNode

      /**
       * @deprecated Use `startContent`, which follows the text direction.
       * `leftContent` will be removed in the next major version.
       */
      leftContent?: JSX.Element

      /**
       * @deprecated Use `endContent`, which follows the text direction.
       * `rightContent` will be removed in the next major version.
       */
      rightContent?: JSX.Element

      /**
       * The size of the label text. Defaults to the Figma text style of the
       * button size: 12 (`sm`), 14 (`md`) or 16 (`lg`).
       */
      textSize?: TextSize

      /**
       * The variant of the button. `bare` has no box and a `text-secondary`
       * label that turns black on hover and keyboard focus; its colour is the
       * `--button-fg` custom property, so a `text-*` className sets it in
       * every state, and `[--button-fg:…]` sets only the rest colour.
       * @default "borderless"
       */
      variant?: ButtonVariant

      /** The rendered element: the `<button>`, or the child with `asChild`. */
      ref?: Ref<HTMLElement>
    }

/**
 * Figma "Button" (Size × Variant × State). The design has Default and Hover
 * states only; the focus ring (`ring-focus`) and the disabled look are the
 * library's own, built from the same tokens.
 */
const buttonVariants = cva(
  [
    'group inline-flex shrink-0 items-center justify-center whitespace-nowrap font-normal text-black transition-all',
    // The press scale is motion: none with reduced motion.
    'cursor-pointer focus-ring active:scale-95 motion-reduce:active:scale-100',
    'disabled:cursor-not-allowed disabled:scale-100 disabled:text-black-20',
  ],
  {
    variants: {
      variant: {
        borderless: 'bg-transparent hover:bg-black-4 disabled:bg-transparent',
        gray: 'bg-black-4 hover:bg-black-10 disabled:bg-black-4',
        outline:
          'bg-transparent inset-ring-[0.5px] inset-ring-black-10 hover:bg-black-4 disabled:bg-transparent',
        // Figma draws a white label in both modes; on the dark indigo Primary
        // that is 2.07:1, so the label flips to black there (10.15:1).
        filled:
          'bg-primary text-white hover:bg-primary-hover disabled:bg-black-4',
        // No box. Figma dims it to 40% opacity (2.85:1); the label uses
        // `text-secondary` instead (5.74:1), black on hover and keyboard
        // focus. The colour is `var(--button-fg)` and the states only change
        // that property, so a `text-*` className sets the colour in every
        // state; set `[--button-fg:…]` to change only the rest colour.
        bare: 'bg-transparent text-(--button-fg) [--button-fg:var(--color-text-secondary)] hover:[--button-fg:var(--color-black)] focus-visible:[--button-fg:var(--color-black)]',
      },
      size: {
        sm: 'min-h-6 min-w-6 gap-1 rounded-12 px-3 py-1 text-12',
        md: 'min-h-9 min-w-9 gap-1.5 rounded-16 px-4 py-2 text-14',
        lg: 'min-h-12 min-w-12 gap-2 rounded-20 px-5 py-3 text-16',
      },
    },
    compoundVariants: [
      {
        variant: 'bare',
        // No box, so the element can be smaller than 24px: `hit-area` gives
        // it an invisible 24×24px hit area (WCAG 2.5.8).
        className: 'relative min-h-0 min-w-0 rounded-none p-0 hit-area',
      },
    ],
    defaultVariants: {
      variant: 'borderless',
      size: 'sm',
    },
  },
)

/** Label text style per size (Figma: 12/16, 14/20, 16/24). */
const buttonTextSizes: { [K in Size]: TextSize } = {
  sm: TEXT_SIZES[12],
  md: TEXT_SIZES[14],
  lg: TEXT_SIZES[16],
}

/*
 * Figma icon sizes, for icons that don't size themselves: an <svg> child
 * without a `width` attribute or a `size-*` class. Icons from
 * @holakirr/snow-ui-icons always render `width`, so pass their `size`
 * (12/16/20 next to a label, 16/20/24 in an icon-only button).
 */

/** Icons next to a label: 12, 16 or 20px. */
const buttonIconSizes: { [K in Size]: string } = {
  sm: '[&>svg:not([width]):not([class*=size-])]:size-3',
  md: '[&>svg:not([width]):not([class*=size-])]:size-4',
  lg: '[&>svg:not([width]):not([class*=size-])]:size-5',
}

/** Icon-only buttons: square padding and a bigger glyph (16, 20 or 24px). */
const iconButtonClasses: { [K in Size]: string } = {
  sm: 'p-1 [&>svg:not([width]):not([class*=size-])]:size-4',
  md: 'p-2 [&>svg:not([width]):not([class*=size-])]:size-5',
  lg: 'p-3 [&>svg:not([width]):not([class*=size-])]:size-6',
}

/**
 * Button component displays a button element. With `asChild` it styles its
 * child element instead, e.g. a link or a router link.
 */
const Button = <C extends ElementType = typeof defaultTag>({
  as,
  asChild = false,
  className,
  label,
  startContent,
  endContent,
  leftContent,
  rightContent,
  size,
  textSize,
  variant,
  children,
  ...props
}: ButtonProps<C>): JSX.Element => {
  if (as !== undefined) {
    warnAsDeprecated('Button', '<Button asChild><a href="/">…</a></Button>')
  }
  if (leftContent !== undefined || rightContent !== undefined) {
    warnDeprecated(
      'Button:leftContent',
      'Button: `leftContent` and `rightContent` are deprecated and will be removed in the next major version. Use `startContent` and `endContent`, which follow the text direction.',
    )
  }

  const start = startContent ?? leftContent
  const end = endContent ?? rightContent
  const Component = as ?? defaultTag
  const buttonSize = size ?? SIZES.sm
  // `children` may be screen-reader-only text, so they don't count here.
  const isIconOnly = !!start && !end && !label
  // An icon at either end (or both) without a label or a name.
  if (!label) {
    warnIfUnnamedIconOnly(
      'Button',
      'button',
      { ...props, children },
      { asChild, icons: [start, end] },
    )
  }

  const classes = twMerge(
    buttonVariants({ variant, size }),
    isIconOnly
      ? [iconButtonClasses[buttonSize], variant === 'bare' && 'p-0']
      : buttonIconSizes[buttonSize],
    className,
  )

  const renderContent = (content: ReactNode) => (
    <>
      {start}
      {label && (
        <Typography
          className="text-center text-inherit group-hover:px-1 group-disabled:px-0"
          size={textSize ?? buttonTextSizes[buttonSize]}
        >
          {label}
        </Typography>
      )}
      {content}
      {end}
    </>
  )

  if (asChild) {
    const slot = slotted(children, classes, renderContent)
    return (
      <Slot {...props} className={slot.className}>
        {slot.child}
      </Slot>
    )
  }

  return (
    <Component
      type={Component === defaultTag ? 'button' : undefined}
      aria-label={label && children == null ? label : undefined}
      className={classes}
      {...props}
    >
      {renderContent(children)}
    </Component>
  )
}
Button.displayName = 'Button'

export { Button, type ButtonProps, buttonVariants }
