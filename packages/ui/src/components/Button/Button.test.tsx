import { composeStories } from '@storybook/react'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROLES } from '../../constants'
import * as stories from './Button.stories'

const {
  Borderless,
  Gray,
  Filled,
  Outline,
  Bare,
  Disabled,
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
    expect(button).toHaveClass('bg-black-4')
    expect(button).toHaveClass('hover:bg-black-10')
  })

  it('renders with filled variant', async () => {
    await Filled.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
    // White label in both modes: the dark Primary is indigo.
    expect(button).toHaveClass('text-static-white')
    expect(button).toHaveClass('hover:bg-primary-hover')
  })

  it('renders with outline variant', async () => {
    await Outline.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    // 0.5px inside stroke, like the Figma "Outline" variant.
    expect(button).toHaveClass('inset-ring-[0.5px]')
    expect(button).toHaveClass('inset-ring-black-10')
  })

  it('renders with bare variant', async () => {
    await Bare.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toHaveClass('opacity-40')
    expect(button).toHaveClass('hover:opacity-100')
    expect(button).toHaveClass('p-0')
    expect(button).not.toHaveClass('px-3')
    expect(button).not.toHaveClass('min-h-6')
  })

  it('renders disabled buttons with the token styles', async () => {
    await Disabled.run()

    const buttons = screen.getAllByRole(ROLES.button)

    expect(buttons).toHaveLength(5)
    for (const button of buttons) {
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:text-black-20')
    }
  })

  it('renders with sm size', async () => {
    await Sm.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-12')
    expect(button).toHaveClass('min-h-6')
    expect(button).toHaveClass('py-1')
    expect(button).toHaveClass('px-3')
    expect(button).toHaveClass('gap-1')
    expect(button).toHaveClass('rounded-12')
    expect(screen.getByText('Button')).toHaveClass('text-12')
  })

  it('renders with md size', async () => {
    await Md.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-14')
    expect(button).toHaveClass('min-h-9')
    expect(button).toHaveClass('py-2')
    expect(button).toHaveClass('px-4')
    expect(button).toHaveClass('gap-1.5')
    expect(button).toHaveClass('rounded-16')
    expect(screen.getByText('Button')).toHaveClass('text-14')
  })

  it('renders with lg size', async () => {
    await Lg.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-16')
    expect(button).toHaveClass('min-h-12')
    expect(button).toHaveClass('py-3')
    expect(button).toHaveClass('px-5')
    expect(button).toHaveClass('gap-2')
    expect(button).toHaveClass('rounded-20')
    expect(screen.getByText('Button')).toHaveClass('text-16')
  })

  it('lets textSize override the label size', async () => {
    const { container } = render(<Lg textSize={12} />)

    expect(within(container).getByText('Button')).toHaveClass('text-12')
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

    const button = screen.getByRole(ROLES.link)

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href')
    expect(button.tagName).toBe('A')
    expect(button).not.toHaveAttribute('type')
    expect(button).not.toHaveAttribute('role')
  })

  it('sets native button type and no default title', async () => {
    await Filled.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toHaveAttribute('type', 'button')
    expect(button).not.toHaveAttribute('title')
    expect(button).not.toHaveAttribute('tabindex')
    expect(button).not.toHaveAttribute('aria-label', 'Button aria label')
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
    expect(button).toHaveClass('p-1')
    expect(button).toHaveClass('[&>svg]:size-4')
    expect(button).toContainElement(icon)
  })
})
