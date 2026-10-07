'use client'

import { ArrowSquareOut } from '@phosphor-icons/react/dist/csr/ArrowSquareOut'
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ComponentProps,
  type FC,
  isValidElement,
  type KeyboardEvent,
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
        // Figma's Black/80% overlay on hover.
        // Inline, so it wraps in prose.
        default:
          'text-indigo-text underline-offset-2 hover:text-[color-mix(in_srgb,var(--color-indigo-text),var(--color-black)_80%)]',
        // Black with a 40% up-right arrow; indigo on hover.
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

/** Elements whose Enter already activates them (a router's <a href>…). */
const activatesItself =
  'a[href], area[href], button, input, select, textarea, summary'

/**
 * Enter clicks a link that has no `href` (the WAI-ARIA link pattern), so its
 * `onClick` runs from the keyboard too. Space doesn't, as for a link; a
 * held key clicks once.
 */
const activateOnEnter = (event: KeyboardEvent<HTMLElement>) => {
  const link = event.currentTarget
  if (
    event.defaultPrevented ||
    event.key !== 'Enter' ||
    event.repeat ||
    event.target !== link ||
    link.matches(activatesItself)
  ) {
    return
  }
  event.preventDefault()
  link.click()
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
        // The 12px Phosphor icon, as the external one: a "↗" text glyph
        // would change with the font. Figma: 40% (2.85:1 on white); full
        // opacity with more contrast.
        <ArrowUpRight
          aria-hidden
          className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100 contrast-more:opacity-100 rtl:-scale-x-100"
        />
      )}
      {isExternal && (
        <>
          <ArrowSquareOut
            aria-hidden
            className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100 contrast-more:opacity-100 rtl:-scale-x-100"
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
  // link, or on the `asChild` element) `role` and `tabIndex` keep it one,
  // and Enter activates it like a link (it has no activation of its own).
  const href = asChild
    ? isValidElement<{ href?: string }>(children)
      ? children.props.href
      : undefined
    : props.href
  const { onKeyDown } = props
  const linkProps = {
    // Marks the text link for tooling, e.g. Storybook's target-size check.
    'data-slot': 'link',
    ...(href == null && { role: ROLES.link, tabIndex: 0 }),
    ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }),
    ...props,
    ...(href == null && {
      onKeyDown: (event: KeyboardEvent<HTMLAnchorElement>) => {
        onKeyDown?.(event)
        activateOnEnter(event)
      },
    }),
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
