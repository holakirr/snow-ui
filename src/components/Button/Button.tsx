import { type VariantProps, cva } from 'class-variance-authority'
import type { ElementType, JSX } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES, SIZES, TEXT_SIZES } from '../../constants'
import type {
  ButtonVariant,
  PolymorphicProps,
  Size,
  TextSize,
} from '../../types'
import { Text } from '../Text'

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
       * The icon component to be displayed on the right side of the button.
       */
      leftContent?: JSX.Element

      /**
       * The icon component to be displayed on the left side of the button.
       */
      rightContent?: JSX.Element

      /**
       * The size of the text displayed on the button.
       */
      textSize?: TextSize

      /**
       * The variant of the button.
       */
      variant?: ButtonVariant
    }

const buttonVariants = cva(
  'group transition-all hover:cursor-pointer disabled:cursor-not-allowed text-black disabled:text-black/10 inline-flex justify-center items-center focus:outline-hidden focus:ring-4 focus:ring-black/5 active:scale-95',
  {
    variants: {
      variant: {
        borderless: 'bg-transparent font-normal hover:bg-black/5',
        gray: 'bg-black/5 hover:bg-black/20 disabled:bg-black/5 focus:ring-offset-2',
        outline:
          'bg-transparent border border-black/10 border-solid hover:bg-black/5 disabled:border-black/10',
        filled: 'text-white bg-brand hover:bg-brand-hover disabled:bg-black/4',
      },
      size: {
        sm: 'text-sm py-1 px-2 rounded-lg gap-1',
        md: 'text-base py-2 px-4 rounded-xl gap-2',
        lg: 'text-lg py-3 px-6 rounded-2xl gap-2',
      },
    },
    defaultVariants: {
      variant: 'borderless',
      size: 'sm',
    },
  },
)

const IconButtonPaddings: { [K in Size]: string } = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-4',
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
  textSize = TEXT_SIZES[16],
  variant,
  children,
  ...props
}: ButtonProps<C>): JSX.Element => {
  const Component = as ?? defaultTag

  return (
    <Component
      type="button"
      title={label?.toString() || 'Button title'}
      className={twMerge(
        buttonVariants({ variant, size }),
        !!leftContent &&
          !rightContent &&
          !label && [IconButtonPaddings[size || SIZES.sm]],
        className,
      )}
      role={ROLES.button}
      tabIndex={0}
      aria-label={label?.toString() || 'Button aria label'}
      {...props}
    >
      {leftContent}
      {label && (
        <Text
          className="group-hover:px-1 text-center text-inherit"
          size={textSize}
        >
          {label}
        </Text>
      )}
      {children}
      {rightContent}
    </Component>
  )
}
Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
