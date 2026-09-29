import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SnowUIProvider } from '../SnowUIProvider'
import { Avatar, AvatarFallback } from './Avatar'
import { AvatarGroup } from './AvatarGroup'

const people = ['AB', 'CD', 'EF', 'GH', 'IJ'].map((initials) => (
  <Avatar key={initials} size="md">
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
))

describe('AvatarFallback', () => {
  it('sizes the initials by the width of the avatar, from 12px', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>KP</AvatarFallback>
      </Avatar>,
    )

    // The avatar is a size container, and the text 37.5% of its width: 24px
    // in the 64px `lg` avatar, 12px (the minimum) at 24 and 32px.
    expect(screen.getByTestId('avatar')).toHaveClass('@container', 'w-16')
    const text = screen.getByText('KP')
    expect(text).toHaveClass(
      'text-[length:max(0.75rem,37.5cqi)]',
      'leading-[1.3333]',
    )
    expect(text).not.toHaveClass('text-12')
  })
})

describe('AvatarGroup', () => {
  it('shows `items` avatars and names the rest for screen readers', () => {
    render(<AvatarGroup>{people}</AvatarGroup>)

    expect(screen.getByText('AB')).toBeInTheDocument()
    expect(screen.queryByText('GH')).not.toBeInTheDocument()
    const more = screen.getByText('+2')
    expect(more).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('2 more')).toHaveClass('sr-only')
    // The overflow avatar takes the size of the first child.
    expect(more.closest('.w-8')).not.toBeNull()
  })

  it('translates the "+N" text with SnowUIProvider', () => {
    render(
      <SnowUIProvider
        messages={{ avatarGroup: { more: (n) => `${n} de plus` } }}
      >
        <AvatarGroup items={4}>{people}</AvatarGroup>
      </SnowUIProvider>,
    )

    expect(screen.getByText('1 de plus')).toBeInTheDocument()
  })

  it('merges className into the row classes', () => {
    render(
      <AvatarGroup className="-space-x-1 justify-center" data-testid="group">
        {people}
      </AvatarGroup>,
    )

    const group = screen.getByTestId('group')
    expect(group).toHaveClass('flex', '-space-x-1', 'justify-center')
    expect(group).not.toHaveClass('-space-x-2')
  })
})
