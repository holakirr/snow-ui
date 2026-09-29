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
 * "Not on npm yet" means npm answers E404 *and* the package has no
 * `<name>@<version>` git tag; a 404 for a released package, or any other
 * npm error, fails the run before anything is published (publish-plan.ts).
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
import { classifyPackage, isDryRun } from './publish-plan'

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

/** Runs a command and returns what it printed; spawn errors throw. */
const run = (command: string, args: string[]) => {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' })
  if (result.error) {
    throw new Error(`${command} ${args.join(' ')}: ${result.error.message}`)
  }
  return {
    status: result.status,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  }
}

const unpublished = packages.filter((pkg) => {
  const lookup = run('npm', ['view', pkg.name, 'name', '--json'])
  if (lookup.status === 0) return false
  const tags = run('git', ['tag', '--list', `${pkg.name}@*`])
  if (tags.status !== 0) {
    throw new Error(`git tag --list failed:\n${tags.output}`)
  }
  return (
    classifyPackage(
      pkg.name,
      lookup,
      tags.output.split('\n').filter(Boolean),
    ) === 'new'
  )
})

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

if (isDryRun(process.env.RELEASE_DRY_RUN)) {
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
  if (result.error) {
    console.error(`Could not run changeset publish: ${result.error.message}`)
  } else if (result.status !== 0) {
    console.error(
      `changeset publish exited with ${result.status ?? result.signal}`,
    )
  }
  status = result.status ?? 1
} finally {
  for (const pkg of unpublished) writeFileSync(pkg.file, pkg.source)
}
process.exit(status)
