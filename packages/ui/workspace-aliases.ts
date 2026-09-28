import { fileURLToPath } from 'node:url'

// Vite-based tooling (Storybook, Vitest) resolves the icons workspace package
// from source, so it works from a clean clone without building icons first and
// picks up icon changes live. The published build keeps importing
// `@holakirr/snow-ui-icons` as an external dependency.
export const workspaceAliases = {
  '@holakirr/snow-ui-icons': fileURLToPath(
    new URL('../icons/src/main.tsx', import.meta.url),
  ),
}
