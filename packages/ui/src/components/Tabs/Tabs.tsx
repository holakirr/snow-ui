'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva } from 'class-variance-authority'
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
} from 'react'
import type { Size } from '../../types'
import { isDevelopment } from '../../utils/env'
import { twMerge } from '../../utils/tw-merge'
import { segmentedItemVariants, segmentedListVariants } from './segmented'

/**
 * The Figma Tab variants:
 * - `line` ("Underline"): text tabs, the active one in Primary with a 2px line.
 * - `pill` ("Pill"): a segmented control on a blurred Black/4% track; the
 *   active item is white with a shadow.
 * - `icon-toggle` ("Icon-toggle"): the pill control where only the active item
 *   shows its label (give every trigger an `icon`).
 * - `solid` ("Solid"): no track; the active item has a Black/4% fill.
 */
export type TabsVariant = 'line' | 'pill' | 'icon-toggle' | 'solid'

type TabsListContextValue = {
  variant: TabsVariant
  size: Size
}

const TabsListContext = createContext<TabsListContextValue>({
  variant: 'line',
  size: 'md',
})

const Tabs = TabsPrimitive.Root

type TabsListProps = TabsPrimitive.TabsListProps & {
  /**
   * The Figma Tab variant.
   * @default "line"
   */
  variant?: TabsVariant

  /**
   * The Figma Tab size: text 12, 14 or 16px; segmented items use the Button
   * sizes.
   * @default "md"
   */
  size?: Size
}

const TabsList: FC<TabsListProps> = ({
  className,
  variant = 'line',
  size = 'md',
  ...props
}) => (
  <TabsListContext.Provider value={{ variant, size }}>
    <TabsPrimitive.List
      data-variant={variant}
      className={twMerge(
        variant === 'line'
          ? 'inline-flex items-center justify-center gap-4'
          : segmentedListVariants({
              variant: variant === 'solid' ? 'solid' : 'pill',
              size,
            }),
        className,
      )}
      {...props}
    />
  </TabsListContext.Provider>
)
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * Figma "Underline" tab. Figma dims the inactive label to 40% opacity
 * (2.85:1); here it is `text-secondary` (5.74:1 light, 7.08:1 dark), black on
 * hover and keyboard focus, and `primary` when active.
 */
const lineTriggerVariants = cva(
  [
    'group inline-flex flex-col items-center justify-center gap-1 whitespace-nowrap text-secondary transition-all',
    'cursor-pointer rounded-4 focus-ring',
    'hover:text-black focus-visible:text-black enabled:data-[state=active]:text-primary',
    'disabled:cursor-not-allowed disabled:text-black-20 [&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        sm: 'text-12 [&_svg:not([class*=size-])]:size-3',
        md: 'text-14 [&_svg:not([class*=size-])]:size-4',
        lg: 'text-16 [&_svg:not([class*=size-])]:size-5',
      },
    },
  },
)

/** Icon-toggle: inactive items collapse to a square icon button. */
const iconToggleInactiveClasses: { [K in Size]: string } = {
  sm: 'data-[state=inactive]:size-6 data-[state=inactive]:p-0',
  md: 'data-[state=inactive]:size-9 data-[state=inactive]:p-0',
  lg: 'data-[state=inactive]:size-12 data-[state=inactive]:p-0',
}

type TabsTriggerProps = TabsPrimitive.TabsTriggerProps & {
  /**
   * An icon shown before the label. A trigger with an icon and no children
   * is an icon-only tab: give it an `aria-label`.
   */
  icon?: ReactNode
}

const TabsTrigger: FC<TabsTriggerProps> = ({
  className,
  children,
  icon,
  ...props
}) => {
  const { variant, size } = useContext(TabsListContext)
  const iconOnly = !!icon && (children === undefined || children === null)
  const hasAccessibleName = !!(props['aria-label'] || props['aria-labelledby'])

  useEffect(() => {
    if (iconOnly && !hasAccessibleName && isDevelopment()) {
      console.warn(
        'TabsTrigger: an icon-only tab needs an `aria-label` or `aria-labelledby`.',
      )
    }
  }, [iconOnly, hasAccessibleName])

  if (variant === 'line') {
    return (
      <TabsPrimitive.Trigger
        className={twMerge(lineTriggerVariants({ size }), className)}
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          {icon}
          {children}
        </span>
        <span
          aria-hidden
          className="h-0.5 w-full rounded-full bg-transparent transition-colors group-data-[state=active]:bg-primary"
        />
      </TabsPrimitive.Trigger>
    )
  }

  return (
    <TabsPrimitive.Trigger
      className={twMerge(
        segmentedItemVariants({
          variant: variant === 'solid' ? 'solid' : 'pill',
          size,
          iconOnly,
        }),
        variant === 'icon-toggle' &&
          icon && ['group', iconToggleInactiveClasses[size]],
        className,
      )}
      {...props}
    >
      {icon}
      {!iconOnly && (
        <span
          className={twMerge(
            variant === 'icon-toggle' &&
              icon &&
              'group-data-[state=inactive]:sr-only',
          )}
        >
          {children}
        </span>
      )}
    </TabsPrimitive.Trigger>
  )
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

type TabsContentProps = TabsPrimitive.TabsContentProps

const TabsContent: FC<TabsContentProps> = ({ className, ...props }) => (
  <TabsPrimitive.Content
    className={twMerge('mt-2 rounded-4 focus-ring', className)}
    {...props}
  />
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export {
  Tabs,
  TabsContent,
  type TabsContentProps,
  TabsList,
  type TabsListProps,
  TabsTrigger,
  type TabsTriggerProps,
}
