'use client'

import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import {
  type ComponentProps,
  createContext,
  type FC,
  isValidElement,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  useContext,
} from 'react'
import type { Size } from '../../types'
import { slotted, withSlotContent } from '../../utils/slot'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'

const PaginationContext = createContext<{
  onPageChange?: (page: number) => void
}>({})

type PaginationProps = ComponentProps<'nav'> & {
  /**
   * Client-side paging: called with the `page` of the item the user
   * activates. Items with a `page` and no `href` render as buttons; items
   * with both stay links (for a new tab, or without JavaScript) and a plain
   * click calls this instead of navigating.
   */
  onPageChange?: (page: number) => void
}

/**
 * The pagination navigation landmark, named by `aria-label` (default:
 * `messages.pagination.label`, "Pagination").
 */
const Pagination: FC<PaginationProps> = ({
  className,
  'aria-label': ariaLabel,
  onPageChange,
  ...props
}) => {
  const messages = useMessages()

  return (
    <PaginationContext.Provider value={{ onPageChange }}>
      <nav
        aria-label={ariaLabel ?? messages.pagination.label}
        className={twMerge('mx-auto flex w-full justify-center', className)}
        {...props}
      />
    </PaginationContext.Provider>
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
 * Figma Pagination (Order List, `32728:395827`): a 28px row of Button Small
 * items 8px apart, 24px high, radius 12, 12/16 Regular text. The other
 * pages are "Outline" (a 0.5px Black/10% stroke, no fill), the current
 * page "Gray" (a Black/4% fill, no stroke). `sm` is the Figma size.
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
        // Figma Button "Gray": the fill without the outline's stroke (kept
        // transparent, so the size doesn't change).
        true: 'bg-black-4 border-transparent',
        false: 'bg-transparent',
      },
    },
    defaultVariants: {
      size: 'sm',
      isActive: false,
    },
  },
)

type PaginationItemProps = {
  /** The current page: a Black/4% fill without the stroke, and `aria-current="page"`. */
  isActive?: boolean
  /**
   * `sm` is the Figma size (24px).
   * @default 'sm'
   */
  size?: Size
  /**
   * Disables the item, e.g. "previous" on the first page. A link loses its
   * `href` and gets `aria-disabled` (in client-side paging it stays
   * focusable); with `asChild` the child keeps its destination but gets
   * `aria-disabled` and `tabIndex={-1}`, and clicks don't reach it. A button
   * (see `page`) gets `aria-disabled` and ignores clicks, but keeps focus, so
   * "next" that becomes disabled on the last page doesn't drop the
   * keyboard's place.
   */
  disabled?: boolean
}

/**
 * The props of a pagination link: an `<a>` (as in 5.0), or with `asChild`
 * your own link element.
 */
type PaginationLinkProps = PaginationItemProps &
  ComponentProps<'a'> & {
    /**
     * The page this link goes to, passed to `Pagination`'s `onPageChange`:
     * a plain click calls it instead of navigating. Modified and middle
     * clicks, and links with a `target` or `download`, still navigate.
     * Without `href` (and `asChild`), the item is a `<button>` instead.
     */
    page?: number
    /**
     * Render the only child element (a router link) instead of an `<a>`.
     * @example <PaginationLink asChild isActive><RouterLink to="?page=2">2</RouterLink></PaginationLink>
     * @default false
     */
    asChild?: boolean
  } & ({ href: string } | { asChild: true } | { page?: undefined })

/**
 * A client-side item: a `page` without `href` renders a `<button>`, which
 * calls `Pagination`'s `onPageChange`.
 */
type PaginationButtonProps = PaginationItemProps &
  Omit<ComponentProps<'button'>, 'type'> & {
    /** The page this button goes to, passed to `Pagination`'s `onPageChange`. */
    page: number
    href?: undefined
    asChild?: false
  }

/**
 * The props of `PaginationLink`, `PaginationPrevious` and `PaginationNext`:
 * a link (with `href`, `asChild`, or neither) or a button (a `page` without
 * `href`), with the matching `ref` and event types.
 */
