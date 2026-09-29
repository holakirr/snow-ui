'use client'

// Inspired by react-hot-toast library
import { useEffect, useState } from 'react'
import { warnDeprecated } from '../utils/deprecation'
import {
  ACTION_TYPES,
  type Action,
  dispatch,
  genId,
  getState,
  listeners,
  reduce,
  type State,
  type ToasterToast,
} from './toast-store'

/**
 * The store's reducer.
 *
 * @deprecated Internal, and no longer the reducer of the toast store: it
 * will not be exported in 6.0. Show toasts with `toast()`, read them with
 * `useToast()` and set how many a toaster shows with `<Toaster limit>`. It
 * keeps its 5.0 behaviour: `ADD_TOAST` keeps only the newest toast of each
 * toaster.
 */
export const reducer = (state: State, action: Action): State => {
  warnDeprecated(
    'toast:reducer',
    'The `reducer` export of the toast store is deprecated and will be removed in the next major version. Use `toast()`, `useToast()` and `<Toaster limit>` instead.',
  )
  if (action.type !== ACTION_TYPES.ADD_TOAST) return reduce(state, action)

  // The limit applies per toaster, so toasters don't evict each other.
  const sameToaster = state.toasts.filter(
    (t) => t.toasterId === action.toast.toasterId,
  )
  const otherToasters = state.toasts.filter(
    (t) => t.toasterId !== action.toast.toasterId,
  )
  return {
    ...state,
    toasts: [...[action.toast, ...sameToaster].slice(0, 1), ...otherToasters],
  }
}

type Toast = Omit<ToasterToast, 'id'>

/**
 * Shows a toast in the `<Toaster>` with its `toasterId` (the one without an
 * `id` by default). Returns its `id` and functions to `update` and
 * `dismiss` it. Over the toaster's `limit`, the oldest toast closes.
 */
function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_TOAST,
      toast: { ...props, id },
    })
  const dismiss = () =>
    dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId: id })

  dispatch({
    type: ACTION_TYPES.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * The toasts of every toaster, newest first (closed ones stay for a few
 * seconds, with `open: false`, while they animate out), with `toast()` and
 * `dismiss(id?)` (every toast without an id).
 */
function useToast() {
  const [state, setState] = useState<State>(getState)

  useEffect(() => {
    listeners.push(setState)
    // A toast shown between the first render and this effect.
    setState(getState())
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId }),
  }
}

export { toast, useToast }
