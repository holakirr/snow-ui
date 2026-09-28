'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type ComponentProps, createContext, type FC, useContext } from 'react'
import { isIconOnly } from '../../utils/children'
import { twMerge } from '../../utils/tw-merge'
import { segmentedListVariants } from '../Tabs/segmented'
import { type ToggleVariantProps, toggleVariants } from './Toggle'

const ToggleGroupContext = createContext<ToggleVariantProps>({})

type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> &
  ToggleVariantProps

/**
 * A group of toggles, styled like the Figma Tab segmented controls:
 * `variant="pill"` puts the items on a blurred Black/4% track (Figma "Pill"),
 * the other variants have no track (Figma "Solid"). The gap is 2px for `sm`
 * and 4px for `md` / `lg`.
 */
const ToggleGroup: FC<ToggleGroupProps> = ({
  className,
  variant,
  size,
  iconOnly,
  children,
  ...props
}) => (
  <ToggleGroupPrimitive.Root
    data-variant={variant ?? 'borderless'}
    className={twMerge(
      segmentedListVariants({
        variant: variant === 'pill' ? 'pill' : 'solid',
        size: size ?? 'md',
      }),
      className,
    )}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size, iconOnly }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
)

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

type ToggleGroupItemProps = ComponentProps<typeof ToggleGroupPrimitive.Item> &
  ToggleVariantProps

const ToggleGroupItem: FC<ToggleGroupItemProps> = ({
  className,
  children,
  variant,
  size,
  iconOnly,
  ...props
}) => {
  const context = useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      className={toggleVariants({
        variant: variant ?? context.variant,
        size: size ?? context.size,
        iconOnly: iconOnly ?? context.iconOnly ?? isIconOnly(children),
        className,
      })}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupItemProps,
  type ToggleGroupProps,
}
