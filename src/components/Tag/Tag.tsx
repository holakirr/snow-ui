import { CloseIcon } from '@holakirr/snow-ui-icons'
import type { ComponentProps, FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES } from '../../constants'
import { Button } from '../Button'
import { Text } from '../Text'

/**
 * Props for the Tag component.
 */
export type TagProps = ComponentProps<'div'> & {
  leftContent?: ReactNode

  /**
   * The label of the tag.
   */
  label: string

  /**
   * Callback function to be called when the tag is closed.
   */
  onClose?: () => void
}

/**
 * Tag component displays a tag with a label and optional dot and close icon.
 */
const Tag: FC<TagProps> = ({
  leftContent,
  label,
  onClose,
  className,
  ref,
  ...props
}) => (
  <div
    className={twMerge(
      'relative text-black text-xs flex justify-center items-center px-1 py-0.5 bg-black/4 hover:bg-black/10 rounded-lg hover:cursor-pointer',
      !onClose && 'pr-2',
      !leftContent && 'pl-2',
      className,
    )}
    tabIndex={0}
    ref={ref}
    role={ROLES.listitem}
    {...props}
  >
    {leftContent}

    <Text as="span">{label}</Text>

    {onClose && (
      <Button
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        className="p-0"
        leftContent={
          <CloseIcon
            alt={`Close icon for tag ${label}`}
            size={16}
            className="fill-black/20 hover:fill-black/40"
          />
        }
      />
    )}
  </div>
)
Tag.displayName = 'Tag'

export { Tag }
