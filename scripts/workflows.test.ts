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

  // Every `container:` and `image:` in build-check.yml is one of the two
  // anchors (storybook-tests' container and its image, the pinned one), an
  // alias of them, or a container mapping (visual's) with such an image.
  it('is the image of every container in build-check.yml', () => {
    const values = Array.from(
      buildCheck?.matchAll(/^ +(container|image):(.*?)(?: +#.*)?$/gm) ?? [],
      ([, key, value]) => `${key}:${value}`,
    )
    const aliases = [
      'container:',
      'container: *playwright-container',
      'image: *playwright-image',
    ]
    expect(values.filter((value) => !aliases.includes(value))).toEqual([
      'container: &playwright-container',
      `image: &playwright-image ${pinned}`,
    ])
  })

  it.each(workflows)(
    "$file doesn't install Playwright's browsers",
    ({ source }) => {
      expect(source).not.toMatch(/playwright install/)
    },
  )
})

// In the Playwright image Bun comes from npm, locked with its hashes in
// .github/bun (`npm ci`): setup-bun, which the other jobs use, needs unzip.
// It must be the Bun package.json's packageManager names, setup-bun's.
describe('Bun in the Playwright image', () => {
  const json = (path: string) =>
    JSON.parse(readFileSync(join(root, path), 'utf8'))
  const lock = json('.github/bun/package-lock.json')
  const regenerate =
    'set the version in .github/bun/package.json, then run `npm install --package-lock-only` there'

  it(".github/bun locks packageManager's Bun", () => {
    const { packageManager } = json('package.json')
    const locked = [
      json('.github/bun/package.json').dependencies.bun,
      lock.packages['node_modules/bun'].version,
    ].map((version) => `bun@${version}`)
    expect(locked, regenerate).toEqual([packageManager, packageManager])
  })

  // bun's postinstall downloads a binary package missing from node_modules
  // from the registry, unverified: the runners' ones must be in the lock.
  it.each(['linux-x64', 'linux-x64-baseline', 'linux-aarch64'])(
    '.github/bun locks @oven/bun-%s with its hash',
    (platform) => {
      const { version, integrity } =
        lock.packages[`node_modules/@oven/bun-${platform}`] ?? {}
      expect({ version, integrity }, regenerate).toEqual({
        version: lock.packages['node_modules/bun'].version,
        integrity: expect.stringMatching(/^sha512-/),
      })
    },
  )
})
