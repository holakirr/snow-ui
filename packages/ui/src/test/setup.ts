import { setProjectAnnotations } from '@storybook/react'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'
import * as previewAnnotations from '../../../../.storybook/preview'

const annotations = setProjectAnnotations([previewAnnotations])

beforeAll(annotations.beforeAll)

// jsdom builds its default stylesheet on the first getComputedStyle of each
// test file's jsdom: ~150 ms, more under coverage on a busy CI runner. Role
// queries, Radix and userEvent all call it, so the first test of each file
// paid for it; now the file's setup does, once.
getComputedStyle(document.body)

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
