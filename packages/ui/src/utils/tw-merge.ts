import { extendTailwindMerge } from 'tailwind-merge'
import { tokenScales } from './token-scales.generated'

/**
 * `twMerge` that knows the SnowUI token scales (text sizes, radii, shadows,
 * blurs), generated from the design tokens by `bun run tokens`.
 *
 * Without it, tailwind-merge only recognises Tailwind's own scale names, so it
 * would read `text-14` as a text colour (and drop `text-black/20` or the
 * `text-14` itself), and would not see that `rounded-12` and `rounded-xl`
 * conflict.
 */
export const twMerge = extendTailwindMerge({
  extend: { theme: tokenScales },
})
