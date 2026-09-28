'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

// Figma Input "Title": 12/16 Regular, Black/40%.
const labelVariants = cva(
  'text-12 font-normal text-black-40 transition-all peer-disabled:cursor-not-allowed',
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
