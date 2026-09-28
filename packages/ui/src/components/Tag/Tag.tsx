import { CloseIcon } from '@holakirr/snow-ui-icons'
import type { ComponentProps, FC, ReactNode } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { Typography } from '../Text'

/**
 * Figma Tag "State" (Hover is the pointer state of Default):
 * - `default`: Black/4%, Black/10% on hover.
 * - `active`: selected — indigo text and icons on a 10% indigo fill.
 * - `static`: Black/4% with no hover (not interactive).
 */
export type TagState = 'default' | 'active' | 'static'

/**
 * Figma Tag "Type": a rounded tag, or a tag with an arrow tip on one side.
 */
export type TagShape = 'default' | 'arrow-left' | 'arrow-right'

/**
 * Props for the Tag component.
 */
export type TagProps = ComponentProps<'div'> & {
  /**
   * The content to be displayed on the left side of the tag.
   */
  leftContent?: ReactNode

  /**
   * Shows the Figma "Dot" left icon (ignored when `leftContent` is set).
   */
  dot?: boolean

  /**
   * The label of the tag.
   */
  label: string

  /**
   * Callback function to be called when the tag is closed.
   */
  onClose?: () => void

  /**
   * The Figma state of the tag.
   * @default "default"
   */
  state?: TagState

  /**
   * The Figma type of the tag. The arrow shapes have no icons.
   * @default "default"
   */
  shape?: TagShape
}

// The tag fill lives in a CSS variable so the arrow tip (an SVG) and the
// body share it, including on hover.
const stateClasses: { [K in TagState]: string } = {
  default:
    'text-black [--tag-fill:var(--color-black-4)] hover:cursor-pointer hover:[--tag-fill:var(--color-black-10)]',
  // Figma's indigo label is 2.07:1 on the tint; `indigo-text` is 5:1.
  active:
    'text-indigo-text [--tag-fill:color-mix(in_srgb,var(--color-indigo)_10%,transparent)] hover:cursor-pointer',
  static: 'text-black [--tag-fill:var(--color-black-4)]',
}

/**
 * The arrow tip from Figma's "Left arrow" tag: the part of the arrow outside
 * the 8px-radius body, which overlaps it by 8px.
 */
const ArrowTip: FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <svg
    aria-hidden
    viewBox="0 0 14.8774 20"
    className={twMerge(
      'h-5 w-[14.8774px] shrink-0 fill-(--tag-fill) transition-all',
      side === 'left' ? '-mr-2' : '-ml-2 -scale-x-100',
    )}
  >
    <path d="M10.7222 20C8.29204 19.9999 5.99322 18.8956 4.4751 16.998L0.876465 12.499C-0.292235 11.0381 -0.292234 8.96185 0.876466 7.50098L4.4751 3.00293C5.99322 1.10528 8.292 0 10.7222 0L14.8774 0C10.4592 0 6.87744 3.58172 6.87744 8L6.87744 12C6.87744 16.4183 10.4592 20 14.8774 20L10.7222 20Z" />
  </svg>
)

/**
 * Tag component displays a tag with a label and optional dot and close icon.
 * It has no role of its own. For a list of tags, render them in a
 * `role="list"` container and pass `role="listitem"` to each tag, or wrap
 * each tag in an `<li>` of a `<ul>` (a `<ul>` can't contain the tags'
 * `<div>`s directly).
 */
const Tag: FC<TagProps> = ({
  leftContent,
  dot,
  label,
  onClose,
  state = 'default',
  shape = 'default',
  className,
  ref,
  ...props
}) => {
  const isArrow = shape !== 'default'
  const left =
    leftContent ??
    (dot && (
      <span aria-hidden className="flex size-3 items-center justify-center">
        <span className="size-[4.5px] rounded-full bg-current" />
      </span>
    ))
  const hasLeft = !isArrow && !!left
  const hasClose = !isArrow && !!onClose

  const text = (
    <Typography as="span" size={12} className="text-inherit">
      {label}
    </Typography>
  )

  if (isArrow) {
    return (
      <div
        className={twMerge(
          'group relative inline-flex h-5 shrink-0 items-center',
          stateClasses[state],
          className,
        )}
        ref={ref}
        {...props}
      >
        {shape === 'arrow-left' && <ArrowTip side="left" />}
        <span
          className={twMerge(
            'flex h-5 items-center rounded-8 bg-(--tag-fill) py-0.5 transition-all',
            shape === 'arrow-left' ? 'pr-2 pl-1' : 'pr-1 pl-2',
          )}
        >
          {text}
        </span>
        {shape === 'arrow-right' && <ArrowTip side="right" />}
      </div>
    )
  }

  return (
    <div
      className={twMerge(
        'group relative inline-flex h-5 shrink-0 items-center justify-center rounded-8 bg-(--tag-fill) py-0.5 transition-all',
        hasLeft ? 'pl-1' : 'pl-2',
        hasClose ? 'pr-1' : 'pr-2',
        stateClasses[state],
        className,
      )}
      ref={ref}
      {...props}
    >
      {hasLeft && left}

      {text}

      {hasClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={`Remove tag ${label}`}
          title={`Remove tag ${label}`}
          // The 12px Figma icon, with a 24px hit area (WCAG 2.5.8) drawn by
          // the ::after pseudo-element so the tag keeps its 20px height.
          // Figma: 40% opacity (2.85:1). At 80% the icon meets 3:1 (1.4.11)
          // on every tag, the active indigo one included (3.46:1 light,
          // 3.83:1 dark; 60% would be 2.43:1 there).
          className="relative flex size-3 cursor-pointer items-center justify-center rounded-4 opacity-80 transition-opacity after:absolute after:-inset-1.5 after:content-[''] hover:opacity-100 focus-ring focus-visible:opacity-100"
        >
          <CloseIcon aria-hidden size={12} className="fill-current" />
        </button>
      )}
    </div>
  )
}
Tag.displayName = 'Tag'

export { Tag }
