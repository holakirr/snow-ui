'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

// Figma Input "Title": 12/16 Regular, Black/40% (2.85:1); `text-secondary`
// (5.74:1) here.
const labelVariants = cva(
  'text-12 font-normal text-secondary transition-all peer-disabled:cursor-not-allowed',
)

type LabelProps = ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>

const Label: FC<LabelProps> = ({ className, ...props }) => (
  <LabelPrimitive.Root
    className={twMerge(labelVariants({ className }))}
    {...props}
  />
)

Label.displayName = LabelPrimitive.Root.displayName

export { Label, type LabelProps }
