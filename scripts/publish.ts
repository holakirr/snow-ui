/**
 * `changeset publish` or `changeset pack`, except for packages that are not
 * on npm yet. The release workflow (.github/workflows/release.yml) packs in
 * a job without write access (`pack`, after the build) and publishes the
 * tarballs in another (`publish --from-pack-dir`). Before publishing, the
 * packed plan and tarballs are checked against what this commit and npm
 * say should be published (publish-plan.ts, packedPlanProblems): the pack
 * job ran the build toolchain, so nothing it hands over is trusted as is.
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
 *   bun scripts/publish.ts [options]         # changeset publish (`bun run release`)
 *   bun scripts/publish.ts pack --out-dir packs       # changeset pack
 *   bun scripts/publish.ts --from-pack-dir packs      # publish those tarballs
 *   RELEASE_DRY_RUN=1 bun scripts/publish.ts   # only report what it would do
 *
 * Other arguments are passed on to changesets: the canary job of release.yml
 * runs `bun scripts/publish.ts --tag canary --no-git-tag` after
 * `changeset version --snapshot canary`.
 */
import { spawnSync } from 'node:child_process'
import {
  appendFileSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import {
  classifyPackage,
  isDryRun,
  type PackedPlan,
  type PackedTarball,
  packedPlanProblems,
} from './publish-plan'

interface WorkspacePackage {
  name: string
  file: string
  source: string
}

const root = join(import.meta.dirname, '..')

/**
 * The changesets command and its options: `pack …`, or `publish` with
 * options such as `--tag canary --no-git-tag` or `--from-pack-dir <dir>`.
 */
const [command, ...commandArgs] = (
  process.argv[2] === 'pack'
    ? process.argv.slice(2)
    : ['publish', ...process.argv.slice(2)]
).flatMap((arg) =>
  // `--from-pack-dir=packs` → `--from-pack-dir packs`, so it is always seen.
  arg.startsWith('--from-pack-dir=') ? arg.split(/=(.*)/s, 2) : [arg],
)

/** Run by path: `bun <file>` (unlike `bun run`) doesn't put it on the PATH. */
const changeset = join(root, 'node_modules/.bin/changeset')

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

/** The public workspace packages (name → version) this run may publish. */
const workspace = new Map(
  packages
    .filter((pkg) => !unpublished.includes(pkg))
    .map((pkg) => {
      const { name, version } = JSON.parse(pkg.source) as {
        name: string
        version: string
      }
      return [name, version] as const
    }),
)

/** A tarball of the pack directory: its bytes and its own package.json. */
const readTarball =
  (packDir: string) =>
  (path: string): PackedTarball | undefined => {
    const file = join(packDir, path)
    let bytes: Uint8Array
    try {
      bytes = readFileSync(file)
    } catch {
      return undefined
    }
    const manifest = spawnSync('tar', ['-xzOf', file, 'package/package.json'], {
      encoding: 'utf8',
    })
    try {
      return { bytes, manifest: JSON.parse(manifest.stdout) }
    } catch {
      return { bytes }
    }
  }

/**
 * Publishing packed tarballs: the plan the pack job wrote must be the plan
 * `changeset publish-plan` computes here, from this commit and npm, and
 * every tarball must be what the plan says (packedPlanProblems).
 */
const checkPackedPlan = (packDir: string) => {
  const expectedFile = join(
    mkdtempSync(join(tmpdir(), 'publish-plan-')),
    'plan.json',
  )
  const planned = spawnSync(
    changeset,
    ['publish-plan', '--output', expectedFile],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
  if (planned.status !== 0) {
    return [
      `changeset publish-plan exited with ${planned.status ?? planned.signal}`,
    ]
  }
  return packedPlanProblems(
    JSON.parse(
      readFileSync(join(packDir, 'publish-plan.json'), 'utf8'),
    ) as PackedPlan,
    JSON.parse(readFileSync(expectedFile, 'utf8')) as PackedPlan,
    workspace,
    readTarball(packDir),
  )
}

let status = 1
try {
  // Packages that aren't on npm yet: `private` in the working copy, which
  // changesets skips (also when it computes the expected plan).
  for (const pkg of unpublished) {
    const json = JSON.parse(pkg.source) as Record<string, unknown>
    writeFileSync(
      pkg.file,
      `${JSON.stringify({ ...json, private: true }, null, 2)}\n`,
    )
  }
  const packDirIndex = commandArgs.indexOf('--from-pack-dir')
  if (command === 'publish' && packDirIndex !== -1) {
    const problems = checkPackedPlan(
      resolve(root, commandArgs[packDirIndex + 1] ?? ''),
    )
    if (problems.length > 0) {
      throw new Error(`Not publishing:\n${problems.join('\n')}`)
    }
  }
  if (isDryRun(process.env.RELEASE_DRY_RUN)) {
    console.log(
      `Would run changeset ${[command, ...commandArgs].join(' ')}, skipping: ${
        unpublished.map((pkg) => pkg.name).join(', ') || 'none'
      }`,
    )
    status = 0
  } else {
    // Inherits stdio and the environment: changesets/action reads what was
    // published from the file CHANGESETS_OUTPUT names.
    const result = spawnSync(changeset, [command, ...commandArgs], {
      cwd: root,
      stdio: 'inherit',
    })
    if (result.error) {
      console.error(
        `Could not run changeset ${command}: ${result.error.message}`,
      )
    } else if (result.status !== 0) {
      console.error(
        `changeset ${command} exited with ${result.status ?? result.signal}`,
      )
    }
    status = result.status ?? 1
  }
} catch (error) {
  console.error((error as Error).message)
  status = 1
} finally {
  for (const pkg of unpublished) writeFileSync(pkg.file, pkg.source)
}
process.exit(status)
