import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { toast } from '../../hooks'
import { Toaster } from './Toaster'

const getToast = (title: string) => {
  const node = screen.getByText(title).closest('li')
  if (!node) throw new Error('toast not rendered')
  return node
}

describe('Toaster', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Close and remove every toast so the shared toast store starts empty.
    act(() => {
      vi.runAllTimers()
    })
    vi.useRealTimers()
  })

  it('closes a toast after 3 seconds by default', () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Saved' })
    })

    act(() => {
      vi.advanceTimersByTime(2900)
    })
    expect(getToast('Saved')).toHaveAttribute('data-state', 'open')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    // Radix unmounts a toast once it closes.
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('accepts a custom duration', () => {
    render(<Toaster duration={1000} />)
    act(() => {
      toast({ title: 'Quick' })
    })

    act(() => {
      vi.advanceTimersByTime(900)
    })
    expect(getToast('Quick')).toHaveAttribute('data-state', 'open')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.queryByText('Quick')).not.toBeInTheDocument()
  })

  it('uses the Figma surface, radius and status icon', () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Something Wrong', status: 'error', size: 'lg' })
    })

    const node = getToast('Something Wrong')
    // Static colours: the Figma toast is pinned to SnowUI-Light, so it stays
    // dark in dark mode and the status icons keep their contrast.
    expect(node).toHaveClass(
      'rounded-16',
      'bg-static-black/80',
      'from-static-white/10',
      'text-static-white',
      'backdrop-blur-bg-40',
      'px-3',
      'py-2',
    )
    const icon = screen.getByRole('img', { name: 'Icon for status error' })
    expect(icon).toHaveAttribute('width', '20')
    expect(icon.style.color).toBe('var(--color-yellow, #fc0)')
  })

  it("lets a toast's own duration beat the Toaster's", () => {
    render(<Toaster duration={1000} />)
    act(() => {
      toast({ title: 'Slow', duration: 5000 })
    })

    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(getToast('Slow')).toHaveAttribute('data-state', 'open')

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.queryByText('Slow')).not.toBeInTheDocument()
  })

  it('adds a close button to toasts with an action or no timeout', () => {
    render(<Toaster />)
    act(() => {
      toast({
        title: 'Deleted',
        action: <button type="button">Undo</button>,
      })
    })
    expect(
      within(getToast('Deleted')).getByRole('button', { name: 'Close' }),
    ).toBeInTheDocument()

    act(() => {
      toast({ title: 'Sticky', duration: Number.POSITIVE_INFINITY })
    })
    expect(
      within(getToast('Sticky')).getByRole('button', { name: 'Close' }),
    ).toBeInTheDocument()

    act(() => {
      toast({
        title: 'No close',
        action: <button type="button">Undo</button>,
        closable: false,
      })
    })
    expect(
      within(getToast('No close')).queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument()
  })

  it('renders a close button only for closable toasts', () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Plain' })
    })
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument()

    act(() => {
      toast({ title: 'With close', closable: true })
    })
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('keeps toasters with different ids independent', () => {
    render(
      <>
        <Toaster />
        <Toaster id="sidebar" />
      </>,
    )

    act(() => {
      toast({ title: 'Saved' })
      toast({ title: 'Synced', toasterId: 'sidebar' })
    })

    const [main, sidebar] = screen.getAllByRole('region')
    // Each toaster shows only its own toast, and the per-toaster limit of
    // one doesn't let the second toast evict the first.
    expect(within(main).getByText('Saved')).toBeInTheDocument()
    expect(within(main).queryByText('Synced')).toBeNull()
    expect(within(sidebar).getByText('Synced')).toBeInTheDocument()
    expect(within(sidebar).queryByText('Saved')).toBeNull()

    act(() => {
      toast({ title: 'Saved again' })
    })
    expect(within(main).queryByText('Saved')).toBeNull()
    expect(within(main).getByText('Saved again')).toBeInTheDocument()
    expect(within(sidebar).getByText('Synced')).toBeInTheDocument()
  })
})
