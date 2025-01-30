'use client'

import { ArrowRightIcon } from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react'
import * as CtxMenuPrimitive from '@radix-ui/react-context-menu'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { KBD, type KBDProps } from '../Text'

const ContextMenu = CtxMenuPrimitive.Root

const ContextMenuTrigger = CtxMenuPrimitive.Trigger

const ContextMenuGroup = CtxMenuPrimitive.Group

const ContextMenuPortal = CtxMenuPrimitive.Portal

const ContextMenuSub = CtxMenuPrimitive.Sub

const ContextMenuRadioGroup = CtxMenuPrimitive.RadioGroup

type ContextMenuSubTriggerProps = CtxMenuPrimitive.ContextMenuSubTriggerProps

const ContextMenuSubTrigger: FC<ContextMenuSubTriggerProps> = ({
  className,
  children,
  ...props
}) => (
  <CtxMenuPrimitive.SubTrigger
    className={twMerge(
      'flex cursor-default select-none items-center rounded-lg p-2 text-sm text-black outline-none focus:bg-black/4 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=open]:bg-black/4 data-[state=open]:text-black',
      className,
    )}
    {...props}
  >
    {children}
    <ArrowRightIcon className="ml-auto h-4 w-4" />
  </CtxMenuPrimitive.SubTrigger>
)
ContextMenuSubTrigger.displayName = CtxMenuPrimitive.SubTrigger.displayName

const contentClasses =
  'z-50 min-w-60 rounded-2xl border-[0.5px] border-black/10 bg-white/80 p-4 text-black backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[side=bottom]:slide-in-from-top data-[side=left]:slide-in-from-right data-[side=right]:slide-in-from-left data-[side=top]:slide-in-from-bottom'

type ContextMenuSubContentProps = CtxMenuPrimitive.ContextMenuSubContentProps

const ContextMenuSubContent: FC<ContextMenuSubContentProps> = ({
  className,
  ...props
}) => (
  <CtxMenuPrimitive.SubContent
    className={twMerge(contentClasses, className)}
    {...props}
  />
)
ContextMenuSubContent.displayName = CtxMenuPrimitive.SubContent.displayName

type ContextMenuContentProps = CtxMenuPrimitive.ContextMenuContentProps

const ContextMenuContent: FC<ContextMenuContentProps> = ({
  className,
  ...props
}) => (
  <CtxMenuPrimitive.Portal>
    <CtxMenuPrimitive.Content
      className={twMerge(contentClasses, className)}
      {...props}
    />
  </CtxMenuPrimitive.Portal>
)
ContextMenuContent.displayName = CtxMenuPrimitive.Content.displayName

const itemClasses =
  'relative flex cursor-default select-none items-center rounded-lg p-2 text-sm text-black outline-none focus:bg-black/4 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

type ContextMenuItemProps = CtxMenuPrimitive.ContextMenuItemProps

const ContextMenuItem: FC<ContextMenuItemProps> = ({ className, ...props }) => (
  <CtxMenuPrimitive.Item
    className={twMerge(itemClasses, className)}
    {...props}
  />
)
ContextMenuItem.displayName = CtxMenuPrimitive.Item.displayName

type ContextMenuCheckboxItemProps =
  CtxMenuPrimitive.ContextMenuCheckboxItemProps

const ContextMenuCheckboxItem: FC<ContextMenuCheckboxItemProps> = ({
  className,
  children,
  checked,
  ...props
}) => (
  <CtxMenuPrimitive.CheckboxItem
    className={twMerge(itemClasses, 'pl-8', className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CtxMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </CtxMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </CtxMenuPrimitive.CheckboxItem>
)
ContextMenuCheckboxItem.displayName = CtxMenuPrimitive.CheckboxItem.displayName

type ContextMenuRadioItemProps = CtxMenuPrimitive.ContextMenuRadioItemProps

const ContextMenuRadioItem: FC<ContextMenuRadioItemProps> = ({
  className,
  children,
  ...props
}) => (
  <CtxMenuPrimitive.RadioItem
    className={twMerge(itemClasses, 'pl-8', className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CtxMenuPrimitive.ItemIndicator>
        <span className="block w-[14px] h-[14px] aspect-square rounded-full bg-brand group-hover:bg-brand-hover group-disabled:bg-black/10" />
      </CtxMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </CtxMenuPrimitive.RadioItem>
)
ContextMenuRadioItem.displayName = CtxMenuPrimitive.RadioItem.displayName

type ContextMenuLabelProps = CtxMenuPrimitive.ContextMenuLabelProps

const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  className,
  ...props
}) => (
  <CtxMenuPrimitive.Label
    className={twMerge('p-2 text-sm font-semibold text-black', className)}
    {...props}
  />
)
ContextMenuLabel.displayName = CtxMenuPrimitive.Label.displayName

type ContextMenuSeparatorProps = CtxMenuPrimitive.ContextMenuSeparatorProps

const ContextMenuSeparator: FC<ContextMenuSeparatorProps> = ({
  className,
  ...props
}) => (
  <CtxMenuPrimitive.Separator
    className={twMerge('my-2 h-px bg-black/4', className)}
    {...props}
  />
)
ContextMenuSeparator.displayName = CtxMenuPrimitive.Separator.displayName

type ContextMenuShortcutProps = ComponentProps<'span'>

const ContextMenuShortcut: FC<KBDProps> = ({ className, ...props }) => (
  <KBD className="ml-auto" {...props} />
)
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  type ContextMenuCheckboxItemProps,
  type ContextMenuContentProps,
  type ContextMenuItemProps,
  type ContextMenuLabelProps,
  type ContextMenuRadioItemProps,
  type ContextMenuSeparatorProps,
  type ContextMenuShortcutProps,
  type ContextMenuSubContentProps,
  type ContextMenuSubTriggerProps,
}
