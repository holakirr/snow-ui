'use client'

import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionTriggerProps,
} from '@radix-ui/react-accordion'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import type { FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

import { Typography } from '../Text'

const AccordionContent: FC<AccordionContentProps> = ({
  className,
  ...props
}) => (
  <AccordionPrimitive.Content
    className={twMerge(
      'p-4 pt-1 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden',
      className,
    )}
    {...props}
  />
)

const AccordionTrigger: FC<AccordionTriggerProps> = ({
  children,
  className,
  ...props
}) => (
  <AccordionPrimitive.Header className="flex w-full">
    <AccordionPrimitive.Trigger
      className={twMerge(
        // Like the Figma Sidebar collapsible item: radius 12, Black/4% on hover.
        'flex w-full rounded-12 px-4 py-2 items-center justify-between transition-all hover:bg-black-4 focus-visible:bg-black-4 focus-ring [&[data-state=open]>svg]:rotate-90 rtl:[&[data-state=open]>svg]:-rotate-90 gap-2',
        className,
      )}
      tabIndex={0}
      {...props}
    >
      <Typography size={16}>{children}</Typography>

      <ArrowLineRightIcon className="shrink-0 transition-transform rtl:-scale-x-100" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)

const AccordionItem: FC<AccordionItemProps> = (props) => (
  <AccordionPrimitive.Item {...props} />
)

type AccordionProps = (
  | AccordionPrimitive.AccordionSingleProps
  | AccordionPrimitive.AccordionMultipleProps
) & {}

const Accordion = ({ className, ...props }: AccordionProps) => (
  <AccordionPrimitive.Root
    className={twMerge('flex flex-col gap-1 text-black', className)}
    {...props}
  />
)

AccordionContent.displayName = 'AccordionContent'
AccordionTrigger.displayName = 'AccordionTrigger'
AccordionItem.displayName = 'AccordionItem'
Accordion.displayName = 'Accordion'

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  type AccordionProps,
  AccordionTrigger,
}
