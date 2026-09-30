import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Separator } from './Separator'

const linesOf = (element: Element) =>
  element.querySelectorAll('[data-slot="separator-line"]')

describe('Separator', () => {
  it('is one decorative Black/10% line, drawn in the text colour', () => {
    render(<Separator data-testid="separator" />)
    const separator = screen.getByTestId('separator')

    expect(separator).not.toHaveAttribute('role', 'separator')
    expect(separator).toHaveClass(
      'h-px',
      'w-full',
      'bg-current',
      'text-black-10',
    )
    expect(linesOf(separator)).toHaveLength(0)
    expect(separator).not.toHaveAttribute('data-count')
  })

  it('lets a bg or text class set the colour', () => {
    const { rerender } = render(
      <Separator data-testid="separator" className="bg-primary" />,
    )
    expect(screen.getByTestId('separator')).toHaveClass('bg-primary')
    expect(screen.getByTestId('separator')).not.toHaveClass('bg-current')

    rerender(<Separator data-testid="separator" className="text-black" />)
    expect(screen.getByTestId('separator')).toHaveClass(
      'bg-current',
      'text-black',
    )
  })

  it('is a separator for assistive technology when not decorative', () => {
    render(<Separator decorative={false} count={3} />)
    expect(screen.getByRole('separator')).toHaveAttribute('data-count', '3')
  })

  it('stacks `count` lines 8px apart', () => {
    render(<Separator data-testid="separator" count={4} hairline />)
    const separator = screen.getByTestId('separator')
    const lines = linesOf(separator)

    expect(separator).toHaveAttribute('data-count', '4')
    expect(separator).toHaveClass('flex-col', 'gap-2', 'text-black-10')
    expect(lines).toHaveLength(4)
    for (const line of lines) {
      expect(line).toHaveClass('h-px', 'w-full', 'bg-current', 'scale-y-50')
    }
  })

  it('puts the lines side by side when vertical, and clamps the count', () => {
    render(
      <Separator
        data-testid="separator"
        orientation="vertical"
        count={12 as 8}
      />,
    )
    const separator = screen.getByTestId('separator')

    expect(separator).toHaveClass('flex-row', 'h-full')
    expect(linesOf(separator)).toHaveLength(8)
    expect(linesOf(separator)[0]).toHaveClass('w-px', 'h-full')
  })

  it.each([
    ['end', ['order-last', 'rtl:-scale-x-100']],
    ['start', ['order-first', '-scale-x-100', 'rtl:scale-x-100']],
    ['right', ['order-last', 'rtl:order-first']],
    ['left', ['order-first', '-scale-x-100', 'rtl:order-last']],
  ] as const)('draws an arrowhead at the %s', (arrow, classes) => {
    render(<Separator data-testid="separator" arrow={arrow} />)
    const separator = screen.getByTestId('separator')
    const head = separator.querySelector('[data-slot="separator-arrow"]')

    expect(separator).toHaveClass('items-center', 'text-black-10')
    expect(linesOf(separator)).toHaveLength(1)
    expect(head).toHaveAttribute('aria-hidden', 'true')
    expect(head).toHaveClass(...classes)
  })

  it('ignores `arrow` on a vertical separator', () => {
    render(
      <Separator data-testid="separator" orientation="vertical" arrow="end" />,
    )
    const separator = screen.getByTestId('separator')
    expect(separator.querySelector('[data-slot="separator-arrow"]')).toBeNull()
    expect(separator).toHaveClass('w-px', 'h-full')
  })
})
