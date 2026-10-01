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

describe('Avatar hover', () => {
  // The kit's hover, by kind, only in a link or a button (the browser
  // checks of the rules are in the "Interactive" story).
  // As `hover:`, only where the pointer can hover (no sticky touch hover).
  const inInteractive =
    '[@media(hover:hover)]:in-[a[href]:hover,button:enabled:hover,[role=button]:hover]'

  it('has no blanket brightness hover', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>,
    )
    const avatar = screen.getByTestId('avatar')
    expect(avatar.className).not.toMatch(/brightness/)
    // A photo zooms in (AvatarImage); the avatar's own fill doesn't change.
    expect(avatar.className).not.toContain('bg-color-1')
    // Initials: 14 Semibold on White/40% over `color-2`.
    expect(screen.getByText('HK')).toHaveClass(
      `${inInteractive}:font-semibold`,
      `${inInteractive}:text-[length:max(0.875rem,43.75cqi)]`,
    )
    expect(screen.getByText('HK').parentElement?.className).toContain(
      `${inInteractive}:not-has-[svg]:[background-image:linear-gradient(var(--avatar-hover-tint),var(--avatar-hover-tint))]`,
    )
    // An icon: a static Black/20% fill.
    expect(screen.getByText('HK').parentElement?.className).toContain(
      `${inInteractive}:has-[svg]:bg-[color-mix(`,
    )
  })
})

describe('Avatar hover, with a fill of your own', () => {
  it('layers the hover tint over a fill set in className', () => {
    render(
      <Avatar>
        <AvatarFallback className="bg-orange-200">HK</AvatarFallback>
      </Avatar>,
    )
    const fallback = screen.getByText('HK').parentElement as HTMLElement
    // The tint is a background-image: twMerge keeps both, and the custom
    // fill shows under the White/40% layer instead of being replaced.
    expect(fallback).toHaveClass('bg-orange-200')
    expect(fallback).not.toHaveClass('bg-color-2')
    expect(fallback.className).toContain('[background-image:linear-gradient(')
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
