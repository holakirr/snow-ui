import { composeStories } from '@storybook/react'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROLES } from '../../constants'
import * as stories from './Button.stories'

const {
  Borderless,
  Gray,
  Filled,
  Outline,
  Sm,
  Md,
  Lg,
  WithChildren,
  AsLink,
  WithLeftContent,
  WithRightContent,
  WithLeftAndRightContent,
  IconButton,
} = composeStories(stories)

describe('Button', () => {
  it('renders with default props', async () => {
    await Borderless.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-transparent') // primary variant
  })

  it('renders with secondary variant', async () => {
    await Gray.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-black/5')
  })

  it('renders with filled variant', async () => {
    await Filled.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-brand')
    expect(button).toHaveClass('text-white')
    expect(button).toHaveClass('hover:bg-brand-hover')
  })

  it('renders with outline variant', async () => {
    await Outline.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('border-black/10')
  })

  it('renders with sm size', async () => {
    await Sm.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-sm')
    expect(button).toHaveClass('py-1')
    expect(button).toHaveClass('px-2')
    expect(button).toHaveClass('rounded-lg')
  })

  it('renders with md size', async () => {
    await Md.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-base')
    expect(button).toHaveClass('py-2')
    expect(button).toHaveClass('px-4')
    expect(button).toHaveClass('rounded-xl')
  })

  it('renders with lg size', async () => {
    await Lg.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-lg')
    expect(button).toHaveClass('py-3')
    expect(button).toHaveClass('px-6')
    expect(button).toHaveClass('rounded-2xl')
  })

  it('renders with children', async () => {
    await WithChildren.run()

    const button = screen.getByRole(ROLES.button)
    const text = screen.getByText('with-children')

    expect(button).toBeInTheDocument()
    expect(text).toBeInTheDocument()
    expect(button).toContainElement(text)
    expect(button).toHaveTextContent('with-children')
    expect(text.tagName).toBe('P')
  })

  it('renders as link', async () => {
    await AsLink.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href')
    expect(button.tagName).toBe('A')
  })

  it('renders with left content', async () => {
    await WithLeftContent.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img, { name: 'Left Icon' })

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders with right content', async () => {
    await WithRightContent.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img, { name: 'Right Icon' })

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders with left and right content', async () => {
    await WithLeftAndRightContent.run()

    const button = screen.getByRole(ROLES.button)
    const leftIcon = screen.getByRole(ROLES.img, { name: 'Left Icon' })
    const rightIcon = screen.getByRole(ROLES.img, { name: 'Right Icon' })

    expect(button).toBeInTheDocument()
    expect(leftIcon).toBeInTheDocument()
    expect(rightIcon).toBeInTheDocument()
    expect(button).toContainElement(leftIcon)
    expect(button).toContainElement(rightIcon)
  })

  it('renders as icon button', async () => {
    await IconButton.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('p-2')
    expect(button).toContainElement(icon)
  })
})
