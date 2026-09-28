'use client'

import { StatusIcon } from '@holakirr/snow-ui-icons'

import { useToast } from '../../hooks'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast'

/** How long a toast stays on screen: "stay 3s" in the Figma Toast guidance. */
const TOAST_DURATION = 3000

export type ToasterProps = {
  /**
   * Time in milliseconds before each toast closes. A toast's own `duration`
   * wins.
   * @default 3000
   */
  duration?: number
}

export function Toaster({ duration = TOAST_DURATION }: ToasterProps = {}) {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={duration}>
      {toasts.map(
        ({
          id,
          title,
          description,
          action,
          status,
          size,
          closable,
          ...props
        }) => (
          <Toast key={id} size={size} {...props}>
            {status && (
              <StatusIcon
                size={size === 'lg' ? 20 : 16}
                status={status}
                className="shrink-0"
              />
            )}
            <div className="grid">
              {title && <ToastTitle size={size}>{title}</ToastTitle>}
              {description && (
                <ToastDescription size={size}>{description}</ToastDescription>
              )}
            </div>
            {action}
            {closable && <ToastClose size={size} />}
          </Toast>
        ),
      )}
      <ToastViewport />
    </ToastProvider>
  )
}
