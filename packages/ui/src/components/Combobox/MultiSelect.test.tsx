import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import type { ComboboxOption } from './listbox'
import { MultiSelect, type MultiSelectProps } from './MultiSelect'

beforeAll(() => {
  // Radix positions the popup with ResizeObserver; jsdom has none.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const skills: ComboboxOption[] = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'figma', label: 'Figma' },
]

const renderMultiSelect = (props: Partial<MultiSelectProps> = {}) =>
  render(<MultiSelect aria-label="Skills" options={skills} {...props} />)

const field = () => screen.getByRole('combobox')
const activeOption = () => {
  const id = field().getAttribute('aria-activedescendant')
  return id ? document.getElementById(id) : null
}

describe('MultiSelect', () => {
  it('is a combobox with a multiselectable listbox', () => {
    renderMultiSelect({ placeholder: 'Add skills' })
    expect(field()).toHaveAttribute('placeholder', 'Add skills')

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    const listbox = screen.getByRole('listbox', { name: 'Skills' })
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
    expect(activeOption()).toHaveTextContent('React')
  })

  it('toggles options with Enter and keeps the list open', () => {
    const onValueChange = vi.fn()
    renderMultiSelect({ onValueChange })
    fireEvent.keyDown(field(), { key: 'ArrowDown' })

    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(onValueChange).toHaveBeenLastCalledWith(['react'])
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(activeOption()).toHaveTextContent('React')
    expect(activeOption()).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(onValueChange).toHaveBeenLastCalledWith(['react', 'typescript'])

    // Enter on a picked option removes it.
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(onValueChange).toHaveBeenLastCalledWith(['react'])
  })

  it('shows the picked options as tags and describes the field', () => {
    renderMultiSelect({
      defaultValue: ['react', 'figma'],
      placeholder: 'Add skills',
    })

    expect(screen.getByText('React')).toBeVisible()
    expect(screen.getByText('Figma')).toBeVisible()
    expect(field()).toHaveAccessibleDescription('Selected: React, Figma')
    // The placeholder only shows while nothing is picked.
    expect(field()).not.toHaveAttribute('placeholder')
  })

  it('clears the query after a pick', () => {
    const onQueryChange = vi.fn()
    renderMultiSelect({ onQueryChange })

    fireEvent.change(field(), { target: { value: 'fig' } })
    fireEvent.keyDown(field(), { key: 'Enter' })

    expect(field()).toHaveValue('')
    expect(onQueryChange).toHaveBeenLastCalledWith('')
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(activeOption()).toHaveTextContent('Figma')
  })

  it('removes the last tag with Backspace in the empty field', () => {
    const onValueChange = vi.fn()
    renderMultiSelect({ defaultValue: ['react', 'figma'], onValueChange })

    fireEvent.keyDown(field(), { key: 'Backspace' })
    expect(onValueChange).toHaveBeenLastCalledWith(['react'])
    expect(screen.getByRole('status')).toHaveTextContent('Figma removed')

    // Not while there is text.
    fireEvent.change(field(), { target: { value: 'x' } })
    fireEvent.keyDown(field(), { key: 'Backspace' })
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('removes a tag with its remove button and refocuses the field', () => {
    const onValueChange = vi.fn()
    renderMultiSelect({ defaultValue: ['react', 'figma'], onValueChange })

    fireEvent.click(screen.getByRole('button', { name: 'Remove tag React' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['figma'])
    expect(screen.queryByText('React')).not.toBeInTheDocument()
    expect(field()).toHaveFocus()
  })

  it('clears every tag with the clear button; Escape does not', () => {
    const onValueChange = vi.fn()
    renderMultiSelect({ defaultValue: ['react', 'figma'], onValueChange })

    fireEvent.keyDown(field(), { key: 'Escape' })
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(onValueChange).toHaveBeenLastCalledWith([])
    expect(field()).not.toHaveAttribute('aria-describedby')
  })

  it('keeps FormControl’s aria-describedby', () => {
    renderMultiSelect({
      defaultValue: ['react'],
      'aria-describedby': 'hint',
    })
    const ids = field().getAttribute('aria-describedby')?.split(' ')
    expect(ids).toHaveLength(2)
    expect(ids).toContain('hint')
  })

  it('works controlled', () => {
    const Controlled = () => {
      const [value, setValue] = useState<string[]>(['figma'])
      return (
        <>
          <MultiSelect
            aria-label="Skills"
            options={skills}
            value={value}
            onValueChange={setValue}
          />
          <output>{value.join(',')}</output>
        </>
      )
    }
    render(<Controlled />)

    fireEvent.change(field(), { target: { value: 'rea' } })
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(screen.getByText('figma,react')).toBeInTheDocument()
  })

  it('creates tags from the query', () => {
    const onCreate = vi.fn()
    const onValueChange = vi.fn()
    renderMultiSelect({ creatable: true, onCreate, onValueChange })

    fireEvent.change(field(), { target: { value: 'Rust' } })
    fireEvent.keyDown(field(), { key: 'Enter' })

    expect(onCreate).toHaveBeenCalledWith('Rust')
    expect(onValueChange).toHaveBeenLastCalledWith(['Rust'])
    // The tag has a label before the option is added.
    expect(screen.getByText('Rust')).toBeVisible()
  })

  it('offers no "Create" for a picked value, even when options lacks it', () => {
    const onCreate = vi.fn()
    // The parent doesn't add created values to `options`.
    renderMultiSelect({ creatable: true, onCreate })

    fireEvent.change(field(), { target: { value: 'Rust' } })
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(onCreate).toHaveBeenCalledTimes(1)

    for (const query of ['Rust', 'rust', ' RUST ']) {
      fireEvent.change(field(), { target: { value: query } })
      expect(
        screen.queryByRole('option', { name: /Create/ }),
      ).not.toBeInTheDocument()
    }
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(onCreate).toHaveBeenCalledTimes(1)
  })

  it('has no remove buttons and no list while disabled or read-only', () => {
    const { unmount } = renderMultiSelect({
      defaultValue: ['react'],
      disabled: true,
    })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    fireEvent.keyDown(field(), { key: 'Backspace' })
    expect(screen.getByText('React')).toBeVisible()
    unmount()

    renderMultiSelect({ defaultValue: ['react'], readOnly: true })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('submits one hidden input per value and marks required with ARIA', () => {
    const { container } = renderMultiSelect({
      name: 'skills',
      defaultValue: ['react', 'figma'],
      required: true,
    })
    const hidden = container.querySelectorAll('input[type="hidden"]')
    expect(
      [...hidden].map((input) => (input as HTMLInputElement).value),
    ).toEqual(['react', 'figma'])
    expect(field()).toHaveAttribute('aria-required', 'true')
    expect(field()).not.toHaveAttribute('required')
  })

  it('translates its strings with SnowUIProvider', () => {
    render(
      <SnowUIProvider
        messages={{
          combobox: {
            selected: (labels) => `Gewählt: ${labels.join(' und ')}`,
            removed: (label) => `${label} entfernt`,
          },
          tag: { remove: (label) => `${label} entfernen` },
        }}
      >
        <MultiSelect
          aria-label="Fähigkeiten"
          options={skills}
          defaultValue={['react', 'figma']}
        />
      </SnowUIProvider>,
    )
    expect(field()).toHaveAccessibleDescription('Gewählt: React und Figma')
    fireEvent.click(screen.getByRole('button', { name: 'Figma entfernen' }))
    expect(screen.getByRole('status')).toHaveTextContent('Figma entfernt')
  })
})
