import { createHash } from 'node:crypto'

/** What `npm view <name>` answered: its exit status and its output. */
export interface NpmLookup {
  status: number | null
  output: string
}

/**
 * Whether a workspace package is on npm (`published`) or has never been
 * released (`new`), from `npm view` and the package's git tags:
 *
 * - `npm view` found it: `published`.
 * - npm says E404 and there is no `<name>@<version>` tag: `new`. Its first
 *   version is published by hand (see scripts/publish.ts).
 * - npm says E404 but the package has release tags: it was published, so
 *   the registry lookup is wrong (a misconfigured registry, an auth or scope
 *   problem); throw instead of skipping every package and passing.
 * - Any other npm error, or `npm view` killed before it exited: throw.
 */
export const classifyPackage = (
  name: string,
  lookup: NpmLookup,
  tags: readonly string[],
): 'published' | 'new' => {
  if (lookup.status === 0) return 'published'
  // Killed by a signal (no exit status): whatever it printed can't be trusted.
  if (lookup.status === null || !/\bE404\b/.test(lookup.output)) {
    throw new Error(`npm view ${name} failed:\n${lookup.output}`)
  }
  const released = tags.filter((tag) => tag.startsWith(`${name}@`))
  if (released.length > 0) {
    throw new Error(
      `npm has no ${name}, but it was released (${released.join(', ')}): check the registry and the npm auth before publishing.\n${lookup.output}`,
    )
  }
  return 'new'
}

/** Whether `RELEASE_DRY_RUN` asks for a dry run: `1` or `true`, nothing else. */
export const isDryRun = (value: string | undefined): boolean =>
  value === '1' || value?.toLowerCase() === 'true'

/** A release of a publish plan (`changeset pack` / `changeset publish-plan`). */
export interface PlanEntry {
  kind: string
  name: string
  version: string
  access?: string
  tag?: string
  tarball?: { path: string; integrity: string }
}

/** `publish-plan.json`, as `changeset pack` and `changeset publish-plan` write it. */
export interface PackedPlan {
  version: number
  plan: PlanEntry[][]
}

/** A packed tarball: its bytes and its own package.json (name, version). */
export interface PackedTarball {
  bytes: Uint8Array
  manifest?: { name?: unknown; version?: unknown }
}

const TARBALL_PATH = /^packages\/[^/\\]+\.tgz$/

/** The parts of a release that decide what is published where. */
const releaseKey = ({ kind, name, version, access, tag }: PlanEntry) => ({
  kind,
  name,
  version,
  access,
  tag,
})

const describePlan = (plan: PackedPlan) =>
  JSON.stringify(plan.plan.map((chunk) => chunk.map(releaseKey)))

/**
 * What is wrong with a packed plan (and its tarballs) that the publish job is
 * about to publish. The pack job runs the build toolchain, so everything it
 * hands over is checked against what the publish job computes itself from
 * the commit and npm:
 *
 * - the releases (kind, name, version, access, dist-tag) must be exactly the
 *   plan `changeset publish-plan` computes in the publish job (`expected`);
 * - only `publish` releases, of public workspace packages, at their version
 *   at this commit (`workspace`: name → version);
 * - each tarball under `packages/` of the pack directory, with the sha256
 *   the plan records (`sha256-<base64>`) and its own package.json naming
 *   the same package and version (npm publishes what the tarball says).
 *
 * `tarball` reads a tarball by its path in the plan (undefined: missing).
 */
export const packedPlanProblems = (
  packed: PackedPlan,
  expected: PackedPlan,
  workspace: ReadonlyMap<string, string>,
  tarball: (path: string) => PackedTarball | undefined,
): string[] => {
  if (packed.version !== 1)
    return [`Unknown publish plan version ${packed.version}`]
  const problems: string[] = []
  if (describePlan(packed) !== describePlan(expected)) {
    problems.push(
      `The packed plan ${describePlan(packed)} is not the plan of this commit ${describePlan(expected)}`,
    )
  }
  for (const release of packed.plan.flat()) {
    const id = `${release.name}@${release.version}`
    if (release.kind !== 'publish') {
      problems.push(
        `${id}: a "${release.kind}" release; only "publish" is expected`,
      )
      continue
    }
    if (workspace.get(release.name) !== release.version) {
      problems.push(
        `${id} is not a public workspace package at its version in this commit`,
      )
    }
    if (!release.tarball) {
      problems.push(`${id} has no tarball in the plan`)
      continue
    }
    const { path, integrity } = release.tarball
    if (!TARBALL_PATH.test(path)) {
      problems.push(`${id}: ${path} is not a tarball under packages/`)
      continue
    }
    const packedTarball = tarball(path)
    if (!packedTarball) {
      problems.push(`${id}: ${path} is missing`)
      continue
    }
    const actual = `sha256-${createHash('sha256').update(packedTarball.bytes).digest('base64')}`
    if (actual !== integrity) {
      problems.push(
        `${id}: ${path} is ${actual}, the pack job recorded ${integrity}`,
      )
    }
    const { name, version } = packedTarball.manifest ?? {}
    if (name !== release.name || version !== release.version) {
      problems.push(
        `${id}: ${path} contains ${String(name)}@${String(version)}`,
      )
    }
  }
  return problems
}
