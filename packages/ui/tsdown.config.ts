import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/react-hook-form.tsx'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'es2020',
  tsconfig: 'tsconfig.build.json',
  // One output file per source module, so every 'use client' directive stays
  // on the module that declares it (React Server Components boundaries).
  unbundle: true,
  // Rolldown warns that directives "may not be preserved when bundling";
  // with `unbundle` each module is its own chunk, so they are kept as-is.
  checks: { moduleLevelDirective: false },
  // `build` cleans dist and emits dist/index.css with the Tailwind CLI first,
  // so publint/attw below see the complete package.
  clean: false,
  dts: true,
  exports: {
    customExports: (exports) => ({
      ...exports,
      // Built separately by the Tailwind CLI (see the `build:css` script).
      './index.css': './dist/index.css',
    }),
  },
  publint: true,
  attw: {
    level: 'error',
    // node10 has no `exports` support, so the `./react-hook-form` subpath
    // can't resolve there; the root entry is still covered via main/types.
    profile: 'node16',
    // A plain stylesheet, not a JS module.
    excludeEntrypoints: ['./index.css'],
  },
})
