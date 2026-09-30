import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  CommandPalette,
  type CommandPaletteGroup,
  defaultCommandPaletteFilter,
} from './CommandPalette'

const groups: CommandPaletteGroup[] = [
  {
    id: 'recent',
    heading: 'Recent search',
    items: [
      { id: 'landing', label: 'Landing page design' },
      { id: 'byewind', label: 'ByeWind', keywords: ['designer'] },
    ],
  },
  {
    id: 'visited',
    heading: 'Recently visited',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'archive', label: 'Archive', disabled: true },
      { id: 'projects', label: 'Projects' },
    ],
  },
]

const renderOpen = (props: Partial<Parameters<typeof CommandPalette>[0]>) =>
  render(<CommandPalette groups={groups} defaultOpen {...props} />)

const activeOption = () =>
  screen
    .getAllByRole('option')
    .find((option) => option.getAttribute('aria-selected') === 'true')

describe('CommandPalette', () => {
  it('opens from the trigger as a labelled dialog with a combobox', () => {
    render(
      <CommandPalette
        groups={groups}
        trigger={<button type="button">Open</button>}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument()
    const combobox = screen.getByRole('combobox', { name: 'Search' })
    const listbox = screen.getByRole('listbox', { name: 'Search' })
    expect(combobox).toHaveFocus()
    expect(combobox).toHaveAttribute('aria-expanded', 'true')
    expect(combobox).toHaveAttribute('aria-autocomplete', 'list')
    expect(combobox).toHaveAttribute('aria-controls', listbox.id)
  })

  it('groups the options under their headings', () => {
    renderOpen({})

    const recent = screen.getByRole('group', { name: 'Recent search' })
    expect(within(recent).getAllByRole('option')).toHaveLength(2)
    const visited = screen.getByRole('group', { name: 'Recently visited' })
    expect(within(visited).getAllByRole('option')).toHaveLength(3)
    expect(
      within(visited).getByRole('option', { name: 'Archive' }),
    ).toHaveAttribute('aria-disabled', 'true')
  })

  it('highlights the first result and moves with the arrow keys', () => {
    renderOpen({})
    const combobox = screen.getByRole('combobox')

    expect(activeOption()).toHaveAccessibleName('Landing page design')
    expect(combobox).toHaveAttribute(
      'aria-activedescendant',
      activeOption()?.id,
    )

    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(activeOption()).toHaveAccessibleName('ByeWind')
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(activeOption()).toHaveAccessibleName('Overview')

    // The disabled option is skipped.
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(activeOption()).toHaveAccessibleName('Projects')
    expect(combobox).toHaveAttribute(
      'aria-activedescendant',
      activeOption()?.id,
    )

    // Wraps around at both ends.
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(activeOption()).toHaveAccessibleName('Landing page design')
    fireEvent.keyDown(combobox, { key: 'ArrowUp' })
    expect(activeOption()).toHaveAccessibleName('Projects')
  })

  it('ignores the Enter that commits an IME composition (WebKit)', () => {
    const onSelect = vi.fn()
    renderOpen({ onSelect })
    const combobox = screen.getByRole('combobox')

    fireEvent.compositionStart(combobox)
    fireEvent.change(combobox, { target: { value: 'proj' } })
    fireEvent.compositionEnd(combobox, { data: 'proj' })
    // WebKit: after compositionend, Enter with keyCode 229 and isComposing
    // false.
    fireEvent.keyDown(combobox, { key: 'Enter', keyCode: 229 })
    expect(onSelect).not.toHaveBeenCalled()
    fireEvent.keyDown(combobox, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('filters as the user types and resets the highlight', () => {
    renderOpen({})
    const combobox = screen.getByRole('combobox')

    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    fireEvent.change(combobox, { target: { value: 'proj' } })

    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(activeOption()).toHaveAccessibleName('Projects')
    expect(
      screen.queryByRole('group', { name: 'Recent search' }),
    ).not.toBeInTheDocument()

    // Keywords match too.
    fireEvent.change(combobox, { target: { value: 'designer' } })
    expect(activeOption()).toHaveAccessibleName('ByeWind')
  })

  it('shows the empty state when nothing matches', () => {
    renderOpen({ emptyMessage: 'Nothing found' })
    const combobox = screen.getByRole('combobox')

    fireEvent.change(combobox, { target: { value: 'zzz' } })

    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByRole('status')).toHaveTextContent('Nothing found')
    expect(combobox).not.toHaveAttribute('aria-activedescendant')

    // Enter does nothing without results.
    fireEvent.keyDown(combobox, { key: 'Enter' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('selects the highlighted item with Enter and closes', () => {
    const onSelect = vi.fn()
    const onItemSelect = vi.fn()
    const onOpenChange = vi.fn()
    const withItemHandler = groups.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.id === 'byewind' ? { ...item, onSelect: onItemSelect } : item,
      ),
    }))
    render(
      <CommandPalette
        groups={withItemHandler}
        defaultOpen
        onSelect={onSelect}
        onOpenChange={onOpenChange}
      />,
    )
    const combobox = screen.getByRole('combobox')

    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    fireEvent.keyDown(combobox, { key: 'Enter', metaKey: true })

    expect(onItemSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledTimes(1)
    const [item, event] = onSelect.mock.calls[0] ?? []
    expect(item.id).toBe('byewind')
    expect(event.metaKey).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('selects on click and highlights on hover', () => {
    const onSelect = vi.fn()
    renderOpen({ onSelect, closeOnSelect: false })

    const overview = screen.getByRole('option', { name: 'Overview' })
    fireEvent.mouseMove(overview)
    expect(overview).toHaveAttribute('aria-selected', 'true')

    fireEvent.click(overview)
    expect(onSelect.mock.calls[0]?.[0].id).toBe('overview')
    // closeOnSelect={false} keeps it open.
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('option', { name: 'Archive' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('closes with Escape', () => {
    const onOpenChange = vi.fn()
    renderOpen({ onOpenChange })

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens with a hotkey, but not while typing in a field', () => {
    render(
      <>
        <input aria-label="Other field" />
        <CommandPalette groups={groups} hotkey="/" />
      </>,
    )

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Other field' }), {
      key: '/',
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.keyDown(document.body, { key: '/' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('toggles with a modifier hotkey', () => {
    render(<CommandPalette groups={groups} hotkey="mod+k" />)

    fireEvent.keyDown(document.body, { key: 'k' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'K', metaKey: true })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the groups as given with filter={false} and marks loading', () => {
    const onQueryChange = vi.fn()
    renderOpen({ filter: false, loading: true, onQueryChange })
    const combobox = screen.getByRole('combobox')

    fireEvent.change(combobox, { target: { value: 'zzz' } })

    expect(onQueryChange).toHaveBeenCalledWith('zzz')
    expect(screen.getAllByRole('option')).toHaveLength(5)
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true')
  })

  it('centres the loading ring in its box and stops it for reduced motion', () => {
    renderOpen({ loading: true })
    const spinner = screen
      .getByRole('dialog')
      .querySelector('svg:has(circle)') as SVGSVGElement
    const circle = spinner.querySelector('circle') as SVGCircleElement
    const [x, y, width, height] = (spinner.getAttribute('viewBox') ?? '')
      .split(' ')
      .map(Number)

    // The ring turns around its centre, which must be the box's centre.
    expect(Number(circle.getAttribute('cx'))).toBe(x + width / 2)
    expect(Number(circle.getAttribute('cy'))).toBe(y + height / 2)
    // Turned by CSS, which reduced motion stops, not by an SVG <animate>.
    expect(spinner).toHaveClass(
      'animate-spinner-turn',
      'motion-reduce:animate-none',
    )
    expect(spinner.querySelector('animate, animateTransform')).toBeNull()
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
  })

  it('supports a controlled query', () => {
    const { rerender } = render(
      <CommandPalette groups={groups} defaultOpen query="over" />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(1)

    rerender(<CommandPalette groups={groups} defaultOpen query="" />)
    expect(screen.getAllByRole('option')).toHaveLength(5)
  })

  it('keeps the highlighted item when the groups change', () => {
    const { rerender } = render(
      <CommandPalette groups={groups} defaultOpen filter={false} />,
    )
    const combobox = screen.getByRole('combobox')
    fireEvent.keyDown(combobox, { key: 'ArrowDown' })
    expect(activeOption()).toHaveAccessibleName('ByeWind')

    // E.g. new server-side results arrive in front of the current ones.
    const [recent, visited] = groups
    rerender(
      <CommandPalette
        groups={[
          {
            ...recent,
            items: [{ id: 'new', label: 'New result' }, ...recent.items],
          },
          visited,
        ]}
        defaultOpen
        filter={false}
      />,
    )

    expect(activeOption()).toHaveAccessibleName('ByeWind')
    expect(combobox).toHaveAttribute(
      'aria-activedescendant',
      activeOption()?.id,
    )
  })

  it('builds valid option ids from ids with spaces', () => {
    render(
      <CommandPalette
        groups={[
          { id: 'my group', items: [{ id: 'a b', label: 'Spaced id' }] },
        ]}
        defaultOpen
      />,
    )
    const id = screen
      .getByRole('combobox')
      .getAttribute('aria-activedescendant')

    expect(id).not.toMatch(/\s/)
    expect(document.getElementById(id ?? '')).toHaveAccessibleName('Spaced id')
  })
})

describe('defaultCommandPaletteFilter', () => {
  const item = { id: 'a', label: 'Landing page design', keywords: ['web'] }

  it('matches every word, in any order, case-insensitively', () => {
    expect(defaultCommandPaletteFilter(item, 'DESIGN landing')).toBe(true)
    expect(defaultCommandPaletteFilter(item, 'web page')).toBe(true)
    expect(defaultCommandPaletteFilter(item, 'landing mobile')).toBe(false)
  })
})
