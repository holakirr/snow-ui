import { request, type BrowserContext } from '@playwright/test'

export async function authorizeProduction(context: BrowserContext, origin: string, secretName: string) {
  const secret = process.env[secretName]
  if (!secret) throw new Error(`Missing ${secretName}; credentials are never stored in the test configuration`)
  const allowed = new Set(['https://snow-ui.holakirr.com', 'https://demo.snow-ui.holakirr.com'])
  if (!allowed.has(origin)) throw new Error('Production authentication origin is not allowlisted')
  const bootstrap = await request.newContext({ ignoreHTTPSErrors: false })
  try {
    const response = await bootstrap.get(origin+'/', {
      headers: {'x-vercel-protection-bypass':secret, 'x-vercel-set-bypass-cookie':'true'},
      maxRedirects:0, timeout:30000,
    })
    if (response.status() >= 400) throw new Error('Production authentication rejected')
    const location = response.headers().location
    if (location && new URL(location,origin).origin !== origin) throw new Error('Unexpected authentication redirect')
    const hostname = new URL(origin).hostname
    const state = await bootstrap.storageState()
    const cookies = state.cookies.filter(cookie => cookie.domain.replace(/^\./,'') === hostname)
    if (!cookies.length && response.status() !== 200) throw new Error('Authentication did not set a scoped cookie')
    await context.addCookies(cookies)
  } catch {
    throw new Error(`Production authentication failed for ${new URL(origin).hostname}; sensitive request details suppressed`)
  } finally {
    await bootstrap.dispose()
  }
}
