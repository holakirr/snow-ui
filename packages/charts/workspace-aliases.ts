import { fileURLToPath } from 'node:url'
import { workspaceAliases as uiAliases } from '../ui/workspace-aliases.ts'

// Vite-based tooling (Storybook, Vitest) resolves the ui package (the peer
// the charts read `useSnowUI` from) and, through it, the icons package from
// source: no build needed, and one SnowUIProvider context shared with the
// stories' decorators, which import the ui source too. The published build
// imports `@holakirr/snow-ui` as an external peer dependency.
export const workspaceAliases = {
  ...uiAliases,
  '@holakirr/snow-ui': fileURLToPath(
    new URL('../ui/src/index.ts', import.meta.url),
  ),
}
