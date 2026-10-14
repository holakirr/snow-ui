import type { APIRequestContext } from '@playwright/test'

export const targets = {
  SNOWUI_SITE_AUTOMATION_SECRET: 'https://snow-ui.holakirr.com',
  SNOWUI_DEMO_AUTOMATION_SECRET: 'https://demo.snow-ui.holakirr.com',
} as const
export type SecretName = keyof typeof targets

export function accessHeaders(origin: string, name: SecretName) {
  if (targets[name] !== origin) throw new Error('Credential origin mismatch')
  const secret = process.env[name]
  if (!secret) throw new Error(`Missing ${name}`)
  return {
    'x-vercel-protection-bypass': secret,
    'x-vercel-set-bypass-cookie': 'true',
  }
}

// Credentials never follow a redirect, including a same-origin redirect.
export async function productionGet(
  context: APIRequestContext,
  origin: string,
  path: string,
  name: SecretName,
) {
  const url = new URL(path, origin)
  if (url.origin !== origin || url.username || url.password) {
    throw new Error('Unexpected production URL')
  }
  try {
    return await context.get(url.href, {
      headers: accessHeaders(origin, name),
      maxRedirects: 0,
      timeout: 30000,
    })
  } catch {
    throw new Error(`Production request failed for ${new URL(origin).hostname}`)
  }
}

export function scopedCookies<T extends { domain: string; secure: boolean }>(
  cookies: T[],
  hostname: string,
): T[] {
  return cookies
    .filter((cookie) => cookie.domain.replace(/^\./, '') === hostname)
    .map((cookie) => ({ ...cookie, domain: hostname, secure: true }))
}
