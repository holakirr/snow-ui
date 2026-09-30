import { describe, expect, it } from 'vitest'
import { releaseMode } from './release-mode-decision'

const minor = { releases: [{ name: '@holakirr/snow-ui', type: 'minor' }] }

describe('releaseMode', () => {
  it('publishes when no changesets are pending', () => {
    expect(releaseMode([], undefined)).toBe('publish')
  })

  it('versions when a changeset releases something', () => {
    expect(
      releaseMode(
        [
          { id: 'empty', releases: [] },
          { id: 'combobox', ...minor },
        ],
        undefined,
      ),
    ).toBe('version')
  })

  it('does nothing when every pending changeset is empty', () => {
    expect(releaseMode([{ id: 'ci-only', releases: [] }], undefined)).toBe(
      'none',
    )
  })

  it('ignores `pre/` changesets in pre mode, as changesets/action does', () => {
    expect(releaseMode([{ id: 'pre/combobox', ...minor }], 'pre')).toBe(
      'publish',
    )
    expect(releaseMode([{ id: 'pre/combobox', ...minor }], 'exit')).toBe(
      'version',
    )
  })
})
