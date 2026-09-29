'use client'

import {
  ArrowLineDownIcon,
  ArrowLineUpDownIcon,
  ArrowLineUpIcon,
} from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import * as SelectPrimitive from '@radix-ui/react-select'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  popoverAnimationClasses,
  popoverItemClasses,
  popoverLabelClasses,
  popoverSeparatorClasses,
  popoverSurfaceClasses,
} from '../Popover/surface'
import { useSnowUI } from '../SnowUIProvider'
import { invalidInputClasses } from './Input'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger>

const SelectTrigger: FC<SelectTriggerProps> = ({
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.Trigger
    className={twMerge(
      // The Figma Input field with a trailing 16px ArrowLineUpDown; the
      // stroke is the `control-border*` tokens (1px with more contrast).
      'group flex w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-16 bg-surface-1 px-4 py-3 text-14 text-black inset-ring-[0.5px] inset-ring-control-border transition-all data-[placeholder]:text-secondary [&>span]:line-clamp-1 contrast-more:inset-ring-1',
      'hover:inset-ring-control-border-strong data-[state=open]:inset-ring-control-border-strong',
      'focus-ring data-[state=open]:ring-4 data-[state=open]:ring-focus',
      'disabled:cursor-not-allowed disabled:bg-black-4 disabled:text-black-20 disabled:inset-ring-0',
      // Invalid: the red Input stroke, also while the list is open.
      invalidInputClasses,
      'aria-invalid:data-[state=open]:inset-ring-red',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ArrowLineUpDownIcon
        size={16}
        className="shrink-0 fill-control-border-strong group-disabled:fill-black-20"
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

type SelectScrollUpButtonProps = ComponentProps<
  typeof SelectPrimitive.ScrollUpButton
>

const SelectScrollUpButton: FC<SelectScrollUpButtonProps> = ({
  className,
  ...props
}) => (
  <SelectPrimitive.ScrollUpButton
    className={twMerge(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ArrowLineUpIcon size={16} />
  </SelectPrimitive.ScrollUpButton>
)
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

type SelectScrollDownButtonProps = ComponentProps<
  typeof SelectPrimitive.ScrollDownButton
>

const SelectScrollDownButton: FC<SelectScrollDownButtonProps> = ({
  className,
  ...props
}) => (
  <SelectPrimitive.ScrollDownButton
    className={twMerge(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ArrowLineDownIcon size={16} />
  </SelectPrimitive.ScrollDownButton>
)
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

type SelectContentProps = ComponentProps<typeof SelectPrimitive.Content>

const SelectContent: FC<SelectContentProps> = ({
  className,
  children,
  position = 'popper',
  ...props
}) => {
  const { theme } = useSnowUI()

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        // The portal is outside your `data-theme` scope: a `ThemeScope`'s
        // theme follows it.
        data-theme={theme}
        className={twMerge(
          'relative z-50 max-h-96 min-w-[8rem] touch-manipulation overflow-hidden sm:touch-auto',
          popoverSurfaceClasses,
          // The padding is on the viewport, so the list scrolls inside it.
          'p-0',
          popoverAnimationClasses,
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={twMerge(
            'p-3',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}
SelectContent.displayName = SelectPrimitive.Content.displayName

type SelectLabelProps = ComponentProps<typeof SelectPrimitive.Label>

const SelectLabel: FC<SelectLabelProps> = ({ className, ...props }) => (
  <SelectPrimitive.Label
    className={twMerge(popoverLabelClasses, className)}
    {...props}
  />
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>

const SelectItem: FC<SelectItemProps> = ({ className, children, ...props }) => (
  <SelectPrimitive.Item
    className={twMerge(
      popoverItemClasses,
      'w-full pe-8 hover:bg-black-4',
      className,
    )}
    {...props}
  >
    {/* Figma: a trailing 16px Check on the selected item. */}
    <span className="absolute end-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)
SelectItem.displayName = SelectPrimitive.Item.displayName

type SelectSeparatorProps = ComponentProps<typeof SelectPrimitive.Separator>

const SelectSeparator: FC<SelectSeparatorProps> = ({ className, ...props }) => (
  <SelectPrimitive.Separator
    className={twMerge(popoverSeparatorClasses, className)}
    {...props}
  />
)
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectContent,
  type SelectContentProps,
  SelectGroup,
  SelectItem,
  type SelectItemProps,
  SelectLabel,
  type SelectLabelProps,
  SelectScrollDownButton,
  type SelectScrollDownButtonProps,
  SelectScrollUpButton,
  type SelectScrollUpButtonProps,
  SelectSeparator,
  type SelectSeparatorProps,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
}
