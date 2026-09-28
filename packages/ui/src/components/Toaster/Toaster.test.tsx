import { act, render, screen } from '@testing-library/react'
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
    expect(node).toHaveClass(
      'rounded-16',
      'bg-black-80',
      'from-white-10',
      'backdrop-blur-bg-40',
      'px-3',
      'py-2',
    )
    const icon = screen.getByRole('img', { name: 'Icon for status error' })
    expect(icon).toHaveAttribute('width', '20')
    expect(icon.style.color).toBe('var(--color-yellow, #fc0)')
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
})
