import { StarIcon } from '@holakirr/snow-ui-icons'
import { composeStories } from '@storybook/react'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROLES } from '../../constants'
import { Button } from './Button'
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
  WithStartContent,
  WithEndContent,
  WithStartAndEndContent,
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
    // `white` flips: a white label on black, a black label on the dark-mode
    // indigo Primary (white on indigo is 2.07:1).
    expect(button).toHaveClass('text-white')
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

    // Figma's 40% opacity is 2.85:1; the label is text-secondary instead,
    // through --button-fg, which hover and keyboard focus switch to black.
    expect(button).toHaveClass(
      'text-(--button-fg)',
      '[--button-fg:var(--color-text-secondary)]',
      'hover:[--button-fg:var(--color-black)]',
    )
    expect(button).not.toHaveClass('text-black')
    expect(button.className).not.toMatch(/opacity-40/)
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

  it('renders with start content', async () => {
    await WithStartContent.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img, { name: 'Left Icon' })

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders with end content', async () => {
    await WithEndContent.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img, { name: 'Right Icon' })

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders with start and end content', async () => {
    await WithStartAndEndContent.run()

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
    expect(button).toHaveClass(
      '[&>svg:not([width]):not([class*=size-])]:size-4',
    )
    expect(button).toContainElement(icon)
  })

  it('shows the focus-ring on keyboard focus, even for bare buttons', async () => {
    await Bare.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toHaveClass(
      'focus-ring',
      'focus-visible:[--button-fg:var(--color-black)]',
    )
  })

  it('keeps a custom colour on a bare button in every state', () => {
    render(<Button variant="bare" className="text-red-text" label="Delete" />)

    const button = screen.getByRole(ROLES.button, { name: 'Delete' })

    // The consumer's colour replaces `text-(--button-fg)`; the hover and
    // focus classes only change --button-fg, which nothing reads any more.
    expect(button).toHaveClass('text-red-text')
    expect(button).not.toHaveClass('text-(--button-fg)')
    expect(button.className).not.toMatch(/(hover|focus-visible):text-/)
  })

  it('leaves icons that size themselves alone', () => {
    const { container } = render(
      <>
        <Button
          label="Sized by class"
          startContent={<svg className="size-6" />}
        />
        <Button label="Sized by attribute" startContent={<svg width="24" />} />
        <Button label="Unsized" startContent={<svg />} />
      </>,
    )
    const [byClass, byAttribute, unsized] = Array.from(
      container.querySelectorAll('svg'),
    )

    // The Figma size applies only to an <svg> with no width and no size-* class.
    const matches = (svg: Element) =>
      svg.matches(':not([width]):not([class*=size-])')

    expect(matches(byClass)).toBe(false)
    expect(matches(byAttribute)).toBe(false)
    expect(matches(unsized)).toBe(true)
    expect(unsized.parentElement).toHaveClass(
      '[&>svg:not([width]):not([class*=size-])]:size-3',
    )
  })

  it('keeps an explicit icon size prop (e.g. Dialog close, 24px)', () => {
    render(
      <Button
        size="md"
        startContent={<StarIcon size={24} data-testid="star" />}
        label=""
        title="Star"
      />,
    )

    expect(screen.getByTestId('star')).toHaveAttribute('width', '24')
  })
})
