import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { Badge, type BadgeColor, BadgeComponent } from './Badge'

describe('Badge', () => {
  it('renders a dot badge next to its children', () => {
    render(
      <Badge>
        <button type="button">Inbox</button>
      </Badge>,
    )

    const badge = screen.getByRole('status', { name: 'Notification badge' })

    expect(screen.getByRole('button', { name: 'Inbox' })).toBeInTheDocument()
    expect(badge).toHaveClass('size-1.5', 'bg-indigo')
    expect(badge).toBeEmptyDOMElement()
  })

  it('renders a number badge with black text on indigo', () => {
    render(<BadgeComponent content="8" />)

    const badge = screen.getByRole('status', { name: '8' })

    expect(badge).toHaveTextContent('8')
    // White on indigo is 2.07:1; black is 10.15:1.
    expect(badge).toHaveClass('bg-indigo', 'text-static-black', 'rounded-80')
  })

  it('puts className on the wrapper and badgeClassName on the badge', () => {
    render(
      <Badge
        content="3"
        className="inline-block"
        badgeClassName="bg-red"
        data-testid="wrapper"
      >
        <button type="button">Inbox</button>
      </Badge>,
    )

    const wrapper = screen.getByTestId('wrapper')
    const badge = screen.getByRole('status', { name: '3' })
    expect(wrapper).toHaveClass('relative', 'inline-block')
    expect(wrapper).not.toHaveClass('bg-red')
    expect(badge).toHaveClass('absolute', 'bg-red')
    expect(badge).not.toHaveClass('bg-indigo')
    expect(badge).not.toHaveClass('inline-block')
  })

  describe('color (5.2)', () => {
    it('is indigo by default, as before', () => {
      expectTypeOf<'red'>().toExtend<BadgeColor>()
      render(<BadgeComponent content="8" />)
      const badge = screen.getByRole('status', { name: '8' })
      expect(badge).toHaveClass('bg-indigo', 'text-static-black')
      expect(badge).not.toHaveAttribute('data-color')
    })

    it('puts the red number on red-text with the per-mode white', () => {
      render(<BadgeComponent content="12" color="red" />)
      const badge = screen.getByRole('status', { name: '12' })
      // Figma's white on Secondary/Red is 3.36:1; red-text is 5.21:1.
      expect(badge).toHaveClass('bg-red-text', 'text-white', 'rounded-80')
      expect(badge).not.toHaveClass('bg-indigo', 'text-static-black', 'bg-red')
    })

    it('keeps Secondary/Red for the red dot', () => {
      render(<BadgeComponent color="red" />)
      const dot = screen.getByRole('status', { name: 'Notification badge' })
      expect(dot).toHaveClass('bg-red', 'size-1.5')
      expect(dot).not.toHaveClass('bg-indigo')
    })

    it('passes the colour from Badge to its badge, and badgeClassName wins', () => {
      const { rerender } = render(
        <Badge content="3" color="red">
          <button type="button">Inbox</button>
        </Badge>,
      )
      expect(screen.getByRole('status', { name: '3' })).toHaveClass(
        'bg-red-text',
      )
      rerender(
        <Badge content="3" color="red" badgeClassName="bg-green">
          <button type="button">Inbox</button>
        </Badge>,
      )
      const badge = screen.getByRole('status', { name: '3' })
      expect(badge).toHaveClass('bg-green')
      expect(badge).not.toHaveClass('bg-red-text')
    })

    it('sits on the top end corner in right-to-left text', () => {
      render(
        <div dir="rtl">
          <Badge content="3" color="red">
            <button type="button">Inbox</button>
          </Badge>
        </div>,
      )
      expect(screen.getByRole('status', { name: '3' })).toHaveClass(
        'start-full',
        'rtl:translate-x-1/2',
      )
    })

    it('renders on the server and forwards the ref', () => {
      const html = renderToString(<BadgeComponent content="12" color="red" />)
      expect(html).toContain('bg-red-text')
      expect(html).toContain('role="status"')

      const ref = createRef<HTMLSpanElement>()
      render(<BadgeComponent ref={ref} content="1" color="red" />)
      expect(ref.current).toBe(screen.getByRole('status', { name: '1' }))
    })
  })
})
