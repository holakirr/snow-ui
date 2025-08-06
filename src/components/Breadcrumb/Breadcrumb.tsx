import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES } from '../../constants'
import { Button } from '../Button'
import { Typography } from '../Text'

export type BreadcrumbProps = ComponentProps<'nav'>

const Breadcrumb: FC<BreadcrumbProps> = ({ ...props }) => (
  <nav aria-label="Breadcrumb" role={ROLES.navigation} {...props} />
)
Breadcrumb.displayName = 'Breadcrumb'

export type BreadcrumbListProps = ComponentProps<'ol'>

const BreadcrumbList: FC<BreadcrumbListProps> = ({ className, ...props }) => (
  <ol
    aria-label="Breadcrumb List"
    className={twMerge(
      'flex items-center gap-2 break-words text-sm',
      className,
    )}
    {...props}
  />
)
BreadcrumbList.displayName = 'BreadcrumbList'

export type BreadcrumbItemProps = ComponentProps<'li'>

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ className, ...props }) => (
  <li
    aria-label="Breadcrumb Item"
    className={twMerge(
      'inline-flex items-center transition-colors text-black/40 last-of-type:text-black',
      className,
    )}
    {...props}
  />
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

export type BreadcrumbLinkProps = ComponentProps<'a'> & {
  disabled?: boolean
}

const BreadcrumbLink: FC<BreadcrumbLinkProps> = ({
  className,
  disabled,
  ...props
}) => (
  <Button
    as="a"
    aria-label="Breadcrumb Link"
    aria-disabled={disabled}
    tabIndex={disabled ? -1 : 0}
    className={twMerge(
      'transition-colors text-inherit',
      disabled && 'text-black/10 pointer-events-none',
      className,
    )}
    {...props}
  />
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

export type BreadcrumbPageProps = ComponentProps<'span'>

const BreadcrumbSeparator: FC<ComponentProps<'li'>> = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={twMerge('[&>svg]:w-3.5 [&>svg]:h-3.5 text-black/20', className)}
    {...props}
  >
    {children ?? '/'}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis: FC<ComponentProps<'span'>> = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={twMerge('flex items-center justify-center', className)}
    {...props}
  >
    <Typography>...</Typography>

    <span className="sr-only">Additional navigation elements</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
}
