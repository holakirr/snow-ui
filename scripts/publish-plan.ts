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

/** `publish-plan.json` as `changeset pack` writes it (the parts we check). */
export interface PackedPlan {
  version: number
  plan: {
    kind: string
    name: string
    version: string
    tarball?: { path: string; integrity: string }
  }[][]
}

/**
 * What is wrong with the tarballs of a packed plan before they are
 * published: a missing tarball, or one whose sha256 differs from the
 * integrity `changeset pack` recorded (`sha256-<base64>`). `read` returns a
 * tarball's bytes (by its path in the plan), or undefined when it is missing.
 */
export const tarballProblems = (
  { version, plan }: PackedPlan,
  read: (path: string) => Uint8Array | undefined,
): string[] => {
  if (version !== 1) return [`Unknown publish plan version ${version}`]
  return plan.flat().flatMap((release) => {
    if (release.kind !== 'publish') return []
    const id = `${release.name}@${release.version}`
    if (!release.tarball) return [`${id} has no tarball in the plan`]
    const bytes = read(release.tarball.path)
    if (!bytes) return [`${id}: ${release.tarball.path} is missing`]
    const integrity = `sha256-${createHash('sha256').update(bytes).digest('base64')}`
    return integrity === release.tarball.integrity
      ? []
      : [
          `${id}: ${release.tarball.path} is ${integrity}, the pack job recorded ${release.tarball.integrity}`,
        ]
  })
}
