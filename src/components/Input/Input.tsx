'use client'

import { type ComponentProps, type FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { ROLES } from '../../constants'
import { Label } from '../Label'

export const basicInputClasses =
  'peer py-4 px-5 transition-all rounded-2xl bg-white/80 inset-ring inset-ring-black/10 placeholder:text-black/20 hover:inset-ring-black/40 text-black/100'

export const disabledInputClasses =
  'disabled:bg-black/5 disabled:text-black/10 disabled:inset-ring-0 disabled:cursor-not-allowed'

export const focusInputClasses =
  'text-lg focus:ring-4 focus:ring-black/5 focus:outline-none active:inset-ring-black/40 focus:inset-ring-black/40'

type InputProps = ComponentProps<'input'> & {
  title?: string
}

const Input: FC<InputProps> = ({
  className,
  value: clientValue,
  defaultValue,
  id,
  title,
  placeholder,
  onChange,
  ref,
  ...props
}) => {
  const [value, setInputValue] = useState(clientValue)
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <div className="relative">
      <input
        className={twMerge(
          basicInputClasses,
          disabledInputClasses,
          focusInputClasses,
          title && 'py-6 focus:pb-4 focus:pt-8',
          title && (value || defaultValue) && 'pb-4 pt-8',
          className,
        )}
        placeholder={title ? '' : placeholder}
        id={id}
        value={value}
        defaultValue={defaultValue}
        role={ROLES.textbox}
        onChange={changeHandler}
        {...props}
      />
      {title && (
        <Label
          htmlFor={id}
          className={twMerge(
            'absolute left-5 -translate-y-1/2 peer-focus:top-4 peer-focus:text-xs peer-focus:translate-0',
            value || defaultValue
              ? 'top-6 text-xs translate-0'
              : 'top-1/2 text-lg',
          )}
        >
          {title}
        </Label>
      )}
    </div>
  )
}

Input.displayName = 'Input'

export { Input, type InputProps }
