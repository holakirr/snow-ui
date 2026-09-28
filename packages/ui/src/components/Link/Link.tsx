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
  [
    'group relative inline-flex cursor-pointer items-center gap-0.5 text-14 transition-all',
    'rounded-4 outline-none focus-visible:underline focus-visible:ring-4 focus-visible:ring-focus',
  ],
  {
    variants: {
      variant: {
        // Indigo; on hover Figma lays Black/80% over it.
        default:
          'text-indigo hover:text-[color-mix(in_srgb,var(--color-indigo),var(--color-black)_80%)]',
        // Black with a 40% "↗"; indigo on hover.
        arrow: 'text-black hover:text-indigo',
        // Black with a 40% external-link icon; indigo on hover.
        external: 'text-black hover:text-indigo',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type LinkProps = ComponentProps<'a'> & VariantProps<typeof linkVariants>

/**
 * Link component displays a text link.
 */
const Link: FC<LinkProps> = ({ className, variant, children, ...props }) => (
  <a
    className={twMerge(linkVariants({ variant }), className)}
    role={ROLES.link}
    tabIndex={0}
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
    {variant === 'external' && (
      <ArrowSquareOut
        aria-hidden
        className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
      />
    )}
  </a>
)

Link.displayName = 'Link'

export { Link, type LinkProps, linkVariants }
