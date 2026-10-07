'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  IconBox,
} from '@holakirr/snow-ui'
import { ArrowLineDownIcon } from '@holakirr/snow-ui-icons'
import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDictionary } from '@/app/providers'

export const PeriodMenu = () => {
  const dict = useDictionary()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const raw = params.get('period')
  const period = raw === 'week' || raw === 'month' ? raw : 'today'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="bare"
          className="text-black"
          aria-label={`${dict.dashboard.period}: ${dict.dashboard.periods[period]}`}
          endContent={
            <IconBox size={16}>
              <ArrowLineDownIcon />
            </IconBox>
          }
        >
          {dict.dashboard.periods[period]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={period}
          onValueChange={(value) => {
            if (value !== 'today' && value !== 'week' && value !== 'month')
              return
            const next = new URLSearchParams(params)
            if (value === 'today') next.delete('period')
            else next.set('period', value)
            router.replace(
              `${pathname}${next.size ? `?${next}` : ''}` as Route,
              {
                scroll: false,
              },
            )
          }}
        >
          {(['today', 'week', 'month'] as const).map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {dict.dashboard.periods[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
