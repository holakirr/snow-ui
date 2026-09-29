import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  classifyPackage,
  isDryRun,
  type PackedPlan,
  packedPlanProblems,
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

describe('packedPlanProblems', () => {
  const bytes = new TextEncoder().encode('package contents')
  const integrity = `sha256-${createHash('sha256').update(bytes).digest('base64')}`
  const icons = {
    kind: 'publish',
    name: '@holakirr/snow-ui-icons',
    version: '2.2.1',
    access: 'public',
    tag: 'latest',
  }
  const packed = (
    release: Record<string, unknown> = {},
    path = 'packages/icons.tgz',
  ): PackedPlan => ({
    version: 1,
    plan: [[{ ...icons, ...release, tarball: { path, integrity } }]],
  })
  const expected: PackedPlan = { version: 1, plan: [[icons]] }
  const workspace = new Map([
    ['@holakirr/snow-ui', '5.1.0'],
    ['@holakirr/snow-ui-icons', '2.2.1'],
  ])
  const tarballs =
    (manifest: object = { name: icons.name, version: icons.version }) =>
    (path: string) =>
      path === 'packages/icons.tgz' ? { bytes, manifest } : undefined

  it('accepts the plan of this commit with matching tarballs', () => {
    expect(
      packedPlanProblems(packed(), expected, workspace, tarballs()),
    ).toEqual([])
  })

  it('rejects releases the publish job did not plan (another version or tag)', () => {
    const problems = packedPlanProblems(
      packed({ version: '9.9.9' }),
      expected,
      workspace,
      tarballs({ name: icons.name, version: '9.9.9' }),
    )
    expect(problems).toContainEqual(
      expect.stringMatching(
        /^The packed plan .* is not the plan of this commit/,
      ),
    )
    expect(problems).toContainEqual(
      '@holakirr/snow-ui-icons@9.9.9 is not a public workspace package at its version in this commit',
    )
    expect(
      packedPlanProblems(
        packed({ tag: 'next' }),
        expected,
        workspace,
        tarballs(),
      ),
    ).toEqual([
      expect.stringMatching(
        /^The packed plan .* is not the plan of this commit/,
      ),
    ])
  })

  it('rejects tag-only releases and tarballs outside packages/', () => {
    expect(
      packedPlanProblems(
        packed({ kind: 'tag-only' }),
        { version: 1, plan: [[{ ...icons, kind: 'tag-only' }]] },
        workspace,
        tarballs(),
      ),
    ).toEqual([
      '@holakirr/snow-ui-icons@2.2.1: a "tag-only" release; only "publish" is expected',
    ])
    expect(
      packedPlanProblems(
        packed({}, '../elsewhere.tgz'),
        expected,
        workspace,
        tarballs(),
      ),
    ).toEqual([
      '@holakirr/snow-ui-icons@2.2.1: ../elsewhere.tgz is not a tarball under packages/',
    ])
  })

  it('rejects a changed, missing or mislabelled tarball', () => {
    expect(
      packedPlanProblems(packed(), expected, workspace, () => ({
        bytes: new TextEncoder().encode('something else'),
        manifest: { name: icons.name, version: icons.version },
      })),
    ).toEqual([
      expect.stringMatching(
        /^@holakirr\/snow-ui-icons@2\.2\.1: packages\/icons\.tgz is sha256-.*, the pack job recorded sha256-/,
      ),
    ])
    expect(
      packedPlanProblems(packed(), expected, workspace, () => undefined),
    ).toEqual(['@holakirr/snow-ui-icons@2.2.1: packages/icons.tgz is missing'])
    expect(
      packedPlanProblems(
        packed(),
        expected,
        workspace,
        tarballs({ name: '@holakirr/snow-ui', version: '9.9.9' }),
      ),
    ).toEqual([
      '@holakirr/snow-ui-icons@2.2.1: packages/icons.tgz contains @holakirr/snow-ui@9.9.9',
    ])
    expect(
      packedPlanProblems(
        { version: 2, plan: [] },
        expected,
        workspace,
        tarballs(),
      ),
    ).toEqual(['Unknown publish plan version 2'])
  })
})
