import { Card, Typography } from '@holakirr/snow-ui'
import type { ReactNode } from 'react'

/**
 * The Figma dashboard "Block" (radius 20, padding 24, Background/2) with its
 * 14px Semibold heading. The heading's `id` names the chart inside.
 */
export const Block = ({
  id,
  title,
  action,
  className,
  children,
}: {
  id: string
  title: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) => (
  <Card
    variant="block"
    className={`flex min-w-0 flex-col gap-4 ${className ?? ''}`}
  >
    <div className="flex min-h-5 items-center justify-between gap-4">
      <Typography asChild size={14} semibold>
        <h2 id={id}>{title}</h2>
      </Typography>
      {action}
    </div>
    {children}
  </Card>
)
