import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import { TableCopyButton } from './TableCopyButton'
import { TableLoadMore } from './TableLoadMore'
import { TablePageSize } from './TablePageSize'
import { TableResults } from './TableResults'
import { TableSelectionBar } from './TableSelectionBar'

describe('TableSelectionBar', () => {
  it('is a group named by its count, with Delete, Duplicate and your actions', () => {
    const onDelete = vi.fn()
    const onDuplicate = vi.fn()
    render(
      <TableSelectionBar
        count={2}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        className="ms-2"
      >
        <button type="button">Export</button>
      </TableSelectionBar>,
    )
    const bar = screen.getByRole('group', { name: '2 Selected' })
    expect(bar).toHaveAttribute('data-slot', 'table-selection-bar')
    expect(bar).toHaveClass('flex', 'items-center', 'gap-2', 'text-12', 'ms-2')
    // The divider is decorative.
    expect(within(bar).queryByRole('separator')).toBeNull()

    const buttons = within(bar).getAllByRole('button')
    expect(
      buttons.map(
        (button) => button.getAttribute('aria-label') ?? button.textContent,
      ),
    ).toEqual(['Delete', 'Duplicate', 'Export'])
    fireEvent.click(buttons[0] as HTMLElement)
    expect(onDelete).toHaveBeenCalledTimes(1)
    fireEvent.click(buttons[1] as HTMLElement)
    expect(onDuplicate).toHaveBeenCalledTimes(1)
  })

  it('shows only the buttons it has handlers for, with your labels', () => {
    render(
      <TableSelectionBar
        count={1}
        onDelete={() => {}}
        deleteLabel="Delete orders"
      />,
    )
    const bar = screen.getByRole('group', { name: '1 Selected' })
    expect(
      within(bar).getByRole('button', { name: 'Delete orders' }),
    ).toBeInTheDocument()
    expect(within(bar).queryByRole('button', { name: 'Duplicate' })).toBeNull()
  })

  it('takes its strings from SnowUIProvider', () => {
    render(
      <SnowUIProvider
        messages={{
          table: {
            selected: (count) => `Выбрано: ${count}`,
            delete: 'Удалить',
            duplicate: 'Дублировать',
          },
        }}
      >
        <TableSelectionBar
          count={3}
          onDelete={() => {}}
          onDuplicate={() => {}}
        />
      </SnowUIProvider>,
    )
    const bar = screen.getByRole('group', { name: 'Выбрано: 3' })
    expect(
      within(bar).getByRole('button', { name: 'Удалить' }),
    ).toBeInTheDocument()
    expect(
      within(bar).getByRole('button', { name: 'Дублировать' }),
    ).toBeInTheDocument()
  })
})

describe('TableCopyButton', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>()
  const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
  })
  afterEach(() => {
    vi.useRealTimers()
    if (original) Object.defineProperty(navigator, 'clipboard', original)
    else Reflect.deleteProperty(navigator, 'clipboard')
  })

  const renderInCell = (element: React.ReactNode) =>
    render(
      <table>
        <tbody>
          <tr>
            <td>{element}</td>
          </tr>
        </tbody>
      </table>,
    )

  it('copies its value, shows a check mark and announces "Copied"', async () => {
    const onCopy = vi.fn()
    renderInCell(
      <TableCopyButton value="Meadow Lane Oakland" onCopy={onCopy} />,
    )
    const button = screen.getByRole('button', { name: 'Copy' })
    expect(button).toHaveAttribute('type', 'button')
    expect(screen.getByRole('status')).toHaveTextContent('')

    await act(async () => {
      fireEvent.click(button)
    })
    expect(writeText).toHaveBeenCalledWith('Meadow Lane Oakland')
    expect(onCopy).toHaveBeenCalledWith('Meadow Lane Oakland')
    expect(button).toHaveAttribute('data-state', 'copied')
    expect(screen.getByRole('status')).toHaveTextContent('Copied')
  })

  it('turns back into the clipboard icon after 2 seconds', async () => {
    vi.useFakeTimers()
    renderInCell(<TableCopyButton value="x" />)
    const button = screen.getByRole('button', { name: 'Copy' })
    const icon = button.innerHTML
    await act(async () => {
      fireEvent.click(button)
    })
    expect(button.innerHTML).not.toBe(icon)
    act(() => vi.advanceTimersByTime(1999))
    expect(button).toHaveAttribute('data-state', 'copied')
    act(() => vi.advanceTimersByTime(1))
    expect(button).not.toHaveAttribute('data-state')
    expect(button.innerHTML).toBe(icon)
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('copies nothing when the clipboard refuses or onClick cancels', async () => {
    writeText.mockRejectedValue(new Error('NotAllowedError'))
    const onCopy = vi.fn()
    const { unmount } = renderInCell(
      <TableCopyButton value="x" onCopy={onCopy} />,
    )
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    })
    expect(onCopy).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).not.toHaveAttribute('data-state')
    unmount()

    writeText.mockClear()
    renderInCell(
      <TableCopyButton
        value="x"
        onClick={(event) => event.preventDefault()}
        aria-label="Copy the address"
      />,
    )
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy the address' }))
    })
    expect(writeText).not.toHaveBeenCalled()
  })

  it('hides only where the pointer can hover, until its cell is hovered or it has keyboard focus', () => {
    renderInCell(<TableCopyButton value="x" />)
    const button = screen.getByRole('button', { name: 'Copy' })
    expect(button).toHaveClass(
      '[@media(hover:hover)]:[:is(td,th):not(:hover)_&:not(:focus-visible)]:opacity-0',
      // A 16px icon with a 24px pointer target (WCAG 2.5.8).
      'size-4',
      'hit-area',
      'focus-ring',
    )
  })
})

