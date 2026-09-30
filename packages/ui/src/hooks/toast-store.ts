// The toast store behind `toast()`, `useToast()` and `<Toaster>`: module
// state shared by every toaster on the page. Internal: `use-toast.ts` is the
// public API.

import type {
  ToastActionElement,
  ToastProps,
} from '../components/Toaster/Toast'

/** How many toasts a toaster shows at once unless its `limit` says otherwise. */
export const DEFAULT_TOAST_LIMIT = 1
/** How long a closed toast stays in the store (its exit animation plays first). */
export const TOAST_REMOVE_DELAY = 3000

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  /**
   * Time in milliseconds before the toast closes (`Number.POSITIVE_INFINITY`
   * keeps it until it is dismissed). Defaults to the `<Toaster>`'s
   * `duration` (3000), or to `Number.POSITIVE_INFINITY` for a toast with an
   * `action`, so the action doesn't vanish before the user reaches it.
   */
  duration?: number
  /**
   * Shows a close button. The Figma toast has none: it closes itself, on
   * swipe or with Escape. Defaults to `true` for toasts with an `action` or
   * an infinite `duration`, `false` otherwise.
   */
  closable?: boolean
  /**
   * The `<Toaster id>` that shows this toast. Toasts without one go to the
   * `<Toaster>` without an `id`. Each toaster keeps its own `limit` of
   * visible toasts.
   */
  toasterId?: string
}

export const ACTION_TYPES = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

type ActionType = typeof ACTION_TYPES

export type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

export interface State {
  toasts: ToasterToast[]
}

let count = 0

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ACTION_TYPES.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * The limits of the mounted `<Toaster>`s, by `id`: one entry per mounted
 * toaster (two can share an `id`); the last one mounted wins.
 */
const toasterLimits = new Map<string | undefined, { limit: number }[]>()

const limitOf = (toasterId: string | undefined) => {
  const entries = toasterLimits.get(toasterId)
  return entries?.[entries.length - 1]?.limit ?? DEFAULT_TOAST_LIMIT
}

/**
 * The toasts closed by the default limit of 1 while no `<Toaster>` had
 * registered theirs (as in 5.0, for toasts rendered without `<Toaster>`). A
 * `<Toaster>` that mounts while they are still in the store (after the
 * effects that showed them, or lazily) reopens them, up to its own limit.
 */
const closedBeforeRegistration = new Set<string>()

/**
 * A `limit` prop as a usable limit: a whole number from 1, `Infinity`
 * allowed; `NaN` (e.g. `Number(undefined)`) is the default, 1.
 */
export const normalizeToastLimit = (limit: number): number =>
  Number.isNaN(limit) ? DEFAULT_TOAST_LIMIT : Math.max(1, Math.floor(limit))

/**
 * Closes the open toasts of a toaster beyond its limit, oldest first
 * (`toasts` is newest first). They play their exit animation, then leave the
 * store like dismissed toasts.
 */
const closeOverLimit = (
  toasts: ToasterToast[],
  toasterId: string | undefined,
): ToasterToast[] => {
  const limit = limitOf(toasterId)
  const registered = toasterLimits.has(toasterId)
  let open = 0
  return toasts.map((t) => {
    if (t.toasterId !== toasterId || t.open === false) return t
    open += 1
    if (open <= limit) return t
    addToRemoveQueue(t.id)
    if (!registered) closedBeforeRegistration.add(t.id)
    return { ...t, open: false }
  })
}

/** Reopens the toasts of a toaster closed before it registered its limit. */
const reopenClosedBeforeRegistration = (
  toasts: ToasterToast[],
  toasterId: string | undefined,
): ToasterToast[] =>
  toasts.map((t) => {
    if (t.toasterId !== toasterId || !closedBeforeRegistration.has(t.id)) {
      return t
    }
    closedBeforeRegistration.delete(t.id)
    clearTimeout(toastTimeouts.get(t.id))
    toastTimeouts.delete(t.id)
    return { ...t, open: true }
  })

/**
 * The reducer of the shared store. `ADD_TOAST` closes the toaster's oldest
 * open toasts over its `limit` instead of dropping them, so they animate out.
 */
export const reduce = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.ADD_TOAST:
      return {
        ...state,
        toasts: closeOverLimit(
          [action.toast, ...state.toasts],
          action.toast.toasterId,
        ),
      }

    case ACTION_TYPES.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case ACTION_TYPES.DISMISS_TOAST: {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
        // Dismissed: a toaster that mounts later doesn't bring it back.
        closedBeforeRegistration.delete(toastId)
      } else {
        for (const toast of state.toasts) {
          addToRemoveQueue(toast.id)
        }
        closedBeforeRegistration.clear()
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case ACTION_TYPES.REMOVE_TOAST:
      if (action.toastId === undefined) {
        closedBeforeRegistration.clear()
        return {
          ...state,
          toasts: [],
        }
      }
      closedBeforeRegistration.delete(action.toastId)
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

export const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

export const getState = (): State => memoryState

export function dispatch(action: Action) {
  memoryState = reduce(memoryState, action)
  for (const listener of listeners) {
    listener(memoryState)
  }
}

/**
 * Sets the limit of the `<Toaster>` with this `id` while it is mounted and
 * closes its toasts over the new limit. Returns the unregister function,
 * which removes only this registration: another mounted toaster with the
 * same `id` keeps its limit.
 */
export const registerToasterLimit = (
  toasterId: string | undefined,
  limit: number,
): (() => void) => {
  const entry = { limit: normalizeToastLimit(limit) }
  toasterLimits.set(toasterId, [...(toasterLimits.get(toasterId) ?? []), entry])
  const next = closeOverLimit(
    reopenClosedBeforeRegistration(memoryState.toasts, toasterId),
    toasterId,
  )
  if (next.some((t, index) => t !== memoryState.toasts[index])) {
    memoryState = { ...memoryState, toasts: next }
    for (const listener of listeners) {
      listener(memoryState)
    }
  }
  return () => {
    const entries = toasterLimits.get(toasterId)?.filter((e) => e !== entry)
    if (entries?.length) toasterLimits.set(toasterId, entries)
    else toasterLimits.delete(toasterId)
  }
}
