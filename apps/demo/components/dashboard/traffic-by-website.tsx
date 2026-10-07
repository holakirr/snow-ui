import { Strip, Typography } from '@holakirr/snow-ui'
import { trafficByWebsite } from '@/lib/data'
import type { Dictionary } from '@/lib/i18n/dictionaries'

/**
 * Figma "Traffic by Website": each site's share as a segmented Strip
 * (three segments, with a percentage text alternative). A Server Component, no JavaScript.
 */
export const TrafficByWebsite = ({ dict }: { dict: Dictionary }) => (
  <dl className="grid h-61.5 grid-cols-[57px_minmax(0,1fr)] items-center gap-x-4 gap-y-2">
    {trafficByWebsite.map(({ site, share }, index) => (
      <div key={site} className="contents">
        <Typography asChild size={12}>
          <dt>{site}</dt>
        </Typography>
        <dd>
          <div
            role="progressbar"
            aria-label={`${site}: ${dict.dashboard.trafficByWebsite}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={share}
          >
            <Strip
              count={3}
              thickness={2}
              rounded
              style={{
                height: 7 / 3,
                width: `${[33.142857, 59.5, 39, 80, 28.75, 47.2][index]}px`,
              }}
              className="gap-0.5 [&>span]:h-full [&>:nth-child(2)]:bg-black-40 [&>:nth-child(3)]:bg-black-10"
            />
          </div>
        </dd>
      </div>
    ))}
  </dl>
)
