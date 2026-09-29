'use client'

import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import {
  type ComponentProps,
  type FC,
  isValidElement,
  type ReactNode,
} from 'react'
import type { Size } from '../../types'
import { slotted, withSlotContent } from '../../utils/slot'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'

/**
 * The pagination navigation landmark, named by `aria-label` (default:
 * `messages.pagination.label`, "Pagination").
 */
const Pagination: FC<ComponentProps<'nav'>> = ({
  className,
  'aria-label': ariaLabel,
  ...props
}: ComponentProps<'nav'>) => {
  const messages = useMessages()

  return (
    <nav
      aria-label={ariaLabel ?? messages.pagination.label}
      className={twMerge('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}
Pagination.displayName = 'Pagination'

const PaginationContent: FC<ComponentProps<'ul'>> = ({
  className,
  ...props
}) => (
  <ul
    className={twMerge('flex flex-row items-center gap-2', className)}
    {...props}
  />
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem: FC<ComponentProps<'li'>> = ({ className, ...props }) => (
  // `flex` keeps text and icon-only links on the same line box.
  <li className={twMerge('flex', className)} {...props} />
)
PaginationItem.displayName = 'PaginationItem'

/*
 * Figma Pagination (Table page): Button Small "Outline" items, a 0.5px
 * Black/10% stroke, radius 12, 12 Regular text; the current page has a
 * Black/4% fill. `sm` is the Figma size.
 */
const paginationLinkVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1 border-[0.5px] border-black-10 font-normal text-black transition-colors hover:bg-black-4 focus-ring aria-disabled:pointer-events-none aria-disabled:text-black-20',
  {
    variants: {
      size: {
        sm: 'h-6 min-w-6 rounded-12 px-3 text-12',
        md: 'h-8 min-w-8 rounded-12 px-3 text-14',
        lg: 'h-10 min-w-10 rounded-12 px-4 text-16',
      },
      isActive: {
        true: 'bg-black-4',
        false: 'bg-transparent',
      },
    },
    defaultVariants: {
      size: 'sm',
      isActive: false,
    },
  },
)

type PaginationLinkProps = {
  /** The current page: a Black/4% fill and `aria-current="page"`. */
  isActive?: boolean
  /**
   * `sm` is the Figma size (24px).
   * @default 'sm'
   */
  size?: Size
  /** Disables the link (`aria-disabled`), e.g. "previous" on the first page. */
  disabled?: boolean
  /**
   * Render the only child element (a router link) instead of an `<a>`. A
   * disabled one gets `aria-disabled` and no pointer events; give it no
   * destination yourself.
   * @example <PaginationLink asChild isActive><RouterLink to="?page=2">2</RouterLink></PaginationLink>
   * @default false
   */
  asChild?: boolean
} & ComponentProps<'a'>

const PaginationLink: FC<PaginationLinkProps> = ({
  className,
  isActive,
  size = 'sm',
  disabled,
  asChild = false,
  href,
  onClick,
  children,
  ...props
}) => {
  const classes = twMerge(paginationLinkVariants({ size, isActive }), className)
  // A disabled link has no `href` (so it can't navigate or take focus) and
  // keeps `role="link"` with `aria-disabled`.
  const linkProps = {
    href: disabled ? undefined : href,
    onClick: disabled ? undefined : onClick,
    role: disabled ? 'link' : undefined,
    'aria-current': isActive ? ('page' as const) : undefined,
    'aria-disabled': disabled || undefined,
    'data-active': isActive || undefined,
    ...props,
  }

  if (asChild) {
    const slot = slotted(children, classes)
    return (
      <Slot {...linkProps} className={slot.className}>
        {slot.child}
      </Slot>
    )
  }

  return (
    <a {...linkProps} className={classes}>
      {children}
    </a>
  )
}
PaginationLink.displayName = 'PaginationLink'

const PAGINATION_ICON_SIZES = {
  sm: 16,
  md: 16,
  lg: 20,
}

/** Icon-only links are square: the Figma prev/next buttons (padding 4). */
const ICON_ONLY_PADDINGS = {
  sm: 'px-1',
  md: 'px-2',
  lg: 'px-2.5',
}

/** The visible text of a previous / next link (inside the child with `asChild`). */
const linkText = (asChild: boolean | undefined, children: ReactNode) =>
  asChild && isValidElement<{ children?: ReactNode }>(children)
    ? children.props.children
    : children

/**
 * The link to the previous page: an arrow (pointing to the start side, so
 * right in right-to-left text) and optional text, named by `aria-label`
 * (default: `messages.pagination.previous`, "Go to previous page").
 */
const PaginationPrevious: FC<PaginationLinkProps> = ({
  className,
  size = 'sm',
  asChild,
  'aria-label': ariaLabel,
  children,
  ...props
}) => {
  const messages = useMessages()
  const hasText = !!linkText(asChild, children)

  return (
    <PaginationLink
      aria-label={ariaLabel ?? messages.pagination.previous}
      size={size}
      asChild={asChild}
      className={twMerge(
        hasText ? 'ps-2' : ICON_ONLY_PADDINGS[size],
        className,
      )}
      {...props}
    >
      {withSlotContent(asChild, children, (text) => (
        <>
          <ArrowLineLeftIcon
            size={PAGINATION_ICON_SIZES[size]}
            className="rtl:-scale-x-100"
          />
          {text && <span>{text}</span>}
        </>
      ))}
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

/**
 * The link to the next page, named by `aria-label` (default:
 * `messages.pagination.next`, "Go to next page").
 */
const PaginationNext: FC<PaginationLinkProps> = ({
  className,
  size = 'sm',
  asChild,
  'aria-label': ariaLabel,
  children,
  ...props
}) => {
  const messages = useMessages()
  const hasText = !!linkText(asChild, children)

  return (
    <PaginationLink
      aria-label={ariaLabel ?? messages.pagination.next}
      size={size}
      asChild={asChild}
      className={twMerge(
        hasText ? 'pe-2' : ICON_ONLY_PADDINGS[size],
        className,
      )}
      {...props}
    >
      {withSlotContent(asChild, children, (text) => (
        <>
          {text && <span>{text}</span>}
          <ArrowLineRightIcon
            size={PAGINATION_ICON_SIZES[size]}
            className="rtl:-scale-x-100"
          />
        </>
      ))}
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

type PaginationEllipsisProps = {
  size?: Size
  /**
   * Screen-reader text for the skipped pages.
   * @default messages.pagination.more: "More pages"
   */
  label?: string
} & Omit<ComponentProps<'span'>, 'size'>

const ELLIPSIS_SIZES = {
  sm: 'h-6 min-w-6 text-12',
  md: 'h-8 min-w-8 text-14',
  lg: 'h-10 min-w-10 text-16',
}

const PaginationEllipsis = ({
  className,
  size = 'sm',
  label,
  ...props
}: PaginationEllipsisProps) => {
  const messages = useMessages()

  return (
    <span
      className={twMerge(
        'flex items-center justify-center text-secondary',
        ELLIPSIS_SIZES[size],
        className,
      )}
      {...props}
    >
      <span aria-hidden>…</span>
      <span className="sr-only">{label ?? messages.pagination.more}</span>
    </span>
  )
}
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  type PaginationEllipsisProps,
  PaginationItem,
  PaginationLink,
  type PaginationLinkProps,
  PaginationNext,
  PaginationPrevious,
}
