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
 * - Any other npm error: throw.
 */
export const classifyPackage = (
  name: string,
  lookup: NpmLookup,
  tags: readonly string[],
): 'published' | 'new' => {
  if (lookup.status === 0) return 'published'
  if (!/\bE404\b/.test(lookup.output)) {
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
