import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { IconText } from './IconText'
import * as stories from './IconText.stories'

const { Default, Vertical, Flip, Interactive, Active, Examples } =
  composeStories(stories)

const icon = <svg data-testid="icon" aria-hidden />

describe('IconText', () => {
  it('renders the icon before 14px text in a row', async () => {
    await Default.run()

    const text = screen.getByText('Text')
    const root = text.parentElement as HTMLElement

    expect(root.tagName).toBe('DIV')
    expect(root).toHaveClass('inline-flex', 'flex-row', 'gap-2', 'rounded-12')
    expect(text).toHaveClass('text-14')
    expect(root.lastElementChild).toBe(text)
  })

  it('stacks vertically', async () => {
    await Vertical.run()

    expect(screen.getByText('Text').parentElement).toHaveClass(
      'flex-col',
      'items-center',
    )
  })

  it('puts the text first when flipped', async () => {
    await Flip.run()

    const text = screen.getByText('Text')
    expect(text.parentElement?.firstElementChild).toBe(text)
  })

  it('is a hoverable button when interactive', async () => {
    await Interactive.run()

    const button = screen.getByRole('button', { name: 'Text' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('p-2', 'hover:bg-black-4')
    expect(button).not.toHaveAttribute('data-active')
  })

  it('keeps the fill when active', async () => {
    await Active.run()

    const button = screen.getByRole('button', { name: 'Text' })
    expect(button).toHaveAttribute('data-active', 'true')
    expect(button).toHaveClass('bg-black-4')
  })

  it('renders links with aria-current', async () => {
    await Examples.run()

    expect(screen.getByRole('link', { name: 'User Profile' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
      'href',
      '#account',
    )
  })

  it('passes props and events to the element', () => {
    const onClick = vi.fn()
    render(
      <IconText asChild icon={icon} onClick={onClick} aria-label="Star">
        <button type="button">
          <span>Custom</span>
        </button>
      </IconText>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Star' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Custom')).not.toHaveClass('text-14')
  })
})
