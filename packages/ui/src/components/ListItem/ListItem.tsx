import type { ElementType, ReactNode } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { IconText, type IconTextProps } from '../IconText'
import { Typography } from '../Text'

const defaultTag = 'div'

/**
 * Props for the ListItem component.
 *
 * @template C - The element type rendered by ListItem.
 */
export type ListItemProps<C extends ElementType = typeof defaultTag> = Omit<
  IconTextProps<C>,
  'vertical' | 'title'
> & {
  /**
   * The main line (14 Regular, Black/100%).
   */
  title: ReactNode

  /**
   * The second line: a timestamp or a short description (12 Regular,
   * Black/40%).
   */
  description?: ReactNode
}

/**
 * ListItem is a row of the dashboard lists — Notifications, Activities,
 * Contacts: an icon or avatar (24px), a title and an optional description or
 * timestamp. It is an IconText, so `interactive`, `active`, `flip` and `as`
 * work the same way (render it `as="li"` inside a `<ul>`, or `as="a"` /
 * `as="button"` for a clickable row). Children are rendered after the text,
 * e.g. a trailing badge or button.
 */
function ListItem<C extends ElementType = typeof defaultTag>({
  title,
  description,
  className,
  children,
  ...props
}: ListItemProps<C>): ReactNode {
  return (
    <IconText
      {...(props as IconTextProps<C>)}
      className={twMerge(
        'flex w-full text-left',
        description ? 'items-start' : 'items-center',
        className,
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <Typography size={14} className="truncate text-black">
          {title}
        </Typography>
        {description && (
          <Typography size={12} className="truncate text-black-40">
            {description}
          </Typography>
        )}
      </span>
      {children}
    </IconText>
  )
}

ListItem.displayName = 'ListItem'

export { ListItem }
