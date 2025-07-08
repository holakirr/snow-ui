import {
  Children,
  type ComponentProps,
  type FC,
  isValidElement,
  useMemo,
} from 'react'
import { SIMPLE_SIZES } from '../../constants'
import { Avatar, AvatarFallback, type AvatarProps } from './Avatar'

const AvatarWrapper: FC<ComponentProps<'span'>> = ({ ...props }) => (
  <span
    className="border-2 border-white rounded-full overflow-hidden z-[1] hover:z-[2]"
    {...props}
  />
)

type AvatarGroupProps = ComponentProps<'div'> & {
  items?: number
}

const AvatarGroup: FC<AvatarGroupProps> = ({
  items = 3,
  children,
  ...props
}) => {
  const kids = Children.toArray(children)
  const rest = kids.length - items
  let size: AvatarProps['size'] = SIMPLE_SIZES.lg

  // Generate unique IDs at the top level
  const itemIds = useMemo(
    () =>
      kids
        .slice(0, items)
        .map(() => `avatar-${Math.random().toString(36).slice(2)}`),
    [kids, items],
  )

  if (
    kids[0] &&
    isValidElement<AvatarProps>(kids[0]) &&
    'size' in (kids[0].props as AvatarProps)
  ) {
    size = kids[0].props.size
  }

  return (
    <div className="flex -space-x-2" {...props}>
      {kids.slice(0, items).map((child, index) => (
        <AvatarWrapper key={itemIds[index]}>{child}</AvatarWrapper>
      ))}
      {rest > 0 && (
        <AvatarWrapper>
          <Avatar size={size}>
            <AvatarFallback>+{rest}</AvatarFallback>
          </Avatar>
        </AvatarWrapper>
      )}
    </div>
  )
}
AvatarGroup.displayName = 'AvatarGroup'

export { AvatarGroup }
