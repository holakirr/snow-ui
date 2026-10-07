'use client'

import {
  ArrowLineDownIcon,
  ArrowLineUpDownIcon,
  ArrowLineUpIcon,
} from '@holakirr/snow-ui-icons'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import * as SelectPrimitive from '@radix-ui/react-select'
import { type ComponentProps, type FC, useId } from 'react'
import { twMerge } from '../../utils/tw-merge'
import {
  popoverAnimationClasses,
  popoverItemClasses,
  popoverLabelClasses,
  popoverScrollClasses,
  popoverSeparatorClasses,
  popoverSurfaceClasses,
} from '../Popover/surface'
import { useSnowUI } from '../SnowUIProvider'
import { invalidInputClasses } from './inputClasses'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

type SelectTriggerProps = Omit<
  ComponentProps<typeof SelectPrimitive.Trigger>,
  'title'
> & {
  /**
   * The Figma "2 row" title: a 12/16 label above the value, inside the
   * field, as `Input`'s `title`. It names the trigger unless `aria-label` or
   * `aria-labelledby` does.
   */
  title?: string
}

const SelectTrigger: FC<SelectTriggerProps> = ({
  className,
  children,
  title,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) => {
  const titleId = useId()
  return (
    <SelectPrimitive.Trigger
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ?? (title && !ariaLabel ? titleId : undefined)
      }
      className={twMerge(
        // The Figma Input field with a trailing 16px ArrowLineUpDown; the
        // stroke is the `control-border*` tokens (1px with more contrast).
        'group flex w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-16 bg-surface-1 px-4 py-3 text-14 text-black inset-ring-[0.5px] inset-ring-control-border transition-all data-[placeholder]:text-secondary [&>span:not([data-slot=select-title])]:line-clamp-1 contrast-more:inset-ring-1',
        // The Figma "2 row" field: the icon in the value row.
        title && 'items-end',
        'hover:inset-ring-control-border-strong data-[state=open]:inset-ring-control-border-strong',
        'focus-ring data-[state=open]:ring-4 data-[state=open]:ring-focus',
        'disabled:cursor-default disabled:bg-black-4 disabled:text-black-20 disabled:inset-ring-0',
        // Invalid: the red Input stroke, also while the list is open.
        invalidInputClasses,
        'aria-invalid:data-[state=open]:inset-ring-control-border-invalid',
        className,
      )}
      {...props}
    >
      {title ? (
        <span
          data-slot="select-title"
          className="flex min-w-0 flex-col items-start gap-2 [&>span]:max-w-full [&>span]:truncate"
        >
          {/* The accessible name (`aria-labelledby`), not the value. */}
          <span
            id={titleId}
            aria-hidden
            className="text-12 text-secondary group-disabled:text-black-20"
          >
            {title}
          </span>
          {children}
        </span>
      ) : (
        children
      )}
      <SelectPrimitive.Icon asChild>
        <ArrowLineUpDownIcon
          size={16}
          className={twMerge(
            'shrink-0 fill-text-secondary group-disabled:fill-black-20',
            // In the middle of the 20px value line.
            title && 'mb-0.5',
          )}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}
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

/**
 * Radix hides the viewport's scrollbar with an unlayered style (its scroll
 * buttons stand in for it), which beats the `scrollbar-snow` utility: show it
 * again (`!important`). Chrome, Edge and Safari draw the utility's thumb only
 * with `scrollbar-width: auto`; Firefox gets the utility's thin scrollbar, and
 * forced-colors mode the system one (a thin one in Chrome, which then ignores
 * the WebKit scrollbar styles). The scroll buttons stay.
 */
const selectViewportScrollbarClasses =
  '[scrollbar-width:auto]! [&::-webkit-scrollbar]:block! not-supports-[selector(::-webkit-scrollbar)]:[scrollbar-width:thin]! forced-colors:[scrollbar-width:thin]!'

const SelectContent: FC<SelectContentProps> = ({
  className,
  children,
  position = 'popper',
  ...props
}) => {
  const { theme, contrast } = useSnowUI()

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        // The portal is outside your `data-theme` scope: a `ThemeScope`'s
        // theme follows it.
        data-theme={theme}
        data-contrast={contrast}
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
            popoverScrollClasses,
            selectViewportScrollbarClasses,
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
