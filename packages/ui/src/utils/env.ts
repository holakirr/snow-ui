/*
 * Typed here rather than through @types/node, so the module also compiles as
 * copied source (the @snow-ui registry) in projects without Node types.
 */
declare const process: { env: { NODE_ENV?: string } }

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
