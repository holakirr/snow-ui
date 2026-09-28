'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import type { VariantProps } from 'class-variance-authority'

import { type ComponentProps, createContext, type FC, useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { toggleVariants } from './Toggle'

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  size: 'md',
  variant: 'borderless',
})

type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>

const ToggleGroup: FC<ToggleGroupProps> = ({
  className,
  variant,
  size,
  children,
  ...props
}) => (
  <ToggleGroupPrimitive.Root
    className={twMerge('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
)

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

type ToggleGroupItemProps = ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>

const ToggleGroupItem: FC<ToggleGroupItemProps> = ({
  className,
  children,
  variant,
  size,
  ...props
}) => {
  const context = useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      className={twMerge(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
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
