import { describe, expect, it } from 'vitest'
import changelog from '../.changeset/changelog.mjs'

// The changelog generator of .changeset/config.json. The changesets below
// have no commit, so changelog-github makes no GitHub API call.
const releaseLine = (summary: string) =>
  changelog.getReleaseLine({ id: 'test', releases: [], summary }, 'patch', {
    repo: 'holakirr/snow-ui',
  })

describe('changelog', () => {
  it('leaves a # in a code span alone', async () => {
    expect(await releaseLine('`background-1` is `#333` (was `#2A2A2A`).')).toBe(
      '\n\n- `background-1` is `#333` (was `#2A2A2A`).\n',
    )
  })

  it('leaves a # in a code block alone', async () => {
    expect(
      await releaseLine('Colours:\n\n```css\n.a { color: #111; }\n```'),
    ).toContain('  .a { color: #111; }')
  })

  it('still links issue and PR references', async () => {
    expect(await releaseLine('Fixes #12.')).toBe(
      '\n\n- Fixes [#12](https://github.com/holakirr/snow-ui/issues/12).\n',
    )
  })
})
