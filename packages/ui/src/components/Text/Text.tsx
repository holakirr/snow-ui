import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, ReactNode, Ref } from 'react'
import type { PolymorphicProps, TextSize } from '../../types'
import { warnAsDeprecated } from '../../utils/deprecation'
import { slotted } from '../../utils/slot'
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
    // `start` / `end` follow the text direction; `left` / `right` don't.
    align: {
      start: 'text-start',
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      end: 'text-end',
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
    align: 'start',
  },
})

/**
 * Props for the Text component.
 *
 * @template C - The element type for the Text component.
 * @example <Typography asChild size={24} semibold align="center"><h1>Example</h1></Typography>
 */
export type TextProps<C extends ElementType = typeof defaultTag> =
  PolymorphicProps<C> &
    VariantProps<typeof textStyles> & {
      /**
       * Render the only child element (a heading, a paragraph, a `<label>`…)
       * with the text styles instead of a `<span>`. Its own classes are
       * merged in and win conflicts.
       * @example <Typography asChild size={24}><h1>Title</h1></Typography>
       * @default false
       */
      asChild?: boolean

      /**
       * The element to render instead of a `<span>`.
       * @deprecated Use `asChild`: `<Typography asChild><h1>…</h1></Typography>`.
       * `as` will be removed in the next major version.
       */
      as?: C

      /**
       * The size of the text: a Figma text style (font size / line height).
       * @default 14
       */
      size?: TextSize

      /** The rendered element: the `<span>`, or the child with `asChild`. */
      ref?: Ref<HTMLElement>

      /**
       * Text alignment. `start` and `end` follow the text direction.
       * @default "start"
       */
      align?: 'start' | 'left' | 'center' | 'right' | 'end'
    }

/**
 * Text component displays text with various styles.
 */
function Typography<C extends ElementType = typeof defaultTag>({
  as,
  asChild = false,
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
  if (as !== undefined) {
    warnAsDeprecated(
      'Typography',
      '<Typography asChild><h1>…</h1></Typography>',
    )
  }

  const classes = twMerge(
    textStyles({ size, semibold, align, italic, underline }),
    className,
  )

  if (asChild) {
    const slot = slotted(children, classes)
    return (
      <Slot ref={ref} {...props} className={slot.className}>
        {slot.child}
      </Slot>
    )
  }

  const Component = as ?? defaultTag

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  )
}

Typography.displayName = 'Typography'

export { Typography }
