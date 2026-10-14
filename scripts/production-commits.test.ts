import { expect, it, vi } from 'vitest'
import { resolveProductionCommits } from './production-commits'

const site = 'a'.repeat(40)
const demo = 'b'.repeat(40)
const env = {
  GITHUB_API_URL: 'https://api.github.com',
  GITHUB_REPOSITORY: 'holakirr/snow-ui',
  GH_TOKEN: 'test-only-token',
  GITHUB_SHA: demo,
}
it('resolves a manual main run using the fetch Response.ok property', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json({ object: { sha: site } }))
  await expect(resolveProductionCommits(env, fetcher)).resolves.toEqual({
    site,
    demo,
  })
  expect(fetcher.mock.calls[0][1]?.redirect).toBe('error')
})
it('uses the caller release SHAs without consulting GitHub', async () => {
  const fetcher = vi.fn<typeof fetch>()
  await expect(
    resolveProductionCommits(
      { ...env, SITE_SHA: site, DEMO_SHA: demo },
      fetcher,
    ),
  ).resolves.toEqual({ site, demo })
  expect(fetcher).not.toHaveBeenCalled()
})
it('rejects failed HTTP responses and suppresses transport details', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(new Response(null, { status: 403 }))
  await expect(resolveProductionCommits(env, fetcher)).rejects.toThrow(
    'Cannot resolve release branch; request details suppressed',
  )
  fetcher.mockRejectedValue(new Error('test-only-token'))
  await expect(resolveProductionCommits(env, fetcher)).rejects.toThrow(
    'Cannot resolve release branch; request details suppressed',
  )
})
it('rejects malformed returned or caller SHAs', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json({ object: { sha: 'short' } }))
  await expect(resolveProductionCommits(env, fetcher)).rejects.toThrow(
    'full Git SHAs',
  )
  await expect(
    resolveProductionCommits(
      { ...env, SITE_SHA: site, DEMO_SHA: 'bad' },
      fetcher,
    ),
  ).rejects.toThrow('full Git SHAs')
})
