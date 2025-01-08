import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { ROLES } from '../../constants'

const cardStyles = cva('rounded-2xl bg-bg5 text-black p-6', {
  variants: {
    bordered: {
      true: 'border-[0.5px] inset-0.5 border-black/40',
      false: '',
    },
  },
  defaultVariants: {
    bordered: false,
  },
})

type CardProps = ComponentProps<'div'> & VariantProps<typeof cardStyles>

const Card: FC<CardProps> = ({ bordered, className, ...props }) => (
  <div
    role={ROLES.region}
    aria-label="card"
    className={twMerge(cardStyles({ bordered, className }))}
    {...props}
  />
)
Card.displayName = 'Card'

export { Card }
