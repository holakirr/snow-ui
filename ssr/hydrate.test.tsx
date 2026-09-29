import { act } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'
import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import { captureConsoleErrors, FIXED_NOW, stories } from './stories'

// Hydration phase of `bun run test:ssr`, in headless Chromium: each story's
// server HTML (from render.test.tsx) is put in the page and hydrated with
// the same story, as a server-rendered app does. A story fails when React
// reports a hydration mismatch (text, elements or attributes that differ
// between the server and the first client render) or logs any other error.

const serverHtml = Object.values(
  import.meta.glob<Record<string, string>>('../.tmp/ssr/stories.json', {
    eager: true,
    import: 'default',
  }),
)[0]

if (!serverHtml) {
  throw new Error(
    'No server HTML in .tmp/ssr/stories.json: run `bun run test:ssr`, which renders the stories on the server first.',
  )
}

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(FIXED_NOW)
})

afterAll(() => {
  vi.useRealTimers()
})

it.each(stories)('$id', async ({ id, Story }) => {
  const html = serverHtml[id]
  expect(html, 'the server phase did not render this story').toBeTypeOf(
    'string',
  )

  const container = document.createElement('div')
  container.innerHTML = html
  document.body.append(container)

  const recoverable: string[] = []
  const errors = captureConsoleErrors()
  let root: Root | undefined
  try {
    await act(async () => {
      root = hydrateRoot(container, <Story />, {
        // Hydration mismatches: React throws the server HTML away and
        // renders the tree on the client instead.
        onRecoverableError: (error) => {
          recoverable.push(error instanceof Error ? error.message : `${error}`)
        },
      })
    })
  } finally {
    errors.restore()
    await act(async () => root?.unmount())
    container.remove()
  }

  expect(recoverable).toEqual([])
  expect(errors.messages).toEqual([])
})
