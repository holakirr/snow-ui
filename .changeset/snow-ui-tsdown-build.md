---
"@holakirr/snow-ui": patch
---

Built with tsdown into a flat `dist` (`.js` + `.cjs`, with `.d.ts` + `.d.cts` declarations). `require('@holakirr/snow-ui')` now works: the Phosphor icons are bundled into the build instead of being required from `@phosphor-icons/react`, whose CommonJS file Node loads as ESM, so `@phosphor-icons/react` is no longer a dependency. CommonJS consumers get matching `.d.cts` type declarations.