describe('TablePageSize', () => {
  beforeEach(() => {
    // jsdom has no layout: what Radix Select calls on open.
    Element.prototype.scrollIntoView ??= () => {}
    Element.prototype.hasPointerCapture ??= () => false
  })

  it('is a combobox named "Rows per page", 20 by default', () => {
    render(<TablePageSize className="ms-1" />)
    const trigger = screen.getByRole('combobox', { name: 'Rows per page' })
    expect(trigger).toHaveTextContent('20')
    // The kit's Button Small Borderless.
    expect(trigger).toHaveClass(
      'min-h-6',
      'rounded-12',
      'px-3',
      'text-12',
      'hover:bg-black-4',
      'ms-1',
    )
  })

  it('lists its options and reports the pick as a number', () => {
    const onValueChange = vi.fn()
    render(
      <TablePageSize
        options={[10, 25]}
        defaultValue={25}
        onValueChange={onValueChange}
      />,
    )
    const trigger = screen.getByRole('combobox', { name: 'Rows per page' })
    expect(trigger).toHaveTextContent('25')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(['10', '25'])
    fireEvent.keyDown(screen.getByRole('option', { name: '10' }), {
      key: 'Enter',
    })
    expect(onValueChange).toHaveBeenCalledWith(10)
  })

  it('shows a controlled value; aria-label and SnowUIProvider name it', () => {
    const { rerender } = render(<TablePageSize value={50} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('50')
    rerender(<TablePageSize value={100} aria-label="Orders per page" />)
    expect(
      screen.getByRole('combobox', { name: 'Orders per page' }),
    ).toHaveTextContent('100')
    rerender(
      <SnowUIProvider messages={{ table: { pageSize: 'Строк на странице' } }}>
        <TablePageSize value={100} disabled />
      </SnowUIProvider>,
    )
    expect(
      screen.getByRole('combobox', { name: 'Строк на странице' }),
    ).toBeDisabled()
  })
})

describe('TableResults', () => {
  it('"105 results" in a status region, 12/16 text-secondary', () => {
    const ref = createRef<HTMLParagraphElement>()
    const { rerender } = render(
      <TableResults ref={ref} count={105} className="ms-1" />,
    )
    const results = screen.getByRole('status')
    expect(results).toBe(ref.current)
    expect(results).toHaveTextContent('105 results')
    expect(results).toHaveClass('text-12', 'text-secondary', 'ms-1')
    rerender(<TableResults count={1} />)
    expect(results).toHaveTextContent('1 result')
  })

  it('takes its text from SnowUIProvider', () => {
    render(
      <SnowUIProvider
        messages={{ table: { results: (count) => `${count} строк` } }}
      >
        <TableResults count={7} />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('7 строк')
  })
})

describe('TableLoadMore', () => {
  let observers: {
    callback: IntersectionObserverCallback
    observe: ReturnType<typeof vi.fn>
    disconnect: ReturnType<typeof vi.fn>
  }[] = []

  beforeEach(() => {
    observers = []
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn()
        disconnect = vi.fn()
        constructor(callback: IntersectionObserverCallback) {
          observers.push({
            callback,
            observe: this.observe,
            disconnect: this.disconnect,
          })
        }
      },
    )
  })
  afterEach(() => vi.unstubAllGlobals())

  const intersect = (isIntersecting: boolean) =>
    act(() =>
      observers
        .at(-1)
        ?.callback(
          [{ isIntersecting } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
    )

  it('calls onLoadMore when it scrolls into view', () => {
    const onLoadMore = vi.fn()
    const ref = createRef<HTMLDivElement>()
    render(<TableLoadMore ref={ref} onLoadMore={onLoadMore} />)
    expect(observers).toHaveLength(1)
    expect(observers[0]?.observe).toHaveBeenCalledWith(ref.current)
    expect(ref.current).toHaveAttribute('data-slot', 'table-load-more')
    expect(ref.current).toHaveClass('h-10', 'justify-center')
    intersect(false)
    expect(onLoadMore).not.toHaveBeenCalled()
    intersect(true)
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('stops observing while loading, and shows and announces the spinner', () => {
    const onLoadMore = vi.fn()
    const { container, rerender } = render(
      <TableLoadMore onLoadMore={onLoadMore} />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('')
    expect(container.querySelector('svg')).toBeNull()

    rerender(<TableLoadMore loading onLoadMore={onLoadMore} />)
    expect(observers[0]?.disconnect).toHaveBeenCalled()
    expect(observers).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Loading more')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden')

    // Loaded, still in view: observed anew, so it loads again.
    rerender(<TableLoadMore onLoadMore={onLoadMore} />)
    expect(observers).toHaveLength(2)
  })

  it("doesn't observe without onLoadMore; label wins over the provider", () => {
    render(
      <SnowUIProvider messages={{ table: { loadingMore: 'Загрузка' } }}>
        <TableLoadMore loading label="Loading orders" />
      </SnowUIProvider>,
    )
    expect(observers).toHaveLength(0)
    expect(screen.getByRole('status')).toHaveTextContent('Loading orders')
  })
})
