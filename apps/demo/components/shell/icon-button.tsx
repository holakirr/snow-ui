'use client'

import {
  Button,
  type ButtonProps,
  IconBox,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@holakirr/snow-ui'
import type { ReactNode } from 'react'

/**
 * The header's 28px icon buttons (Figma: a 20px icon, 4px padding, radius
 * 12), named by `label` and with the same text as a tooltip. Extra props
 * (`aria-pressed`, `aria-expanded`, a trigger's props through `asChild`
 * parents) go to the button.
 */
export const IconButton = ({
  label,
  icon,
  badge,
  className,
  ...props
}: Omit<ButtonProps, 'label' | 'startContent'> & {
  label: string
  icon: ReactNode
  /** A dot on the icon (Figma: the indigo notification dot). */
  badge?: boolean
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        aria-label={label}
        startContent={
          <IconBox size={20} badge={badge || undefined}>
            {icon}
          </IconBox>
        }
        className={`rounded-12 p-1 ${className ?? ''}`}
        {...props}
      />
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)
