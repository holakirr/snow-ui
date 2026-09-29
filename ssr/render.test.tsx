import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import {
  captureConsoleErrors,
  FIXED_NOW,
  SERVER_HTML,
  stories,
} from './stories'

// Server phase of `bun run test:ssr`: every ui story rendered with
// react-dom/server in Node, where there is no `window` or `document`, as in
// a server-rendered app (Next.js, React Router). A story fails when it
// throws or React logs an error. The HTML goes to .tmp/ssr/stories.json
// for the hydration phase (hydrate.test.tsx, in Chromium).

const html: Record<string, string> = {}

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(FIXED_NOW)
})

afterAll(() => {
  vi.useRealTimers()
  const file = resolve(import.meta.dirname, '..', SERVER_HTML)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(html, null, 2)}\n`)
})

it('finds the ui stories', () => {
  expect(stories.length).toBeGreaterThan(100)
})

it.each(stories)('$id', ({ id, Story }) => {
  const errors = captureConsoleErrors()
  try {
    html[id] = renderToString(<Story />)
  } finally {
    errors.restore()
  }
  expect(errors.messages).toEqual([])
})
