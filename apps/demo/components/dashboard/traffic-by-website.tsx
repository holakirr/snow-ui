import { Strip, Typography } from '@holakirr/snow-ui'
import { trafficByWebsite } from '@/lib/data'
import type { Dictionary } from '@/lib/i18n/dictionaries'

/**
 * Figma "Traffic by Website": each site's share as a segmented Strip
 * (`role="progressbar"`, 6 segments). A Server Component, no JavaScript.
 */
export const TrafficByWebsite = ({ dict }: { dict: Dictionary }) => (
  <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-5">
    {trafficByWebsite.map(({ site, share }) => (
      <div key={site} className="contents">
        <Typography asChild size={12}>
          <dt>{site}</dt>
        </Typography>
        <dd>
          <Strip
            count={6}
            value={share}
            thickness={2}
            rounded
            aria-label={`${site}: ${dict.dashboard.trafficByWebsite}`}
            className="w-full max-w-32"
          />
        </dd>
      </div>
    ))}
  </dl>
)
