import { Card } from '@holakirr/snow-ui'
import { type ReactNode, useId } from 'react'

/**
 * The SnowUI dashboard block around a story's chart (Figma "Block": radius
 * 20, padding 24, Background/2) with its 14px Semibold title. The chart
 * takes its accessible name from the title: `children(titleId)`.
 */
export const DashboardCard = ({
  title,
  width = 662,
  children,
}: {
  title: string
  width?: number
  children: (titleId: string) => ReactNode
}) => {
  const titleId = useId()
  return (
    <Card
      variant="block"
      className="flex flex-col gap-4 text-start"
      style={{ width }}
    >
      <h3 id={titleId} className="m-0 font-semibold text-14 text-black">
        {title}
      </h3>
      {children(titleId)}
    </Card>
  )
}
