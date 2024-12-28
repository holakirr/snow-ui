import { setProjectAnnotations } from '@storybook/react'
import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, expect } from 'vitest'
import * as previewAnnotations from '../../.storybook/preview'

const annotations = setProjectAnnotations([previewAnnotations])

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

beforeAll(annotations.beforeAll)

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
