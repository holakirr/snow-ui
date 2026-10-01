'use client'

import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import type { ComponentProps, FC } from 'react'
import { twMerge } from '../../utils/tw-merge'

import { Typography } from '../Text'

type AccordionContentProps = ComponentProps<typeof AccordionPrimitive.Content>

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

type AccordionTriggerProps = ComponentProps<typeof AccordionPrimitive.Trigger>

const AccordionTrigger: FC<AccordionTriggerProps> = ({
  children,
  className,
  ...props
}) => (
  <AccordionPrimitive.Header className="flex w-full">
    <AccordionPrimitive.Trigger
      className={twMerge(
        // Like the Figma Sidebar collapsible item: radius 12, Black/4% on hover.
        // The chevron: the kit's small chevrons are Black/20% at rest and
        // black on hover; at rest it's `text-secondary` instead, as the
        // library's other chevrons (Black/20% is 1.6:1, WCAG 1.4.11).
        'flex w-full rounded-12 px-4 py-2 items-center justify-between transition-all hover:bg-black-4 focus-visible:bg-black-4 focus-ring [&>svg]:text-secondary hover:[&>svg]:text-black focus-visible:[&>svg]:text-black [&[data-state=open]>svg]:rotate-90 rtl:[&[data-state=open]>svg]:-rotate-90 gap-2',
        className,
      )}
      tabIndex={0}
      {...props}
    >
      <Typography size={16}>{children}</Typography>

      <ArrowLineRightIcon
        className="shrink-0 transition-transform motion-reduce:transition-none rtl:-scale-x-100"
        // The icons' inline `transition: all .15s` would beat the classes:
        // the chevron turns in 150ms, and not at all with reduced motion.
        style={{ transition: undefined }}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)

type AccordionItemProps = ComponentProps<typeof AccordionPrimitive.Item>

const AccordionItem: FC<AccordionItemProps> = (props) => (
  <AccordionPrimitive.Item {...props} />
)

type AccordionProps = ComponentProps<typeof AccordionPrimitive.Root>

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
