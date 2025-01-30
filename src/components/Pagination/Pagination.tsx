import { ArrowLineLeftIcon, ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { type ButtonProps, buttonVariants } from '../Button'
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
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

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

const PaginationPrevious = ({
  className,
  size = 'md',
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size={size}
    className={twMerge('gap-1 pl-2.5', className)}
    {...props}
  >
    <ArrowLineLeftIcon className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  size = 'md',
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size={size}
    className={twMerge('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ArrowLineRightIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden
    className={twMerge('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <Text>...</Text>
    <span className="sr-only">More pages</span>
  </span>
)
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
