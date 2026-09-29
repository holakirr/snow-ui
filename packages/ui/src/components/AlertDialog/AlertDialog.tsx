'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import type { ComponentProps, ComponentPropsWithoutRef, FC } from 'react'
import type { ButtonVariant } from '../../types'
import { twMerge } from '../../utils/tw-merge'
import { Button, type ButtonProps } from '../Button'
import {
  dialogMotionClasses,
  dialogOverlayClasses,
  dialogPopupClasses,
  dialogPositionClasses,
} from '../Dialog/styles'
import { useMessages, useSnowUI } from '../SnowUIProvider'

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * The Dialog's mask: the Figma gradient with "Background blur 40". A click
 * on it doesn't close an alert dialog, and doesn't take the focus out of it
 * either.
 */
const AlertDialogOverlay: FC<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
> = ({ className, onMouseDown, ...props }) => (
  <AlertDialogPrimitive.Overlay
    className={twMerge(dialogOverlayClasses, dialogMotionClasses, className)}
    onMouseDown={(event) => {
      onMouseDown?.(event)
      // Focus would move to <body>, outside the dialog's focus trap.
      event.preventDefault()
    }}
    {...props}
  />
)
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * The `role="alertdialog"` card, in a portal over the Dialog's mask: the
 * Dialog's popup (Background/3, "Background blur 40", radius 32) with 32px
 * padding, 448px wide at most. It takes the `dir` of a `SnowUIProvider`.
 * Opening focuses `AlertDialogCancel`; a click on the mask doesn't close it.
 */
const AlertDialogContent: FC<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
> = ({ className, ...props }) => {
  const { dir } = useSnowUI()

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        dir={dir}
        className={twMerge(
          dialogPositionClasses,
          dialogPopupClasses,
          // The text and the actions 28px apart, like the Dialog's title row
          // and popup.
          'flex max-w-md flex-col gap-7 p-8',
          dialogMotionClasses,
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/** Stacks the title and the description, centred. */
const AlertDialogHeader: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => (
  <div
    className={twMerge('flex flex-col gap-2 text-center', className)}
    {...props}
  />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

/**
 * The actions, 16px apart: side by side at equal widths, or stacked when
 * they don't fit at 160px each (a phone), the last one (the main action)
 * on top.
 */
const AlertDialogFooter: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => (
  <div
    className={twMerge(
      'flex flex-wrap-reverse gap-4 *:flex-[1_1_10rem]',
      className,
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

/** 24 Semibold. It names the dialog. */
const AlertDialogTitle: FC<
  ComponentProps<typeof AlertDialogPrimitive.Title>
> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Title
    className={twMerge('text-24 font-semibold text-black', className)}
    {...props}
  />
)
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/** 14 Regular, `text-secondary`. It describes the dialog. */
const AlertDialogDescription: FC<
  ComponentProps<typeof AlertDialogPrimitive.Description>
> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Description
    className={twMerge('text-14 text-secondary', className)}
    {...props}
  />
)
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/*
 * Destructive: `red-text` (#D42020; #FF8080 in dark mode) with the per-mode
 * `white` label, 5.21:1 in light mode and 8.65:1 in dark mode. Figma's
 * Secondary/Red under a white label would be 3.36:1. On hover it mixes 15%
 * of `black` in (white in dark mode), which keeps the label contrast up.
 */
const destructiveClasses =
  'bg-red-text hover:bg-[color-mix(in_srgb,var(--color-red-text),var(--color-black)_15%)]'

/**
 * Props for AlertDialogAction.
 */
export type AlertDialogActionProps = Omit<ButtonProps, 'variant'> & {
  /**
   * A Button variant, or `destructive`: a red Filled button for an action
   * that deletes something or can't be undone.
   * @default "filled"
   */
  variant?: ButtonVariant | 'destructive'
}

/**
 * The action that confirms, a Button (`lg`, Filled by default) that closes
 * the dialog. Run the action in its `onClick`; `event.preventDefault()`
 * there keeps the dialog open.
 */
const AlertDialogAction: FC<AlertDialogActionProps> = ({
  variant = 'filled',
  size = 'lg',
  className,
  ...props
}) => (
  <AlertDialogPrimitive.Action asChild>
    <Button
      variant={variant === 'destructive' ? 'filled' : variant}
      size={size}
      data-variant={variant}
      className={twMerge(
        variant === 'destructive' && destructiveClasses,
        className,
      )}
      {...props}
    />
  </AlertDialogPrimitive.Action>
)
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/**
 * The way out, a Button (`lg`, Gray by default) that closes the dialog. It
 * gets the focus when the dialog opens. Without children or a `label` it
 * reads "Cancel" (`messages.alertDialog.cancel`).
 */
const AlertDialogCancel: FC<ButtonProps> = ({
  variant = 'gray',
  size = 'lg',
  label,
  children,
  ...props
}) => {
  const messages = useMessages()

  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button variant={variant} size={size} label={label} {...props}>
        {children ??
          (label === undefined ? messages.alertDialog.cancel : undefined)}
      </Button>
    </AlertDialogPrimitive.Cancel>
  )
}
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
