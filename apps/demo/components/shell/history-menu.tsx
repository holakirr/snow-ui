'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from '@holakirr/snow-ui'
import Link from 'next/link'
import { useDictionary } from '@/app/providers'
import { ClockCounterClockwiseIcon } from '@/components/icons'
import { IconButton } from './icon-button'
import { DirectionToggle, LanguageMenu } from './preference-controls'

/** The header's history tool; preferences remain available in its panel. */
export const HistoryMenu = () => {
  const dict = useDictionary()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          label={dict.nav.recently}
          icon={<ClockCounterClockwiseIcon />}
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col gap-2">
        <Typography size={12} className="px-2 text-secondary">
          {dict.nav.recently}
        </Typography>
        <Link
          href="/dashboard"
          className="rounded-12 p-2 text-14 hover:bg-black-4 focus-ring"
        >
          {dict.nav.overview}
        </Link>
        <Link
          href="/settings"
          className="rounded-12 p-2 text-14 hover:bg-black-4 focus-ring"
        >
          {dict.nav.settings}
        </Link>
        <Link
          href="/orders"
          className="rounded-12 p-2 text-14 hover:bg-black-4 focus-ring"
        >
          {dict.orders.title}
        </Link>
        <div className="flex items-center gap-2 border-t border-black-10 pt-2">
          <LanguageMenu />
          <DirectionToggle />
        </div>
      </PopoverContent>
    </Popover>
  )
}
