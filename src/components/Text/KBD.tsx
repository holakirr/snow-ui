import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES } from '../../constants'
import { Text, type TextProps } from './Text'

type KBDProps = TextProps<'kbd'> & {
  keys: string[]
  separator?: string
}

const KBD: FC<KBDProps> = ({ keys, separator = '', className, ...props }) => (
  <Text
    as="kbd"
    role={ROLES.definition}
    aria-keyshortcuts={keys.join(separator)}
    className={twMerge('w-min text-black/20', className)}
    {...props}
  >
    {keys.join(separator)}
  </Text>
)
KBD.displayName = 'KBD'

export { KBD, type KBDProps }
