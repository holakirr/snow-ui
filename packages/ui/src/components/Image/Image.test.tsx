import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Image, type ImageSize } from './Image'

const frameOf = (img: HTMLElement) => img.closest('[data-size]') as HTMLElement

const markOf = (frame: HTMLElement) =>
  frame.querySelector('[data-slot="radio-mark"]')

describe('Image', () => {
  it('is a 40px rounded square on Black/4% that the picture fills', () => {
    render(
      <Image>
        <img src="data:," alt="Hills" />
      </Image>,
    )
    const img = screen.getByRole('img', { name: 'Hills' })
    const frame = frameOf(img)

    expect(frame).toHaveAttribute('data-size', '40')
    expect(frame).toHaveClass(
      'size-10',
      'rounded-12',
      'overflow-hidden',
      'bg-black-4',
      '[corner-shape:squircle]',
    )
    expect(img.parentElement).toHaveClass('*:size-full', '*:object-cover')
    expect(markOf(frame)).toBeNull()
    expect(frame).not.toHaveAttribute('data-state')
  })

  it.each<[ImageSize, string]>([
    [12, 'size-3 rounded-4'],
    [24, 'size-6 rounded-8'],
    [48, 'size-12 rounded-12'],
    [64, 'size-16 rounded-16'],
    [80, 'size-20 rounded-24'],
  ])('is %ipx with its radius', (size, classes) => {
    render(
      <Image size={size}>
        <img src="data:," alt="" />
      </Image>,
    )
    const frame = document.querySelector('[data-size]') as HTMLElement
    expect(frame).toHaveClass(...classes.split(' '))
  })

  it('takes its size from a class when free', () => {
    render(
      <Image size="free" className="h-24 w-40">
        <img src="data:," alt="" />
      </Image>,
    )
    const frame = document.querySelector('[data-size]') as HTMLElement
    expect(frame).toHaveAttribute('data-size', 'free')
    expect(frame).toHaveClass('h-24', 'w-40', 'rounded-16')
    expect(frame.className).not.toMatch(/\bsize-/)
  })

  it('insets the content on the tile as an icon', () => {
    render(
      <Image size={80} icon>
        <img src="data:," alt="" />
      </Image>,
    )
    const content = document.querySelector(
      '[data-slot="image-content"]',
    ) as HTMLElement
    expect(content).toHaveClass('p-3', '*:rounded-16')
  })

  it('darkens the top edge on hover when interactive', () => {
    render(
      <Image interactive>
        <img src="data:," alt="" />
      </Image>,
    )
    const frame = document.querySelector('[data-size]') as HTMLElement
    expect(frame).toHaveClass(
      'cursor-pointer',
      'hover:after:shadow-[inset_0_20px_20px_0_rgb(0_0_0/0.1)]',
      'motion-reduce:after:transition-none',
    )
  })

  it('shows a Primary ring when selected without an option mark', () => {
    render(
      <Image selected>
        <img src="data:," alt="" />
      </Image>,
    )
    const frame = document.querySelector('[data-size]') as HTMLElement
    expect(frame).toHaveAttribute('data-state', 'selected')
    expect(frame).toHaveClass(
      'before:inset-ring-2',
      'before:inset-ring-primary',
    )
  })

  it('shows the option mark, checked when selected, and no ring', () => {
    const { rerender } = render(
      <Image size={80} option>
        <img src="data:," alt="" />
      </Image>,
    )
    let frame = document.querySelector('[data-size]') as HTMLElement
    let mark = markOf(frame) as HTMLElement
    expect(mark).toHaveAttribute('aria-hidden', 'true')
    expect(mark).toHaveAttribute('data-state', 'unchecked')
    expect(mark).toHaveClass(
      'size-5',
      'top-2',
      'end-2',
      'inset-ring-control-border',
      'group-hover:inset-ring-control-border-strong',
    )

    rerender(
      <Image size={80} option selected>
        <img src="data:," alt="" />
      </Image>,
    )
    frame = document.querySelector('[data-size]') as HTMLElement
    mark = markOf(frame) as HTMLElement
    expect(mark).toHaveAttribute('data-state', 'checked')
    expect(mark).toHaveClass('inset-ring-[6px]', 'inset-ring-primary')
    expect(frame).not.toHaveClass('before:inset-ring-2')
  })

  it('scales the mark with the image', () => {
    render(
      <Image size={12} option>
        <img src="data:," alt="" />
      </Image>,
    )
    const frame = document.querySelector('[data-size]') as HTMLElement
    expect(markOf(frame)).toHaveClass('size-2', 'top-0', 'end-0')
  })

  it('passes the ref and props to the frame', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <Image ref={ref} data-testid="frame" className="rounded-8">
        <img src="data:," alt="" />
      </Image>,
    )
    const frame = screen.getByTestId('frame')
    expect(ref.current).toBe(frame)
    expect(frame).toHaveClass('rounded-8')
    expect(frame).not.toHaveClass('rounded-12')
  })
})
