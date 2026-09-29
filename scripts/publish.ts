/**
 * The publish step of `bun run release` (run by .github/workflows/release.yml
 * after the build): `changeset publish`, except for packages that are not on
 * npm yet.
 *
 * Why: CI publishes with npm Trusted Publishing (OIDC, no token), and a
 * package's Trusted Publisher can only be configured on npmjs.com once the
 * package exists. The first version of a new workspace package would make
 * `changeset publish` fail (and the release job with it, after the other
 * packages were published but before their GitHub releases were created).
 * So a package that isn't on npm yet is set aside for this run (marked
 * `private` in the working copy, which `changeset publish` skips) with a
 * warning, and the owner publishes it by hand once, then configures its
 * Trusted Publisher; see CONTRIBUTING.md#publishing-a-new-package.
 *
 * Any other npm error fails the run before anything is published.
 *
 *   bun scripts/publish.ts            # what `bun run release` runs
 *   RELEASE_DRY_RUN=1 bun scripts/publish.ts   # only report what it would do
 */
import { spawnSync } from 'node:child_process'
import {
  appendFileSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

interface WorkspacePackage {
  name: string
  file: string
  source: string
}

const root = join(import.meta.dirname, '..')

const packages: WorkspacePackage[] = readdirSync(join(root, 'packages'))
  .map((dir) => join(root, 'packages', dir, 'package.json'))
  .flatMap((file) => {
    try {
      const source = readFileSync(file, 'utf8')
      const json = JSON.parse(source) as { name: string; private?: boolean }
      return json.private ? [] : [{ name: json.name, file, source }]
    } catch {
      return []
    }
  })

/** Whether a package has any version on npm (false only for E404). */
const isOnNpm = (name: string): boolean => {
  const result = spawnSync('npm', ['view', name, 'name', '--json'], {
    encoding: 'utf8',
  })
  if (result.status === 0) return true
  const output = `${result.stdout}\n${result.stderr}`
  if (/\bE404\b/.test(output)) return false
  throw new Error(`npm view ${name} failed:\n${output}`)
}

const unpublished = packages.filter((pkg) => !isOnNpm(pkg.name))

for (const pkg of unpublished) {
  const message = `${pkg.name} is not on npm yet, so this release skips it: npm Trusted Publishing can only be configured for an existing package. Publish its first version by hand and configure its Trusted Publisher (CONTRIBUTING.md, "Publishing a new package"); later releases publish it automatically.`
  console.log(`::warning title=First publish of ${pkg.name}::${message}`)
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `### Not published: ${pkg.name}\n\n${message}\n\n`,
    )
  }
}

if (process.env.RELEASE_DRY_RUN) {
  console.log(
    `Would publish with changeset publish, skipping: ${
      unpublished.map((pkg) => pkg.name).join(', ') || 'none'
    }`,
  )
  process.exit(0)
}

let status = 1
try {
  for (const pkg of unpublished) {
    const json = JSON.parse(pkg.source) as Record<string, unknown>
    writeFileSync(
      pkg.file,
      `${JSON.stringify({ ...json, private: true }, null, 2)}\n`,
    )
  }
  // Inherits stdout: changesets/action reads the "New tag:" lines from it.
  const result = spawnSync('changeset', ['publish'], {
    cwd: root,
    stdio: 'inherit',
  })
  status = result.status ?? 1
} finally {
  for (const pkg of unpublished) writeFileSync(pkg.file, pkg.source)
}
process.exit(status)
