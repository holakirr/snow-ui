import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InputSmall } from './InputSmall'

describe('InputSmall', () => {
  it('keeps the native role of each input type', () => {
    render(
      <>
        <InputSmall aria-label="Name" />
        <InputSmall type="number" aria-label="Age" />
        <InputSmall type="search" aria-label="Find" />
      </>,
    )

    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute(
      'role',
    )
    expect(screen.getByRole('spinbutton', { name: 'Age' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Find' })).toBeInTheDocument()
  })

  it.each(['gray', 'outline'] as const)(
    'shows the red stroke while the %s input is invalid',
    (variant) => {
      render(<InputSmall variant={variant} aria-label="Name" aria-invalid />)

      expect(screen.getByRole('textbox')).toHaveClass(
        'aria-invalid:inset-ring',
        'aria-invalid:inset-ring-control-border-invalid',
      )
    },
  )
})
