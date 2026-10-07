import { Card, IconBox, IconText, Typography } from '@holakirr/snow-ui'
import { ArrowFallIcon, ArrowRiseIcon } from '@holakirr/snow-ui-icons'
import { kpis } from '@/lib/data'
import { formatChange, formatNumber } from '@/lib/format'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Lang } from '@/lib/preferences'

/** The kit’s 108px KPI cards: label, value and change. */
export const KpiCards = ({
  dict,
  lang,
  period = 'today',
}: {
  dict: Dictionary
  lang: Lang
  period?: 'today' | 'week' | 'month'
}) => (
  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-7 xl:grid-cols-4">
    {kpis.map(({ key, value, change }, index) => {
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
            <Typography asChild size={14}>
              <h2>{label}</h2>
            </Typography>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Typography size={24} semibold>
                {formatNumber(
                  lang,
                  value * (period === 'week' ? 7 : period === 'month' ? 30 : 1),
                )}
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
          </Card>
        </li>
      )
    })}
  </ul>
)
