'use client'

import { SidebarSimple } from '@phosphor-icons/react/dist/csr/SidebarSimple'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIsMobile } from '../../hooks'
import { twMerge } from '../../utils/tw-merge'
import { Button, type ButtonProps } from '../Button'
import { Input, type InputProps } from '../Input'
import { Separator, type SeparatorProps } from '../Separator'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../Sheet'
import { Skeleton } from '../Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../Tooltip'

const SIDEBAR_COOKIE_NAME = 'sidebar:state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
// Figma Sidebar: 212px wide.
const SIDEBAR_WIDTH = '13.25rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
// A 36px menu button plus 8px on each side.
const SIDEBAR_WIDTH_ICON = '3.25rem'
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

/**
 * Reads the persisted sidebar state from the cookie (client only).
 */
const readSidebarCookie = (): boolean | undefined => {
  if (typeof document === 'undefined') return undefined
  const value = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    ?.split('=')[1]
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
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
  const [_open, _setOpen] = useState(() => readSidebarCookie() ?? defaultOpen)
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
      // biome-ignore lint/suspicious/noDocumentCookie: it's necessary to set the cookie
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  // Helper to toggle the sidebar.
  // biome-ignore lint/correctness/useExhaustiveDependencies: it's necessary to use setOpen and setOpenMobile in the callback
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's necessary to use setOpen and setOpenMobile in the callback
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
            'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-background-2',
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
          'flex h-full w-(--sidebar-width) flex-col border-black-10 bg-transparent py-2 text-black',
          side === 'left' ? 'border-r-[0.5px]' : 'border-l-[0.5px]',
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
          className="w-(--sidebar-width) bg-background-1 p-0 py-2 text-black [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as CSSProperties
          }
          side={side}
        >
          <SheetTitle className="sr-only">Sidebar</SheetTitle>
          <SheetDescription className="sr-only">
            Displays the mobile sidebar.
          </SheetDescription>
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
          'duration-200 relative h-svh w-(--sidebar-width) bg-transparent transition-[width] ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        className={twMerge(
          'duration-200 fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
            : // Figma: a 0.5px Black/10% stroke on the inner edge.
              'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r-[0.5px] group-data-[side=right]:border-l-[0.5px] border-black-10',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          // Figma: no fill, the sidebar sits on the page background.
          className="flex h-full w-full flex-col bg-transparent py-2 group-data-[variant=floating]:rounded-16 group-data-[variant=floating]:border-[0.5px] group-data-[variant=floating]:border-black-10 group-data-[variant=floating]:bg-background-1"
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
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-black-10 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-background-1',
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
      'relative flex min-h-svh flex-1 flex-col bg-background-1',
      'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-12',
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
    className={twMerge('h-8 w-full py-1.5', className)}
    {...props}
  />
)

SidebarInput.displayName = 'SidebarInput'

type SidebarHeaderProps = ComponentProps<'div'>

const SidebarHeader: FC<SidebarHeaderProps> = ({ className, ...props }) => (
  <div
    data-sidebar="header"
    className={twMerge(
      'flex flex-col gap-2 px-4 py-2 group-data-[collapsible=icon]:px-2',
      className,
    )}
    {...props}
  />
)
SidebarHeader.displayName = 'SidebarHeader'

type SidebarFooterProps = ComponentProps<'div'>

