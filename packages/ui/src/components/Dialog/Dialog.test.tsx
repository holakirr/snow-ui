import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './Dialog'

const classesOf = (element: HTMLElement) => [...element.classList]

describe('DialogBody', () => {
  it('pads 32px, and 80px from md, through --dialog-padding', () => {
    render(<DialogBody data-testid="body" />)
    const body = screen.getByTestId('body')

    expect(body).toHaveClass(
      'p-(--dialog-padding)',
      '[--dialog-padding:--spacing(8)]',
      'md:[--dialog-padding:--spacing(20)]',
      'bg-background-3',
      'rounded-32',
    )
  })

  it('lets a padding class win at every breakpoint', () => {
    render(<DialogBody data-testid="body" className="p-4" />)
    const body = screen.getByTestId('body')

    expect(body).toHaveClass('p-4')
    // No padding utility is left that could win at a larger breakpoint.
    expect(
      classesOf(body).filter((name) => /(^|:)p[xytrbl]?-/.test(name)),
    ).toEqual(['p-4'])
  })

  it('lets --dialog-padding change the padding and keep it responsive', () => {
    render(
      <DialogBody
        data-testid="body"
        className="md:[--dialog-padding:--spacing(12)]"
      />,
    )
    const body = screen.getByTestId('body')

    expect(body).toHaveClass(
      'p-(--dialog-padding)',
      '[--dialog-padding:--spacing(8)]',
      'md:[--dialog-padding:--spacing(12)]',
    )
    expect(body).not.toHaveClass('md:[--dialog-padding:--spacing(20)]')
  })
})

describe('Dialog', () => {
  it('renders the title row and the popup in an accessible dialog', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>New</DialogTitle>
          </DialogHeader>
          <DialogBody>Body</DialogBody>
        </DialogContent>
      </Dialog>,
    )

    const dialog = screen.getByRole('dialog', { name: 'New' })
    expect(dialog).toHaveTextContent('Body')
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
