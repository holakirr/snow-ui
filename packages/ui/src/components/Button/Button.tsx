import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, JSX } from 'react'
import { SIZES, TEXT_SIZES } from '../../constants'
import type {
  ButtonVariant,
  PolymorphicProps,
  Size,
  TextSize,
} from '../../types'
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
       * The element type for the Text component.
       */
      as?: C

      /**
       * The label text or number displayed on the button.
       */
      label?: string

      /**
       * The icon component to be displayed on the left side of the button.
       */
      leftContent?: JSX.Element

      /**
       * The icon component to be displayed on the right side of the button.
       */
      rightContent?: JSX.Element

      /**
       * The size of the label text. Defaults to the Figma text style of the
       * button size: 12 (`sm`), 14 (`md`) or 16 (`lg`).
       */
      textSize?: TextSize

      /**
       * The variant of the button.
       * @default "borderless"
       */
      variant?: ButtonVariant
    }

/**
 * Figma "Button" (Size × Variant × State). The design has Default and Hover
 * states only; the focus ring (`ring-focus`) and the disabled look are the
 * library's own, built from the same tokens.
 */
const buttonVariants = cva(
  [
    'group inline-flex shrink-0 items-center justify-center whitespace-nowrap font-normal text-black transition-all',
    'cursor-pointer focus-ring active:scale-95',
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
        // No box: 40% opacity, 100% on hover and keyboard focus.
        bare: 'bg-transparent opacity-40 hover:opacity-100 focus-visible:opacity-100 disabled:opacity-100',
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
        className: 'min-h-0 min-w-0 rounded-none p-0',
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
 * Button component displays a button element.
 */
const Button = <C extends ElementType = typeof defaultTag>({
  as,
  className,
  label,
  leftContent,
  rightContent,
  size,
  textSize,
  variant,
  children,
  ...props
}: ButtonProps<C>): JSX.Element => {
  const Component = as ?? defaultTag
  const isNativeButton = Component === defaultTag
  const buttonSize = size ?? SIZES.sm
  // `children` may be screen-reader-only text, so they don't count here.
  const isIconOnly = !!leftContent && !rightContent && !label

  return (
    <Component
      type={isNativeButton ? 'button' : undefined}
      aria-label={label && children == null ? label : undefined}
      className={twMerge(
        buttonVariants({ variant, size }),
        isIconOnly
          ? [iconButtonClasses[buttonSize], variant === 'bare' && 'p-0']
          : buttonIconSizes[buttonSize],
        className,
      )}
      {...props}
    >
      {leftContent}
      {label && (
        <Typography
          className="text-center text-inherit group-hover:px-1 group-disabled:px-0"
          size={textSize ?? buttonTextSizes[buttonSize]}
        >
          {label}
        </Typography>
      )}
      {children}
      {rightContent}
    </Component>
  )
}
Button.displayName = 'Button'

export { Button, type ButtonProps, buttonVariants }
