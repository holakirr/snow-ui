import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  classifyPackage,
  isDryRun,
  type PackedPlan,
  tarballProblems,
} from './publish-plan'

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

  it('throws when npm view was interrupted, even after printing E404', () => {
    expect(() =>
      classifyPackage(
        '@holakirr/snow-ui-charts',
        { status: null, output: E404 },
        [],
      ),
    ).toThrow(/npm view @holakirr\/snow-ui-charts failed/)
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

describe('tarballProblems', () => {
  const tarball = new TextEncoder().encode('package contents')
  const integrity = `sha256-${createHash('sha256').update(tarball).digest('base64')}`
  const packed = (): PackedPlan => ({
    version: 1,
    plan: [
      [
        {
          kind: 'publish',
          name: '@holakirr/snow-ui-icons',
          version: '2.2.1',
          tarball: { path: 'packages/icons.tgz', integrity },
        },
      ],
      [{ kind: 'tag-only', name: 'private-thing', version: '1.0.0' }],
    ],
  })
  const reader = (files: Record<string, Uint8Array>) => (path: string) =>
    files[path]

  it('accepts tarballs that match the recorded integrity', () => {
    expect(
      tarballProblems(packed(), reader({ 'packages/icons.tgz': tarball })),
    ).toEqual([])
  })

  it('rejects a changed tarball', () => {
    expect(
      tarballProblems(
        packed(),
        reader({
          'packages/icons.tgz': new TextEncoder().encode('something else'),
        }),
      ),
    ).toEqual([
      expect.stringMatching(
        /^@holakirr\/snow-ui-icons@2\.2\.1: packages\/icons\.tgz is sha256-.*, the pack job recorded sha256-/,
      ),
    ])
  })

  it('rejects a missing tarball and an unknown plan version', () => {
    expect(tarballProblems(packed(), reader({}))).toEqual([
      '@holakirr/snow-ui-icons@2.2.1: packages/icons.tgz is missing',
    ])
    expect(tarballProblems({ version: 2, plan: [] }, reader({}))).toEqual([
      'Unknown publish plan version 2',
    ])
  })
})
