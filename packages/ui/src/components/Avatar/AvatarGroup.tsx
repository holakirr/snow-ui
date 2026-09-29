'use client'

import {
  Children,
  type ComponentProps,
  type FC,
  isValidElement,
  useId,
} from 'react'
import { SIMPLE_SIZES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
import { useMessages } from '../SnowUIProvider'
import { Avatar, AvatarFallback, type AvatarProps } from './Avatar'

const AvatarWrapper: FC<ComponentProps<'span'>> = ({ ...props }) => (
  <span
    className="border-2 border-white rounded-full overflow-hidden z-[1] hover:z-[2]"
    {...props}
  />
)

type AvatarGroupProps = ComponentProps<'div'> & {
  /**
   * How many avatars to show; the rest become a "+N" avatar, read as
   * `messages.avatarGroup.more(N)` ("N more") by screen readers.
   * @default 3
   */
  items?: number
}

const AvatarGroup: FC<AvatarGroupProps> = ({
  items = 3,
  className,
  children,
  ...props
}) => {
  const messages = useMessages()
  const kids = Children.toArray(children)
  const rest = kids.length - items
  let size: AvatarProps['size'] = SIMPLE_SIZES.lg
  const baseId = useId()

  if (
    kids[0] &&
    isValidElement<AvatarProps>(kids[0]) &&
    'size' in (kids[0].props as AvatarProps)
  ) {
    size = kids[0].props.size
  }

  return (
    <div className={twMerge('flex -space-x-2', className)} {...props}>
      {kids.slice(0, items).map((child, index) => {
        const childKey = isValidElement(child) && child.key ? child.key : index
        return (
          <AvatarWrapper key={`${baseId}-${childKey}`}>{child}</AvatarWrapper>
        )
      })}
      {rest > 0 && (
        <AvatarWrapper key={`${baseId}-overflow`}>
          <Avatar size={size}>
            <AvatarFallback>
              <span aria-hidden>+{rest}</span>
              <span className="sr-only">{messages.avatarGroup.more(rest)}</span>
            </AvatarFallback>
          </Avatar>
        </AvatarWrapper>
      )}
    </div>
  )
}
AvatarGroup.displayName = 'AvatarGroup'

export { AvatarGroup, type AvatarGroupProps }
