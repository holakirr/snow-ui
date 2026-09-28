import { ArrowSquareOut } from '@phosphor-icons/react/dist/csr/ArrowSquareOut'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { ROLES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'

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
     * @default "(opens in a new tab)"
     */
    externalLabel?: string
  }

/**
 * Link component displays a text link. `external` links open in a new tab
 * (`target="_blank"`, `rel="noopener noreferrer"`, both overridable) and tell
 * screen readers so.
 */
const Link: FC<LinkProps> = ({
  className,
  variant,
  externalLabel = '(opens in a new tab)',
  children,
  ...props
}) => {
  const isExternal = variant === 'external'

  return (
    <a
      className={twMerge(linkVariants({ variant }), className)}
      role={ROLES.link}
      tabIndex={0}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      {...props}
    >
      {children}
      {variant === 'arrow' && (
        <span
          aria-hidden
          className="opacity-40 transition-opacity group-hover:opacity-100"
        >
          ↗
        </span>
      )}
      {isExternal && (
        <>
          <ArrowSquareOut
            aria-hidden
            className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
          />
          {/* A separate space keeps the name "Text (opens…)"; flex drops it visually. */}{' '}
          <span className="sr-only">{externalLabel}</span>
        </>
      )}
    </a>
  )
}

Link.displayName = 'Link'

export { Link, type LinkProps, linkVariants }
