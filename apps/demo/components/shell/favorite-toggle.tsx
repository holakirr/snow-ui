'use client'

import { useState } from 'react'
import { useDictionary } from '@/app/providers'
import { StarIcon } from '@/components/icons'
import { IconButton } from './icon-button'

/** The header's star: a toggle button (`aria-pressed`), local state only. */
export const FavoriteToggle = () => {
  const dict = useDictionary()
  const [favorite, setFavorite] = useState(false)
  return (
    <IconButton
      label={dict.header.favorite}
      icon={<StarIcon weight={favorite ? 'fill' : 'regular'} />}
      aria-pressed={favorite}
      onClick={() => setFavorite((current) => !current)}
    />
  )
}
