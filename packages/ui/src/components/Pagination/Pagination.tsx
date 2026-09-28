import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import type { Size } from '../../types'
import { twMerge } from '../../utils/tw-merge'

const Pagination: FC<ComponentProps<'nav'>> = ({
  className,
  ...props
}: ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    className={twMerge('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
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
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 border-[0.5px] border-black-10 font-normal text-black transition-colors hover:bg-black-4 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-focus aria-disabled:pointer-events-none aria-disabled:text-black-20',
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
} & ComponentProps<'a'>

const PaginationLink: FC<PaginationLinkProps> = ({
  className,
  isActive,
  size = 'sm',
  disabled,
  href,
  onClick,
  ...props
}) => (
  // A disabled link has no `href` (so it can't navigate or take focus) and
  // keeps `role="link"` with `aria-disabled`.
  <a
    href={disabled ? undefined : href}
    onClick={disabled ? undefined : onClick}
    role={disabled ? 'link' : undefined}
    aria-current={isActive ? 'page' : undefined}
    aria-disabled={disabled || undefined}
    data-active={isActive || undefined}
    className={twMerge(paginationLinkVariants({ size, isActive }), className)}
    {...props}
  />
)
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

const PaginationPrevious: FC<ComponentProps<typeof PaginationLink>> = ({
  className,
  size = 'sm',
  children,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size={size}
    className={twMerge(children ? 'pl-2' : ICON_ONLY_PADDINGS[size], className)}
    {...props}
  >
    <ArrowLineLeftIcon size={PAGINATION_ICON_SIZES[size]} />
    {children && <span>{children}</span>}
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext: FC<ComponentProps<typeof PaginationLink>> = ({
  className,
  size = 'sm',
  children,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size={size}
    className={twMerge(children ? 'pr-2' : ICON_ONLY_PADDINGS[size], className)}
    {...props}
  >
    {children && <span>{children}</span>}
    <ArrowLineRightIcon size={PAGINATION_ICON_SIZES[size]} />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

type PaginationEllipsisProps = {
  size?: Size
} & Omit<ComponentProps<'span'>, 'size'>

const ELLIPSIS_SIZES = {
  sm: 'h-6 min-w-6 text-12',
  md: 'h-8 min-w-8 text-14',
  lg: 'h-10 min-w-10 text-16',
}

const PaginationEllipsis = ({
  className,
  size = 'sm',
  ...props
}: PaginationEllipsisProps) => {
  return (
    <span
      className={twMerge(
        'flex items-center justify-center text-black-40',
        ELLIPSIS_SIZES[size],
        className,
      )}
      {...props}
    >
      <span aria-hidden>…</span>
      <span className="sr-only">More pages</span>
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
