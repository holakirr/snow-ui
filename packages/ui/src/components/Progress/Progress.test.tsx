import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import { Progress } from './Progress'
import { ProgressCircle } from './ProgressCircle'
import { normalizeProgress } from './value'

const fillOf = (bar: HTMLElement) => bar.firstElementChild as HTMLElement

afterEach(() => {
  vi.restoreAllMocks()
})

describe('normalizeProgress', () => {
  it('clamps the value to 0…max and keeps null indeterminate', () => {
    expect(normalizeProgress(40, 200)).toEqual({
      max: 200,
      value: 40,
      fraction: 0.2,
    })
    expect(normalizeProgress(150, 100).value).toBe(100)
    expect(normalizeProgress(-5, 100).value).toBe(0)
    expect(normalizeProgress(null, 100)).toEqual({
      max: 100,
      value: null,
      fraction: 0,
    })
    expect(normalizeProgress(undefined, undefined).value).toBeNull()
    expect(normalizeProgress(Number.NaN, 100).value).toBeNull()
  })

  it('falls back to a max of 100', () => {
    expect(normalizeProgress(5, 0).max).toBe(100)
    expect(normalizeProgress(5, -1).max).toBe(100)
    expect(normalizeProgress(5, Number.POSITIVE_INFINITY).max).toBe(100)
  })
})

describe('Progress', () => {
  it('is a named progressbar that reads a percentage', () => {
    render(<Progress value={30} max={60} aria-label="Upload" />)
    const bar = screen.getByRole('progressbar', { name: 'Upload' })

    expect(bar).toHaveAttribute('aria-valuemax', '60')
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuetext', '50%')
    expect(bar).toHaveAttribute('data-state', 'loading')
    expect(fillOf(bar)).toHaveStyle({ width: '50%' })
  })

  it('is 4px thick on a Black/10% track with a Black/100% fill', () => {
    render(<Progress value={10} aria-label="Upload" />)
    const bar = screen.getByRole('progressbar')

    expect(bar).toHaveClass(
      'h-1',
      'rounded-full',
      'bg-(--progress-track)',
      '[--progress-track:var(--color-black-10)]',
      '[--progress-fill:var(--color-black)]',
    )
    expect(fillOf(bar)).toHaveClass('bg-(--progress-fill)', 'rounded-full')
  })

  it('takes the Strip thicknesses', () => {
    render(<Progress value={10} thickness={8} aria-label="Upload" />)
    expect(screen.getByRole('progressbar')).toHaveClass('h-2')
  })

  it('lets a class set the fill colour', () => {
    render(
      <Progress
        value={10}
        aria-label="Upload"
        className="[--progress-fill:var(--color-indigo-text)]"
      />,
    )
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveClass('[--progress-fill:var(--color-indigo-text)]')
    expect(bar).not.toHaveClass('[--progress-fill:var(--color-black)]')
  })

  it('is indeterminate without a value', () => {
    render(<Progress aria-label="Loading" />)
    const bar = screen.getByRole('progressbar', { name: 'Loading' })

    expect(bar).toHaveAttribute('data-state', 'indeterminate')
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).not.toHaveAttribute('aria-valuetext')
    expect(fillOf(bar)).toHaveClass(
      'w-2/5',
      'start-0',
      'animate-progress-indeterminate',
      'motion-reduce:w-full',
      'motion-reduce:animate-pulse',
    )
    expect(fillOf(bar).style.width).toBe('')
    // The animation runs from the end side in right-to-left text.
    expect(bar).toHaveClass('rtl:[--progress-direction:-1]')
  })

  it('clamps out-of-range values instead of turning indeterminate', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<Progress value={250} aria-label="Upload" />)
    const bar = screen.getByRole('progressbar')

    expect(bar).toHaveAttribute('aria-valuenow', '100')
    expect(bar).toHaveAttribute('data-state', 'complete')
    expect(fillOf(bar)).toHaveStyle({ width: '100%' })
    expect(error).not.toHaveBeenCalled()
  })

  it('is named "Progress" by default, and not over aria-labelledby', () => {
    const { rerender } = render(<Progress value={1} />)
    expect(
      screen.getByRole('progressbar', { name: 'Progress' }),
    ).toBeInTheDocument()

    rerender(
      <>
        <span id="label">Storage</span>
        <Progress value={1} aria-labelledby="label" />
      </>,
    )
    const bar = screen.getByRole('progressbar', { name: 'Storage' })
    expect(bar).not.toHaveAttribute('aria-label')
  })

  it('reads its strings from the provider, and getValueLabel over them', () => {
    const messages = {
      progress: {
        label: 'Ход выполнения',
        value: (value: number, max: number) => `${value} из ${max}`,
      },
    }
    const { rerender } = render(
      <SnowUIProvider messages={messages}>
        <Progress value={3} max={4} />
      </SnowUIProvider>,
    )
    const bar = screen.getByRole('progressbar', { name: 'Ход выполнения' })
    expect(bar).toHaveAttribute('aria-valuetext', '3 из 4')

    rerender(
      <SnowUIProvider messages={messages}>
        <Progress
          value={3}
          max={4}
          getValueLabel={(value) => `Step ${value}`}
        />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      'Step 3',
    )
  })
})

describe('ProgressCircle', () => {
  const arcOf = (bar: HTMLElement) =>
    bar.querySelector('[data-slot="progress-circle-value"]')

  it('draws the value clockwise from 12 o’clock on the Loading A ring', () => {
    render(<ProgressCircle value={25} aria-label="Upload" />)
    const bar = screen.getByRole('progressbar', { name: 'Upload' })
    const arc = arcOf(bar) as SVGCircleElement
    const [dash, gap] = (arc.getAttribute('stroke-dasharray') ?? '')
      .split(' ')
      .map(Number)

    expect(bar).toHaveAttribute('aria-valuetext', '25%')
    expect(bar).toHaveClass('size-6')
    expect(arc).toHaveAttribute('r', '9.5')
    expect(arc).toHaveAttribute('transform', 'rotate(-90 12 12)')
    expect(gap).toBeCloseTo(2 * Math.PI * 9.5)
    expect(dash / gap).toBeCloseTo(0.25)
  })

  it('draws no arc at 0', () => {
    render(<ProgressCircle value={0} aria-label="Upload" />)
    expect(arcOf(screen.getByRole('progressbar'))).toBeNull()
  })

  it('turns like the Spinner without a value', () => {
    render(<ProgressCircle size={48} aria-label="Loading" />)
    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    const svg = bar.querySelector('svg') as SVGElement

    expect(bar).toHaveClass('size-12')
    expect(bar).toHaveAttribute('data-state', 'indeterminate')
    expect(svg).toHaveClass('animate-spinner-turn')
    expect(svg.querySelectorAll('circle')).toHaveLength(2)
    expect(svg.querySelectorAll('circle')[1]).toHaveClass(
      'animate-spinner-arc',
      'stroke-(--progress-fill)',
    )
  })

  it('is named "Progress" by default', () => {
    render(<ProgressCircle value={50} />)
    expect(
      screen.getByRole('progressbar', { name: 'Progress' }),
    ).toHaveAttribute('aria-valuetext', '50%')
  })
})
