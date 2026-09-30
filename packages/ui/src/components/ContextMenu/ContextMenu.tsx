'use client'

import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import * as CtxMenuPrimitive from '@radix-ui/react-context-menu'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  popoverItemClasses,
  popoverLabelClasses,
  popoverSeparatorClasses,
  popoverSurfaceClasses,
} from '../Popover/surface'
import { useSnowUI } from '../SnowUIProvider'
import { KBD, type KBDProps } from '../Text'

const ContextMenu = CtxMenuPrimitive.Root

const ContextMenuTrigger = CtxMenuPrimitive.Trigger

const ContextMenuGroup = CtxMenuPrimitive.Group

const ContextMenuPortal = CtxMenuPrimitive.Portal

const ContextMenuSub = CtxMenuPrimitive.Sub

const ContextMenuRadioGroup = CtxMenuPrimitive.RadioGroup

type ContextMenuSubTriggerProps = ComponentProps<
  typeof CtxMenuPrimitive.SubTrigger
> & {
  inset?: boolean
}

const ContextMenuSubTrigger: FC<ContextMenuSubTriggerProps> = ({
  className,
  inset,
  children,
  ...props
}) => (
  <CtxMenuPrimitive.SubTrigger
    className={twMerge(popoverItemClasses, inset && 'ps-8', className)}
    {...props}
  >
    {children}
    {/* Figma: the submenu item ends in a 16px ArrowLineRight chevron. */}
    <ArrowLineRightIcon className="ms-auto rtl:-scale-x-100" />
  </CtxMenuPrimitive.SubTrigger>
)
ContextMenuSubTrigger.displayName = CtxMenuPrimitive.SubTrigger.displayName

const contentClasses = twMerge(
  'z-50 min-w-60',
  popoverSurfaceClasses,
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[side=bottom]:animate-slide-in-from-top data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left data-[side=top]:animate-slide-in-from-bottom',
)

type ContextMenuSubContentProps = ComponentProps<
  typeof CtxMenuPrimitive.SubContent
>

const ContextMenuSubContent: FC<ContextMenuSubContentProps> = ({
  className,
  ...props
}) => {
  const { theme, contrast } = useSnowUI()

  return (
    <CtxMenuPrimitive.SubContent
      // For a submenu you put in a `ContextMenuPortal`.
      data-theme={theme}
      data-contrast={contrast}
      className={twMerge(contentClasses, className)}
      {...props}
    />
  )
}
ContextMenuSubContent.displayName = CtxMenuPrimitive.SubContent.displayName

type ContextMenuContentProps = ComponentProps<typeof CtxMenuPrimitive.Content>

/**
 * The menu, in a portal. It takes the `theme` of a `SnowUIProvider` or
 * `ThemeScope` (the portal is outside your layout's `data-theme` scope).
 */
const ContextMenuContent: FC<ContextMenuContentProps> = ({
  className,
  ...props
}) => {
  const { theme, contrast } = useSnowUI()

  return (
    <CtxMenuPrimitive.Portal>
      <CtxMenuPrimitive.Content
        data-theme={theme}
        data-contrast={contrast}
        className={twMerge(contentClasses, className)}
        {...props}
      />
    </CtxMenuPrimitive.Portal>
  )
}
ContextMenuContent.displayName = CtxMenuPrimitive.Content.displayName

const itemClasses = popoverItemClasses

type ContextMenuItemProps = ComponentProps<typeof CtxMenuPrimitive.Item> & {
  inset?: boolean
}

const ContextMenuItem: FC<ContextMenuItemProps> = ({
  className,
  inset,
  ...props
}) => (
  <CtxMenuPrimitive.Item
    className={twMerge(itemClasses, inset && 'ps-8', className)}
    {...props}
  />
)
ContextMenuItem.displayName = CtxMenuPrimitive.Item.displayName

type ContextMenuCheckboxItemProps = ComponentProps<
  typeof CtxMenuPrimitive.CheckboxItem
>

const ContextMenuCheckboxItem: FC<ContextMenuCheckboxItemProps> = ({
  className,
  children,
  checked,
  ...props
}) => (
  <CtxMenuPrimitive.CheckboxItem
    className={twMerge(itemClasses, 'pe-8', className)}
    checked={checked}
    {...props}
  >
    {children}
    {/* Figma: a trailing 16px Check on the selected item, as in Select. */}
    <span className="absolute end-2 flex size-4 items-center justify-center">
      <CtxMenuPrimitive.ItemIndicator>
        <Check />
      </CtxMenuPrimitive.ItemIndicator>
    </span>
  </CtxMenuPrimitive.CheckboxItem>
)
ContextMenuCheckboxItem.displayName = CtxMenuPrimitive.CheckboxItem.displayName

type ContextMenuRadioItemProps = ComponentProps<
  typeof CtxMenuPrimitive.RadioItem
>

const ContextMenuRadioItem: FC<ContextMenuRadioItemProps> = ({
  className,
  children,
  ...props
}) => (
  <CtxMenuPrimitive.RadioItem
    className={twMerge(itemClasses, 'pe-8', className)}
    {...props}
  >
    {children}
    {/* Figma: the chosen item of a single-choice list ends in the same
        16px Check as Select's (the role says it is a radio item). */}
    <span className="absolute end-2 flex size-4 items-center justify-center">
      <CtxMenuPrimitive.ItemIndicator>
        <Check />
      </CtxMenuPrimitive.ItemIndicator>
    </span>
  </CtxMenuPrimitive.RadioItem>
)
ContextMenuRadioItem.displayName = CtxMenuPrimitive.RadioItem.displayName

type ContextMenuLabelProps = ComponentProps<typeof CtxMenuPrimitive.Label> & {
  inset?: boolean
}

const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  className,
  inset,
  ...props
}) => (
  <CtxMenuPrimitive.Label
    className={twMerge(popoverLabelClasses, inset && 'ps-8', className)}
    {...props}
  />
)
ContextMenuLabel.displayName = CtxMenuPrimitive.Label.displayName

type ContextMenuSeparatorProps = ComponentProps<
  typeof CtxMenuPrimitive.Separator
>

const ContextMenuSeparator: FC<ContextMenuSeparatorProps> = ({
  className,
  ...props
}) => (
  <CtxMenuPrimitive.Separator
    className={twMerge(popoverSeparatorClasses, className)}
    {...props}
  />
)
ContextMenuSeparator.displayName = CtxMenuPrimitive.Separator.displayName

type ContextMenuShortcutProps = KBDProps

const ContextMenuShortcut: FC<ContextMenuShortcutProps> = ({
  className,
  ...props
}) => <KBD className={twMerge('ms-auto', className)} {...props} />
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  type ContextMenuCheckboxItemProps,
  ContextMenuContent,
  type ContextMenuContentProps,
  ContextMenuGroup,
  ContextMenuItem,
  type ContextMenuItemProps,
  ContextMenuLabel,
  type ContextMenuLabelProps,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  type ContextMenuRadioItemProps,
  ContextMenuSeparator,
  type ContextMenuSeparatorProps,
  ContextMenuShortcut,
  type ContextMenuShortcutProps,
  ContextMenuSub,
  ContextMenuSubContent,
  type ContextMenuSubContentProps,
  ContextMenuSubTrigger,
  type ContextMenuSubTriggerProps,
  ContextMenuTrigger,
}
