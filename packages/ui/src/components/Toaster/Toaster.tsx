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

/**
 * The Figma toast has no close button: it closes itself. A toast that
 * doesn't (no timeout) or that has an action gets one by default, so it can
 * be dismissed with a pointer and the action isn't lost when time runs out.
 */
const isClosable = ({
  closable,
  action,
  duration,
}: {
  closable?: boolean
  action?: unknown
  duration: number
}) => closable ?? (Boolean(action) || duration === Number.POSITIVE_INFINITY)

export type ToasterProps = {
  /**
   * Shows only the toasts created with `toast({ toasterId: id })`. Without
   * it, the toaster shows the toasts that have no `toasterId`. Use it to run
   * several independent toasters; most apps need one `<Toaster />`.
   */
  id?: string
  /**
   * Time in milliseconds before each toast closes. A toast's own `duration`
   * wins.
   * @default 3000
   */
  duration?: number
}

export function Toaster({
  id: toasterId,
  duration = TOAST_DURATION,
}: ToasterProps = {}) {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={duration}>
      {toasts
        .filter((toast) => toast.toasterId === toasterId)
        .map(
          ({
            id,
            toasterId: _toasterId,
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
              {isClosable({
                closable,
                action,
                duration: props.duration ?? duration,
              }) && <ToastClose size={size} />}
            </Toast>
          ),
        )}
      <ToastViewport />
    </ToastProvider>
  )
}