type PaginationItemLinkProps = PaginationLinkProps | PaginationButtonProps

/**
 * Blocks a click (a pointer or Enter on the focused link) before the link's
 * own handlers run: a router link's `onClick` sees `defaultPrevented` too
 * late in the bubble phase, so the event stops in the capture phase.
 */
const preventActivation = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
}

const PaginationLink: FC<PaginationItemLinkProps> = ({
  className,
  isActive,
  size = 'sm',
  disabled,
  asChild = false,
  href,
  page,
  onClick: onClickProp,
  onClickCapture,
  ref,
  children,
  ...props
}) => {
  const { onPageChange } = useContext(PaginationContext)
  // One handler type for the `<a>` and the `<button>`.
  const onClick = onClickProp as
    | MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
    | undefined
  const classes = twMerge(paginationLinkVariants({ size, isActive }), className)
  const isButton = !asChild && href === undefined && page !== undefined

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (isButton && disabled) return
    onClick?.(event)
    if (page === undefined || !onPageChange || event.defaultPrevented) return
    if (!isButton) {
      // The browser's own navigation, as a router link lets it: a new tab
      // or window (a modified or middle click, `target`) or a download.
      const link = event.currentTarget
      const elsewhere =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        (link.hasAttribute('target') &&
          !['', '_self'].includes(link.getAttribute('target') ?? '')) ||
        link.hasAttribute('download')
      if (elsewhere) return
      event.preventDefault()
    }
    onPageChange(page)
  }

  if (isButton) {
    // Client-side paging without a URL: a button. Disabled, it keeps focus
    // (`aria-disabled`): a disabled button under the keyboard's focus would
    // drop it on the page.
    return (
      <button
        type="button"
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        data-active={isActive || undefined}
        onClickCapture={
          onClickCapture as ComponentProps<'button'>['onClickCapture']
        }
        {...(props as ComponentProps<'button'>)}
        ref={ref as Ref<HTMLButtonElement>}
        onClick={handleClick}
        className={classes}
      >
        {children}
      </button>
    )
  }

  // A disabled link has no `href` (so it can't navigate) and keeps
  // `role="link"` with `aria-disabled`. It leaves the tab order, except in
  // client-side paging, where "next" disabled on the last page keeps the
  // keyboard's focus. A disabled `asChild` link keeps its own destination:
  // it leaves the tab order, and its clicks (and Enter) stop before its own
  // handlers, a router link's included.
  const disabledChild = disabled && asChild
  const linkProps = {
    href: disabled ? undefined : href,
    onClick: disabled ? undefined : handleClick,
    onClickCapture: disabledChild
      ? preventActivation
      : (onClickCapture as ComponentProps<'a'>['onClickCapture']),
    role: disabled ? 'link' : undefined,
    tabIndex: disabledChild ? -1 : disabled && onPageChange ? 0 : undefined,
    'aria-current': isActive ? ('page' as const) : undefined,
    'aria-disabled': disabled || undefined,
    'data-active': isActive || undefined,
    ...(props as ComponentProps<'a'>),
    ref: ref as Ref<HTMLAnchorElement>,
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
const PaginationPrevious: FC<PaginationItemLinkProps> = ({
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
      className={twMerge(
        hasText ? 'ps-2' : ICON_ONLY_PADDINGS[size],
        className,
      )}
      {...({ ...props, asChild } as PaginationItemLinkProps)}
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
const PaginationNext: FC<PaginationItemLinkProps> = ({
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
      className={twMerge(
        hasText ? 'pe-2' : ICON_ONLY_PADDINGS[size],
        className,
      )}
      {...({ ...props, asChild } as PaginationItemLinkProps)}
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
  type PaginationButtonProps,
  PaginationContent,
  PaginationEllipsis,
  type PaginationEllipsisProps,
  PaginationItem,
  PaginationLink,
  type PaginationLinkProps,
  PaginationNext,
  PaginationPrevious,
  type PaginationProps,
}
