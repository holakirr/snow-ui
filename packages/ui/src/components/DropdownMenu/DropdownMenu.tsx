'use client'

import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ComponentProps, FC } from 'react'
import { TEXT_SIZES } from '../../constants'
import { twMerge } from '../../utils/tw-merge'
import {
  popoverAnimationClasses,
  popoverItemClasses,
  popoverLabelClasses,
  popoverSeparatorClasses,
  popoverSurfaceClasses,
} from '../Popover/surface'
import { useSnowUI } from '../SnowUIProvider'
import { KBD, type KBDProps } from '../Text'

const dropdownMenuContentStyles = twMerge(
  'z-50 min-w-[8rem] overflow-hidden',
  popoverSurfaceClasses,
  popoverAnimationClasses,
)

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuPrimitive.Group>

/**
 * 4px margins above and below: next to a separator they merge into its 8px,
 * so a line between two groups keeps the Figma 8 + 0.5 + 8.
 */
const DropdownMenuGroup: FC<DropdownMenuGroupProps> = ({
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.Group
    className={twMerge('my-1', className)}
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
    className={twMerge(popoverItemClasses, inset && 'ps-8', className)}
    {...props}
  >
    {children}
    <ArrowLineRightIcon className="ms-auto rtl:-scale-x-100" />
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
}) => {
  const { theme, contrast } = useSnowUI()

  return (
    <DropdownMenuPrimitive.SubContent
      // For a submenu you put in a `DropdownMenuPortal`.
      data-theme={theme}
      data-contrast={contrast}
      className={twMerge(dropdownMenuContentStyles, className)}
      {...props}
    />
  )
}
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

type DropdownMenuContentProps = ComponentProps<
  typeof DropdownMenuPrimitive.Content
>

/**
 * The menu, in a portal. It takes the `theme` of a `SnowUIProvider` or
 * `ThemeScope` (the portal is outside your layout's `data-theme` scope).
 */
const DropdownMenuContent: FC<DropdownMenuContentProps> = ({
  className,
  sideOffset = 4,
  ...props
}) => {
  const { theme, contrast } = useSnowUI()

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-theme={theme}
        data-contrast={contrast}
        sideOffset={sideOffset}
        className={twMerge(dropdownMenuContentStyles, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}
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
    className={twMerge(popoverItemClasses, inset && 'ps-8', className)}
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
    className={twMerge(popoverItemClasses, 'pe-8', className)}
    checked={checked}
    {...props}
  >
    {children}
    {/* Figma: a trailing 16px Check on the selected item, as in Select. */}
    <span className="absolute end-2 flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={16} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
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
    className={twMerge(popoverItemClasses, 'pe-8', className)}
    {...props}
  >
    {children}
    {/* Figma: the chosen item of a single-choice list ends in the same
        16px Check as Select's (the role says it is a radio item). */}
    <span className="absolute end-2 flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={16} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
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
    className={twMerge(popoverLabelClasses, inset && 'ps-8', className)}
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
    className={twMerge(popoverSeparatorClasses, className)}
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
    className={twMerge('ms-auto', className)}
    size={TEXT_SIZES[12]}
    {...props}
  />
)
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  type DropdownMenuCheckboxItemProps,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuGroup,
  type DropdownMenuGroupProps,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  DropdownMenuLabel,
  type DropdownMenuLabelProps,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type DropdownMenuRadioItemProps,
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
  DropdownMenuShortcut,
  type DropdownMenuShortcutProps,
  DropdownMenuSub,
  DropdownMenuSubContent,
  type DropdownMenuSubContentProps,
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  DropdownMenuTrigger,
  dropdownMenuContentStyles,
}
