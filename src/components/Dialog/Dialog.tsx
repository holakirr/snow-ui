'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentProps, ComponentPropsWithoutRef, FC, JSX } from 'react'
import { twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Text } from '../Text'

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
      'fixed inset-0 z-50 bg-linear-to-t from-[#cbddff]/50 to-[#d7d0ff]/20 data-[state=open]:backdrop-blur-xs starting:data-[state=open]:backdrop-blur-none data-[state=closed]:backdrop-blur-none starting:data-[state=closed]:backdrop-blur-xs',
      animationClasses,
      className,
    )}
    {...props}
  />
)

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent: FC<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
> = ({ className, children, ...props }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={twMerge(
        'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 duration-200 gap-7',
        animationClasses,
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
)

DialogContent.displayName = DialogPrimitive.Content.displayName

type DialogHeaderProps = ComponentProps<'div'> & {
  leftContent?: JSX.Element
}

const DialogHeader: FC<DialogHeaderProps> = ({
  className,
  leftContent,
  children,
  ...props
}) => (
  <div
    className={twMerge('flex justify-between items-center px-2', className)}
    {...props}
  >
    <div className="w-10">{leftContent}</div>
    {children}
    <DialogPrimitive.Close asChild>
      <Button variant="gray" size="md" leftContent={<CloseIcon size={24} />}>
        <Text className="sr-only">Close</Text>
      </Button>
    </DialogPrimitive.Close>
  </div>
)

DialogHeader.displayName = 'DialogHeader'

const DialogBody: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={twMerge('bg-bg1 p-10 rounded-4xl', className)} {...props} />
)

DialogBody.displayName = 'DialogBody'

const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Title
    className={twMerge(
      'text-5xl font-semibold leading-none tracking-tight text-center',
      className,
    )}
    {...props}
  />
)

DialogTitle.displayName = DialogPrimitive.Title.displayName

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
