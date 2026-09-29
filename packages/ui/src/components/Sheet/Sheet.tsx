'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { useDirection } from '@radix-ui/react-direction'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { resolveSide } from '../../utils/direction'
import { twMerge } from '../../utils/tw-merge'
import { Button } from '../Button'
import { useMessages, useSnowUI } from '../SnowUIProvider'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

type SheetOverlayProps = ComponentProps<typeof SheetPrimitive.Overlay>

const SheetOverlay: FC<SheetOverlayProps> = ({ className, ...props }) => (
  <SheetPrimitive.Overlay
    className={twMerge(
      // The Dialog mask: the Figma gradient and "Background blur 40". Figma's
      // dark dashboards use the same raw colours, so it doesn't flip.
      'fixed inset-0 z-50 bg-linear-to-t from-[#cbddff]/50 to-[#d7d0ff]/20 backdrop-blur-bg-40 data-[state=open]:animate-in data-[state=closed]:animate-out',
      className,
    )}
    {...props}
  />
)
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  // A glass panel like the Figma popups (Background/3, "Background blur 40")
  // with the 0.5px Black/10% edge of the dashboard side panels.
  'fixed z-50 gap-4 border-black-10 bg-background-3 p-4 backdrop-blur-bg-40 transition-all ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b-[0.5px] data-[state=closed]:animate-slide-out-to-top data-[state=open]:animate-slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t-[0.5px] data-[state=closed]:animate-slide-out-to-bottom data-[state=open]:animate-slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r-[0.5px] data-[state=closed]:animate-slide-out-to-left data-[state=open]:animate-slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l-[0.5px] data-[state=closed]:animate-slide-out-to-right data-[state=open]:animate-slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

/** The edge a sheet slides in from; `start` / `end` follow the direction. */
export type SheetSide = 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> &
  Omit<VariantProps<typeof sheetVariants>, 'side'> & {
    /**
     * The edge the sheet slides in from. `start` and `end` are the left and
     * right edges in left-to-right text and the other way round in
     * right-to-left text (the `dir` of `SnowUIProvider`).
     * @default "end"
     */
    side?: SheetSide
    /**
     * Accessible name of the close button.
     * @default messages.sheet.close: "Close"
     */
    closeLabel?: string
  }

const SheetContent: FC<SheetContentProps> = ({
  side = 'end',
  closeLabel,
  className,
  children,
  ...props
}) => {
  const messages = useMessages()
  const { dir, theme, contrast } = useSnowUI()
  const direction = useDirection()
  const label = closeLabel ?? messages.sheet.close
  const physicalSide = resolveSide(side, direction)

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        dir={dir}
        data-theme={theme}
        data-contrast={contrast}
        data-side={physicalSide}
        className={twMerge(sheetVariants({ side: physicalSide }), className)}
        {...props}
      >
        <SheetPrimitive.Close
          asChild
          className="absolute end-4 top-4 text-black"
        >
          <Button aria-label={label} startContent={<CloseIcon />}>
            <span className="sr-only">{label}</span>
          </Button>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}
SheetContent.displayName = SheetPrimitive.Content.displayName

type SheetHeaderProps = ComponentProps<'div'>

const SheetHeader: FC<SheetHeaderProps> = ({ className, ...props }) => (
  <div
    className={twMerge(
      'flex flex-col space-y-2 text-center sm:text-start',
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

type SheetTitleProps = ComponentProps<typeof SheetPrimitive.Title>

const SheetTitle: FC<SheetTitleProps> = ({ className, ...props }) => (
  <SheetPrimitive.Title
    className={twMerge('text-18 font-semibold text-black', className)}
    {...props}
  />
)
SheetTitle.displayName = SheetPrimitive.Title.displayName

type SheetDescriptionProps = ComponentProps<typeof SheetPrimitive.Description>

const SheetDescription: FC<SheetDescriptionProps> = ({
  className,
  ...props
}) => (
  <SheetPrimitive.Description
    className={twMerge('text-14 text-secondary', className)}
    {...props}
  />
)
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetClose,
  SheetContent,
  type SheetContentProps,
  SheetDescription,
  type SheetDescriptionProps,
  SheetFooter,
  type SheetFooterProps,
  SheetHeader,
  type SheetHeaderProps,
  SheetOverlay,
  type SheetOverlayProps,
  SheetPortal,
  SheetTitle,
  type SheetTitleProps,
  SheetTrigger,
}
