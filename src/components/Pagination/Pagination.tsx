import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import type { Size } from '../../types'
import { buttonVariants } from '../Button'
import { Text } from '../Text'

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
    className={twMerge('flex flex-row items-center gap-1', className)}
    {...props}
  />
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem: FC<ComponentProps<'li'>> = ({ className, ...props }) => (
  <li className={twMerge('', className)} {...props} />
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  size?: Size
} & ComponentProps<'a'>

const PaginationLink: FC<PaginationLinkProps> = ({
  className,
  isActive,
  size = 'md',
  ...props
}) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={twMerge(
      buttonVariants({
        variant: isActive ? 'filled' : 'borderless',
        size,
      }),
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PAGINATION_ICON_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const PaginationPrevious: FC<ComponentProps<typeof PaginationLink>> = ({
  className,
  size = 'md',
  children,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size={size}
    className={twMerge('gap-1 pl-2.5', className)}
    {...props}
  >
    <ArrowLineLeftIcon className={PAGINATION_ICON_SIZES[size]} />
    <span>{children}</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext: FC<ComponentProps<typeof PaginationLink>> = ({
  className,
  size = 'md',
  children,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size={size}
    className={twMerge('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>{children}</span>
    <ArrowLineRightIcon className={PAGINATION_ICON_SIZES[size]} />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

type PaginationEllipsisProps = {
  size?: Size
} & Omit<ComponentProps<'span'>, 'size'>

const ELLIPSIS_SIZES = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
}

const PaginationEllipsis = ({
  className,
  size = 'md',
  ...props
}: PaginationEllipsisProps) => {
  return (
    <span
      role="presentation"
      aria-hidden
      className={twMerge(
        `flex ${ELLIPSIS_SIZES[size]} items-center justify-center`,
        className,
      )}
      {...props}
    >
      <Text>...</Text>
      <span className="sr-only">More pages</span>
    </span>
  )
}
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
