'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentProps, FC, JSX, ReactNode } from 'react'
import { warnDeprecated } from '../../utils/deprecation'
import { twMerge } from '../../utils/tw-merge'

import { Button } from '../Button'
import { useMessages, useSnowUI } from '../SnowUIProvider'
import { Typography } from '../Text'
import {
  dialogMotionClasses,
  dialogOverlayClasses,
  dialogPopupClasses,
  dialogPositionClasses,
} from './styles'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay: FC<ComponentProps<typeof DialogPrimitive.Overlay>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Overlay
    className={twMerge(dialogOverlayClasses, dialogMotionClasses, className)}
    {...props}
  />
)

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * The dialog, in a portal. It takes the `dir` and the `theme` of a
 * `SnowUIProvider` or `ThemeScope` (the portal is outside your layout's
 * `dir` and `data-theme` scopes).
 */
const DialogContent: FC<ComponentProps<typeof DialogPrimitive.Content>> = ({
  className,
  children,
  ...props
}) => {
  const { dir, theme, contrast } = useSnowUI()

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        dir={dir}
        data-theme={theme}
        data-contrast={contrast}
        className={twMerge(
          dialogPositionClasses,
          // Figma "Add data": 576px wide, the title row and the popup 28px apart.
          'grid max-w-xl gap-7',
          dialogMotionClasses,
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
   * Content before the title (on the left in left-to-right text), in a slot
   * at least 40px wide that balances the close button. The Figma "Add data"
   * dialog puts a 48px icon there: the Add glyph at 36×36 in a 48px box.
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
      {/* At least 40px, the close button's width; it widens for larger
          content, such as the Figma "Add data" 48px icon. */}
      <div className="min-w-10">{startContent ?? leftContent}</div>
      {children}
      <DialogPrimitive.Close asChild>
        {/* Figma "Close": Button Medium "Gray", icon-only (padding 8, radius
            12, 40px), with the kit's Close icon (an 11px X in a 24px box). */}
        <Button
          variant="gray"
          size="md"
          className="rounded-12"
          startContent={<CloseIcon size={24} />}
        >
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
    // Figma "Popup", with padding 80 (32 below the md breakpoint). The
    // padding reads the --dialog-padding variable, so a padding class
    // replaces it at every breakpoint, and setting the variable changes it
    // responsively.
    className={twMerge(
      dialogPopupClasses,
      'p-(--dialog-padding) [--dialog-padding:--spacing(8)] md:[--dialog-padding:--spacing(20)]',
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
