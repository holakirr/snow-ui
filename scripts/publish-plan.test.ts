import { describe, expect, it } from 'vitest'
import { classifyPackage, isDryRun } from './publish-plan'

const E404 = `npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/@holakirr%2fsnow-ui-charts - Not found`

describe('classifyPackage', () => {
  it('is published when npm finds it', () => {
    expect(
      classifyPackage('@holakirr/snow-ui', { status: 0, output: '' }, [
        '@holakirr/snow-ui@5.0.0',
      ]),
    ).toBe('published')
  })

  it('is new when npm has never heard of it and it has no release tag', () => {
    expect(
      classifyPackage(
        '@holakirr/snow-ui-charts',
        { status: 1, output: E404 },
        // Another package's tags don't count, even with a shared prefix.
        ['@holakirr/snow-ui@5.0.0', '@holakirr/snow-ui-icons@2.2.0'],
      ),
    ).toBe('new')
  })

  it('throws on a 404 for a package that has release tags', () => {
    expect(() =>
      classifyPackage('@holakirr/snow-ui', { status: 1, output: E404 }, [
        '@holakirr/snow-ui@4.0.0',
        '@holakirr/snow-ui@5.0.0',
      ]),
    ).toThrow(
      /it was released \(@holakirr\/snow-ui@4\.0\.0, @holakirr\/snow-ui@5\.0\.0\)/,
    )
  })

  it('throws on any other npm error', () => {
    expect(() =>
      classifyPackage(
        '@holakirr/snow-ui-charts',
        { status: 1, output: 'npm error code ECONNRESET' },
        [],
      ),
    ).toThrow(/npm view @holakirr\/snow-ui-charts failed/)
    expect(() =>
      classifyPackage(
        '@holakirr/snow-ui-charts',
        { status: null, output: '' },
        [],
      ),
    ).toThrow()
  })
})

describe('isDryRun', () => {
  it('is on only for 1 or true', () => {
    expect(isDryRun('1')).toBe(true)
    expect(isDryRun('true')).toBe(true)
    expect(isDryRun('TRUE')).toBe(true)
    expect(isDryRun('0')).toBe(false)
    expect(isDryRun('false')).toBe(false)
    expect(isDryRun('')).toBe(false)
    expect(isDryRun(undefined)).toBe(false)
  })
})
