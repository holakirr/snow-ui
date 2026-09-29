import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'

/** The size every element reports: jsdom has no layout. */
export const TEST_SIZE = { width: 600, height: 240 }

// Recharts sizes charts from their container: ResizeObserver (which jsdom
// lacks) and getBoundingClientRect (which jsdom answers with zeros). Without
// a size, nothing is drawn.
class ResizeObserverStub implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element) {
    const rect = target.getBoundingClientRect()
    this.callback(
      [{ target, contentRect: rect } as unknown as ResizeObserverEntry],
      this,
    )
  }

  unobserve() {}

  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver = ResizeObserverStub
  // Reduced motion: Recharts' `isAnimationActive="auto"` then draws the
  // final state at once, so tests don't wait for animations.
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
  HTMLElement.prototype.getBoundingClientRect =
    function getBoundingClientRect() {
      // Recharts measures tick labels in a hidden span: about 7px per character.
      const measuring = this.id === 'recharts_measurement_span'
      const width = measuring
        ? (this.textContent?.length ?? 0) * 7
        : TEST_SIZE.width
      const height = measuring ? 16 : TEST_SIZE.height
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        width,
        height,
        toJSON: () => ({}),
      } as DOMRect
    }
})

afterEach(() => {
  cleanup()
})
