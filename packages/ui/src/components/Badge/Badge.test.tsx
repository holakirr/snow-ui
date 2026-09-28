import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge, BadgeComponent } from './Badge'

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
})
