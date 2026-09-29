import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../react-hook-form'
import { SnowUIProvider } from '../SnowUIProvider'
import { Combobox, type ComboboxProps } from './Combobox'
import {
  type ComboboxOption,
  type ComboboxOptionGroup,
  defaultComboboxFilter,
} from './listbox'

beforeAll(() => {
  // Radix positions the popup with ResizeObserver; jsdom has none.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const fruits: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', keywords: ['yellow'] },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'grapes', label: 'Grapes' },
]

const renderCombobox = (props: Partial<ComboboxProps> = {}) =>
  render(
    <>
      <label htmlFor="fruit">Fruit</label>
      <Combobox id="fruit" options={fruits} {...props} />
    </>,
  )

const field = () => screen.getByRole('combobox')
const activeOption = () => {
  const id = field().getAttribute('aria-activedescendant')
  return id ? document.getElementById(id) : null
}
const optionLabels = () =>
  screen.queryAllByRole('option').map((option) => option.textContent)

describe('Combobox', () => {
  it('is a collapsed combobox until the list opens', () => {
    renderCombobox({ placeholder: 'Pick a fruit' })

    expect(field()).toHaveAccessibleName('Fruit')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(field()).toHaveAttribute('aria-autocomplete', 'list')
    expect(field()).toHaveAttribute('autocomplete', 'off')
    expect(field()).not.toHaveAttribute('aria-controls')
    expect(field()).toHaveAttribute('placeholder', 'Pick a fruit')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('opens with ↓ on the first option and names the list after the label', () => {
    renderCombobox()
    fireEvent.keyDown(field(), { key: 'ArrowDown' })

    const listbox = screen.getByRole('listbox', { name: 'Fruit' })
    expect(field()).toHaveAttribute('aria-expanded', 'true')
    expect(field()).toHaveAttribute('aria-controls', listbox.id)
    expect(activeOption()).toHaveTextContent('Apple')
    expect(activeOption()).toHaveAttribute('data-highlighted', 'true')
  })

  it('opens with ↑ on the last enabled option; Alt+↑ closes it', () => {
    renderCombobox()
    fireEvent.keyDown(field(), { key: 'ArrowUp' })
    expect(activeOption()).toHaveTextContent('Grapes')

    fireEvent.keyDown(field(), { key: 'ArrowUp', altKey: true })
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens with Alt+↓ without a highlight', () => {
    renderCombobox()
    fireEvent.keyDown(field(), { key: 'ArrowDown', altKey: true })

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(field()).not.toHaveAttribute('aria-activedescendant')
    // Enter without a highlight does nothing.
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('moves the highlight past disabled options and wraps around', () => {
    renderCombobox()
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(activeOption()).toHaveTextContent('Blueberry')

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(activeOption()).toHaveTextContent('Grapes')
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(activeOption()).toHaveTextContent('Apple')
    fireEvent.keyDown(field(), { key: 'ArrowUp' })
    expect(activeOption()).toHaveTextContent('Grapes')

    expect(screen.getByRole('option', { name: 'Durian' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('filters by label and keywords as the user types', () => {
    const onQueryChange = vi.fn()
    renderCombobox({ onQueryChange })

    fireEvent.change(field(), { target: { value: 'b' } })
    expect(optionLabels()).toEqual(['Banana', 'Blueberry'])
    expect(activeOption()).toHaveTextContent('Banana')
    expect(onQueryChange).toHaveBeenLastCalledWith('b')

    fireEvent.change(field(), { target: { value: 'yellow' } })
    expect(optionLabels()).toEqual(['Banana'])
  })

  it('selects with Enter: the label fills the field and the list closes', () => {
    const onValueChange = vi.fn()
    const onQueryChange = vi.fn()
    renderCombobox({ onValueChange, onQueryChange })

    fireEvent.change(field(), { target: { value: 'blue' } })
    fireEvent.keyDown(field(), { key: 'Enter' })

    expect(onValueChange).toHaveBeenCalledWith('blueberry')
    expect(field()).toHaveValue('Blueberry')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    // The query resets.
    expect(onQueryChange).toHaveBeenLastCalledWith('')
  })

  it('selects with a click, not on a disabled option', () => {
    const onValueChange = vi.fn()
    renderCombobox({ onValueChange })
    fireEvent.keyDown(field(), { key: 'ArrowDown' })

    fireEvent.click(screen.getByRole('option', { name: 'Durian' }))
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.mouseMove(screen.getByRole('option', { name: 'Grapes' }))
    expect(activeOption()).toHaveTextContent('Grapes')
    fireEvent.click(screen.getByRole('option', { name: 'Grapes' }))
    expect(onValueChange).toHaveBeenCalledWith('grapes')
    expect(field()).toHaveValue('Grapes')
  })

  it('marks the selected option and highlights it when the list opens', () => {
    renderCombobox({ defaultValue: 'blueberry' })
    expect(field()).toHaveValue('Blueberry')

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    const selected = screen.getByRole('option', { name: 'Blueberry' })
    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(activeOption()).toBe(selected)
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
    // Every option shows, not only the ones matching the label.
    expect(optionLabels()).toHaveLength(5)
  })

  it('toggles the list with clicks on the field', () => {
    renderCombobox({ defaultValue: 'apple' })

    fireEvent.click(field())
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(activeOption()).toHaveTextContent('Apple')
    fireEvent.click(field())
    expect(field()).toHaveAttribute('aria-expanded', 'false')

    // While the user types, a click only moves the caret.
    fireEvent.change(field(), { target: { value: 'gr' } })
    fireEvent.click(field())
    expect(field()).toHaveAttribute('aria-expanded', 'true')
  })

  it('focuses the input on a pointer down on the padding', () => {
    renderCombobox()
    const shell = field().closest('[data-slot="combobox"]') as HTMLElement

    fireEvent.pointerDown(shell)
    expect(field()).toHaveFocus()
  })

  it('drops the query when it loses focus, and keeps the value', () => {
    const onValueChange = vi.fn()
    renderCombobox({ defaultValue: 'apple', onValueChange })

    fireEvent.change(field(), { target: { value: 'gra' } })
    expect(field()).toHaveValue('gra')
    fireEvent.blur(field())

    expect(field()).toHaveValue('Apple')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('clears the value when the text is emptied and the field is left', () => {
    const onValueChange = vi.fn()
    renderCombobox({ defaultValue: 'apple', onValueChange })

    fireEvent.change(field(), { target: { value: '' } })
    fireEvent.blur(field())

    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(field()).toHaveValue('')
  })

  it('keeps the value when the text is emptied and clearable is false', () => {
    const onValueChange = vi.fn()
    renderCombobox({ defaultValue: 'apple', onValueChange, clearable: false })

    fireEvent.change(field(), { target: { value: '' } })
    fireEvent.blur(field())

    expect(onValueChange).not.toHaveBeenCalled()
    expect(field()).toHaveValue('Apple')
    expect(
      screen.queryByRole('button', { name: 'Clear' }),
    ).not.toBeInTheDocument()
  })

  it('closes with Escape, then clears with Escape', () => {
    const onValueChange = vi.fn()
    renderCombobox({ defaultValue: 'apple', onValueChange })

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    fireEvent.keyDown(field(), { key: 'Escape' })
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(onValueChange).not.toHaveBeenCalled()

    fireEvent.keyDown(field(), { key: 'Escape' })
    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(field()).toHaveValue('')
  })

  it('clears with the clear button and refocuses the input', () => {
    const onValueChange = vi.fn()
    renderCombobox({ defaultValue: 'apple', onValueChange })

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))

    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(field()).toHaveValue('')
    expect(field()).toHaveFocus()
    expect(
      screen.queryByRole('button', { name: 'Clear' }),
    ).not.toBeInTheDocument()
  })

  it('works controlled', () => {
    const Controlled = () => {
      const [value, setValue] = useState<string | null>('apple')
      return (
        <>
          <Combobox
            aria-label="Fruit"
            options={fruits}
            value={value}
            onValueChange={setValue}
          />
          <output>{value ?? 'none'}</output>
        </>
      )
    }
    render(<Controlled />)
    expect(field()).toHaveValue('Apple')

    fireEvent.change(field(), { target: { value: 'grap' } })
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(screen.getByText('grapes')).toBeInTheDocument()
    expect(field()).toHaveValue('Grapes')
  })

  it('ignores a value change the parent refuses', () => {
    render(<Combobox aria-label="Fruit" options={fruits} value="apple" />)
    fireEvent.change(field(), { target: { value: 'grap' } })
    fireEvent.keyDown(field(), { key: 'Enter' })
    expect(field()).toHaveValue('Apple')
  })

  it('shows the value itself when no option has it', () => {
    render(<Combobox aria-label="Fruit" options={fruits} value="kiwi" />)
    expect(field()).toHaveValue('kiwi')
  })

  it('renders titled groups', () => {
    const groups: (ComboboxOption | ComboboxOptionGroup)[] = [
      { value: 'none', label: 'No team' },
      {
        label: 'Design',
        options: [
          { value: 'ui', label: 'UI' },
          { value: 'ux', label: 'UX' },
        ],
      },
      {
        label: 'Engineering',
        options: [{ value: 'web', label: 'Web' }],
      },
    ]
    render(<Combobox aria-label="Team" options={groups} defaultOpen />)

    const design = screen.getByRole('group', { name: 'Design' })
    expect(within(design).getAllByRole('option')).toHaveLength(2)
    expect(screen.getByRole('group', { name: 'Engineering' })).toBeVisible()
    // Loose options aren't in a group.
    expect(
      screen.getByRole('option', { name: 'No team' }).parentElement,
    ).toHaveAttribute('role', 'listbox')

    fireEvent.change(field(), { target: { value: 'we' } })
    expect(
      screen.queryByRole('group', { name: 'Design' }),
    ).not.toBeInTheDocument()
  })

  it('takes a custom filter, or none', () => {
    const { unmount } = render(
      <Combobox
        aria-label="Fruit"
        options={fruits}
        filter={(option, query) => option.label.startsWith(query)}
      />,
    )
    fireEvent.change(field(), { target: { value: 'B' } })
    expect(optionLabels()).toEqual(['Banana', 'Blueberry'])
    unmount()

    render(<Combobox aria-label="Fruit" options={fruits} filter={false} />)
    fireEvent.change(field(), { target: { value: 'zzz' } })
    expect(optionLabels()).toHaveLength(5)
  })

  it('shows and announces the empty message', () => {
    render(
      <Combobox
        aria-label="Fruit"
        options={fruits}
        emptyMessage="Nothing here"
      />,
    )
    fireEvent.change(field(), { target: { value: 'zzz' } })

    expect(screen.getByText('Nothing here', { selector: 'p' })).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here')
  })

  it('shows loading: a busy list and the loading message', () => {
    render(<Combobox aria-label="Person" options={[]} loading defaultOpen />)

    expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute(
      'aria-busy',
      'true',
    )
    expect(screen.getByText('Loading', { selector: 'p' })).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })

  it('creates an option from the query', () => {
    const onCreate = vi.fn()
    const onValueChange = vi.fn()
    render(
      <Combobox
        aria-label="Label"
        options={[{ value: 'bug', label: 'Bug' }]}
        creatable
        onCreate={onCreate}
        onValueChange={onValueChange}
      />,
    )

    // No "Create" for an exact (case-insensitive) match.
    fireEvent.change(field(), { target: { value: 'bug' } })
    expect(
      screen.queryByRole('option', { name: /Create/ }),
    ).not.toBeInTheDocument()

    fireEvent.change(field(), { target: { value: '  docs ' } })
    const create = screen.getByRole('option', { name: 'Create "docs"' })
    expect(activeOption()).toBe(create)
    fireEvent.click(create)

    expect(onCreate).toHaveBeenCalledWith('docs')
    expect(onValueChange).toHaveBeenCalledWith('docs')
    // The label shows before the option is added to `options`.
    expect(field()).toHaveValue('docs')
  })

  it('stays closed and unchanged while disabled or read-only', () => {
    const { unmount } = renderCombobox({
      disabled: true,
      defaultValue: 'apple',
    })
    expect(field()).toBeDisabled()
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    fireEvent.click(field())
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(field().closest('[data-slot="combobox"]')).toHaveAttribute(
      'data-disabled',
      'true',
    )
    unmount()

    renderCombobox({ readOnly: true, defaultValue: 'apple' })
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    fireEvent.keyDown(field(), { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(field()).toHaveValue('Apple')
    expect(
      screen.queryByRole('button', { name: 'Clear' }),
    ).not.toBeInTheDocument()
  })

  it('skips its keys when onKeyDown prevents the default', () => {
    renderCombobox({ onKeyDown: (event) => event.preventDefault() })
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('works with a controlled open state', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Combobox
        aria-label="Fruit"
        options={fruits}
        open={false}
        onOpenChange={onOpenChange}
      />,
    )
    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    rerender(
      <Combobox
        aria-label="Fruit"
        options={fruits}
        open
        onOpenChange={onOpenChange}
      />,
    )
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('submits its value with a hidden input', () => {
    const { container } = renderCombobox({
      name: 'fruit',
      defaultValue: 'banana',
    })
    const hidden = container.querySelector('input[type="hidden"]')
    expect(hidden).toHaveAttribute('name', 'fruit')
    expect(hidden).toHaveValue('banana')
    // The visible input has no name: it holds the label.
    expect(field()).not.toHaveAttribute('name')
  })

  it('marks the field invalid from aria-invalid', () => {
    renderCombobox({ 'aria-invalid': true })
    expect(field()).toHaveAttribute('aria-invalid', 'true')
    expect(field().closest('[data-slot="combobox"]')).toHaveAttribute(
      'data-invalid',
      'true',
    )
  })

  it('translates its strings with SnowUIProvider', () => {
    render(
      <SnowUIProvider
        messages={{
          combobox: {
            clear: 'Löschen',
            empty: 'Keine Treffer',
            create: (query) => `„${query}“ anlegen`,
          },
        }}
      >
        <Combobox
          aria-label="Obst"
          options={fruits}
          defaultValue="apple"
          creatable
        />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('button', { name: 'Löschen' })).toBeInTheDocument()
    fireEvent.change(field(), { target: { value: 'Kiwi' } })
    expect(
      screen.getByRole('option', { name: '„Kiwi“ anlegen' }),
    ).toBeInTheDocument()
  })

  it('forwards the ref to the input for react-hook-form', async () => {
    let setFocus: (name: 'fruit') => void = () => {}
    const TestForm = () => {
      const form = useForm<{ fruit: string | null }>({
        defaultValues: { fruit: null },
      })
      setFocus = form.setFocus
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="fruit"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Fruit</FormLabel>
                <FormControl>
                  <Combobox
                    options={fruits}
                    value={value}
                    onValueChange={onChange}
                    {...rest}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      )
    }
    render(<TestForm />)

    // react-hook-form focuses the field's ref in a timeout.
    act(() => setFocus('fruit'))
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveFocus(),
    )
  })
})

describe('defaultComboboxFilter', () => {
  it('matches every word in the label or the keywords', () => {
    const option = { value: 'x', label: 'New York', keywords: ['usa'] }
    expect(defaultComboboxFilter(option, 'york new')).toBe(true)
    expect(defaultComboboxFilter(option, 'USA')).toBe(true)
    expect(defaultComboboxFilter(option, 'york paris')).toBe(false)
  })
})
