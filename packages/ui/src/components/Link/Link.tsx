'use client'

import { ArrowSquareOut } from '@phosphor-icons/react/dist/csr/ArrowSquareOut'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ComponentProps,
  type FC,
  isValidElement,
  type ReactNode,
} from 'react'
import { ROLES } from '../../constants'
import { slotted } from '../../utils/slot'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'

/**
 * Figma "Link" (Variant Default / Arrow / External × State Default / Hover):
 * 14/20 text, a 2px gap before the trailing arrow or icon.
 */
const linkVariants = cva(
  'group relative cursor-pointer rounded-4 text-14 transition-all focus-ring',
  {
    variants: {
      variant: {
        // Indigo text (`indigo-text`: Figma's indigo is 2.07:1 on white), with
        // Figma's Black/80% overlay on hover plus an underline, so the hover
        // state doesn't rely on colour alone. Inline, so it wraps in prose.
        default:
          'text-indigo-text underline-offset-2 hover:text-[color-mix(in_srgb,var(--color-indigo-text),var(--color-black)_80%)] hover:underline',
        // Black with a 40% "↗"; indigo on hover.
        arrow:
          'inline-flex items-center gap-0.5 text-black hover:text-indigo-text',
        // Black with a 40% external-link icon; indigo on hover. Opens in a new tab.
        external:
          'inline-flex items-center gap-0.5 text-black hover:text-indigo-text',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type LinkProps = ComponentProps<'a'> &
  VariantProps<typeof linkVariants> & {
    /**
     * Screen-reader text appended to `external` links.
     * @default messages.link.external: "(opens in a new tab)"
     */
    externalLabel?: string

    /**
     * Render the only child element (a router link) with the link styles
     * and the arrow or external icon, instead of an `<a>`.
     * @example <Link asChild variant="arrow"><RouterLink to="/docs">Docs</RouterLink></Link>
     * @default false
     */
    asChild?: boolean
  }

/**
 * Link component displays a text link. `external` links open in a new tab
 * (`target="_blank"`, `rel="noopener noreferrer"`, both overridable) and tell
 * screen readers so. The arrow and the external icon point the other way in
 * right-to-left text.
 */
const Link: FC<LinkProps> = ({
  className,
  variant,
  externalLabel,
  asChild = false,
  children,
  ...props
}) => {
  const messages = useMessages()
  const isExternal = variant === 'external'
  const classes = twMerge(linkVariants({ variant }), className)

  const renderContent = (content: ReactNode) => (
    <>
      {content}
      {variant === 'arrow' && (
        <span
          aria-hidden
          className="inline-block opacity-40 transition-opacity group-hover:opacity-100 rtl:-scale-x-100"
        >
          ↗
        </span>
      )}
      {isExternal && (
        <>
          <ArrowSquareOut
            aria-hidden
            className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100 rtl:-scale-x-100"
          />
          {/* A separate space keeps the name "Text (opens…)"; flex drops it visually. */}{' '}
          <span className="sr-only">
            {externalLabel ?? messages.link.external}
          </span>
        </>
      )}
    </>
  )

  // An <a href> is a focusable link already. Without an `href` (on the
  // link, or on the `asChild` element) `role` and `tabIndex` keep it one.
  const href = asChild
    ? isValidElement<{ href?: string }>(children) && children.props.href
    : props.href
  const linkProps = {
    ...(href == null && { role: ROLES.link, tabIndex: 0 }),
    ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }),
    ...props,
  }

  if (asChild) {
    const slot = slotted(children, classes, renderContent)
    return (
      <Slot {...linkProps} className={slot.className}>
        {slot.child}
      </Slot>
    )
  }

  return (
    <a className={classes} {...linkProps}>
      {renderContent(children)}
    </a>
  )
}

Link.displayName = 'Link'

export { Link, type LinkProps, linkVariants }
