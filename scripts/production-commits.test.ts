import { expect, it, vi } from 'vitest'
import { resolveProductionCommits } from './production-commits'

const site = 'a'.repeat(40)
const demo = 'b'.repeat(40)
const env = {
  GITHUB_API_URL: 'https://api.github.com',
  GITHUB_REPOSITORY: 'holakirr/snow-ui',
  GH_TOKEN: 'test-only-token',
  GITHUB_SHA: 'c'.repeat(40),
}
it('resolves the current published commits, not an ignored workflow-only main commit', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ object: { sha: site } }))
    .mockResolvedValueOnce(
      Response.json([
        { id: 2, sha: 'd'.repeat(40) },
        { id: 1, sha: demo },
      ]),
    )
    .mockResolvedValueOnce(Response.json([{ state: 'pending' }]))
    .mockResolvedValueOnce(Response.json([{ state: 'success' }]))
  await expect(resolveProductionCommits(env, fetcher)).resolves.toEqual({
    site,
    demo,
  })
  expect(
    fetcher.mock.calls.every(([, options]) => options?.redirect === 'error'),
  ).toBe(true)
  expect(fetcher.mock.calls[1][0]).toContain(
    encodeURIComponent('Production – snow-ui-demo'),
  )
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
    'Cannot resolve production commits; request details suppressed',
  )
  fetcher.mockRejectedValue(new Error('test-only-token'))
  await expect(resolveProductionCommits(env, fetcher)).rejects.toThrow(
    'Cannot resolve production commits; request details suppressed',
  )
})
it('rejects malformed returned or caller SHAs and missing active deployments', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json({ object: { sha: 'short' } }))
  await expect(
    resolveProductionCommits({ ...env, DEMO_SHA: demo }, fetcher),
  ).rejects.toThrow('full Git SHAs')
  await expect(
    resolveProductionCommits(
      { ...env, SITE_SHA: site, DEMO_SHA: 'bad' },
      fetcher,
    ),
  ).rejects.toThrow('full Git SHAs')
  fetcher.mockResolvedValue(Response.json([]))
  await expect(
    resolveProductionCommits({ ...env, SITE_SHA: site }, fetcher),
  ).rejects.toThrow('full Git SHAs')
})
