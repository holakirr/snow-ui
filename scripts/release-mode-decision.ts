/** A pending changeset, as @changesets/read returns it. */
export interface PendingChangeset {
  id: string
  releases: readonly unknown[]
}

export type ReleaseMode = 'version' | 'publish' | 'none'

/**
 * changesets/action's decision (v2.1.2), given the pending changesets and
 * the pre-release mode (`.changeset/pre.json`):
 *
 * - in pre mode, changesets whose id starts with `pre/` don't count;
 * - no changesets: publish (what isn't on npm yet);
 * - only empty changesets (`changeset --empty`): nothing;
 * - otherwise: version.
 */
export const releaseMode = (
  changesets: readonly PendingChangeset[],
  preMode: 'pre' | 'exit' | undefined,
): ReleaseMode => {
  const pending =
    preMode === 'pre'
      ? changesets.filter((changeset) => !changeset.id.startsWith('pre/'))
      : changesets
  if (pending.length === 0) return 'publish'
  if (!pending.some((changeset) => changeset.releases.length > 0)) {
    return 'none'
  }
  return 'version'
}
