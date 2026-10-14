import type { APIRequestContext } from '@playwright/test'
import { afterEach, expect, it, vi } from 'vitest'
import {
  accessHeaders,
  productionGet,
  scopedCookies,
  targets,
} from '../production/access'

afterEach(() => vi.unstubAllEnvs())
it('binds each credential to its own origin', () => {
  vi.stubEnv('SNOWUI_SITE_AUTOMATION_SECRET', 'test-site-secret')
  expect(
    accessHeaders(
      targets.SNOWUI_SITE_AUTOMATION_SECRET,
      'SNOWUI_SITE_AUTOMATION_SECRET',
    )['x-vercel-protection-bypass'],
  ).toBe('test-site-secret')
  expect(() =>
    accessHeaders(
      targets.SNOWUI_DEMO_AUTOMATION_SECRET,
      'SNOWUI_SITE_AUTOMATION_SECRET',
    ),
  ).toThrow('mismatch')
})
it('does not send credentials outside the allowed origin', async () => {
  const get = vi.fn()
  await expect(
    productionGet(
      { get } as unknown as APIRequestContext,
      targets.SNOWUI_SITE_AUTOMATION_SECRET,
      '//example.org/',
      'SNOWUI_SITE_AUTOMATION_SECRET',
    ),
  ).rejects.toThrow('Unexpected')
  expect(get).not.toHaveBeenCalled()
})
it('disables redirects and suppresses transport error details', async () => {
  vi.stubEnv('SNOWUI_SITE_AUTOMATION_SECRET', 'test-site-secret')
  const get = vi.fn().mockRejectedValue(new Error('header test-site-secret'))
  await expect(
    productionGet(
      { get } as unknown as APIRequestContext,
      targets.SNOWUI_SITE_AUTOMATION_SECRET,
      '/',
      'SNOWUI_SITE_AUTOMATION_SECRET',
    ),
  ).rejects.toThrow('Production request failed for snow-ui.holakirr.com')
  expect(get.mock.calls[0][1].maxRedirects).toBe(0)
})

it('narrows parent-domain cookies to the authorized HTTPS host', () => {
  const cookies = [
    { domain: '.snow-ui.holakirr.com', secure: false },
    { domain: 'example.org', secure: true },
  ]
  expect(scopedCookies(cookies, 'snow-ui.holakirr.com')).toEqual([
    { domain: 'snow-ui.holakirr.com', secure: true },
  ])
})
