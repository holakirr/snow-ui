'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, FC } from 'react'
import { twMerge } from 'tailwind-merge'

const labelVariants = cva(
  'text-sm font-medium leading-none text-black/20 w-min transition-all',
)

type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>

const Label: FC<LabelProps> = ({ className, ...props }) => (
  <LabelPrimitive.Root
    className={twMerge(labelVariants({ className }))}
    {...props}
  />
)

Label.displayName = LabelPrimitive.Root.displayName

export { Label, type LabelProps }
