import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Link } from './Link'

describe('Link', () => {
  it('stays inline by default so it wraps in prose', () => {
    render(<Link href="/docs">Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).not.toHaveClass('inline-flex')
    expect(link).toHaveClass('text-indigo-text', 'focus-ring')
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
    // A 12px icon, as the external one, hidden from the accessible name.
    expect(link).toHaveTextContent(/^More$/)
    const arrow = link.querySelector('svg')
    expect(arrow).toHaveAttribute('aria-hidden', 'true')
    expect(arrow).toHaveClass('size-3', 'opacity-40')
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

  it('activates a link without an href with Enter, not Space', () => {
    const onClick = vi.fn()
    render(<Link onClick={onClick}>Open</Link>)
    const link = screen.getByRole('link', { name: 'Open' })

    fireEvent.keyDown(link, { key: ' ' })
    expect(onClick).not.toHaveBeenCalled()

    fireEvent.keyDown(link, { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)

    // A held key clicks once.
    fireEvent.keyDown(link, { key: 'Enter', repeat: true })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('keeps its own onKeyDown, which can prevent the activation', () => {
    const onClick = vi.fn()
    const onKeyDown = vi.fn((event) => event.preventDefault())
    render(
      <Link onClick={onClick} onKeyDown={onKeyDown}>
        Open
      </Link>,
    )

    fireEvent.keyDown(screen.getByRole('link', { name: 'Open' }), {
      key: 'Enter',
    })

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("leaves Enter to a router link's own <a href>", () => {
    const onClick = vi.fn()
    // A router link renders the href from its own prop (`to`).
    const RouterLink = ({
      to,
      ...props
    }: { to: string } & ComponentProps<'a'>) => <a href={to} {...props} />
    render(
      <Link asChild onClick={onClick}>
        <RouterLink to="/docs">Docs</RouterLink>
      </Link>,
    )

    fireEvent.keyDown(screen.getByRole('link', { name: 'Docs' }), {
      key: 'Enter',
    })

    // The browser clicks it on Enter; Link doesn't click it a second time.
    expect(onClick).not.toHaveBeenCalled()
  })

  it('leaves Enter to elements that activate themselves', () => {
    const onClick = vi.fn()
    render(
      <>
        <Link href="/docs" onClick={onClick}>
          Docs
        </Link>
        <Link asChild>
          <button type="button" onClick={onClick}>
            Menu
          </button>
        </Link>
      </>,
    )

    // The browser clicks these on Enter itself; a second click would run
    // onClick twice.
    fireEvent.keyDown(screen.getByRole('link', { name: 'Docs' }), {
      key: 'Enter',
    })
    fireEvent.keyDown(screen.getByRole('link', { name: 'Menu' }), {
      key: 'Enter',
    })

    expect(onClick).not.toHaveBeenCalled()
  })

  it('activates an asChild element without an href with Enter', () => {
    const onClick = vi.fn()
    render(
      <Link asChild onClick={onClick}>
        <span>Home</span>
      </Link>,
    )

    fireEvent.keyDown(screen.getByRole('link', { name: 'Home' }), {
      key: 'Enter',
    })

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
