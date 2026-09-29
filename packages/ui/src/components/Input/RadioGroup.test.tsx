import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as stories from './RadioGroup.stories'

const { Default, WithDisabled } = composeStories(stories)

describe('RadioGroup', () => {
  it('keeps the ids of the stories unique when they share a page', () => {
    // The docs page renders every story of a component.
    const { container } = render(
      <>
        <Default />
        <WithDisabled />
      </>,
    )

    const ids = Array.from(container.querySelectorAll('[id]'), (el) => el.id)
    expect(new Set(ids).size).toBe(ids.length)

    // Each label names the radio of its own story.
    const [enabled, disabled] = screen.getAllByLabelText('Comfortable')
    expect(enabled).not.toBe(disabled)
    expect(enabled).toBeEnabled()
    expect(disabled).toBeDisabled()
  })

  it('checks the default value and selects on click', () => {
    render(<Default />)

    const comfortable = screen.getByRole('radio', { name: 'Comfortable' })
    expect(comfortable).toBeChecked()

    const compact = screen.getByRole('radio', { name: 'Compact' })
    fireEvent.click(compact)
    expect(compact).toBeChecked()
    expect(comfortable).not.toBeChecked()
  })
})
