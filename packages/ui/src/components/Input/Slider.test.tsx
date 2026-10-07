import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { SnowUIProvider } from '../SnowUIProvider'
import { Slider } from './Slider'

beforeAll(() => {
  // Radix Slider measures thumbs with ResizeObserver, which jsdom lacks.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Slider', () => {
  it('renders one thumb by default', () => {
    render(<Slider />)

    expect(screen.getAllByRole('slider')).toHaveLength(1)
  })

  it('renders two thumbs for a range', () => {
    render(<Slider defaultValue={[20, 80]} />)

    const thumbs = screen.getAllByRole('slider')
    expect(thumbs).toHaveLength(2)
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20')
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80')
  })

  it('renders a thumb per value for a controlled range', () => {
    render(<Slider value={[10, 40, 90]} />)

    expect(screen.getAllByRole('slider')).toHaveLength(3)
  })

  it('names the thumb with aria-label, not the role-less root', () => {
    const { container } = render(<Slider aria-label="Volume" />)

    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument()
    expect(container.firstElementChild).not.toHaveAttribute('aria-label')
  })

  it('names each thumb of a range', () => {
    render(<Slider aria-label="Price" defaultValue={[20, 80]} />)

    expect(
      screen.getByRole('slider', { name: 'Price, minimum' }),
    ).toHaveAttribute('aria-valuenow', '20')
    expect(
      screen.getByRole('slider', { name: 'Price, maximum' }),
    ).toHaveAttribute('aria-valuenow', '80')
  })

  it('passes aria-labelledby to the thumbs', () => {
    render(
      <>
        <span id="volume-label">Volume</span>
        <Slider aria-labelledby="volume-label" />
      </>,
    )

    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument()
  })

  it('shows a grab cursor on the thumb and a pointer on the bar', () => {
    const { container } = render(<Slider defaultValue={[50]} />)

    const thumb = screen.getByRole('slider')
    const root = container.firstElementChild

    expect(thumb).toHaveClass('cursor-grab', 'active:cursor-grabbing')
    expect(root).toHaveClass('cursor-pointer', 'data-disabled:cursor-default')
    expect(root).toContainElement(container.querySelector('.bg-primary'))
  })

  it('describes the thumbs, not the role-less root', () => {
    const { container } = render(
      <>
        <Slider
          aria-label="Price"
          aria-describedby="price-hint"
          aria-invalid
          defaultValue={[20, 80]}
        />
        <p id="price-hint">Between 10 and 90.</p>
      </>,
    )

    for (const thumb of screen.getAllByRole('slider')) {
      expect(thumb).toHaveAccessibleDescription('Between 10 and 90.')
      expect(thumb).toHaveAttribute('aria-invalid', 'true')
    }
    const root = container.firstElementChild
    expect(root).not.toHaveAttribute('aria-describedby')
    expect(root).not.toHaveAttribute('aria-invalid')
    expect(root).toHaveAttribute('data-invalid')
  })

  it('shows the label and names the thumb with it', () => {
    const { container } = render(<Slider label="Volume" defaultValue={[28]} />)

    const thumb = screen.getByRole('slider', { name: 'Volume' })
    expect(thumb).not.toHaveAttribute('aria-valuetext')
    // Two aria-hidden layers: over the empty track and over the fill.
    const labels = [
      ...container.querySelectorAll('[aria-hidden] > span'),
    ].filter((element) => element.textContent === 'Volume')
    expect(labels).toHaveLength(2)
    for (const label of labels) {
      expect(label.closest('[aria-hidden="true"]')).not.toBeNull()
    }
  })

  it('lets aria-label and thumbLabels win over label', () => {
    render(
      <>
        <Slider label="Volume" aria-label="Media volume" />
        <Slider label="Volume" thumbLabels={['Alarm volume']} />
      </>,
    )

    expect(
      screen.getByRole('slider', { name: 'Media volume' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('slider', { name: 'Alarm volume' }),
    ).toBeInTheDocument()
  })

  it('shows the value in percent and reads it out', () => {
    const { container } = render(
      <Slider
        aria-label="Zoom"
        showValue
        min={50}
        max={150}
        defaultValue={[78]}
      />,
    )

    const thumb = screen.getByRole('slider', { name: 'Zoom' })
    expect(thumb).toHaveAttribute('aria-valuenow', '78')
    expect(thumb).toHaveAttribute('aria-valuetext', '28%')
    expect(container.firstElementChild).toHaveTextContent('28%')
  })

  it('formats the value with valueFormatter', () => {
    const { container } = render(
      <>
        <Slider
          aria-label="Price"
          showValue
          valueFormatter={(v) => `$${v}`}
          defaultValue={[40]}
        />
        <Slider
          aria-label="Size"
          valueFormatter={(v) => `${v} px`}
          defaultValue={[12]}
        />
      </>,
    )

    expect(screen.getByRole('slider', { name: 'Price' })).toHaveAttribute(
      'aria-valuetext',
      '$40',
    )
    // Without showValue it is only read out.
    const size = screen.getByRole('slider', { name: 'Size' })
    expect(size).toHaveAttribute('aria-valuetext', '12 px')
    expect(container).not.toHaveTextContent('12 px')
  })

  it('takes messages.slider.value from the provider', () => {
    render(
      <SnowUIProvider
        messages={{ slider: { value: (value) => `${value} units` } }}
      >
        <Slider aria-label="Level" showValue defaultValue={[3]} />
      </SnowUIProvider>,
    )

    expect(screen.getByRole('slider', { name: 'Level' })).toHaveAttribute(
      'aria-valuetext',
      '3 units',
    )
  })

  it('updates the shown value when uncontrolled', () => {
    const { container } = render(
      <Slider aria-label="Volume" showValue defaultValue={[10]} />,
    )

    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })

    expect(thumb).toHaveAttribute('aria-valuenow', '11')
    expect(container.firstElementChild).toHaveTextContent('11%')
  })

  it('follows a controlled value and reports changes', () => {
    const changes: number[][] = []
    const Controlled = () => {
      const [value, setValue] = useState([30])
      return (
        <Slider
          aria-label="Volume"
          showValue
          value={value}
          onValueChange={(next) => {
            changes.push(next)
            setValue(next)
          }}
        />
      )
    }
    const { container } = render(<Controlled />)

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' })

    expect(changes).toEqual([[100]])
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '100')
    expect(container.firstElementChild).toHaveTextContent('100%')
  })

  it('keeps a controlled value that the owner does not update', () => {
    render(<Slider aria-label="Volume" value={[30]} />)

    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })

    expect(thumb).toHaveAttribute('aria-valuenow', '30')
  })

  it('clips the fill layer to the fill, from the right in right-to-left text', () => {
    const { container } = render(
      <SnowUIProvider dir="rtl">
        <Slider aria-label="Volume" label="Volume" defaultValue={[25]} />
      </SnowUIProvider>,
    )

    const clipped = container.querySelector<HTMLElement>('[style*="clip-path"]')
    expect(clipped?.style.clipPath).toBe(
      'inset(0 0 0 75% round var(--radius-8))',
    )
    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl')
  })

  it('puts the values of a range beside the track', () => {
    const { container } = render(
      <Slider
        aria-label="Price"
        className="w-80"
        showValue
        valueFormatter={(v) => `$${v}`}
        defaultValue={[20, 80]}
      />,
    )

    const wrapper = container.firstElementChild
    expect(wrapper?.tagName).toBe('DIV')
    expect(wrapper).toHaveClass('w-80')
    const texts = [...(wrapper?.children ?? [])].filter((child) =>
      child.getAttribute('aria-hidden'),
    )
    expect(texts.map((text) => text.firstElementChild?.textContent)).toEqual([
      '$20',
      '$80',
    ])
    expect(
      screen.getByRole('slider', { name: 'Price, minimum' }),
    ).toHaveAttribute('aria-valuetext', '$20')
  })

  it('shows the minimum by the start of an inverted range at the other end', () => {
    const { container } = render(
      <Slider aria-label="Price" inverted showValue defaultValue={[20, 80]} />,
    )

    const texts = [...(container.firstElementChild?.children ?? [])].filter(
      (child) => child.getAttribute('aria-hidden'),
    )
    expect(texts.map((text) => text.firstElementChild?.textContent)).toEqual([
      '80%',
      '20%',
    ])
  })

  it('renders the range without a wrapper when it shows no values', () => {
    const { container } = render(
      <Slider aria-label="Price" className="w-80" defaultValue={[20, 80]} />,
    )

    expect(container.firstElementChild).toHaveAttribute(
      'data-orientation',
      'horizontal',
    )
    expect(container.firstElementChild).toHaveClass('w-80')
  })

  it('resets an uncontrolled value with its form', () => {
    const { container } = render(
      <form>
        <Slider
          aria-label="Volume"
          name="volume"
          showValue
          defaultValue={[40]}
        />
      </form>,
    )

    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'Home' })
    expect(thumb).toHaveAttribute('aria-valuenow', '0')

    fireEvent.reset(container.querySelector('form') as HTMLFormElement)

    expect(thumb).toHaveAttribute('aria-valuenow', '40')
    expect(container.querySelector('form')).toHaveTextContent('40%')
  })

  it('gives a range wrapper the direction of a dir prop', () => {
    const { container } = render(
      <Slider aria-label="Price" dir="rtl" showValue defaultValue={[20, 80]} />,
    )

    const wrapper = container.firstElementChild
    expect(wrapper).toHaveAttribute('dir', 'rtl')
    expect(wrapper?.querySelector('[data-orientation]')).toHaveAttribute(
      'dir',
      'rtl',
    )
  })

  it('clips the fill layer from the right of an inverted bar', () => {
    const { container } = render(
      <Slider aria-label="Volume" inverted defaultValue={[25]} />,
    )

    const clipped = container.querySelector<HTMLElement>('[style*="clip-path"]')
    expect(clipped?.style.clipPath).toBe(
      'inset(0 0 0 75% round var(--radius-8))',
    )
  })

  it('commits once per key press', () => {
    const commits: number[][] = []
    render(
      <Slider
        aria-label="Volume"
        defaultValue={[10]}
        onValueCommit={(next) => commits.push(next)}
      />,
    )

    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    fireEvent.keyDown(thumb, { key: 'End' })

    expect(commits).toEqual([[11], [100]])
  })

  it('marks the thumbs of a disabled slider disabled', () => {
    render(<Slider aria-label="Price" disabled defaultValue={[20, 80]} />)

    for (const thumb of screen.getAllByRole('slider')) {
      expect(thumb).toHaveAttribute('aria-disabled', 'true')
      expect(thumb).not.toHaveAttribute('tabindex')
    }
  })

  it('warns when it switches between controlled and uncontrolled', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { rerender } = render(<Slider aria-label="Volume" />)
    rerender(<Slider aria-label="Volume" value={[40]} />)

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('from uncontrolled to controlled'),
    )
    warn.mockRestore()
  })
})
