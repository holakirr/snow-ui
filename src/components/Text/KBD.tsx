import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES } from '../../constants'
import { type TextProps, Typography } from './Text'

type KBDProps = TextProps<'kbd'> & {
  keys: string[]
  separator?: string
}

const KBD: FC<KBDProps> = ({ keys, separator = '', className, ...props }) => (
  <Typography
    as="kbd"
    role={ROLES.definition}
    aria-keyshortcuts={keys.join(separator)}
    className={twMerge('w-min text-black/20', className)}
    {...props}
  >
    {keys.join(separator)}
  </Typography>
)
KBD.displayName = 'KBD'

export { KBD, type KBDProps }
