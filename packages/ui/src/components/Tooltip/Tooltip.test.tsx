import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, expectTypeOf, it } from 'vitest'

import { SnowUIProvider } from '../SnowUIProvider'
import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  type TooltipDescriptionProps,
  TooltipProvider,
  TooltipTitle,
  type TooltipTitleProps,
  TooltipTrigger,
} from './Tooltip'

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const RICH = 'has-[[data-slot^=tooltip-]]'

describe('rich Tooltip', () => {
  it('stacks a semibold title over its text, and describes the trigger with both', async () => {
    render(
      <SnowUIProvider dir="rtl">
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Info</TooltipTrigger>
            <TooltipContent>
              <TooltipTitle className="uppercase">
                This is a tooltip
              </TooltipTitle>
              <TooltipDescription>
                Tooltips describe an element.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SnowUIProvider>,
    )
    const tip = await screen.findByRole('tooltip')
    // Radix's hidden copy holds the title and the text; as paragraphs, the
    // trigger's description has a space between them.
    expect(tip).toHaveTextContent(
      'This is a tooltipTooltips describe an element.',
    )
    expect(
      screen.getByRole('button', { name: 'Info' }),
    ).toHaveAccessibleDescription(
      'This is a tooltip Tooltips describe an element.',
    )

    const content = tip.closest('[data-variant]') as HTMLElement
    expect(content).toHaveAttribute('dir', 'rtl')
    expect(content).toHaveClass(
      `${RICH}:flex-col`,
      `${RICH}:items-start`,
      `${RICH}:rounded-8`,
      `${RICH}:max-w-70`,
      // The plain tooltip's classes stay for tooltips without the parts.
      'rounded-12',
      'gap-1',
      'px-2',
      'py-1',
    )
    const [title] = screen.getAllByText('This is a tooltip')
    expect(title).toHaveAttribute('data-slot', 'tooltip-title')
    expect(title).toHaveClass('font-semibold', 'uppercase')
    expect(
      screen.getAllByText('Tooltips describe an element.')[0],
    ).toHaveAttribute('data-slot', 'tooltip-description')
  })

  it('forwards the refs and types the parts as paragraphs', async () => {
    let title: HTMLParagraphElement | null = null
    let description: HTMLParagraphElement | null = null
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Info</TooltipTrigger>
          <TooltipContent variant="light">
            <TooltipTitle
              ref={(node) => {
                title ??= node
              }}
            >
              Title
            </TooltipTitle>
            <TooltipDescription
              ref={(node) => {
                description ??= node
              }}
            >
              Text
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    await screen.findByRole('tooltip')
    expect(title).toBeInstanceOf(HTMLParagraphElement)
    expect(description).toBeInstanceOf(HTMLParagraphElement)
    expectTypeOf<TooltipTitleProps>().toMatchTypeOf<{ children?: unknown }>()
    expectTypeOf<TooltipDescriptionProps['ref']>().not.toBeNever()
  })
})
