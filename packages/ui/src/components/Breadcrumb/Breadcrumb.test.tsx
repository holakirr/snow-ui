import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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
})
