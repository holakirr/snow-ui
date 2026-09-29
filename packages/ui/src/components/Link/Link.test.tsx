import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Link } from './Link'

describe('Link', () => {
  it('stays inline by default so it wraps in prose', () => {
    render(<Link href="/docs">Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).not.toHaveClass('inline-flex')
    expect(link).toHaveClass(
      'text-indigo-text',
      'hover:underline',
      'focus-ring',
    )
    expect(link).not.toHaveAttribute('target')
  })

  it('opens external links in a new tab and says so to screen readers', () => {
    render(
      <Link href="https://example.com" variant="external">
        Example
      </Link>,
    )

    const link = screen.getByRole('link', {
      name: /^Example\s+\(opens in a new tab\)$/,
    })

    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveClass('inline-flex')
    expect(screen.getByText('(opens in a new tab)')).toHaveClass('sr-only')
  })

  it('lets external links override target, rel and the screen-reader text', () => {
    render(
      <Link
        href="https://example.com"
        variant="external"
        target="_self"
        rel="nofollow"
        externalLabel="(externe Seite)"
      >
        Beispiel
      </Link>,
    )

    const link = screen.getByRole('link', {
      name: /^Beispiel\s+\(externe Seite\)$/,
    })

    expect(link).toHaveAttribute('target', '_self')
    expect(link).toHaveAttribute('rel', 'nofollow')
  })

  it('renders the arrow variant with a decorative arrow', () => {
    render(
      <Link href="#" variant="arrow">
        More
      </Link>,
    )

    const link = screen.getByRole('link', { name: 'More' })

    expect(link).toHaveClass('inline-flex')
    expect(link).toHaveTextContent('More↗')
  })

  it('leaves a link with an href its native role and tab order', () => {
    render(<Link href="/docs">Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).not.toHaveAttribute('role')
    expect(link).not.toHaveAttribute('tabindex')
  })

  it('keeps a link without an href a focusable link', () => {
    render(<Link>Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).toHaveAttribute('tabindex', '0')
    expect(link).toHaveAttribute('role', 'link')
  })

  it('looks at the href of the asChild element', () => {
    render(
      <>
        <Link asChild>
          <a href="/docs">Docs</a>
        </Link>
        <Link asChild>
          <span>Home</span>
        </Link>
      </>,
    )

    expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute(
      'tabindex',
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'tabindex',
      '0',
    )
  })
})
