import { composeStories } from '@storybook/react'
import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import * as stories from './Accordion.stories'

const { Single, Multiple } = composeStories(stories)

describe('Accordion', () => {
  it('renders with single props', async () => {
    await Single.run()

    const accordionTriggers = screen.getAllByRole('button')

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(accordionTriggers).toHaveLength(3)

    await act(async () => {
      await accordionTriggers[0].click()
    })

    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('region')).toHaveLength(1)

    await act(async () => {
      await accordionTriggers[1].click()
    })

    expect(screen.getAllByRole('region')).toHaveLength(1)
    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'closed')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'false')
    expect(accordionTriggers[1]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[1]).toHaveAttribute('aria-expanded', 'true')
    expect(accordionTriggers[2]).toHaveAttribute('data-state', 'closed')
    expect(accordionTriggers[2]).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders with multiple type', async () => {
    await Multiple.run()

    const accordionTriggers = screen.getAllByRole('button')

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(accordionTriggers).toHaveLength(3)

    await act(async () => {
      await accordionTriggers[0].click()
    })

    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'true')

    await act(async () => {
      await accordionTriggers[1].click()
    })

    expect(screen.getAllByRole('region')).toHaveLength(2)
    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(accordionTriggers[1]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[1]).toHaveAttribute('aria-expanded', 'true')
    expect(accordionTriggers[2]).toHaveAttribute('data-state', 'closed')
    expect(accordionTriggers[2]).toHaveAttribute('aria-expanded', 'false')
  })
})
