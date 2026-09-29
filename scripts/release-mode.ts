/**
 * Which half of a release the checked-out commit needs, decided the way
 * changesets/action (v2.1.2: src/index.ts, src/readChangesetState.ts)
 * decides it, so that .github/workflows/release.yml can run each half in its
 * own job with only the permissions that half needs:
 *
 * - `version`: changesets are pending → open or update the version PR
 *   (GitHub write token, no npm);
 * - `publish`: none are → build and pack in a job without write access,
 *   then publish the tarballs (npm OIDC, tags and GitHub releases);
 * - `none`: only empty changesets, which the action ignores.
 *
 *   bun scripts/release-mode.ts   # prints the mode
 */
import { join } from 'node:path'
import { readPreState } from '@changesets/pre'
import readChangesets from '@changesets/read'
import { type ReleaseMode, releaseMode } from './release-mode-decision'

const root = join(import.meta.dirname, '..')
const mode: ReleaseMode = releaseMode(
  await readChangesets(root),
  (await readPreState(root))?.mode,
)
console.log(mode)
