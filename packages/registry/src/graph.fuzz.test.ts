import { describe, expect, it } from 'vitest'
import { resolveRelative } from './graph'
import { relativeSpecifier } from './util'

// Fixed seeds and bounded paths keep failures reproducible in the normal CI suite.
function random(seed: number) {
  let state = seed >>> 0
  return (limit: number) => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) % limit
  }
}

const segments = ['components', 'hooks', 'util', 'a.b', 'nested-dir', '深い']
const names = ['Button', 'use-toast', 'surface', 'a.b', 'index']

function path(next: (limit: number) => number) {
  const directories = Array.from(
    { length: next(6) },
    () => segments[next(segments.length)],
  )
  return [
    ...directories,
    `${names[next(names.length)]}.${next(2) ? 'tsx' : 'ts'}`,
  ].join('/')
}

describe('registry module resolution: bounded seeded fuzz cases', () => {
  it.each([
    ['surface.tsx', '.', 'index.ts'],
    ['hooks/use-toast.ts', '..', 'index.tsx'],
  ])('resolves the root barrel from %s via %s', (from, specifier, target) => {
    expect(resolveRelative(from, specifier, (file) => file === target)).toBe(
      target,
    )
  })

  it.each([0x51a7, 0xc0ffee, 0xdeadbeef])(
    'preserves the target when generating and resolving relative imports (seed %i)',
    (seed) => {
      const next = random(seed)
      for (let sample = 0; sample < 500; sample++) {
        const from = path(next)
        const target = path(next)
        const specifier = relativeSpecifier(from, target)
        const known = new Set([target])
        const context = `seed=${seed} sample=${sample} from=${from} target=${target} specifier=${specifier}`
        expect(
          resolveRelative(from, specifier, (file) => known.has(file)),
          context,
        ).toBe(target)
        // Adding syntactically redundant path segments must not change identity.
        expect(
          resolveRelative(from, `./${specifier}`, (file) => known.has(file)),
          context,
        ).toBe(target)
        // The resolver must never invent a file absent from the available modules.
        expect(
          resolveRelative(from, specifier, () => false),
          context,
        ).toBeUndefined()
      }
    },
  )

  it.each([0x12345678, 0x87654321])(
    'resolves emitted .js imports back to the available TypeScript module (seed %i)',
    (seed) => {
      const next = random(seed)
      for (let sample = 0; sample < 500; sample++) {
        const from = path(next)
        // Explicit file imports also exercise index.ts without the barrel shorthand.
        const target = path(next)
        const emitted = target.replace(/\.tsx?$/, '.js')
        const specifier = relativeSpecifier(from, emitted)
        expect(
          resolveRelative(from, specifier, (file) => file === target),
          `seed=${seed} sample=${sample} from=${from} target=${target} specifier=${specifier}`,
        ).toBe(target)
      }
    },
  )
})
