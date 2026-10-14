import baseline from './docs-baseline.json'

// Preserve the verified production scope. Added docs are discovered live;
// intentional removals must update this reviewed baseline in the same PR.
export function requireDocsCoverage(docs: unknown[]) {
  const ids = docs.map((entry) => (entry as { id?: string }).id)
  if (
    new Set(ids).size !== ids.length ||
    baseline.some((id) => !ids.includes(id))
  ) {
    throw new Error(
      'Published docs index is missing required pages or has duplicate IDs',
    )
  }
}

export function completeSuite(
  stats: {
    expected: number
    unexpected: number
    skipped: number
    flaky: number
  },
  minimum: number,
) {
  return (
    stats.expected >= minimum &&
    stats.unexpected === 0 &&
    stats.skipped === 0 &&
    stats.flaky === 0
  )
}
