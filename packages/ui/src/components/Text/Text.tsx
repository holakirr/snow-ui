import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, ReactNode } from 'react'
import type { PolymorphicProps, TextSize } from '../../types'
import { twMerge } from '../../utils/tw-merge'

const defaultTag = 'span'

const textStyles = cva(['font-sans font-normal transition-all'], {
  variants: {
    // Figma text styles: size / line height (see `--text-*` in index.css).
    size: {
      64: 'text-64',
      48: 'text-48',
      32: 'text-32',
      24: 'text-24',
      18: 'text-18',
      16: 'text-16',
      14: 'text-14',
      12: 'text-12',
    },
    semibold: {
      true: 'font-semibold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    italic: {
      true: 'italic',
    },
    underline: {
      true: 'underline',
    },
  },
  defaultVariants: {
    // Figma's Text component defaults to "14 Regular".
    size: 14,
    align: 'left',
  },
})

/**
 * Props for the Text component.
 *
 * @template C - The element type for the Text component.
 * @example <Text as="h1" size={TEXT_SIZES[24]} semibold align="center" italic underline>Example</Text>
 */
export type TextProps<C extends ElementType = typeof defaultTag> =
  PolymorphicProps<C> &
    VariantProps<typeof textStyles> & {
      /**
       * The size of the text: a Figma text style (font size / line height).
       * @default 14
       */
      size?: TextSize
    }

/**
 * Text component displays text with various styles.
 */
function Typography<C extends ElementType = typeof defaultTag>({
  as,
  size,
  semibold,
  align,
  italic,
  underline,
  className,
  children,
  ref,
  ...props
}: TextProps<C>): ReactNode {
  const Component = as ?? defaultTag

  return (
    <Component
      ref={ref}
      className={twMerge(
        textStyles({ size, semibold, align, italic, underline }),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

Typography.displayName = 'Typography'

export { Typography }
