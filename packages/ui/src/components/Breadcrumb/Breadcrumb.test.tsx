import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BreadcrumbLink } from './Breadcrumb'

describe('BreadcrumbLink', () => {
  it('is a plain link to its href', () => {
    render(<BreadcrumbLink href="/docs">Docs</BreadcrumbLink>)

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).toHaveAttribute('href', '/docs')
    expect(link).not.toHaveAttribute('tabindex')
    expect(link).not.toHaveAttribute('aria-disabled')
  })

  it('drops the href when disabled, so it leads nowhere', () => {
    render(
      <BreadcrumbLink href="/docs" disabled>
        Docs
      </BreadcrumbLink>,
    )

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).not.toHaveAttribute('tabindex')
    expect(link).toHaveClass('pointer-events-none')
  })

  it('takes a disabled asChild link out of the tab order', () => {
    render(
      <BreadcrumbLink asChild disabled>
        <a href="/docs">Docs</a>
      </BreadcrumbLink>,
    )

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')
  })

  it("doesn't let a disabled asChild link be activated", () => {
    // A router link navigates in its own onClick unless the click was
    // prevented; Enter on a focused link clicks it too.
    const navigate = vi.fn()
    render(
      <BreadcrumbLink asChild disabled>
        <a
          href="/docs"
          onClick={(event) => {
            if (!event.defaultPrevented) navigate()
          }}
        >
          Docs
        </a>
      </BreadcrumbLink>,
    )

    const link = screen.getByRole('link', { name: 'Docs' })
    link.focus()
    const notPrevented = fireEvent.click(link)

    expect(notPrevented).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('keeps the click handlers of an enabled asChild link', () => {
    const onClick = vi.fn()
    const onClickCapture = vi.fn()
    render(
      <BreadcrumbLink asChild onClickCapture={onClickCapture}>
        <a
          href="/docs"
          onClick={(event) => {
            event.preventDefault()
            onClick()
          }}
        >
          Docs
        </a>
      </BreadcrumbLink>,
    )

    fireEvent.click(screen.getByRole('link', { name: 'Docs' }))

    expect(onClickCapture).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
