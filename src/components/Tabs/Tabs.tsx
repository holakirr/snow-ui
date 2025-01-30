'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Separator } from '../Separator'

const Tabs = TabsPrimitive.Root

type TabsListProps = TabsPrimitive.TabsListProps

const TabsList: FC<TabsListProps> = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={twMerge(
      'inline-flex items-center justify-center gap-4 text-black/40',
      className,
    )}
    {...props}
  />
)
TabsList.displayName = TabsPrimitive.List.displayName

type TabsTriggerProps = TabsPrimitive.TabsTriggerProps

const TabsTrigger: FC<TabsTriggerProps> = ({
  className,
  children,
  ...props
}) => (
  <TabsPrimitive.Trigger
    className={twMerge(
      'group flex flex-col items-center justify-center whitespace-nowrap gap-1 text-sm ring-offset-black/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-brand data-[state=active]:[&>[role="presentation"]]:bg-brand',
      className,
    )}
    {...props}
  >
    {children}
    <Separator
      role="presentation"
      decorative
      className="w-full h-1 rounded-full bg-transparent transition-colors"
    />
  </TabsPrimitive.Trigger>
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

type TabsContentProps = TabsPrimitive.TabsContentProps

const TabsContent: FC<TabsContentProps> = ({ className, ...props }) => (
  <TabsPrimitive.Content
    className={twMerge(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
