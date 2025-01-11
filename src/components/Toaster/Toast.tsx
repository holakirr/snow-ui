'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { SIMPLE_SIZES } from '../../constants'
import type { SimpleSize, StatusNotify } from '../../types'
import { buttonStyles } from '../Button'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport: FC<
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
> = ({ className, ...props }) => (
  <ToastPrimitives.Viewport
    className={twMerge(
      'fixed bottom-0 z-[100] flex max-h-screen w-[calc(100vw-40px)] md:max-w-md md:w-auto flex-col-reverse gap-2 p-4 left-1/2 -translate-x-1/2',
      className,
    )}
    {...props}
  />
)
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group relative flex gap-2 w-full items-center justify-between overflow-hidden transition-all bg-black/80 rounded text-white data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:animate-out data-[state=closed]:animate-slide-out-to-bottom data-[state=open]:animate-slide-in-from-bottom',
  {
    variants: {
      size: {
        lg: 'px-4 py-2 pr-8 rounded-lg',
        sm: 'px-2 py-1 pr-6 rounded',
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
    className={twMerge(buttonStyles({ variant: 'filled', size }), className)}
    {...props}
  />
)
ToastAction.displayName = ToastPrimitives.Action.displayName

const toastCloseStyles = cva(
  'absolute p-1 cursor-pointer opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100',
  {
    variants: {
      size: {
        lg: 'right-1 top-1',
        sm: 'right-0 top-0',
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
    {...props}
  >
    <CloseIcon size={16} />
  </ToastPrimitives.Close>
)
ToastClose.displayName = ToastPrimitives.Close.displayName

const toastTitleStyles = cva('font-semibold', {
  variants: {
    size: {
      lg: 'text-sm',
      sm: 'text-xs',
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

const toastDescriptionStyles = cva('', {
  variants: {
    size: {
      lg: 'text-sm',
      sm: 'text-xs',
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
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
}
