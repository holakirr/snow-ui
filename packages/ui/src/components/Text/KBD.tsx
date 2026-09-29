import { cva, type VariantProps } from 'class-variance-authority'
import type { FC } from 'react'
import { TEXT_SIZES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'

import { type TextProps, Typography } from './Text'

/**
 * Figma "Kbd" (Variant Solid / Border): 16px high, at least 28px wide, 4px
 * side padding, 6px radius, 12/16 text in Black/100%.
 */
const kbdVariants = cva(
  'inline-flex h-4 min-w-7 shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] px-1 text-black',
  {
    variants: {
      variant: {
        solid: 'bg-black-4',
        border: 'bg-transparent inset-ring-[0.5px] inset-ring-black-10',
      },
    },
    defaultVariants: {
      variant: 'solid',
    },
  },
)

type KBDProps = TextProps<'kbd'> &
  VariantProps<typeof kbdVariants> & {
    keys: string[]
    separator?: string
  }

const KBD: FC<KBDProps> = ({
  keys,
  separator = '+',
  variant,
  size = TEXT_SIZES[12],
  className,
  ...props
}) => {
  const shortcut = keys.join(separator)

  return (
    <Typography
      aria-keyshortcuts={shortcut}
      size={size}
      className={twMerge(kbdVariants({ variant }), className)}
      {...props}
      asChild
    >
      {/* Shortcuts read left to right, also in right-to-left text. */}
      <kbd dir="ltr">{shortcut}</kbd>
    </Typography>
  )
}
KBD.displayName = 'KBD'

export { KBD, type KBDProps, kbdVariants }
