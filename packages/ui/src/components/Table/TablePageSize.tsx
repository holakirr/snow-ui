'use client'

import { ArrowLineDownIcon } from '@holakirr/snow-ui-icons'
import * as SelectPrimitive from '@radix-ui/react-select'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'
import { SelectContent, SelectItem } from '../Input/Select'
import { useMessages } from '../SnowUIProvider'

/** The kit's choices: "20, 50, 100, default 20". */
const DEFAULT_OPTIONS = [20, 50, 100] as const

type TablePageSizeProps = Omit<
  ComponentProps<typeof SelectPrimitive.Trigger>,
  'value' | 'defaultValue' | 'children' | 'dir'
> & {
  /** The rows per page, controlled. */
  value?: number
  /**
   * The rows per page at first, uncontrolled.
   * @default the first of `options`: 20
   */
  defaultValue?: number
  /** Called with the rows per page the user picks. */
  onValueChange?: (value: number) => void
  /**
   * The choices, in the order they are listed. A `value` or `defaultValue`
   * that isn't one of them is added, in order: TanStack Table's default
   * page size, 10, shows as 10 rather than as an empty field.
   * @default [20, 50, 100]
   */
  options?: readonly number[]
  /** The name of the field in a form; it submits the rows per page. */
  name?: string
  /** The `id` of the form the field belongs to, when it is outside it. */
  form?: string
  /** The field must have a value to submit its form. */
  required?: boolean
}

/**
 * The kit's rows-per-page field under a table: "20 ∨", a small borderless
 * button (12/16, ArrowLineDown 16) that opens the list of `options` (20, 50
 * and 100 by default). A Radix Select: a `combobox` named "Rows per page"
 * (`messages.table.pageSize`), with the arrow keys, type-ahead, Enter and
 * Escape. Props other than the value ones go to the button. Added in 5.3.
 */
const TablePageSize: FC<TablePageSizeProps> = ({
  value,
  defaultValue,
  onValueChange,
  options = DEFAULT_OPTIONS,
  name,
  form,
  required,
  disabled,
  className,
  'aria-label': ariaLabel,
  ...props
}) => {
  const messages = useMessages()
  const current = value ?? defaultValue
  const choices =
    current === undefined || options.includes(current)
      ? options
      : [...options, current].sort((a, b) => a - b)

  return (
    <SelectPrimitive.Root
      value={value === undefined ? undefined : String(value)}
      defaultValue={String(defaultValue ?? options[0])}
      onValueChange={(next) => onValueChange?.(Number(next))}
      name={name}
      form={form}
      required={required}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel ?? messages.table.pageSize}
        className={twMerge(
          // The kit's Button Small Borderless with a right icon.
          'group inline-flex min-h-6 shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-12 px-3 py-1 text-12 text-black transition-colors hover:bg-black-4 focus-ring data-[state=open]:bg-black-4',
          'disabled:cursor-default disabled:bg-transparent disabled:text-black-20',
          className,
        )}
        disabled={disabled}
        {...props}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon asChild>
          {/* Black/40% in the kit (2.85:1): `text-secondary`, 3:1 or more
              for the icon that marks the menu (WCAG 1.4.11). */}
          <ArrowLineDownIcon
            size={16}
            className="shrink-0 fill-text-secondary group-disabled:fill-black-20"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectContent>
        {choices.map((option) => (
          <SelectItem key={option} value={String(option)}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  )
}
TablePageSize.displayName = 'TablePageSize'

export { TablePageSize, type TablePageSizeProps }
