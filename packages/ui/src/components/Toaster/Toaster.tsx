'use client'

import { StatusIcon } from '@holakirr/snow-ui-icons'
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { useToast } from '../../hooks'
import { registerToasterLimit } from '../../hooks/toast-store'
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

/** The gap between expanded toasts (the viewport's `gap-2`). */
const STACK_GAP = 8
/** How far each toast behind the front one shows above it, collapsed. */
const STACK_PEEK = 8
/** How much smaller each toast behind the front one is, collapsed. */
const STACK_SCALE_STEP = 0.05
/** How long the pointer may be off the stack (crossing a gap) before it collapses. */
const COLLAPSE_DELAY = 150

/**
 * How long a toast stays: its own `duration`, else until it is dismissed if
 * it has an action (WCAG 2.2.1: the user gets as long as they need to reach
 * it), else the Toaster's `duration`.
 */
const getDuration = ({
  duration,
  action,
  toasterDuration,
}: {
  duration?: number
  action?: unknown
  toasterDuration: number
}) => duration ?? (action ? Number.POSITIVE_INFINITY : toasterDuration)

/**
 * The Figma toast has no close button: it closes itself. A toast that
 * doesn't (no timeout, the default with an action) gets one by default, so
 * it can be dismissed with a pointer.
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

type Size = { width: number; height: number }

/**
 * Reports the size of a toast while it has its own size (the front toast,
 * or any toast of an expanded stack): collapsed behind the front one, it
 * takes the front one's size.
 */
const useToastSize = (
  id: string,
  measure: boolean,
  onSize: (id: string, size: Size) => void,
) => {
  const ref = useRef<HTMLLIElement>(null)
  const measureRef = useRef(measure)
  measureRef.current = measure

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const report = () => {
      if (!measureRef.current) return
      onSize(id, { width: node.offsetWidth, height: node.offsetHeight })
    }
    report()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(report)
    observer.observe(node)
    return () => observer.disconnect()
  }, [id, onSize])

  // Measures again when the toast gets its own size back.
  useLayoutEffect(() => {
    const node = ref.current
    if (measure && node) {
      onSize(id, { width: node.offsetWidth, height: node.offsetHeight })
    }
  }, [id, measure, onSize])

  return ref
}

export type ToasterProps = {
  /**
   * Shows only the toasts created with `toast({ toasterId: id })`. Without
   * it, the toaster shows the toasts that have no `toasterId`. Use it to run
   * several independent toasters; most apps need one `<Toaster />`.
   */
  id?: string
  /**
   * Time in milliseconds before each toast closes. A toast's own `duration`
   * wins, and a toast with an `action` stays until it is dismissed unless it
   * sets its own `duration`.
   * @default 3000
   */
  duration?: number
  /**
   * The most toasts on screen at once; a new toast over the limit closes the
   * oldest. From 2, the toasts stack: the newest in front, the older ones
   * peeking out above it, smaller, and the stack spreads into a list while
   * the pointer is on it or focus is in it (their timers pause meanwhile).
   * @default 1
   */
  limit?: number
  /**
   * Keeps a stack spread into a list, instead of only while it is hovered
   * or focused.
   * @default false
   */
  expand?: boolean
}

type StackedToastProps = {
  toast: ReturnType<typeof useToast>['toasts'][number]
  toasterDuration: number
  layout: {
    /** 0 for the front toast. */
    index: number
    y: number
    scale: number
    /** Behind the front toast in a collapsed stack: its size and no content. */
    collapsed: boolean
    /** A newer toast is open in front of it (it fades out when it closes). */
    behind: boolean
    zIndex: number
  }
  front?: Size
  onSize: (id: string, size: Size) => void
}