const SidebarFooter: FC<SidebarFooterProps> = ({ className, ...props }) => (
  <div
    data-sidebar="footer"
    className={twMerge(
      'flex flex-col gap-2 px-4 py-2 group-data-[collapsible=icon]:px-2',
      className,
    )}
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
    className={twMerge('mx-4 w-auto', className)}
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
    className={twMerge(
      'relative flex w-full min-w-0 flex-col px-4 py-2 group-data-[collapsible=icon]:px-2',
      className,
    )}
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
        // Figma section heading: 14 Regular, padding 4/12, radius 12. Black/80%
        // instead of Figma's Black/40% (2.85:1) for a 4.5:1 text contrast.
        'duration-200 flex h-7 shrink-0 items-center rounded-12 px-3 text-14 font-normal text-black-80 outline-none transition-[margin,opacity] ease-linear focus-visible:ring-4 focus-visible:ring-focus [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:-mt-7 group-data-[collapsible=icon]:opacity-0',
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
        'absolute right-5 top-3 flex aspect-square w-5 items-center justify-center rounded-8 p-0 text-black outline-none transition-transform hover:bg-black-4 hover:text-black focus-visible:ring-4 focus-visible:ring-focus [&>svg]:size-4 [&>svg]:shrink-0',
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
    className={twMerge('w-full text-14', className)}
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

/*
 * Figma nav item ("Frame"): padding 8, radius 12, 14 Regular text, 20px icons,
 * a Black/4% fill on hover and on the active item.
 */
const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-12 p-2 text-left text-black text-14 font-normal outline-none transition-[width,height,padding] hover:bg-black-4 focus-visible:ring-4 focus-visible:ring-focus active:bg-black-4 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-black-4 data-[state=open]:hover:bg-black-4 group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        outline:
          'bg-background-1 inset-ring-[0.5px] inset-ring-black-10 hover:bg-black-4',
      },
      size: {
        default: 'h-9 text-14',
        sm: 'h-7 text-12',
        lg: 'h-12 text-14 group-data-[collapsible=icon]:!p-0',
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
        'absolute right-2 top-2 flex aspect-square w-5 items-center justify-center rounded-8 p-0 text-black outline-none transition-transform hover:bg-black-4 hover:text-black focus-visible:ring-4 focus-visible:ring-focus peer-hover/menu-button:text-black [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-2',
        'peer-data-[size=lg]/menu-button:top-3.5',
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
      'absolute right-2 flex h-5 min-w-5 items-center justify-center rounded-8 px-1 text-12 font-normal tabular-nums text-black select-none pointer-events-none',
      'peer-hover/menu-button:text-black peer-data-[active=true]/menu-button:text-black',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-2',
      'peer-data-[size=lg]/menu-button:top-3.5',
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
        'rounded-12 h-9 flex gap-2 px-2 items-center',
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-5 rounded-8"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-(--skeleton-width)"
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
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-black-10 px-2.5 py-0.5',
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
        'flex h-9 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-12 px-2 font-normal text-black outline-none hover:bg-black-4 hover:text-black focus-visible:ring-4 focus-visible:ring-focus active:bg-black-4 active:text-black disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-black',
        'data-[active=true]:bg-black-4 data-[active=true]:text-black',
        size === 'sm' && 'h-7 text-12',
        size === 'md' && 'text-14',
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
  type SidebarContentProps,
  SidebarFooter,
  type SidebarFooterProps,
  SidebarGroup,
  SidebarGroupAction,
  type SidebarGroupActionProps,
  SidebarGroupContent,
  type SidebarGroupContentProps,
  SidebarGroupLabel,
  type SidebarGroupLabelProps,
  type SidebarGroupProps,
  SidebarHeader,
  type SidebarHeaderProps,
  SidebarInput,
  type SidebarInputProps,
  SidebarInset,
  type SidebarInsetProps,
  SidebarMenu,
  SidebarMenuAction,
  type SidebarMenuActionProps,
  SidebarMenuBadge,
  type SidebarMenuBadgeProps,
  SidebarMenuButton,
  type SidebarMenuButtonProps,
  SidebarMenuItem,
  type SidebarMenuItemProps,
  type SidebarMenuProps,
  SidebarMenuSkeleton,
  type SidebarMenuSkeletonProps,
  SidebarMenuSub,
  SidebarMenuSubButton,
  type SidebarMenuSubButtonProps,
  SidebarMenuSubItem,
  type SidebarMenuSubItemProps,
  type SidebarMenuSubProps,
  type SidebarProps,
  SidebarProvider,
  type SidebarProviderProps,
  SidebarRail,
  type SidebarRailProps,
  SidebarSeparator,
  type SidebarSeparatorProps,
  SidebarTrigger,
  type SidebarTriggerProps,
  useSidebar,
}
