import type { FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

import { type TextProps, Typography } from './Text'

type KBDProps = TextProps<'kbd'> & {
  keys: string[]
  separator?: string
}

const KBD: FC<KBDProps> = ({ keys, separator = '+', className, ...props }) => {
  const shortcut = keys.join(separator)

  return (
    <Typography
      as="kbd"
      aria-keyshortcuts={shortcut}
      className={twMerge('w-min text-black/20', className)}
      {...props}
    >
      {shortcut}
    </Typography>
  )
}
KBD.displayName = 'KBD'

export { KBD, type KBDProps }
