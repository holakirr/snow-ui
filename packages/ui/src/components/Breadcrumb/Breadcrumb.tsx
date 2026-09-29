'use client'

import type { ComponentProps, FC } from 'react'
import { ROLES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
import { Button } from '../Button'
import { useMessages } from '../SnowUIProvider'
import { Typography } from '../Text'

export type BreadcrumbProps = ComponentProps<'nav'>

/**
 * The breadcrumb navigation landmark, named by `aria-label` (default:
 * `messages.breadcrumb.label`, "Breadcrumb").
 */
const Breadcrumb: FC<BreadcrumbProps> = ({
  'aria-label': ariaLabel,
  ...props
}) => {
  const messages = useMessages()
  return (
    <nav
      aria-label={ariaLabel ?? messages.breadcrumb.label}
      role={ROLES.navigation}
      {...props}
    />
  )
}
Breadcrumb.displayName = 'Breadcrumb'

export type BreadcrumbListProps = ComponentProps<'ol'>

const BreadcrumbList: FC<BreadcrumbListProps> = ({ className, ...props }) => (
  <ol
    className={twMerge(
      // Figma Breadcrumb: a Group with gap 4 and 12 Regular items.
      'flex items-center gap-1 break-words text-12',
      className,
    )}
    {...props}
  />
)
BreadcrumbList.displayName = 'BreadcrumbList'

export type BreadcrumbItemProps = ComponentProps<'li'>

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ className, ...props }) => (
  <li
    className={twMerge(
      'inline-flex items-center transition-colors text-secondary last-of-type:text-black',
      className,
    )}
    {...props}
  />
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

export type BreadcrumbLinkProps = ComponentProps<'a'> & {
  disabled?: boolean
  /**
   * Render the only child element (a router link) instead of an `<a>`.
   * @example <BreadcrumbLink asChild><RouterLink to="/">Home</RouterLink></BreadcrumbLink>
   * @default false
   */
  asChild?: boolean
}

/**
 * A link to an ancestor page. `disabled` renders it without its `href`: a
 * `<span role="link" aria-disabled="true">` that isn't in the tab order (like
 * `BreadcrumbPage`). With `asChild`, the child keeps its own `href`: it gets
 * `aria-disabled` and `tabIndex={-1}` and can't be clicked.
 */
const BreadcrumbLink: FC<BreadcrumbLinkProps> = ({
  className,
  disabled,
  asChild = false,
  href,
  children,
  ...props
}) => (
  <Button<'a'>
    asChild
    aria-disabled={disabled || undefined}
    tabIndex={disabled && asChild ? -1 : undefined}
    // Figma: a Button Small "Borderless" (padding 4/12, radius 12).
    className={twMerge(
      'rounded-12 px-3 py-1 text-12 text-inherit transition-colors hover:bg-black-4',
      disabled && 'text-black-10 pointer-events-none',
      className,
    )}
    {...props}
  >
    {asChild ? (
      children
    ) : disabled ? (
      // biome-ignore lint/a11y/useFocusableInteractive: a disabled link is intentionally not focusable
      // biome-ignore lint/a11y/useSemanticElements: a link without an `href` can't be an <a href>
      <span role="link">{children}</span>
    ) : (
      <a href={href}>{children}</a>
    )}
  </Button>
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

export type BreadcrumbPageProps = ComponentProps<'span'>

const BreadcrumbPage: FC<BreadcrumbPageProps> = ({ className, ...props }) => (
  // biome-ignore lint/a11y/useFocusableInteractive: the current page is intentionally not focusable
  // biome-ignore lint/a11y/useSemanticElements: the current page is not a real link
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={twMerge('px-3 py-1 text-black', className)}
    {...props}
  />
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

export type BreadcrumbSeparatorProps = ComponentProps<'li'>

const BreadcrumbSeparator: FC<BreadcrumbSeparatorProps> = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={twMerge(
      // An icon separator (a chevron) points the other way in right-to-left
      // text.
      'text-14 text-black-10 [&>svg]:h-3.5 [&>svg]:w-3.5 rtl:[&>svg]:-scale-x-100',
      className,
    )}
    {...props}
  >
    {children ?? '/'}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

export type BreadcrumbEllipsisProps = ComponentProps<'span'> & {
  /**
   * Screen-reader text for the collapsed items.
   * @default messages.breadcrumb.more: "More pages"
   */
  label?: string
}

/**
 * Stands for collapsed items: "…" on screen, `label` for screen readers.
 */
const BreadcrumbEllipsis: FC<BreadcrumbEllipsisProps> = ({
  className,
  label,
  ...props
}) => {
  const messages = useMessages()

  return (
    <span
      className={twMerge('flex items-center justify-center', className)}
      {...props}
    >
      <Typography aria-hidden>...</Typography>
      <span className="sr-only">{label ?? messages.breadcrumb.more}</span>
    </span>
  )
}
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
