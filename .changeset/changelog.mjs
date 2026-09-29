// @ts-check
/**
 * The changelog generator of `.changeset/config.json`:
 * @changesets/changelog-github, except that a `#` inside a code span or a
 * code block stays text.
 *
 * changelog-github turns every `#` followed by digits in a changeset's
 * summary into a link to that issue, code spans included, so the colour
 * `#333` in the 5.0.0 notes became a link to issue 333. Here the code in the
 * summary is set aside while changelog-github formats the line: write
 * colours, and any other `#` that isn't an issue or PR reference, in
 * backticks (GitHub doesn't link them there either, in the GitHub release
 * notes). A bare `#123` is still linked.
 */
import github from '@changesets/changelog-github'

/** Stands in for `#` inside code: a private-use character, never in text. */
const HASH = ''

/** Code spans and fenced code blocks: a run of backticks up to the same run. */
const CODE = /(`+)[\s\S]*?\1/g

/** @param {string} summary */
const protectCode = (summary) =>
  summary.replace(CODE, (code) => code.replaceAll('#', HASH))

/** @param {string} line */
const restore = (line) => line.replaceAll(HASH, '#')

/** @type {import('@changesets/types').ChangelogFunctions} */
const changelogFunctions = {
  getDependencyReleaseLine: github.getDependencyReleaseLine,
  getReleaseLine: async (changeset, type, options) =>
    restore(
      await github.getReleaseLine(
        { ...changeset, summary: protectCode(changeset.summary) },
        type,
        options,
      ),
    ),
}

export default changelogFunctions