const StackedToast = ({
  toast: {
    id,
    toasterId: _toasterId,
    title,
    description,
    action,
    status,
    size,
    closable,
    duration: toastDuration,
    className,
    style,
    ...props
  },
  toasterDuration,
  layout,
  front,
  onSize,
}: StackedToastProps) => {
  const ref = useToastSize(id, !layout.collapsed, onSize)
  const duration = getDuration({
    duration: toastDuration,
    action,
    toasterDuration,
  })

  return (
    <Toast
      ref={ref}
      size={size}
      status={status}
      duration={duration}
      data-index={layout.index}
      data-front={layout.index === 0 || undefined}
      data-collapsed={layout.collapsed || undefined}
      className={[
        // Stacked at the bottom centre: `mx-auto` with `w-fit` centres it
        // without a transform, which the swipe gesture uses.
        'pointer-events-auto absolute inset-x-0 bottom-4 mx-auto max-w-[calc(100vw-4rem)] origin-bottom [transform:translateY(var(--toast-y))_scale(var(--toast-scale))] md:max-w-[26rem]',
        // Behind the front toast: its size, content hidden.
        '[&>*]:transition-opacity [&[data-collapsed]>*]:opacity-0',
        // Closed while a newer toast is in front of it: fades out in place.
        layout.behind && 'data-[state=closed]:animate-out',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--toast-y': `${layout.y}px`,
          '--toast-scale': layout.scale,
          zIndex: layout.zIndex,
          ...(layout.collapsed && front
            ? { width: front.width, height: front.height }
            : undefined),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
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
      {isClosable({ closable, action, duration }) && <ToastClose size={size} />}
    </Toast>
  )
}

/**
 * Renders the toasts of `toast()`. Render it once (or once per `id`). With
 * `limit` above 1, toasts stack like Sonner's: the newest in front, and the
 * stack spreads into a list on hover and keyboard focus.
 */
export function Toaster({
  id: toasterId,
  duration: toasterDuration = TOAST_DURATION,
  limit: limitProp = 1,
  expand = false,
}: ToasterProps = {}) {
  const { toasts } = useToast()
  const limit = Math.max(1, Math.floor(limitProp))
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [sizes, setSizes] = useState<Record<string, Size>>({})
  const viewportRef = useRef<HTMLOListElement>(null)

  useEffect(() => registerToasterLimit(toasterId, limit), [toasterId, limit])

  // Spreads the stack while the pointer is on it or focus is in it. The
  // toasts are portalled into the viewport, so they are its children in the
  // DOM but not in the React tree: React's events on the viewport wouldn't
  // see them, native listeners do.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    let collapseTimer: ReturnType<typeof setTimeout> | undefined
    const onPointerEnter = () => {
      clearTimeout(collapseTimer)
      setHovered(true)
    }
    // Waits a moment: the pointer crossing the gap between two toasts
    // leaves the stack.
    const onPointerLeave = () => {
      clearTimeout(collapseTimer)
      collapseTimer = setTimeout(() => setHovered(false), COLLAPSE_DELAY)
    }
    const onFocusIn = () => setFocused(true)
    const onFocusOut = (event: FocusEvent) => {
      if (!viewport.contains(event.relatedTarget as Node | null)) {
        setFocused(false)
      }
    }
    viewport.addEventListener('pointerenter', onPointerEnter)
    viewport.addEventListener('pointerleave', onPointerLeave)
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('focusout', onFocusOut)
    return () => {
      clearTimeout(collapseTimer)
      viewport.removeEventListener('pointerenter', onPointerEnter)
      viewport.removeEventListener('pointerleave', onPointerLeave)
      viewport.removeEventListener('focusin', onFocusIn)
      viewport.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const onSize = useCallback((id: string, size: Size) => {
    setSizes((sizes) =>
      sizes[id]?.width === size.width && sizes[id]?.height === size.height
        ? sizes
        : { ...sizes, [id]: size },
    )
  }, [])

  // Newest first, like the store.
  const own = toasts.filter((toast) => toast.toasterId === toasterId)
  const openCount = own.filter((toast) => toast.open !== false).length
  const expanded = expand || hovered || focused

  // A toast removed under the pointer fires no pointerleave: collapse the
  // stack once it is empty.
  useEffect(() => {
    if (openCount === 0) setHovered(false)
  }, [openCount])

  // Forgets the sizes of removed toasts.
  useEffect(() => {
    setSizes((sizes) => {
      const ids = Object.keys(sizes)
      const kept = ids.filter((id) => own.some((toast) => toast.id === id))
      return kept.length === ids.length
        ? sizes
        : Object.fromEntries(kept.map((id) => [id, sizes[id]]))
    })
  })

  const frontId = own.find((toast) => toast.open !== false)?.id
  const front = frontId ? sizes[frontId] : undefined

  let index = 0
  let offset = 0
  const items = own.map((toast, position) => {
    const isOpen = toast.open !== false
    // A closed toast keeps the place behind the open toasts newer than it.
    const layout = {
      index,
      y: expanded ? -offset : -index * STACK_PEEK,
      scale: expanded ? 1 : 1 - index * STACK_SCALE_STEP,
      collapsed: !expanded && index > 0,
      behind: index > 0,
      zIndex: own.length - position,
    }
    if (isOpen) {
      index += 1
      offset += (sizes[toast.id]?.height ?? 0) + STACK_GAP
    }
    return (
      <StackedToast
        key={toast.id}
        toast={toast}
        toasterDuration={toasterDuration}
        layout={layout}
        front={front}
        onSize={onSize}
      />
    )
  })

  return (
    <ToastProvider duration={toasterDuration}>
      {items}
      <ToastViewport
        ref={viewportRef}
        data-expanded={expanded || undefined}
        // The toasts are placed in it absolutely: a full-width strip at the
        // bottom that lets clicks through between them.
        className="inset-x-0 w-full max-w-none translate-x-0 pointer-events-none md:max-w-none"
      />
    </ToastProvider>
  )
}
