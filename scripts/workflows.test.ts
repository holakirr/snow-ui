import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// GitHub runs a `run:` step without an explicit shell as `bash -e {0}`: no
// pipefail, so `failing-command | tee log` passes. `shell: bash` runs
// `bash --noprofile --norc -eo pipefail {0}`. Every workflow with `run:`
// steps sets it as the default, and no step picks another shell.
const root = join(import.meta.dirname, '..')
const dir = join(root, '.github/workflows')
const workflows = readdirSync(dir)
  .filter((file) => /\.ya?ml$/.test(file))
  .map((file) => ({ file, source: readFileSync(join(dir, file), 'utf8') }))

describe('workflows', () => {
  it.each(workflows.filter(({ source }) => /^\s+run:/m.test(source)))(
    '$file runs its steps in bash with pipefail',
    ({ source }) => {
      expect(source).toMatch(/^defaults:\n {2}run:\n {4}shell: bash\n/m)
      expect(source.match(/^\s+shell: (?!bash\s*$).*$/gm) ?? []).toEqual([])
    },
  )
})

// The Build Check jobs that run browsers run in the official Playwright
// image, which has the browsers and their system packages, instead of
// installing them (apt) on the runner: the image visual/Dockerfile pins by
// digest (`bun run visual`'s), written out once in build-check.yml with the
// `playwright-image` anchor and aliased by every other job. Its tag must be
// the version of every playwright-core in bun.lock (behind playwright and
// @playwright/test, so what `bun install --frozen-lockfile` puts in
// node_modules): another version looks for browser builds the image doesn't
// have. Dependabot bumps Playwright in package.json and bun.lock only, so
// its PR fails here until the new image is pinned in both files.
describe('Playwright image', () => {
  const pinned = readFileSync(join(root, 'visual/Dockerfile'), 'utf8').match(
    /^FROM (\S+)$/m,
  )?.[1]
  const buildCheck = workflows.find(
    ({ file }) => file === 'build-check.yml',
  )?.source

  it('visual/Dockerfile pins the image of the locked Playwright by digest', () => {
    const lock = readFileSync(join(root, 'bun.lock'), 'utf8')
    const locked = new Set(
      Array.from(lock.matchAll(/"playwright-core@([^"]+)"/g), ([, v]) => v),
    )
    const tag = pinned?.match(
      /^mcr\.microsoft\.com\/playwright:v(.+)-noble@sha256:[0-9a-f]{64}$/,
    )?.[1]
    expect(
      [...locked],
      `visual/Dockerfile pins ${pinned}: pin mcr.microsoft.com/playwright:v<locked version>-noble by digest there and in build-check.yml (CONTRIBUTING.md, Visual regression tests)`,
    ).toEqual([tag])
  })

  it('is the image of every container in build-check.yml', () => {
    const images = Array.from(
      buildCheck?.matchAll(/^ +image: (.+)$/gm) ?? [],
      ([, image]) => image,
    )
    expect(images.filter((image) => image !== '*playwright-image')).toEqual([
      `&playwright-image ${pinned}`,
    ])
  })

  it.each(workflows)(
    "$file doesn't install Playwright's browsers",
    ({ source }) => {
      expect(source).not.toMatch(/playwright install/)
    },
  )
})
