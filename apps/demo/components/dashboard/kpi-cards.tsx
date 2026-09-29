import { Card, IconBox, IconText, Typography } from '@holakirr/snow-ui'
import { Sparkline } from '@holakirr/snow-ui-charts'
import { ArrowFallIcon, ArrowRiseIcon } from '@holakirr/snow-ui-icons'
import { kpis } from '@/lib/data'
import { formatChange, formatNumber } from '@/lib/format'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { intlLocale, type Lang } from '@/lib/preferences'

/**
 * The Figma "Views / Visits / New Users / Active Users" cards (Color 1 and
 * Color 2 tints, static black text in both themes) with a Sparkline of the
 * last 7 days. A Server Component: Sparkline is plain SVG, rendered on the
 * server; only its tiny module ships to the client.
 */
export const KpiCards = ({ dict, lang }: { dict: Dictionary; lang: Lang }) => (
  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-7 xl:grid-cols-4">
    {kpis.map(({ key, value, change, trend, color }, index) => {
      const label = dict.dashboard.kpi[key]
      const up = change >= 0
      return (
        <li key={key}>
          <Card
            variant="block"
            className={`flex h-full flex-col gap-2 text-static-black ${
              index % 2 ? 'bg-color-2' : 'bg-color-1'
            }`}
          >
            <Typography asChild size={14} semibold>
              <h2>{label}</h2>
            </Typography>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Typography size={24} semibold>
                {formatNumber(lang, value)}
              </Typography>
              <IconText
                flip
                icon={
                  <IconBox size={16} aria-hidden>
                    {up ? <ArrowRiseIcon /> : <ArrowFallIcon />}
                  </IconBox>
                }
                className="gap-1 text-static-black"
              >
                <Typography size={12}>
                  {formatChange(lang, change)}
                  <span className="sr-only">
                    {' '}
                    ({up ? dict.dashboard.kpi.up : dict.dashboard.kpi.down})
                  </span>
                </Typography>
              </IconText>
            </div>
            <Sparkline
              title={`${label}, ${dict.dashboard.kpi.trend}`}
              data={trend}
              color={color}
              locale={intlLocale(lang)}
              area
              width="100%"
              height={32}
            />
          </Card>
        </li>
      )
    })}
  </ul>
)
