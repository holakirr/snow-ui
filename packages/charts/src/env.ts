/**
 * Whether the consumer's build is a development build. Bundlers replace
 * `process.env.NODE_ENV`; where nothing defines `process` (unbundled ESM),
 * it reads as production so no dev-only warnings are logged.
 */
export const isDevelopment = (): boolean => {
  try {
    return process.env.NODE_ENV !== 'production'
  } catch {
    return false
  }
}

const warned = new Set<string>()

/** Logs a development warning once per message. */
export const warnOnce = (message: string): void => {
  if (!isDevelopment() || warned.has(message)) return
  warned.add(message)
  console.warn(`[@holakirr/snow-ui-charts] ${message}`)
}
