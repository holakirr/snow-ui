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

/** The `limit` of each mounted `<Toaster>`, by its `id`. */
const toasterLimits = new Map<string | undefined, number>()

const limitOf = (toasterId: string | undefined) =>
  toasterLimits.get(toasterId) ?? DEFAULT_TOAST_LIMIT

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
  let open = 0
  return toasts.map((t) => {
    if (t.toasterId !== toasterId || t.open === false) return t
    open += 1
    if (open <= limit) return t
    addToRemoveQueue(t.id)
    return { ...t, open: false }
  })
}

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
      } else {
        for (const toast of state.toasts) {
          addToRemoveQueue(toast.id)
        }
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
        return {
          ...state,
          toasts: [],
        }
      }
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
 * closes its toasts over the new limit. Returns the unregister function.
 */
export const registerToasterLimit = (
  toasterId: string | undefined,
  limit: number,
): (() => void) => {
  toasterLimits.set(toasterId, limit)
  const next = closeOverLimit(memoryState.toasts, toasterId)
  if (next.some((t, index) => t !== memoryState.toasts[index])) {
    memoryState = { ...memoryState, toasts: next }
    for (const listener of listeners) {
      listener(memoryState)
    }
  }
  return () => {
    if (toasterLimits.get(toasterId) === limit) toasterLimits.delete(toasterId)
  }
}
