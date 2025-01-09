'use client'

import { ArrowLineRightIcon, DotIcon } from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { TEXT_SIZES } from '../../constants'
import { KBD, type KBDProps } from '../Text'

const dropdownMenuContentStyles =
  'z-50 min-w-[8rem] overflow-hidden rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-2xl text-black text-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top data-[side=left]:slide-in-from-right data-[side=right]:slide-in-from-left data-[side=top]:slide-in-from-bottom'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuPrimitive.Group>

const DropdownMenuGroup: FC<DropdownMenuGroupProps> = ({
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.Group
    className={twMerge('py-2', className)}
    {...props}
  />
)

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

type DropdownMenuSubTriggerProps = ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean
}

const DropdownMenuSubTrigger: FC<DropdownMenuSubTriggerProps> = ({
  className,
  inset,
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.SubTrigger
    className={twMerge(
      'flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ArrowLineRightIcon className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
)
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

type DropdownMenuSubContentProps = ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
>

const DropdownMenuSubContent: FC<DropdownMenuSubContentProps> = ({
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.SubContent
    className={twMerge(dropdownMenuContentStyles, className)}
    {...props}
  />
)
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

type DropdownMenuContentProps = ComponentProps<
  typeof DropdownMenuPrimitive.Content
>

const DropdownMenuContent: FC<DropdownMenuContentProps> = ({
  className,
  sideOffset = 4,
  ...props
}) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={twMerge(dropdownMenuContentStyles, className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
)
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

type DropdownMenuItemProps = ComponentProps<
  typeof DropdownMenuPrimitive.Item
> & {
  inset?: boolean
}

const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  className,
  inset,
  ...props
}) => (
  <DropdownMenuPrimitive.Item
    className={twMerge(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

type DropdownMenuCheckboxItemProps = ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
>

const DropdownMenuCheckboxItem: FC<DropdownMenuCheckboxItemProps> = ({
  className,
  children,
  checked,
  ...props
}) => (
  <DropdownMenuPrimitive.CheckboxItem
    className={twMerge(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={16} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

type DropdownMenuRadioItemProps = ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem
>

const DropdownMenuRadioItem: FC<DropdownMenuRadioItemProps> = ({
  className,
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.RadioItem
    className={twMerge(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotIcon size={16} className="fill-current" weight="fill" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
)
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

type DropdownMenuLabelProps = ComponentProps<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean
}

const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  className,
  inset,
  ...props
}) => (
  <DropdownMenuPrimitive.Label
    className={twMerge(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

type DropdownMenuSeparatorProps = ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>

const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = ({
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.Separator
    className={twMerge('h-px bg-black/4', className)}
    {...props}
  />
)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

type DropdownMenuShortcutProps = KBDProps

const DropdownMenuShortcut: FC<DropdownMenuShortcutProps> = ({
  className,
  ...props
}) => (
  <KBD
    className={twMerge('ml-auto', className)}
    size={TEXT_SIZES[12]}
    {...props}
  />
)
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  dropdownMenuContentStyles,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps,
  type DropdownMenuGroupProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuShortcutProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuSubTriggerProps,
}
