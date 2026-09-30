// No 'use client': Server Components call `readSidebarState` to render the
// saved state.

/**
 * The cookie that keeps the sidebar open or collapsed between visits:
 * `"true"` or `"false"`. Read it on the server with `readSidebarState` and
 * pass the result to `SidebarProvider`'s `defaultOpen`, so the server renders
 * the sidebar the way the user left it.
 */
export const SIDEBAR_COOKIE_NAME = 'sidebar_state'

/**
 * The cookie name before 5.1. `:` isn't allowed in a cookie name (RFC 6265),
 * so some servers and frameworks drop it. It is still read, after the new
 * one, and written next to it, for servers that read it by name (until 6.0).
 */
export const LEGACY_SIDEBAR_COOKIE_NAME = 'sidebar:state'

/** A week, in seconds. */
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const decode = (text: string) => {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

/**
 * The state in the cookie `name`: its value, unquoted (RFC 6265 allows a
 * quoted value), as `true` / `false`; `undefined` without a valid one. The
 * name may be URL-encoded (`sidebar%3Astate`), as some servers write it.
 */
const cookieState = (cookies: string, name: string): boolean | undefined => {
  for (const cookie of cookies.split(';')) {
    const separator = cookie.indexOf('=')
    if (separator === -1) continue
    if (decode(cookie.slice(0, separator).trim()) !== name) continue
    const value = cookie
      .slice(separator + 1)
      .trim()
      .replace(/^"(.*)"$/, '$1')
    if (value === 'true') return true
    if (value === 'false') return false
  }
  return undefined
}

/**
 * The sidebar state saved in the `sidebar_state` cookie (or the pre-5.1
 * `sidebar:state` one): `true` (open), `false` (collapsed) or `undefined`
 * (no cookie). Pass the `Cookie` request header on the server; without an
 * argument it reads `document.cookie` in the browser. Not a client
 * function, so Server Components can call it.
 *
 * @example
 * // Next.js App Router: app/layout.tsx (a Server Component)
 * import { headers } from 'next/headers'
 * import { readSidebarState, SidebarProvider } from '@holakirr/snow-ui'
 *
 * const cookie = (await headers()).get('cookie')
 * <SidebarProvider defaultOpen={readSidebarState(cookie) ?? true}>…
 */
export const readSidebarState = (
  cookies?: string | null,
): boolean | undefined => {
  const source =
    cookies ?? (typeof document === 'undefined' ? '' : document.cookie)
  return (
    cookieState(source, SIDEBAR_COOKIE_NAME) ??
    cookieState(source, LEGACY_SIDEBAR_COOKIE_NAME)
  )
}
