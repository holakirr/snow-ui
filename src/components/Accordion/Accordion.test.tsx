import { composeStories } from '@storybook/react'
import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import * as stories from './Accordion.stories'

const { Single, Multiple } = composeStories(stories)

describe('Accordion', () => {
  it('renders with single props', async () => {
    await Single.run()

    const accordion = screen.getByRole('region')
    const accordionTriggers = screen.getAllByRole('button')

    expect(accordion).toBeInTheDocument()
    expect(accordionTriggers).toHaveLength(3)

    await act(async () => {
      await accordionTriggers[0].click()
    })

    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'true')

    await act(async () => {
      await accordionTriggers[1].click()
    })

    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'closed')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'false')
    expect(accordionTriggers[1]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[1]).toHaveAttribute('aria-expanded', 'true')
    expect(accordionTriggers[2]).toHaveAttribute('data-state', 'closed')
    expect(accordionTriggers[2]).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders with multiple type', async () => {
    await Multiple.run()

    const accordion = screen.getByRole('region')
    const accordionTriggers = screen.getAllByRole('button')

    expect(accordion).toBeInTheDocument()
    expect(accordionTriggers).toHaveLength(3)

    await act(async () => {
      await accordionTriggers[0].click()
    })

    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'true')

    await act(async () => {
      await accordionTriggers[1].click()
    })

    expect(accordionTriggers[0]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(accordionTriggers[1]).toHaveAttribute('data-state', 'open')
    expect(accordionTriggers[1]).toHaveAttribute('aria-expanded', 'true')
    expect(accordionTriggers[2]).toHaveAttribute('data-state', 'closed')
    expect(accordionTriggers[2]).toHaveAttribute('aria-expanded', 'false')
  })
})
