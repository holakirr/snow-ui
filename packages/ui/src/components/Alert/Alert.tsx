'use client'

import { CloseIcon } from '@holakirr/snow-ui-icons'
import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps, FC, ReactNode } from 'react'
import type { StatusExpanded } from '../../types'
import { slotted } from '../../utils/slot'
import { SlotHost } from '../../utils/slot-host'
import { twMerge } from '../../utils/tw-merge'
import { Button } from '../Button'
import { useMessages } from '../SnowUIProvider'

/**
 * The status of an Alert: `default` (neutral), `info`, `success`, `warning`
 * or `error`.
 */
export type AlertStatus = StatusExpanded

/*
 * The fill is the status's Secondary colour at 16% (Black/4% for `default`),
 * so it tints any surface; `text-secondary` stays at least 5.2:1 on it. The
 * icon is that colour mixed with 40% of `black` (white in dark mode): at
 * least 3.6:1 on the tint in light mode and 5:1 in dark mode, where the
 * Figma colours alone are 1.5–3.4:1 on white. Both are custom properties,
 * so a class can set them: `[--alert-fill:…] [--alert-icon:…]`.
 */
const statusClasses: { [K in AlertStatus]: string } = {
  default:
    '[--alert-fill:var(--color-black-4)] [--alert-icon:var(--color-black)]',
  info: '[--alert-fill:color-mix(in_srgb,var(--color-blue)_16%,transparent)] [--alert-icon:color-mix(in_srgb,var(--color-blue),var(--color-black)_40%)]',
  success:
    '[--alert-fill:color-mix(in_srgb,var(--color-green)_16%,transparent)] [--alert-icon:color-mix(in_srgb,var(--color-green),var(--color-black)_40%)]',
  warning:
    '[--alert-fill:color-mix(in_srgb,var(--color-yellow)_16%,transparent)] [--alert-icon:color-mix(in_srgb,var(--color-yellow),var(--color-black)_40%)]',
  error:
    '[--alert-fill:color-mix(in_srgb,var(--color-red)_16%,transparent)] [--alert-icon:color-mix(in_srgb,var(--color-red),var(--color-black)_40%)]',
}

/*
 * Status glyphs: the "fill" weight of Phosphor's Info, CheckCircle, Warning
 * and WarningCircle (MIT), the icon set of the kit. Only this weight is
 * inlined: importing the icons would ship all six weights of each.
 */
const infoPath =
  'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z'

const statusPaths: { [K in AlertStatus]: string } = {
  default: infoPath,
  info: infoPath,
  success:
    'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z',
  warning:
    'M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z',
  error:
    'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z',
}

const StatusGlyph: FC<{ status: AlertStatus }> = ({ status }) => (
  <svg
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden
    className="size-5"
    data-status-icon={status}
  >
    <path d={statusPaths[status]} />
  </svg>
)

/**
 * Props for the Alert component.
 */
export type AlertProps = ComponentProps<'div'> & {
  /**
   * The status: its colours, icon, screen-reader label and role. `warning`
   * and `error` are `role="alert"` (announced at once), the others
   * `role="status"` (announced when the screen reader is idle); `role`
   * overrides it.
   * @default "default"
   */
  status?: AlertStatus

  /**
   * Replaces the status icon (a 20px icon); `null` or `false` hides it.
   */
  icon?: ReactNode

  /**
   * Screen-reader text read before the content, naming the status; an
   * empty string turns it off.
   * @default messages.alert[status] ("Error"…); none for `default`
   */
  statusLabel?: string

  /**
   * Actions, e.g. a Button: after the text, or under it when the alert is
   * narrow.
   */
  action?: ReactNode

  /**
   * Shows a dismiss button at the end, which calls it. Remove the alert in
   * it, and move the focus somewhere useful (it was on the button).
   */
  onDismiss?: () => void

  /**
   * Accessible name of the dismiss button.
   * @default messages.alert.dismiss: "Dismiss"
   */
  dismissLabel?: string

  /**
   * Render the only child element (e.g. a `<section>`) instead of a
   * `<div>`: it gets the alert's classes and props, and the icon, the
   * actions and the dismiss button go around its own children.
   * @default false
   */
  asChild?: boolean
}

/**
 * Alert (a callout) is a message in the page flow: a tinted card with a
 * status icon, a title, a description, optional actions and a dismiss
 * button. It is a live region (`status` or `alert`, by `status`), so a
 * message that appears is announced.
 */
const Alert: FC<AlertProps> = ({
  status = 'default',
  icon,
  statusLabel,
  action,
  onDismiss,
  dismissLabel,
  asChild = false,
  role,
  className,
  children,
  ...props
}) => {
  const messages = useMessages()
  const label =
    statusLabel ?? (status === 'default' ? undefined : messages.alert[status])
  const showIcon = icon !== null && icon !== false

  const classes = twMerge(
    // Figma "Card" radius (16) and padding (12/16), in the status's tint.
    'flex items-start gap-3 rounded-16 bg-(--alert-fill) px-4 py-3 text-14 text-black',
    statusClasses[status],
    className,
  )

  const renderContent = (content: ReactNode) => (
    <>
      {label && <span className="sr-only">{label}</span>}
      {showIcon && (
        // The height of the title's line, so the icon sits on it.
        <span
          aria-hidden
          className="flex h-5 shrink-0 items-center text-(--alert-icon)"
        >
          {icon ?? <StatusGlyph status={status} />}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-[1_1_16rem] flex-col gap-1">
          {content}
        </div>
        {action && <div className="flex shrink-0 gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <Button
          variant="borderless"
          startContent={<CloseIcon size={16} />}
          onClick={onDismiss}
          // A 24px button on the 20px title line, 12px from the edge.
          className="-my-0.5 -me-1"
        >
          <span className="sr-only">
            {dismissLabel ?? messages.alert.dismiss}
          </span>
        </Button>
      )}
    </>
  )

  const a11yProps = {
    role:
      role ?? (status === 'warning' || status === 'error' ? 'alert' : 'status'),
    'data-status': status,
  }

  if (asChild) {
    const slot = slotted(children, classes, renderContent)
    return (
      <Slot {...a11yProps} {...props} className={slot.className}>
        {slot.child}
      </Slot>
    )
  }

  return (
    <div {...a11yProps} className={classes} {...props}>
      {renderContent(children)}
    </div>
  )
}
Alert.displayName = 'Alert'

/**
 * Props for AlertTitle and AlertDescription.
 */
export type AlertTextProps = ComponentProps<'div'> & {
  /**
   * Render the only child element (a heading, a paragraph) instead of a
   * `<div>`. Its own classes are merged in and win conflicts.
   * @example <AlertTitle asChild><h2>Payment failed</h2></AlertTitle>
   * @default false
   */
  asChild?: boolean
}

/** The title of an Alert: 14 Semibold. */
const AlertTitle: FC<AlertTextProps> = ({ className, ...props }) => (
  <SlotHost
    element="div"
    className={twMerge('text-14 font-semibold text-black', className)}
    {...props}
  />
)
AlertTitle.displayName = 'AlertTitle'

/** The text of an Alert: 14 Regular, `text-secondary`. */
const AlertDescription: FC<AlertTextProps> = ({ className, ...props }) => (
  <SlotHost
    element="div"
    className={twMerge('text-14 text-secondary', className)}
    {...props}
  />
)
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertDescription, AlertTitle }
