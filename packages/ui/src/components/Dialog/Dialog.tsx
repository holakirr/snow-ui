'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  JSX,
  ReactNode,
} from 'react'
import { warnDeprecated } from '../../utils/deprecation'
import { twMerge } from '../../utils/tw-merge'

import { Button } from '../Button'
import { useMessages, useSnowUI } from '../SnowUIProvider'
import { Typography } from '../Text'

const animationClasses =
  'data-[state=open]:scale-100 starting:data-[state=open]:scale-0 data-[state=closed]:scale-0 starting:data-[state=closed]:scale-100 data-[state=closed]:opacity-0 starting:data-[state=closed]:opacity-100 data-[state=open]:opacity-100 starting:data-[state=open]:opacity-0'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay: FC<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
> = ({ className, ...props }) => (
  <DialogPrimitive.Overlay
    className={twMerge(
      // Figma "Mask": a linear gradient (#CBDDFF 50% → #D7D0FF 20%) and
      // "Background blur 40". The Figma dark dashboards use the same raw
      // colours ("Add data", SnowUI-Dark), so the mask doesn't flip.
      'fixed inset-0 z-50 bg-linear-to-t from-[#cbddff]/50 to-[#d7d0ff]/20 data-[state=open]:backdrop-blur-bg-40 starting:data-[state=open]:backdrop-blur-none data-[state=closed]:backdrop-blur-none starting:data-[state=closed]:backdrop-blur-bg-40',
      animationClasses,
      className,
    )}
    {...props}
  />
)

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * The dialog, in a portal. It takes the `dir` of a `SnowUIProvider` (the
 * portal is outside your layout's `dir` scope).
 */
const DialogContent: FC<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
> = ({ className, children, ...props }) => {
  const { dir } = useSnowUI()

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        dir={dir}
        className={twMerge(
          // Figma "Add data": 576px wide, the title row and the popup 28px apart.
          'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 duration-200 gap-7',
          animationClasses,
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

DialogContent.displayName = DialogPrimitive.Content.displayName

type DialogHeaderProps = ComponentProps<'div'> & {
  /**
   * Content before the title (on the left in left-to-right text), in a 40px
   * slot that balances the close button.
   */
  startContent?: ReactNode
  /**
   * @deprecated Use `startContent`, which follows the text direction.
   * `leftContent` will be removed in the next major version.
   */
  leftContent?: JSX.Element
  /**
   * Accessible name of the close button.
   * @default messages.dialog.close: "Close"
   */
  closeLabel?: string
}

const DialogHeader: FC<DialogHeaderProps> = ({
  className,
  startContent,
  leftContent,
  closeLabel,
  children,
  ...props
}) => {
  const messages = useMessages()
  if (leftContent !== undefined) {
    warnDeprecated(
      'DialogHeader:leftContent',
      'DialogHeader: `leftContent` is deprecated and will be removed in the next major version. Use `startContent`, which follows the text direction.',
    )
  }

  return (
    <div
      className={twMerge('flex justify-between items-center px-2', className)}
      {...props}
    >
      <div className="w-10">{startContent ?? leftContent}</div>
      {children}
      <DialogPrimitive.Close asChild>
        <Button variant="gray" size="md" startContent={<CloseIcon size={24} />}>
          <Typography className="sr-only">
            {closeLabel ?? messages.dialog.close}
          </Typography>
        </Button>
      </DialogPrimitive.Close>
    </div>
  )
}

DialogHeader.displayName = 'DialogHeader'

/**
 * The popup card. Its padding is the `--dialog-padding` CSS variable (32px,
 * 80px from the md breakpoint): pass a padding class such as `p-4` to replace
 * it at every breakpoint, or set the variable to keep it responsive.
 */
const DialogBody: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    // Figma "Popup": Background/3 with "Background blur 40", radius 32 and
    // padding 80 (32 below the md breakpoint). The padding reads the
    // --dialog-padding variable, so a padding class replaces it at every
    // breakpoint, and setting the variable changes it responsively.
    className={twMerge(
      'rounded-32 bg-background-3 p-(--dialog-padding) backdrop-blur-bg-40 [--dialog-padding:--spacing(8)] md:[--dialog-padding:--spacing(20)]',
      className,
    )}
    {...props}
  />
)

DialogBody.displayName = 'DialogBody'

const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Title
    className={twMerge(
      'text-48 font-semibold tracking-tight text-center',
      className,
    )}
    {...props}
  />
)

DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription: FC<
  ComponentProps<typeof DialogPrimitive.Description>
> = ({ className, ...props }) => (
  <DialogPrimitive.Description
    className={twMerge('text-14 text-secondary text-center', className)}
    {...props}
  />
)

DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  type DialogHeaderProps,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
