'use client'

import {
  ArrowLineDownIcon,
  ArrowLineUpDownIcon,
  ArrowLineUpIcon,
} from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react'
import * as SelectPrimitive from '@radix-ui/react-select'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

type SelectTriggerProps = SelectPrimitive.SelectTriggerProps

const SelectTrigger: FC<SelectTriggerProps> = ({
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.Trigger
    className={twMerge(
      'group flex w-full items-center justify-between whitespace-nowrap rounded-2xl border-[.5px] border-black/10 bg-bg5 dark:bg-white/80 px-5 py-[13.5px] text-lg text-black data-[placeholder]:text-black/20 dark:data-[placeholder]:text-black/60 [&>span]:line-clamp-1 transition-all',
      'hover:border-black/40',
      'focus:outline-none focus:ring-4 focus:ring-black/5 data-[state=open]:ring-4 data-[state=open]:ring-black/5',
      'disabled:border-black/4 disabled:bg-black/4 disabled:text-black/10 disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ArrowLineUpDownIcon
        size={20}
        className="group-disabled:fill-black/10 fill-black/40 dark:fill-black/80"
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

type SelectScrollUpButtonProps = SelectPrimitive.SelectScrollUpButtonProps

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
    <ArrowLineUpIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
)
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

type SelectScrollDownButtonProps = SelectPrimitive.SelectScrollDownButtonProps

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
    <ArrowLineDownIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
)
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

type SelectContentProps = SelectPrimitive.SelectContentProps

const SelectContent: FC<SelectContentProps> = ({
  className,
  children,
  position = 'popper',
  ...props
}) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={twMerge(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border border-black/10 bg-white/80 backdrop-blur-2xl text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:animate-slide-in-from-top-2 data-[side=left]:animate-slide-in-from-right-2 data-[side=right]:animate-slide-in-from-left-2 data-[side=top]:animate-slide-in-from-bottom-2 touch-manipulation sm:touch-auto',
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
          'p-2',
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
SelectContent.displayName = SelectPrimitive.Content.displayName

type SelectLabelProps = SelectPrimitive.SelectLabelProps

const SelectLabel: FC<SelectLabelProps> = ({ className, ...props }) => (
  <SelectPrimitive.Label
    className={twMerge('p-2 text-sm font-semibold', className)}
    {...props}
  />
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

type SelectItemProps = SelectPrimitive.SelectItemProps

const SelectItem: FC<SelectItemProps> = ({ className, children, ...props }) => (
  <SelectPrimitive.Item
    className={twMerge(
      'relative flex w-full cursor-default select-none items-center rounded-lg p-2 text-sm outline-none hover:bg-black/5 focus:bg-black/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-all',
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)
SelectItem.displayName = SelectPrimitive.Item.displayName

type SelectSeparatorProps = SelectPrimitive.SelectSeparatorProps

const SelectSeparator: FC<SelectSeparatorProps> = ({ className, ...props }) => (
  <SelectPrimitive.Separator
    className={twMerge('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
)
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectContentProps,
  type SelectItemProps,
  type SelectLabelProps,
  type SelectScrollDownButtonProps,
  type SelectScrollUpButtonProps,
  type SelectSeparatorProps,
  type SelectTriggerProps,
}
