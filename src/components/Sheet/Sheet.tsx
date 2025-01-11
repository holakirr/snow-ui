'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../Button'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

type SheetOverlayProps = SheetPrimitive.DialogOverlayProps

const SheetOverlay: FC<SheetOverlayProps> = ({ className, ...props }) => (
  <SheetPrimitive.Overlay
    className={twMerge(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out',
      className,
    )}
    {...props}
  />
)
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-bg5 p-4 transition-all ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:animate-slide-out-to-top data-[state=open]:animate-slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:animate-slide-out-to-bottom data-[state=open]:animate-slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:animate-slide-out-to-left data-[state=open]:animate-slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:animate-slide-out-to-right data-[state=open]:animate-slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

type SheetContentProps = SheetPrimitive.DialogContentProps &
  VariantProps<typeof sheetVariants>

const SheetContent: FC<SheetContentProps> = ({
  side = 'right',
  className,
  children,
  ...props
}) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      className={twMerge(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitive.Close asChild className="absolute right-4 top-4">
        <Button leftContent={<CloseIcon />}>
          <span className="sr-only">Close</span>
        </Button>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
)
SheetContent.displayName = SheetPrimitive.Content.displayName

type SheetHeaderProps = ComponentProps<'div'>

const SheetHeader: FC<SheetHeaderProps> = ({ className, ...props }) => (
  <div
    className={twMerge(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'

type SheetFooterProps = ComponentProps<'div'>

const SheetFooter: FC<SheetFooterProps> = ({ className, ...props }) => (
  <div
    className={twMerge(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
SheetFooter.displayName = 'SheetFooter'

type SheetTitleProps = SheetPrimitive.DialogTitleProps

const SheetTitle: FC<SheetTitleProps> = ({ className, ...props }) => (
  <SheetPrimitive.Title
    className={twMerge('text-lg font-semibold text-foreground', className)}
    {...props}
  />
)
SheetTitle.displayName = SheetPrimitive.Title.displayName

type SheetDescriptionProps = SheetPrimitive.DialogDescriptionProps

const SheetDescription: FC<SheetDescriptionProps> = ({
  className,
  ...props
}) => (
  <SheetPrimitive.Description
    className={twMerge('text-sm text-muted-foreground', className)}
    {...props}
  />
)
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
  type SheetDescriptionProps,
  type SheetFooterProps,
  type SheetHeaderProps,
  type SheetOverlayProps,
  type SheetTitleProps,
}
