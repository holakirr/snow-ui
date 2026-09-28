import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { KBD } from './KBD'

describe('KBD', () => {
  it('renders the shortcut in a <kbd> with aria-keyshortcuts', () => {
    render(<KBD keys={['⌘', 'K']} />)

    const kbd = screen.getByText('⌘+K')

    expect(kbd.tagName).toBe('KBD')
    expect(kbd).toHaveAttribute('aria-keyshortcuts', '⌘+K')
    // Figma Kbd: 16px high, 28px minimum width, 12/16 text, Solid fill.
    expect(kbd).toHaveClass('h-4', 'min-w-7', 'rounded-[6px]', 'text-12')
    expect(kbd).toHaveClass('bg-black-4')
  })

  it('renders the border variant and a custom separator', () => {
    render(<KBD keys={['Ctrl', 'C']} separator=" " variant="border" />)

    const kbd = screen.getByText('Ctrl C')

    expect(kbd).toHaveClass('inset-ring-[0.5px]', 'inset-ring-black-10')
    expect(kbd).not.toHaveClass('bg-black-4')
  })
})
