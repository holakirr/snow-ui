'use client'

import { SidebarSimple } from '@phosphor-icons/react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import {
  type CSSProperties,
  type ComponentProps,
  type FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

import { useIsMobile } from '../../hooks/use-mobile'
import { Button, type ButtonProps } from '../Button'
import { Input, type InputProps } from '../Input'
import { Separator, type SeparatorProps } from '../Separator'
import { Sheet, SheetContent } from '../Sheet'
import { Skeleton } from '../Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../Tooltip'

const SIDEBAR_COOKIE_NAME = 'sidebar:state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContext = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

type SidebarProviderProps = ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SidebarProvider: FC<SidebarProviderProps> = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  // Helper to toggle the sidebar.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed'

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const contextValue = useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as CSSProperties
          }
          className={twMerge(
            'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-white',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}
SidebarProvider.displayName = 'SidebarProvider'

type SidebarProps = ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

const Sidebar: FC<SidebarProps> = ({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        className={twMerge(
          'flex h-full w-[--sidebar-width] flex-col bg-white text-black',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-white p-0 text-black [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer hidden md:block text-black"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={twMerge(
          'duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
        )}
      />
      <div
        className={twMerge(
          'duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-white group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
Sidebar.displayName = 'Sidebar'

type SidebarTriggerProps = ButtonProps

const SidebarTrigger: FC<SidebarTriggerProps> = ({
  className,
  onClick,
  ...props
}) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      className={className}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      leftContent={<SidebarSimple />}
      {...props}
    >
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
SidebarTrigger.displayName = 'SidebarTrigger'

type SidebarRailProps = ComponentProps<'button'>

const SidebarRail: FC<SidebarRailProps> = ({ className, ...props }) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={twMerge(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-white-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-white',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  )
}
SidebarRail.displayName = 'SidebarRail'

type SidebarInsetProps = ComponentProps<'main'>

const SidebarInset: FC<SidebarInsetProps> = ({ className, ...props }) => (
  <main
    className={twMerge(
      'relative flex min-h-svh flex-1 flex-col bg-background',
      'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl',
      className,
    )}
    {...props}
  />
)

SidebarInset.displayName = 'SidebarInset'

type SidebarInputProps = InputProps

const SidebarInput: FC<SidebarInputProps> = ({ className, ...props }) => (
  <Input
    data-sidebar="input"
    className={twMerge('h-8 w-full focus-visible:ring-2', className)}
    {...props}
  />
)

SidebarInput.displayName = 'SidebarInput'

type SidebarHeaderProps = ComponentProps<'div'>

const SidebarHeader: FC<SidebarHeaderProps> = ({ className, ...props }) => (
  <div
    data-sidebar="header"
    className={twMerge('flex flex-col gap-2 p-2', className)}
    {...props}
  />
)
SidebarHeader.displayName = 'SidebarHeader'

type SidebarFooterProps = ComponentProps<'div'>

const SidebarFooter: FC<SidebarFooterProps> = ({ className, ...props }) => (
  <div
    data-sidebar="footer"
    className={twMerge('flex flex-col gap-2 p-2', className)}
    {...props}
  />
)
SidebarFooter.displayName = 'SidebarFooter'

type SidebarSeparatorProps = SeparatorProps

const SidebarSeparator: FC<SidebarSeparatorProps> = ({
  className,
  ...props
}) => (
  <Separator
    data-sidebar="separator"
    className={twMerge('mx-2 w-auto bg-black/10', className)}
    {...props}
  />
)
SidebarSeparator.displayName = 'SidebarSeparator'

type SidebarContentProps = ComponentProps<'div'>

const SidebarContent: FC<SidebarContentProps> = ({ className, ...props }) => (
  <div
    data-sidebar="content"
    className={twMerge(
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
      className,
    )}
    {...props}
  />
)
SidebarContent.displayName = 'SidebarContent'

type SidebarGroupProps = ComponentProps<'div'>

const SidebarGroup: FC<SidebarGroupProps> = ({ className, ...props }) => (
  <div
    data-sidebar="group"
    className={twMerge('relative flex w-full min-w-0 flex-col p-2', className)}
    {...props}
  />
)
SidebarGroup.displayName = 'SidebarGroup'

type SidebarGroupLabelProps = ComponentProps<'div'> & { asChild?: boolean }

const SidebarGroupLabel: FC<SidebarGroupLabelProps> = ({
  className,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-sidebar="group-label"
      className={twMerge(
        'duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-black/70 outline-none transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      {...props}
    />
  )
}
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

type SidebarGroupActionProps = ComponentProps<'button'> & { asChild?: boolean }

const SidebarGroupAction: FC<SidebarGroupActionProps> = ({
  className,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-sidebar="group-action"
      className={twMerge(
        'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-black outline-none transition-transform hover:bg-black/4 hover:text-black focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}
SidebarGroupAction.displayName = 'SidebarGroupAction'

type SidebarGroupContentProps = ComponentProps<'div'>

const SidebarGroupContent: FC<SidebarGroupContentProps> = ({
  className,
  ...props
}) => (
  <div
    data-sidebar="group-content"
    className={twMerge('w-full text-sm', className)}
    {...props}
  />
)
SidebarGroupContent.displayName = 'SidebarGroupContent'

type SidebarMenuProps = ComponentProps<'ul'>

const SidebarMenu: FC<SidebarMenuProps> = ({ className, ...props }) => (
  <ul
    data-sidebar="menu"
    className={twMerge('flex w-full min-w-0 flex-col gap-1', className)}
    {...props}
  />
)
SidebarMenu.displayName = 'SidebarMenu'

type SidebarMenuItemProps = ComponentProps<'li'>

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ className, ...props }) => (
  <li
    data-sidebar="menu-item"
    className={twMerge('group/menu-item relative', className)}
    {...props}
  />
)
SidebarMenuItem.displayName = 'SidebarMenuItem'

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-black text-sm outline-none transition-[width,height,padding] hover:bg-black/4 focus-visible:ring-2 active:bg-black/4 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-black/10 data-[active=true]:font-medium data-[state=open]:hover:bg-black/4 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-black/10',
        outline: 'bg-background hover:bg-black/4',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type SidebarMenuButtonProps = ComponentProps<'button'> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>

const SidebarMenuButton: FC<SidebarMenuButtonProps> = ({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={twMerge(
        sidebarMenuButtonVariants({ variant, size }),
        className,
      )}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}
SidebarMenuButton.displayName = 'SidebarMenuButton'

type SidebarMenuActionProps = ComponentProps<'button'> & {
  asChild?: boolean
  showOnHover?: boolean
}

const SidebarMenuAction: FC<SidebarMenuActionProps> = ({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-sidebar="menu-action"
      className={twMerge(
        'absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-black outline-none transition-transform hover:bg-black/4 hover:text-black focus-visible:ring-2 peer-hover/menu-button:text-black [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-black md:opacity-0',
        className,
      )}
      {...props}
    />
  )
}
SidebarMenuAction.displayName = 'SidebarMenuAction'

type SidebarMenuBadgeProps = ComponentProps<'div'>

const SidebarMenuBadge: FC<SidebarMenuBadgeProps> = ({
  className,
  ...props
}) => (
  <div
    data-sidebar="menu-badge"
    className={twMerge(
      'absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-black select-none pointer-events-none',
      'peer-hover/menu-button:text-black peer-data-[active=true]/menu-button:text-black',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      className,
    )}
    {...props}
  />
)
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

type SidebarMenuSkeletonProps = ComponentProps<'div'> & {
  showIcon?: boolean
}

const SidebarMenuSkeleton: FC<SidebarMenuSkeletonProps> = ({
  className,
  showIcon = false,
  ...props
}) => {
  // Random width between 50 to 90%.
  const width = useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-sidebar="menu-skeleton"
      className={twMerge(
        'rounded-md h-8 flex gap-2 px-2 items-center',
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as CSSProperties
        }
      />
    </div>
  )
}
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

type SidebarMenuSubProps = ComponentProps<'ul'>

const SidebarMenuSub: FC<SidebarMenuSubProps> = ({ className, ...props }) => (
  <ul
    data-sidebar="menu-sub"
    className={twMerge(
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
      className,
    )}
    {...props}
  />
)
SidebarMenuSub.displayName = 'SidebarMenuSub'

type SidebarMenuSubItemProps = ComponentProps<'li'>

const SidebarMenuSubItem: FC<SidebarMenuSubItemProps> = ({ ...props }) => (
  <li {...props} />
)
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

type SidebarMenuSubButtonProps = ComponentProps<'a'> & {
  asChild?: boolean
  size?: 'sm' | 'md'
  isActive?: boolean
}

const SidebarMenuSubButton: FC<SidebarMenuSubButtonProps> = ({
  asChild = false,
  size = 'md',
  isActive,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={twMerge(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-black outline-none hover:bg-black/4 hover:text-black focus-visible:ring-2 active:bg-black/4 active:text-black disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-black',
        'data-[active=true]:bg-black/4 data-[active=true]:text-black',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  type SidebarContentProps,
  type SidebarGroupActionProps,
  type SidebarGroupContentProps,
  type SidebarGroupLabelProps,
  type SidebarGroupProps,
  type SidebarHeaderProps,
  type SidebarInputProps,
  type SidebarInsetProps,
  type SidebarMenuActionProps,
  type SidebarMenuBadgeProps,
  type SidebarMenuButtonProps,
  type SidebarMenuItemProps,
  type SidebarMenuProps,
  type SidebarMenuSkeletonProps,
  type SidebarMenuSubButtonProps,
  type SidebarMenuSubItemProps,
  type SidebarMenuSubProps,
  type SidebarProps,
  type SidebarProviderProps,
  type SidebarRailProps,
  type SidebarSeparatorProps,
  type SidebarTriggerProps,
}
