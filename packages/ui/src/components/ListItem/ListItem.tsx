import type { ElementType, ReactNode } from 'react'
import { warnAsDeprecated } from '../../utils/deprecation'
import { withSlotContent } from '../../utils/slot'
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
   * `text-secondary`; Figma: Black/40%).
   */
  description?: ReactNode
}

/**
 * ListItem is a row of the dashboard lists — Notifications, Activities,
 * Contacts: an icon or avatar (24px), a title and an optional description or
 * timestamp. It is an IconText, so `interactive`, `active`, `flip` and
 * `asChild` work the same way (`<ListItem asChild><li /></ListItem>` inside a
 * `<ul>`, or an `<a>` / `<button>` child for a clickable row). Children are
 * rendered after the text, e.g. a trailing badge or button; with `asChild`,
 * the child element's own children are.
 */
function ListItem<C extends ElementType = typeof defaultTag>({
  as,
  title,
  description,
  className,
  children,
  ...props
}: ListItemProps<C>): ReactNode {
  if (as !== undefined) {
    warnAsDeprecated(
      'ListItem',
      '<ListItem asChild title="…"><li /></ListItem>',
    )
  }

  const renderContent = (extra: ReactNode) => (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <Typography size={14} className="truncate text-black">
          {title}
        </Typography>
        {description && (
          <Typography size={12} className="truncate text-secondary">
            {description}
          </Typography>
        )}
      </span>
      {extra}
    </>
  )
  // The deprecated `as` is rendered as an `asChild` host, so IconText
  // doesn't warn about it a second time.
  const Host: ElementType | undefined = as
  const host = Host ? (
    <Host type={Host === 'button' ? 'button' : undefined}>
      {renderContent(children)}
    </Host>
  ) : (
    withSlotContent(props.asChild, children, renderContent)
  )

  return (
    <IconText
      {...(props as IconTextProps<C>)}
      asChild={Boolean(Host) || props.asChild}
      className={twMerge(
        'flex w-full text-start',
        description ? 'items-start' : 'items-center',
        className,
      )}
    >
      {host}
    </IconText>
  )
}

ListItem.displayName = 'ListItem'

export { ListItem }
