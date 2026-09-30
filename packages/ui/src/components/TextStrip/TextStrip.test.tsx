import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { TextStrip } from './TextStrip'

describe('TextStrip', () => {
  it('is a 160×28 Black/4% pill with semibold, centred text', () => {
    render(<TextStrip>Text</TextStrip>)
    const strip = screen.getByText('Text')

    expect(strip.tagName).toBe('DIV')
    expect(strip).toHaveAttribute('data-state', 'off')
    expect(strip).toHaveClass(
      'h-7',
      'w-40',
      'rounded-full',
      'text-center',
      'text-14',
      'leading-7',
      'truncate',
      'bg-black-4',
      'font-semibold',
      'text-black',
    )
  })

  it('is Secondary/Indigo with static black text as the strip', () => {
    render(<TextStrip strip>Text</TextStrip>)
    const strip = screen.getByText('Text')

    expect(strip).toHaveAttribute('data-state', 'on')
    expect(strip).toHaveClass('bg-indigo', 'text-static-black')
    expect(strip).not.toHaveClass('bg-black-4', 'font-semibold')
  })

  it('gets a boundary with more contrast', () => {
    const { rerender } = render(<TextStrip>Text</TextStrip>)
    expect(screen.getByText('Text')).toHaveClass(
      'contrast-more:inset-ring',
      'contrast-more:inset-ring-control-border',
    )
    rerender(<TextStrip strip>Text</TextStrip>)
    expect(screen.getByText('Text')).toHaveClass(
      'contrast-more:inset-ring-2',
      'contrast-more:inset-ring-black-80',
    )
  })

  it('renders its child with asChild, its classes winning', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <TextStrip asChild strip ref={ref} className="w-60">
        <button type="button" className="w-full">
          Pro
        </button>
      </TextStrip>,
    )
    const button = screen.getByRole('button', { name: 'Pro' })

    expect(button).toHaveClass('w-full', 'bg-indigo', 'rounded-full')
    expect(button).not.toHaveClass('w-40', 'w-60')
    expect(button).toHaveAttribute('data-state', 'on')
    expect(ref.current).toBe(button)
  })
})
