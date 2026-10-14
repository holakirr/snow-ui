import { type BrowserContext, request } from '@playwright/test'
import { productionGet, type SecretName, scopedCookies } from './access'

export async function authorizeProduction(
  context: BrowserContext,
  origin: string,
  secretName: SecretName,
) {
  const bootstrap = await request.newContext({ ignoreHTTPSErrors: false })
  try {
    const response = await productionGet(bootstrap, origin, '/', secretName)
    if (response.status() >= 400)
      throw new Error('Production authentication rejected')
    const location = response.headers().location
    if (location && new URL(location, origin).origin !== origin)
      throw new Error('Unexpected authentication redirect')
    const hostname = new URL(origin).hostname
    const state = await bootstrap.storageState()
    const cookies = scopedCookies(state.cookies, hostname)
    // Public production domains may return no bypass cookie, including same-origin redirects.
    // The browser then accesses the public domain normally; protected responses still fail above.
    await context.addCookies(cookies)
  } catch {
    throw new Error(
      `Production authentication failed for ${new URL(origin).hostname}; sensitive request details suppressed`,
    )
  } finally {
    await bootstrap.dispose()
  }
}
