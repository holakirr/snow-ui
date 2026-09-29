import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('is a status region that reads "Loading"', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')

    expect(spinner).toHaveTextContent('Loading')
    expect(spinner.querySelector('.sr-only')).toHaveTextContent('Loading')
    expect(spinner).toHaveClass('size-5')
  })

  it('draws the Loading A ring: r 9.5 and a 3px stroke in a 24 box', () => {
    render(<Spinner />)
    const svg = screen.getByRole('status').querySelector('svg') as SVGElement
    const circle = svg.querySelector('circle') as SVGCircleElement

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(circle).toHaveAttribute('r', '9.5')
    expect(circle).toHaveAttribute('stroke-width', '3')
    expect(circle).toHaveAttribute('stroke', 'currentColor')
    expect(circle).toHaveAttribute('stroke-linecap', 'round')
  })

  it('turns in CSS, which stops for reduced motion', () => {
    render(<Spinner />)
    const svg = screen.getByRole('status').querySelector('svg') as SVGElement
    const circle = svg.querySelector('circle') as SVGCircleElement

    expect(svg).toHaveClass(
      'animate-spinner-turn',
      'motion-reduce:animate-none',
    )
    expect(circle).toHaveClass(
      'animate-spinner-arc',
      'motion-reduce:animate-pulse',
    )
    // No SMIL, which prefers-reduced-motion can't stop.
    expect(svg.querySelector('animate, animateTransform')).toBeNull()
  })

  it('takes a size, and a size class over it', () => {
    const { rerender } = render(<Spinner size={48} />)
    expect(screen.getByRole('status')).toHaveClass('size-12')

    rerender(<Spinner size={48} className="size-7" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('size-7')
    expect(spinner).not.toHaveClass('size-12')
  })

  it('reads its label from the provider, and the label prop over it', () => {
    const { rerender } = render(
      <SnowUIProvider messages={{ spinner: { label: 'Загрузка' } }}>
        <Spinner />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка')

    rerender(
      <SnowUIProvider messages={{ spinner: { label: 'Загрузка' } }}>
        <Spinner label="Saving" />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Saving')
  })
})
