import { setProjectAnnotations } from '@storybook/react'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'
import * as previewAnnotations from '../../../../.storybook/preview'

const annotations = setProjectAnnotations([previewAnnotations])

beforeAll(annotations.beforeAll)

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
