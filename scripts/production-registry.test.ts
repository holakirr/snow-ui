import { afterEach, expect, it, vi } from 'vitest'
import { verifyPublicRegistry } from '../production/registry'

afterEach(() => vi.unstubAllGlobals())

const sha = 'a'.repeat(40)
const button = { name: 'button', meta: { commit: sha, version: '5.3.5' } }

it('checks the live item even when the catalog has already updated', async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(Response.json({ items: [button] }))
    .mockResolvedValueOnce(
      Response.json({
        ...button,
        meta: { ...button.meta, commit: 'b'.repeat(40) },
      }),
    )
  vi.stubGlobal('fetch', fetch)
  await expect(verifyPublicRegistry(sha, '5.3.5')).rejects.toThrow(
    'Button does not match',
  )
  expect(fetch).toHaveBeenCalledTimes(2)
})
