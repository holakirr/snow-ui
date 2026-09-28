'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { SIMPLE_SIZES } from '../../constants'
import type { SimpleSize, StatusNotify } from '../../types'
import { twMerge } from '../../utils/tw-merge'
import { buttonVariants } from '../Button'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport: FC<
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
> = ({ className, ...props }) => (
  <ToastPrimitives.Viewport
    className={twMerge(
      'fixed bottom-0 z-[100] flex max-h-screen w-[calc(100vw-40px)] md:max-w-md md:w-auto flex-col-reverse items-center gap-2 p-4 left-1/2 -translate-x-1/2',
      className,
    )}
    {...props}
  />
)
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/*
 * Figma Toast: a Black/80% fill under a White/10% overlay (the gradient layer),
 * "Background blur 40", radius 16, White/100% text. The tokens flip in dark
 * mode, so the toast turns light there.
 */
const toastVariants = cva(
  'group relative flex w-fit max-w-full items-center justify-between overflow-hidden rounded-16 bg-black-80 bg-linear-to-r from-white-10 to-white-10 backdrop-blur-bg-40 text-white transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:animate-slide-out-to-bottom data-[state=open]:animate-slide-in-from-bottom',
  {
    variants: {
      size: {
        // Figma Big: padding 8/12, gap 8, text 14/20.
        lg: 'gap-2 px-3 py-2 text-14',
        // Figma small: padding 4/8, gap 4, text 12/16.
        sm: 'gap-1 px-2 py-1 text-12',
      },
    },
    defaultVariants: {
      size: SIMPLE_SIZES.sm,
    },
  },
)

type ToastProps = ComponentProps<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants> & {
    size?: SimpleSize
    status?: StatusNotify
  }

const Toast: FC<ToastProps> = ({ className, size, ...props }) => (
  <ToastPrimitives.Root
    className={twMerge(toastVariants({ size }), className)}
    {...props}
  />
)

Toast.displayName = ToastPrimitives.Root.displayName

type ToastActionProps = ComponentProps<typeof ToastPrimitives.Action> & {
  size?: SimpleSize
}

const ToastAction: FC<ToastActionProps> = ({ className, size, ...props }) => (
  <ToastPrimitives.Action
    className={twMerge(buttonVariants({ variant: 'filled', size }), className)}
    {...props}
  />
)
ToastAction.displayName = ToastPrimitives.Action.displayName

const toastCloseStyles = cva(
  'shrink-0 cursor-pointer rounded-8 text-white-80 transition-colors hover:text-white focus:outline-hidden focus-visible:ring-4 focus-visible:ring-focus',
  {
    variants: {
      size: {
        lg: 'p-0.5',
        sm: 'p-0',
      },
    },
    defaultVariants: {
      size: SIMPLE_SIZES.sm,
    },
  },
)

type ToastCloseProps = ComponentProps<typeof ToastPrimitives.Close> &
  VariantProps<typeof toastCloseStyles> & {
    size?: SimpleSize
  }

const ToastClose: FC<ToastCloseProps> = ({ className, size, ...props }) => (
  <ToastPrimitives.Close
    className={twMerge(toastCloseStyles({ size }), className)}
    toast-close
    aria-label="Close"
    {...props}
  >
    <CloseIcon size={16} />
  </ToastPrimitives.Close>
)
ToastClose.displayName = ToastPrimitives.Close.displayName

const toastTitleStyles = cva('font-normal', {
  variants: {
    size: {
      lg: 'text-14',
      sm: 'text-12',
    },
  },
  defaultVariants: {
    size: SIMPLE_SIZES.sm,
  },
})

type ToastTitleProps = ComponentProps<typeof ToastPrimitives.Title> &
  VariantProps<typeof toastTitleStyles> & {
    size?: SimpleSize
  }

const ToastTitle: FC<ToastTitleProps> = ({ className, size, ...props }) => (
  <ToastPrimitives.Title
    className={twMerge(toastTitleStyles({ size }), className)}
    {...props}
  />
)
ToastTitle.displayName = ToastPrimitives.Title.displayName

const toastDescriptionStyles = cva('text-white-80', {
  variants: {
    size: {
      lg: 'text-14',
      sm: 'text-12',
    },
  },
  defaultVariants: {
    size: SIMPLE_SIZES.sm,
  },
})

type ToastDescriptionProps = ComponentProps<
  typeof ToastPrimitives.Description
> &
  VariantProps<typeof toastDescriptionStyles> & {
    size?: SimpleSize
  }

const ToastDescription: FC<ToastDescriptionProps> = ({
  className,
  size,
  ...props
}) => (
  <ToastPrimitives.Description
    className={twMerge(toastDescriptionStyles({ size }), className)}
    {...props}
  />
)
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  Toast,
  ToastAction,
  type ToastActionElement,
  type ToastActionProps,
  ToastClose,
  type ToastCloseProps,
  ToastDescription,
  type ToastDescriptionProps,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  type ToastTitleProps,
  ToastViewport,
}
