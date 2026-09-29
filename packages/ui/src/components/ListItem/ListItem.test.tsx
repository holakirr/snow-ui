import { composeStories } from '@storybook/react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ListItem } from './ListItem'
import * as stories from './ListItem.stories'

const { Default, Interactive, TitleOnly, DashboardLists } =
  composeStories(stories)

describe('ListItem', () => {
  it('renders the icon, a 14px title and a 12px secondary description', async () => {
    await Default.run()

    const title = screen.getByText('You fixed a bug.')
    const description = screen.getByText('Just now')
    const row = title.closest('[class*="rounded-12"]') as HTMLElement

    expect(title).toHaveClass('text-14', 'text-black')
    expect(description).toHaveClass('text-12', 'text-secondary')
    // Two lines: the icon aligns to the top, as in Figma.
    expect(row).toHaveClass('items-start', 'flex', 'w-62')
    expect(row.firstElementChild).toHaveAttribute('data-size', '16')
  })

  it('centres a single line', async () => {
    await TitleOnly.run()

    const row = screen
      .getByText('Natali Craig')
      .closest('[class*="rounded-12"]') as HTMLElement
    expect(row).toHaveClass('items-center')
  })

  it('is a link row when interactive', async () => {
    await Interactive.run()

    const link = screen.getByRole('link', { name: /You fixed a bug/ })
    expect(link).toHaveAttribute('href', '#notification')
    expect(link).toHaveClass('p-2', 'hover:bg-black-4')
  })

  it('builds the dashboard lists as labelled lists of items', async () => {
    await DashboardLists.run()

    for (const [name, count] of [
      ['Notifications', 4],
      ['Activities', 5],
      ['Contacts', 6],
    ] as const) {
      const section = screen.getByRole('region', { name })
      expect(within(section).getAllByRole('listitem')).toHaveLength(count)
    }
  })

  it('renders children after the text and passes events', () => {
    const onClick = vi.fn()
    const { container } = render(
      <ListItem asChild title="Drew Cano" onClick={onClick}>
        <button type="button">
          <span>Online</span>
        </button>
      </ListItem>,
    )

    const button = within(container).getByRole('button', {
      name: /Drew Cano/,
    })
    expect(button.lastElementChild).toHaveTextContent('Online')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
