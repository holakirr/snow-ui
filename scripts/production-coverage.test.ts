import { expect, it } from 'vitest'
import { completeSuite, requireDocsCoverage } from '../production/coverage'
import baseline from '../production/docs-baseline.json'

it('rejects a truncated published index, accepts new docs without dropping the baseline', () => {
  const docs = baseline.map((id) => ({ id }))
  expect(() => requireDocsCoverage(docs.slice(1))).toThrow('missing required')
  expect(() => requireDocsCoverage([...docs, docs[0]])).toThrow('duplicate')
  expect(() => requireDocsCoverage([...docs, { id: 'new-docs' }])).not.toThrow()
})
it('does not accept reduced, skipped, flaky or failed demo coverage', () => {
  const stats = { expected: 33, unexpected: 0, skipped: 0, flaky: 0 }
  expect(completeSuite(stats, 33)).toBe(true)
  for (const failure of [
    { expected: 32 },
    { skipped: 1 },
    { flaky: 1 },
    { unexpected: 1 },
  ]) {
    expect(completeSuite({ ...stats, ...failure }, 33)).toBe(false)
  }
})
