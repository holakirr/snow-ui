import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { ElementType, ReactNode, Ref } from 'react'
import type { PolymorphicProps } from '../../types'
import { warnAsDeprecated } from '../../utils/deprecation'
import { slotted } from '../../utils/slot'
import { twMerge } from '../../utils/tw-merge'
import { Typography } from '../Text'

const defaultTag = 'div'

const iconTextStyles = cva('inline-flex gap-2 rounded-12 text-black', {
  variants: {
    vertical: {
      true: 'flex-col items-center text-center',
      false: 'flex-row items-center',
    },
    // Figma "Frame": the IconText with hover / selected states. Frame itself
    // has no padding, but every instance in the kit uses 8, so it is built in.
    interactive: {
      true: 'p-2 cursor-pointer transition-colors hover:bg-black-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus',
    },
    active: {
      true: 'p-2 bg-black-4',
    },
  },
  defaultVariants: {
    vertical: false,
  },
})

/**
 * Props for the IconText component.
 *
 * @template C - The element type rendered by IconText.
 */
export type IconTextProps<C extends ElementType = typeof defaultTag> =
  PolymorphicProps<C> & {
    /**
     * Render the only child element instead of a `<div>`, e.g. a link or a
     * `<button type="button">` for an interactive row (give a button its
     * `type`: the deprecated `as="button"` set it): the icon and the child's
     * own children (the text) are rendered inside it.
     * @example <IconText asChild interactive icon={<HomeIcon />}><a href="/">Home</a></IconText>
     * @default false
     */
    asChild?: boolean

    /**
     * The element type to render, e.g. `a` or `button` for an interactive row.
     * @deprecated Use `asChild`: `<IconText asChild><a href="/">…</a></IconText>`.
     * `as` will be removed in the next major version.
     * @default 'div'
     */
    as?: C

    /**
     * The icon, avatar or image. Size it with `IconBox` (16 in the Figma
     * component).
     */
    icon?: ReactNode

    /**
     * Stack the icon above the text (Figma `Vertical`).
     * @default false
     */
    vertical?: boolean

    /**
     * Put the text before the icon (Figma `Flip`).
     * @default false
     */
    flip?: boolean

    /**
     * Figma Frame `State=Default`: an 8px padded row that gets a Black/4% fill
     * on hover. Without it, IconText is static (Frame `State=Static`).
     * @default false
     */
    interactive?: boolean

    /**
     * Keep the Black/4% fill on (Figma Frame `State=Hover`), e.g. for the
     * current navigation item or the highlighted option. Sets `data-active`.
     * @default false
     */
    active?: boolean

    /** The rendered element: the `<div>`, or the child with `asChild`. */
    ref?: Ref<HTMLElement>
  }

/**
 * IconText combines an icon (or avatar) with text — the Figma "IconText" and,
 * with `interactive` / `active`, the Figma "Frame". A string child is rendered
 * as 14 Regular text.
 */
function IconText<C extends ElementType = typeof defaultTag>({
  as,
  asChild = false,
  icon,
  vertical = false,
  flip = false,
  interactive = false,
  active = false,
  className,
  children,
  ...props
}: IconTextProps<C>): ReactNode {
  if (as !== undefined) {
    warnAsDeprecated(
      'IconText',
      '<IconText asChild><a href="/">…</a></IconText>',
    )
  }

  const classes = twMerge(
    iconTextStyles({ vertical, interactive, active }),
    className,
  )
  const renderContent = (content: ReactNode) => {
    const text =
      typeof content === 'string' || typeof content === 'number' ? (
        <Typography size={14} className="min-w-0 text-inherit">
          {content}
        </Typography>
      ) : (
        content
      )
    return (
      <>
        {flip ? text : icon}
        {flip ? icon : text}
      </>
    )
  }

  if (asChild) {
    const slot = slotted(children, classes, renderContent)
    return (
      <Slot
        data-active={active || undefined}
        {...props}
        className={slot.className}
      >
        {slot.child}
      </Slot>
    )
  }

  const Component: ElementType = as ?? defaultTag

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      data-active={active || undefined}
      className={classes}
      {...props}
    >
      {renderContent(children)}
    </Component>
  )
}

IconText.displayName = 'IconText'

export { IconText, iconTextStyles }
