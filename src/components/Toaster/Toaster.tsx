'use client'

import { StatusIcon } from '@holakirr/snow-ui-icons'
import { useToast } from '../../hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(
        ({ id, title, description, action, status, size, ...props }) => (
          <Toast key={id} size={size} {...props}>
            <div
              className={`flex items-center ${size === 'lg' ? 'gap-2' : 'gap-1'}`}
            >
              {status && (
                <StatusIcon size={size === 'lg' ? 24 : 16} status={status} />
              )}
              <div className={`grid ${size === 'lg' && 'gap-1'}`}>
                {title && <ToastTitle size={size}>{title}</ToastTitle>}
                {description && (
                  <ToastDescription size={size}>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose size={size} />
          </Toast>
        ),
      )}
      <ToastViewport />
    </ToastProvider>
  )
}
