import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { toast, useToast } from '../../hooks'
import { Toaster } from './Toaster'

const getToast = (title: string) => {
  const node = screen.getByText(title).closest('li')
  if (!node) throw new Error('toast not rendered')
  return node
}

const undo = <button type="button">Undo</button>

describe('Toaster', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Close and remove every toast, including those without a timeout, so
    // the shared toast store starts empty.
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.dismiss()
    })
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

  it('keeps a toast with an action until it is dismissed (WCAG 2.2.1)', () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Deleted', action: undo })
    })

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(getToast('Deleted')).toHaveAttribute('data-state', 'open')

    fireEvent.click(
      within(getToast('Deleted')).getByRole('button', { name: 'Close' }),
    )
    act(() => {
      vi.runAllTimers()
    })
    expect(screen.queryByText('Deleted')).not.toBeInTheDocument()
  })

  it("doesn't apply the Toaster's duration to toasts with an action", () => {
    render(<Toaster duration={1000} />)
    act(() => {
      toast({ title: 'Archived', action: undo })
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(getToast('Archived')).toHaveAttribute('data-state', 'open')
  })

  it('lets a toast with an action set its own duration', () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Moved', action: undo, duration: 8000 })
    })

    act(() => {
      vi.advanceTimersByTime(7900)
    })
    expect(getToast('Moved')).toHaveAttribute('data-state', 'open')
    // It still gets the close button.
    expect(
      within(getToast('Moved')).getByRole('button', { name: 'Close' }),
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.queryByText('Moved')).not.toBeInTheDocument()
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

describe('Toaster limit and stacking', () => {
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

  const viewport = () => {
    const node = screen.getByRole('region').querySelector('ol')
    if (!node) throw new Error('no viewport')
    return node
  }

  const show = (...titles: string[]) =>
    act(() => {
      for (const title of titles) toast({ title })
    })

  it('shows up to `limit` toasts, the newest in front, and closes the oldest', () => {
    render(<Toaster limit={3} />)
    show('One', 'Two', 'Three', 'Four')

    expect(screen.queryByText('One')).not.toBeInTheDocument()
    expect(getToast('Four')).toHaveAttribute('data-front')
    expect(getToast('Four')).toHaveAttribute('data-index', '0')
    expect(getToast('Three')).toHaveAttribute('data-index', '1')
    expect(getToast('Two')).toHaveAttribute('data-index', '2')
    expect(getToast('Two')).not.toHaveAttribute('data-front')
  })

  it('collapses the toasts behind the front one: higher, smaller, no content', () => {
    render(<Toaster limit={3} />)
    show('One', 'Two')

    const front = getToast('Two')
    const behind = getToast('One')
    expect(front).not.toHaveAttribute('data-collapsed')
    expect(front.style.getPropertyValue('--toast-y')).toBe('0px')
    expect(behind).toHaveAttribute('data-collapsed')
    expect(behind.style.getPropertyValue('--toast-y')).toBe('-8px')
    expect(behind.style.getPropertyValue('--toast-scale')).toBe('0.95')
    expect(Number(front.style.zIndex)).toBeGreaterThan(
      Number(behind.style.zIndex),
    )
    expect(viewport()).not.toHaveAttribute('data-expanded')
  })

  it('spreads the stack into a list while it is hovered', () => {
    render(<Toaster limit={3} />)
    show('One', 'Two')

    fireEvent.pointerEnter(viewport())
    expect(viewport()).toHaveAttribute('data-expanded')
    expect(getToast('One')).not.toHaveAttribute('data-collapsed')
    expect(getToast('One').style.getPropertyValue('--toast-scale')).toBe('1')

    // It stays spread while the pointer crosses the gap between two toasts…
    fireEvent.pointerLeave(viewport())
    act(() => {
      vi.advanceTimersByTime(100)
    })
    fireEvent.pointerEnter(viewport())
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(viewport()).toHaveAttribute('data-expanded')

    // …and collapses once it has left.
    fireEvent.pointerLeave(viewport())
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(viewport()).not.toHaveAttribute('data-expanded')
    expect(getToast('One')).toHaveAttribute('data-collapsed')
  })

  it('spreads the stack while focus is in it, and with `expand`', () => {
    const { rerender } = render(<Toaster limit={3} />)
    act(() => {
      toast({ title: 'One', closable: true })
      toast({ title: 'Two' })
    })

    act(() => {
      within(getToast('One')).getByRole('button', { name: 'Close' }).focus()
    })
    expect(viewport()).toHaveAttribute('data-expanded')
    act(() => {
      ;(document.activeElement as HTMLElement).blur()
    })
    expect(viewport()).not.toHaveAttribute('data-expanded')

    rerender(<Toaster limit={3} expand />)
    expect(viewport()).toHaveAttribute('data-expanded')
  })

  it("puts the toast's status in data-status, not in a status attribute", () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Done', status: 'success' })
    })

    expect(getToast('Done')).toHaveAttribute('data-status', 'success')
    expect(getToast('Done')).not.toHaveAttribute('status')
  })

  it('gives the close button a 24px hit area in both sizes', () => {
    render(<Toaster />)
    act(() => {
      toast({ title: 'Small', closable: true })
    })
    expect(
      within(getToast('Small')).getByRole('button', { name: 'Close' }),
    ).toHaveClass('relative', 'after:absolute', 'after:-inset-1')

    act(() => {
      toast({ title: 'Large', size: 'lg', closable: true })
    })
    expect(
      within(getToast('Large')).getByRole('button', { name: 'Close' }),
    ).toHaveClass('p-0.5', 'after:-inset-0.5')
  })
})
