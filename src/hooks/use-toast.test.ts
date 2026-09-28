import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { reducer, useToast } from './use-toast'

const makeToast = (id: string, title = `Toast ${id}`) => ({
  id,
  title,
  open: true,
})

describe('toast reducer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Flush the remove queue so module-level timeouts do not leak between tests
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('adds a toast respecting the limit', () => {
    let state = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: makeToast('1') },
    )
    expect(state.toasts).toHaveLength(1)

    state = reducer(state, { type: 'ADD_TOAST', toast: makeToast('2') })
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0].id).toBe('2')
  })

  it('updates a toast by id', () => {
    const state = reducer(
      { toasts: [makeToast('1')] },
      { type: 'UPDATE_TOAST', toast: { id: '1', title: 'Updated' } },
    )

    expect(state.toasts[0]).toMatchObject({
      id: '1',
      title: 'Updated',
      open: true,
    })
  })

  it('dismisses a toast by closing it', () => {
    const state = reducer(
      { toasts: [makeToast('1')] },
      { type: 'DISMISS_TOAST', toastId: '1' },
    )

    expect(state.toasts[0].open).toBe(false)
  })

  it('dismisses all toasts when no id is given', () => {
    const state = reducer(
      { toasts: [makeToast('1'), makeToast('2')] },
      { type: 'DISMISS_TOAST' },
    )

    expect(state.toasts.every((t) => t.open === false)).toBe(true)
  })

  it('removes a toast by id or all toasts', () => {
    const initial = { toasts: [makeToast('1'), makeToast('2')] }

    expect(
      reducer(initial, { type: 'REMOVE_TOAST', toastId: '1' }).toasts,
    ).toEqual([makeToast('2')])
    expect(reducer(initial, { type: 'REMOVE_TOAST' }).toasts).toEqual([])
  })
})

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds, updates, dismisses and removes a toast', () => {
    const { result } = renderHook(() => useToast())

    let handle: ReturnType<typeof result.current.toast> | undefined
    act(() => {
      handle = result.current.toast({ title: 'Hello' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Hello',
      open: true,
    })

    act(() => {
      if (handle) handle.update({ id: handle.id, title: 'Updated' })
    })
    expect(result.current.toasts[0].title).toBe('Updated')

    act(() => {
      handle?.dismiss()
    })
    expect(result.current.toasts[0].open).toBe(false)

    act(() => {
      vi.runAllTimers()
    })
    expect(result.current.toasts).toHaveLength(0)
  })
})
