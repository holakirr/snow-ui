import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Typography } from './Text'

describe('Typography', () => {
  it('is a 14 Regular span by default, without the hover padding', () => {
    render(<Typography>Text</Typography>)
    const text = screen.getByText('Text')

    expect(text.tagName).toBe('SPAN')
    expect(text).toHaveClass('text-14', 'font-normal', 'text-start')
    expect(text).not.toHaveClass('hover:px-1')
  })

  it('takes the Figma Hover padding on hover when interactive', () => {
    render(<Typography interactive>Text</Typography>)
    expect(screen.getByText('Text')).toHaveClass(
      'hover:px-1',
      'motion-reduce:transition-none',
    )
  })

  it('keeps the interactive padding with asChild', () => {
    render(
      <Typography asChild interactive size={16}>
        <a href="#top">Top</a>
      </Typography>,
    )
    expect(screen.getByRole('link', { name: 'Top' })).toHaveClass(
      'hover:px-1',
      'text-16',
    )
  })
})
