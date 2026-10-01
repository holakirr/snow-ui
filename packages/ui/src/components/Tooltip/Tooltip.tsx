'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { useSnowUI } from '../SnowUIProvider'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Figma "Tooltip" (Variant Dark / Light): 24px high, 4/8 padding, a 4px gap,
 * a 12px radius, 12/16 text and a background blur.
 * - `dark`: Black/80% under a White/10% overlay, white text.
 * - `light`: Black/4%, black text.
 *
 * Rich (added in 5.2): with a `TooltipTitle` or a `TooltipDescription`
 * inside, the kit's multi-line tooltip ("This is a tooltip" over its text):
 * the parts stack, start-aligned, 4px apart, the radius is 8 and the width
 * at most 240px, so the text wraps.
 */
const tooltipVariants = cva(
  [
    'z-50 flex min-h-6 items-center gap-1 overflow-hidden rounded-12 px-2 py-1 text-12 backdrop-blur-[10px]',
    'has-[[data-slot^=tooltip-]]:max-w-60 has-[[data-slot^=tooltip-]]:flex-col has-[[data-slot^=tooltip-]]:items-start has-[[data-slot^=tooltip-]]:rounded-8',
    'animate-in animate-zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:animate-zoom-out-95 data-[side=bottom]:animate-slide-in-from-top data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left data-[side=top]:animate-slide-in-from-bottom',
  ],
  {
    variants: {
      variant: {
        dark: 'bg-black-80 bg-[linear-gradient(var(--color-white-10),var(--color-white-10))] text-white',
        light: 'bg-black-4 text-black',
      },
    },
    defaultVariants: {
      variant: 'dark',
    },
  },
)

type TooltipContentProps = ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipVariants>

/**
 * The tooltip, in a portal. It takes the `dir` and the `theme` of a
 * `SnowUIProvider` or `ThemeScope` (the portal is outside your layout's
 * `dir` and `data-theme` scopes).
 */
const TooltipContent: FC<TooltipContentProps> = ({
  className,
  sideOffset = 4,
  variant,
  ...props
}) => {
  const { dir, theme, contrast } = useSnowUI()

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        dir={dir}
        data-theme={theme}
        data-contrast={contrast}
        sideOffset={sideOffset}
        data-variant={variant ?? 'dark'}
        className={twMerge(tooltipVariants({ variant }), className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}
TooltipContent.displayName = TooltipPrimitive.Content.displayName

type TooltipShortcutProps = ComponentProps<'span'>

/**
 * The Figma tooltip's secondary text, e.g. a keyboard shortcut. Figma draws it
 * at 40% opacity (2.8:1); 70% keeps it secondary and at least 5.5:1 on both
 * tooltip variants in both modes (WCAG 1.4.3).
 */
const TooltipShortcut: FC<TooltipShortcutProps> = ({ className, ...props }) => (
  <span className={twMerge('opacity-70', className)} {...props} />
)
TooltipShortcut.displayName = 'TooltipShortcut'

type TooltipTitleProps = ComponentProps<'p'>

/**
 * The bold first line of a rich tooltip (the kit's "This is a tooltip"):
 * 12/16 semibold. With it, the tooltip stacks its parts. Text only: a
 * tooltip can't hold links or buttons. Added in 5.2.
 */
const TooltipTitle: FC<TooltipTitleProps> = ({ className, ...props }) => (
  // Paragraphs, so the description that Radix reads out of its hidden copy
  // has a space between the title and the text.
  <p
    data-slot="tooltip-title"
    className={twMerge('font-semibold', className)}
    {...props}
  />
)
TooltipTitle.displayName = 'TooltipTitle'

type TooltipDescriptionProps = ComponentProps<'p'>

/**
 * The text of a rich tooltip, under its `TooltipTitle`, or alone for a
 * multi-line tooltip: 12/16, wrapping at 240px. Added in 5.2.
 */
const TooltipDescription: FC<TooltipDescriptionProps> = ({
  className,
  ...props
}) => <p data-slot="tooltip-description" className={className} {...props} />
TooltipDescription.displayName = 'TooltipDescription'

export {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
  TooltipDescription,
  type TooltipDescriptionProps,
  TooltipProvider,
  TooltipShortcut,
  type TooltipShortcutProps,
  TooltipTitle,
  type TooltipTitleProps,
  TooltipTrigger,
  tooltipVariants,
}
