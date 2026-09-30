import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { resetDeprecationWarnings } from '../utils/deprecation'
import { normalizeToastLimit, registerToasterLimit } from './toast-store'
import { reducer, toast, useToast } from './use-toast'

const makeToast = (id: string, title = `Toast ${id}`) => ({
  id,
  title,
  open: true,
})

const openTitles = (toasts: { title?: unknown; open?: boolean }[]) =>
  toasts.filter((t) => t.open !== false).map((t) => t.title)

describe('toast reducer (deprecated)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    // Flush the remove queue so module-level timeouts do not leak between tests
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('warns once that it is deprecated', () => {
    resetDeprecationWarnings()
    reducer({ toasts: [] }, { type: 'REMOVE_TOAST' })
    reducer({ toasts: [] }, { type: 'REMOVE_TOAST' })

    expect(console.warn).toHaveBeenCalledOnce()
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '`reducer` export of the toast store is deprecated',
      ),
    )
  })

  it('keeps only the newest toast of a toaster, as in 5.0', () => {
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

describe('toast store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.dismiss()
    })
    act(() => {
      vi.runAllTimers()
    })
    vi.useRealTimers()
  })

  it('closes the oldest toast over the limit of one', () => {
    const unregister = registerToasterLimit(undefined, 1)
    const { result } = renderHook(() => useToast())
    act(() => {
      toast({ title: 'First' })
      toast({ title: 'Second' })
    })

    // Closed rather than dropped, so it can animate out; removed later.
    expect(result.current.toasts.map((t) => [t.title, t.open])).toEqual([
      ['Second', true],
      ['First', false],
    ])
    act(() => {
      vi.runAllTimers()
    })
    expect(result.current.toasts.map((t) => t.title)).toEqual(['Second'])
    unregister()
  })

  it('keeps one toast without a toaster, as in 5.0, and reopens the others when one mounts', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      toast({ title: 'First', toasterId: 'late' })
      toast({ title: 'Second', toasterId: 'late' })
      toast({ title: 'Third', toasterId: 'late' })
    })
    // No <Toaster> yet: the limit of 1 (a custom renderer sees one toast).
    expect(openTitles(result.current.toasts)).toEqual(['Third'])

    // A toaster mounting while they are still in the store brings them back,
    // up to its own limit.
    let unregister = () => {}
    act(() => {
      unregister = registerToasterLimit('late', 2)
    })
    expect(openTitles(result.current.toasts)).toEqual(['Third', 'Second'])
    unregister()
  })

  it("doesn't reopen a toast dismissed before its toaster mounts", () => {
    const { result } = renderHook(() => useToast())
    let first = { dismiss: () => {} }
    act(() => {
      first = toast({ title: 'First', toasterId: 'gone' })
      toast({ title: 'Second', toasterId: 'gone' })
      first.dismiss()
    })
    let unregister = () => {}
    act(() => {
      unregister = registerToasterLimit('gone', 3)
    })
    expect(openTitles(result.current.toasts)).toEqual(['Second'])
    unregister()
  })

  it('keeps the limit of a toaster while another with its id unmounts', () => {
    const { result } = renderHook(() => useToast())
    const first = registerToasterLimit('twin', 3)
    const second = registerToasterLimit('twin', 3)
    first()
    act(() => {
      toast({ title: '1', toasterId: 'twin' })
      toast({ title: '2', toasterId: 'twin' })
    })
    expect(openTitles(result.current.toasts)).toEqual(['2', '1'])
    second()
  })

  it('reads a NaN limit as the default of one, and allows Infinity', () => {
    expect(normalizeToastLimit(Number.NaN)).toBe(1)
    expect(normalizeToastLimit(0)).toBe(1)
    expect(normalizeToastLimit(2.7)).toBe(2)
    expect(normalizeToastLimit(Number.POSITIVE_INFINITY)).toBe(
      Number.POSITIVE_INFINITY,
    )
  })

  it("keeps up to a toaster's registered limit open, newest first", () => {
    const unregister = registerToasterLimit('stack', 3)
    const { result } = renderHook(() => useToast())
    act(() => {
      for (const title of ['1', '2', '3', '4']) {
        toast({ title, toasterId: 'stack' })
      }
      toast({ title: 'Other' })
    })

    expect(openTitles(result.current.toasts)).toEqual(['Other', '4', '3', '2'])

    // A lower limit closes the extra toasts at once.
    let unregisterTwo = () => {}
    act(() => {
      unregister()
      unregisterTwo = registerToasterLimit('stack', 2)
    })
    expect(openTitles(result.current.toasts)).toEqual(['Other', '4', '3'])
    unregisterTwo()
  })
})
