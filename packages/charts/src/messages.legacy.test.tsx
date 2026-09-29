import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Sparkline } from './Sparkline'

// `@holakirr/snow-ui` 5.0 (the peer range starts there) has no
// `messages.charts`: the charts fall back to their English strings.
vi.mock('@holakirr/snow-ui', async (importOriginal) => {
  const ui = await importOriginal<typeof import('@holakirr/snow-ui')>()
  const { charts: _charts, ...messages50 } = ui.defaultMessages
  return {
    ...ui,
    useSnowUI: () => ({ messages: messages50 }),
  }
})

describe('chart messages with @holakirr/snow-ui 5.0', () => {
  it('uses the English defaults', () => {
    render(<Sparkline title="Views" data={[1, 3, 2]} />)

    expect(
      screen.getAllByRole('columnheader').map((cell) => cell.textContent),
    ).toEqual(['Point', 'Value'])
  })
})
