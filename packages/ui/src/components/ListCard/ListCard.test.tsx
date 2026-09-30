import { fireEvent, render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import {
  ActivitiesCard,
  ContactsCard,
  ListCard,
  NotificationsCard,
} from './ListCard'

describe('ListCard', () => {
  it('is a section named by its heading, on the popup surface', () => {
    render(
      <ListCard
        title="Recent files"
        items={[{ id: 'q3', title: 'Q3 report.pdf' }]}
      />,
    )
    const card = screen.getByRole('region', { name: 'Recent files' })

    expect(card.tagName).toBe('SECTION')
    expect(card).toHaveClass(
      'w-62',
      'rounded-24',
      'p-4',
      'glass-2',
      'text-black',
    )
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Recent files',
    })
    // Figma: the kit's `Text`, 18 Semibold 18/28 with padding 4/8.
    expect(heading).toHaveClass('text-18', 'font-semibold', 'px-1', 'py-2')
    expect(card).toHaveAttribute('aria-labelledby', heading.id)
  })

  it('renders the rows as a list, with titles and descriptions', () => {
    render(
      <ListCard
        title="Files"
        items={[
          { id: 'a', title: 'A.pdf', description: 'Just now' },
          { id: 'b', title: 'B.pdf' },
        ]}
      />,
    )
    const list = screen.getByRole('list')
    const rows = within(list).getAllByRole('listitem')

    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('A.pdf')
    expect(within(rows[0]).getByText('Just now')).toHaveClass('text-secondary')
    // A static row keeps the interactive rows' padding and isn't focusable.
    expect(rows[1].firstElementChild).toHaveClass('p-2')
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('makes a row with href a link and one with onSelect a button', () => {
    const onSelect = vi.fn()
    render(
      <ListCard
        title="Files"
        items={[
          { id: 'a', title: 'A.pdf', href: '/files/a' },
          { id: 'b', title: 'B.pdf', onSelect },
        ]}
      />,
    )
    const link = screen.getByRole('link', { name: 'A.pdf' })
    const button = screen.getByRole('button', { name: 'B.pdf' })

    expect(link).toHaveAttribute('href', '/files/a')
    expect(link).toHaveClass('p-2', 'hover:bg-black-4', 'focus-ring')
    expect(button).toHaveAttribute('type', 'button')
    fireEvent.click(button)
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('prefers href over onSelect', () => {
    render(
      <ListCard
        title="Files"
        items={[{ id: 'a', title: 'A.pdf', href: '/a', onSelect: vi.fn() }]}
      />,
    )
    expect(screen.getByRole('link', { name: 'A.pdf' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('takes the heading level', () => {
    render(<ListCard title="Files" items={[]} headingLevel={3} />)
    expect(
      screen.getByRole('heading', { level: 3, name: 'Files' }),
    ).toBeInTheDocument()
  })

  it('merges className and forwards props and ref to the section', () => {
    const ref = createRef<HTMLElement>()
    render(
      <ListCard
        ref={ref}
        title="Files"
        items={[]}
        className="w-full p-2"
        data-testid="card"
      />,
    )
    const card = screen.getByTestId('card')

    expect(ref.current).toBe(card)
    expect(card).toHaveClass('w-full', 'p-2')
    expect(card).not.toHaveClass('w-62', 'p-4')
  })
})

describe('NotificationsCard', () => {
  it('puts the icon on a 24px tile and the time under the title', () => {
    render(
      <NotificationsCard
        items={[
          {
            id: 'bug',
            icon: <svg data-testid="icon" />,
            title: 'You fixed a bug.',
            time: 'Just now',
          },
        ]}
      />,
    )
    const card = screen.getByRole('region', { name: 'Notifications' })
    const tile = within(card).getByTestId('icon').closest('[data-size]')

    expect(tile).toHaveAttribute('data-size', '16')
    expect(tile).toHaveClass('p-1', 'rounded-8', 'bg-black-4')
    expect(within(card).getByText('Just now')).toHaveClass('text-secondary')
  })
})

describe('ActivitiesCard', () => {
  it('shows the avatar, what was done and when', () => {
    render(
      <ActivitiesCard
        items={[
          {
            id: 'style',
            avatar: <span data-testid="avatar" />,
            title: 'Changed the style.',
            time: 'Just now',
          },
        ]}
      />,
    )
    const row = within(
      screen.getByRole('region', { name: 'Activities' }),
    ).getByRole('listitem')

    expect(within(row).getByTestId('avatar')).toBeInTheDocument()
    expect(row).toHaveTextContent('Changed the style.Just now')
  })
})

describe('ContactsCard', () => {
  it('has one-line rows 4px apart, like the other cards', () => {
    render(
      <ContactsCard
        items={[
          {
            id: 'drew',
            avatar: <span data-testid="avatar" />,
            name: 'Drew Cano',
            onSelect: vi.fn(),
          },
        ]}
      />,
    )
    const card = screen.getByRole('region', { name: 'Contacts' })

    expect(within(card).getByRole('list')).toHaveClass('gap-1')
    expect(within(card).getByRole('button', { name: 'Drew Cano' })).toHaveClass(
      'items-center',
    )
  })

  it('keeps the user className', () => {
    render(<ContactsCard items={[]} className="w-full" />)
    expect(screen.getByRole('region', { name: 'Contacts' })).toHaveClass(
      'w-full',
      'p-4',
    )
  })
})

describe('the kit cards', () => {
  it('take their default titles from SnowUIProvider messages', () => {
    render(
      <SnowUIProvider
        messages={{
          listCards: {
            notifications: 'Уведомления',
            activities: 'Активность',
            contacts: 'Контакты',
          },
        }}
      >
        <NotificationsCard items={[]} />
        <ActivitiesCard items={[]} />
        <ContactsCard items={[]} />
      </SnowUIProvider>,
    )
    for (const name of ['Уведомления', 'Активность', 'Контакты']) {
      expect(screen.getByRole('region', { name })).toBeInTheDocument()
    }
  })

  it('prefer the title prop over the messages', () => {
    render(<NotificationsCard title="Alerts" items={[]} />)
    expect(screen.getByRole('region', { name: 'Alerts' })).toBeInTheDocument()
  })

  it('forward the ref to the section', () => {
    const ref = createRef<HTMLElement>()
    render(<ActivitiesCard ref={ref} items={[]} />)
    expect(ref.current?.tagName).toBe('SECTION')
  })
})
