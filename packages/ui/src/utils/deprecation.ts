import { isDevelopment } from './env'

/** The deprecations already reported in this session, by id. */
const warned = new Set<string>()

/**
 * Logs a deprecation warning once per `id` (e.g. `'Button:as'`), in
 * development builds only. Safe to call during render: the second and later
 * calls, and every call in production, do nothing.
 */
export const warnDeprecated = (id: string, message: string): void => {
  if (warned.has(id) || !isDevelopment()) return
  warned.add(id)
  console.warn(`[@holakirr/snow-ui] ${message}`)
}

/** Forgets the reported deprecations, so tests can assert each warning. */
export const resetDeprecationWarnings = (): void => {
  warned.clear()
}

/**
 * Warns once that a component's `as` prop is deprecated in favour of
 * `asChild`, with a migration example.
 */
export const warnAsDeprecated = (component: string, example: string): void =>
  warnDeprecated(
    `${component}:as`,
    `${component}: the \`as\` prop is deprecated and will be removed in the next major version. Use \`asChild\` and pass the element as the only child instead, e.g. ${example}.`,
  )
