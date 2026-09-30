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
import {
  normalizeToastLimit,
  registerToasterLimit,
} from '../../hooks/toast-store'
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
/**
 * How many toasts a collapsed stack shows: the front one and two behind it.
 * The others wait, hidden, behind the last one (their timers still run).
 */
const STACK_VISIBLE = 3
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
 * takes the front one's size. Reports `null` once Radix has removed it (after
 * its exit animation).
 */
const useToastSize = (
  id: string,
  measure: boolean,
  onSize: (id: string, size: Size | null) => void,
) => {
  const nodeRef = useRef<HTMLLIElement | null>(null)
  const observerRef = useRef<ResizeObserver | undefined>(undefined)
  const measureRef = useRef(measure)
  measureRef.current = measure

  const ref = useCallback(
    (node: HTMLLIElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = undefined
      nodeRef.current = node
      if (!node) {
        onSize(id, null)
        return
      }
      const report = () => {
        if (!measureRef.current) return
        onSize(id, { width: node.offsetWidth, height: node.offsetHeight })
      }
      report()
      if (typeof ResizeObserver === 'undefined') return
      observerRef.current = new ResizeObserver(report)
      observerRef.current.observe(node)
    },
    [id, onSize],
  )

  // Measures again when the toast gets its own size back.
  useLayoutEffect(() => {
    const node = nodeRef.current
    if (measure && node) {
      onSize(id, { width: node.offsetWidth, height: node.offsetHeight })
    }
  }, [id, measure, onSize])

  return ref
}

/**
 * Whether focus came from the keyboard (`:focus-visible`); true where the
 * selector isn't supported.
 */
const isFocusVisible = (target: EventTarget | null) => {
  try {
    return target instanceof Element && target.matches(':focus-visible')
  } catch {
    return true
  }
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
    /** Beyond the visible depth of a collapsed stack. */
    hidden: boolean
    /** Behind another toast: when it closes it fades out in place. */
    behind: boolean
    zIndex: number
  }
  front?: Size
  onSize: (id: string, size: Size | null) => void
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
      data-hidden={layout.hidden || undefined}
      data-behind={layout.behind || undefined}
      className={[
        // Stacked at the bottom centre of the viewport, which is sized to
        // the stack: `mx-auto` centres it without a transform (the swipe
        // gesture uses one), `w-max` keeps its width its own. With reduced
        // motion it moves and resizes at once; only its opacity changes.
        'absolute inset-x-0 bottom-4 mx-auto w-max max-w-[calc(100vw-4rem)] origin-bottom [transform:translateY(var(--toast-y))_scale(var(--toast-scale))] motion-reduce:transition-opacity md:max-w-[26rem]',
        // Behind the front toast: its size, content hidden; deeper than the
        // visible depth, hidden altogether.
        '[&>*]:transition-opacity [&[data-collapsed]>*]:opacity-0 [&[data-hidden]]:opacity-0',
        // Closed behind another toast (pushed out over the limit, timed out,
        // dismissed): fades out in place. The selector outranks the slide
        // down of `Toast`, whose keyframes would move it from the front
        // position to below the stack.
        '[&[data-behind][data-state=closed]]:animate-out',
        // A hidden one just goes: fading from opacity 1 would flash it.
        '[&[data-hidden][data-behind][data-state=closed]]:animate-none',
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
  const limit = normalizeToastLimit(limitProp)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [sizes, setSizes] = useState<Record<string, Size>>({})
  const viewportRef = useRef<HTMLOListElement>(null)
  /** Focus is in the stack, from the keyboard or a click. */
  const focusInside = useRef(false)
  /** Where each toast was last drawn open: a closing toast stays there. */
  const lastLayouts = useRef(new Map<string, StackedToastProps['layout']>())

  // A layout effect: it runs before the passive effects of the page, which
  // may show toasts as they mount (the store keeps them until then).
  useLayoutEffect(
    () => registerToasterLimit(toasterId, limit),
    [toasterId, limit],
  )

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
    // Keyboard focus only: after a click on a toast's close button or
    // action, Radix moves focus to the viewport, which mustn't keep the
    // stack spread once the pointer has left.
    const onFocusIn = (event: FocusEvent) => {
      focusInside.current = true
      setFocused(isFocusVisible(event.target))
    }
    const onFocusOut = (event: FocusEvent) => {
      if (!viewport.contains(event.relatedTarget as Node | null)) {
        focusInside.current = false
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

  const onSize = useCallback((id: string, size: Size | null) => {
    if (!size) lastLayouts.current.delete(id)
    setSizes((sizes) => {
      if (!size) {
        if (!(id in sizes)) return sizes
        const { [id]: _removed, ...rest } = sizes
        return rest
      }
      return sizes[id]?.width === size.width &&
        sizes[id]?.height === size.height
        ? sizes
        : { ...sizes, [id]: size }
    })
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

  // A focused toast removed by the store (over the limit, `dismiss(id)`)
  // takes the focus with it, and some browsers fire no focusout: tell Radix
  // (which paused the timers on any focus) and ourselves that it has left.
  // A layout effect, so it runs before Radix drops its listeners when the
  // last toast goes; the active element of the viewport's own root, so it
  // works in a shadow root.
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!focusInside.current || !viewport) return
    const root = viewport.getRootNode() as Document | ShadowRoot
    const active = root.activeElement
    if (!active || !viewport.contains(active)) {
      viewport.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: active }),
      )
    }
  })

  const frontId = own.find((toast) => toast.open !== false)?.id
  const front = frontId ? sizes[frontId] : undefined

  let index = 0
  let offset = 0
  // The size of the stack as drawn: the viewport wraps it, so its focus
  // outline (F8) and its hover area match the toasts.
  let stackWidth = 0
  let stackHeight = 0
  const items = own.map((toast, position) => {
    const isOpen = toast.open !== false
    const depth = Math.min(index, STACK_VISIBLE - 1)
    const current = {
      index,
      y: expanded ? -offset : -depth * STACK_PEEK,
      scale: expanded ? 1 : 1 - depth * STACK_SCALE_STEP,
      collapsed: !expanded && index > 0,
      hidden: !expanded && index >= STACK_VISIBLE,
      behind: index > 0,
      zIndex: own.length - position,
    }
    // A closing toast stays where it was last drawn (a toast dismissed with
    // the others doesn't jump to the front); it is behind another if it was,
    // or if a newer toast is open in front of it.
    const last = lastLayouts.current.get(toast.id)
    const layout =
      isOpen || !last
        ? current
        : { ...last, behind: last.behind || index > 0, zIndex: current.zIndex }
    if (isOpen) lastLayouts.current.set(toast.id, current)
    const size = sizes[toast.id]
    if (size && !layout.hidden) {
      const drawn = layout.collapsed && front ? front : size
      stackWidth = Math.max(stackWidth, drawn.width)
      stackHeight = Math.max(stackHeight, drawn.height - layout.y)
    }
    if (isOpen) {
      index += 1
      offset += (size?.height ?? 0) + STACK_GAP
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
        // The toasts are placed in it absolutely, so it takes the stack's
        // size (plus its padding) from their measured sizes.
        style={
          stackWidth > 0
            ? {
                width: `calc(${stackWidth}px + 2rem)`,
                height: `calc(${stackHeight}px + 2rem)`,
              }
            : undefined
        }
      />
    </ToastProvider>
  )
}
