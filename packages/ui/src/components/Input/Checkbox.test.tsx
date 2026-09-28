import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Checkbox } from './Checkbox'

const mark = (checkbox: HTMLElement) =>
  checkbox.querySelector('[data-slot="checkbox-mark"]')

describe('Checkbox', () => {
  it('renders no mark when unchecked and the check mark when checked', () => {
    render(<Checkbox aria-label="agree" />)

    const checkbox = screen.getByRole('checkbox', { name: 'agree' })
    expect(mark(checkbox)).toBeNull()

    fireEvent.click(checkbox)

    expect(checkbox).toHaveAttribute('data-state', 'checked')
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
    expect(mark(checkbox)).toBeInTheDocument()
  })

  it('renders the indeterminate ("Multiple") state with a bar', () => {
    render(<Checkbox aria-label="all" checked="indeterminate" />)

    const checkbox = screen.getByRole('checkbox', { name: 'all' })
    const [check, bar] = Array.from(
      mark(checkbox)?.querySelectorAll('path') ?? [],
    )

    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
    expect(checkbox).toHaveClass('data-[state=indeterminate]:bg-primary')
    // The check hides and the bar shows for the indeterminate root.
    expect(check).toHaveClass('group-data-[state=indeterminate]:hidden')
    expect(bar).toHaveClass('hidden', 'group-data-[state=indeterminate]:block')
  })

  it('uses the Figma box: 28px, 8px radius, 2px ring', () => {
    render(<Checkbox aria-label="agree" />)

    expect(screen.getByRole('checkbox')).toHaveClass(
      'size-7',
      'rounded-8',
      'inset-ring-2',
      'inset-ring-black-20',
      'bg-background-3',
    )
  })

  it('draws the mark in the per-mode white (black on the dark indigo)', () => {
    render(<Checkbox aria-label="agree" defaultChecked />)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toHaveClass('text-white', 'focus-ring')
    expect(checkbox).not.toHaveClass('text-static-white')
  })

  it('keeps disabled checkboxes visible', () => {
    render(<Checkbox aria-label="agree" disabled defaultChecked />)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveClass(
      'disabled:bg-black-4',
      'disabled:inset-ring-black-10',
      'data-[state=checked]:disabled:bg-black-10',
      'disabled:cursor-not-allowed',
    )
    expect(checkbox).not.toHaveClass('disabled:opacity-40')
  })
})
