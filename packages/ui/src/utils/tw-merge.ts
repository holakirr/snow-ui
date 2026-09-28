import { extendTailwindMerge } from 'tailwind-merge'

/**
 * The SnowUI token scales that tailwind-merge doesn't know by default. Keep in
 * sync with `index.css` (checked by `src/foundations/tokens.test.ts`).
 */
export const tokenScales = {
  text: ['12', '14', '16', '18', '24', '32', '48', '64'],
  radius: ['4', '8', '12', '16', '20', '24', '28', '32', '40', '48', '80'],
  shadow: ['1', '2', 'focus', 'glow', 'glass-1', 'glass-2'],
  'inset-shadow': ['inner'],
  blur: ['bg-40', 'bg-100'],
}

/**
 * `twMerge` that knows the SnowUI design tokens from `index.css`.
 *
 * Without it, tailwind-merge only recognises Tailwind's own scale names, so it
 * would read `text-14` as a text colour (and drop `text-black/20` or the
 * `text-14` itself), and would not see that `rounded-12` and `rounded-xl`
 * conflict.
 */
export const twMerge = extendTailwindMerge({
  extend: { theme: tokenScales },
})
