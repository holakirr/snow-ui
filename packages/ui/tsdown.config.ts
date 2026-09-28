import { defineConfig } from 'tsdown'
import { vendorOutputOptions } from '../../tsdown.vendor.ts'

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
  deps: {
    // The few phosphor icons used here are inlined (under dist/vendor):
    // @phosphor-icons/react's CommonJS build can't be require()d (it is
    // `dist/index.cjs.js` in a "type": "module" package, so Node loads it as
    // ESM and throws), which would break `require('@holakirr/snow-ui')`.
    alwaysBundle: [/^@phosphor-icons\/react/],
    onlyBundle: [/^@phosphor-icons\/react/],
  },
  outputOptions: vendorOutputOptions,
  exports: {
    customExports: (exports) => ({
      ...exports,
      // Built separately by the `build:css` script: index.css by the Tailwind
      // CLI, theme.css by scripts/build-css.ts.
      './index.css': './dist/index.css',
      './theme.css': './dist/theme.css',
    }),
  },
  publint: true,
  attw: {
    level: 'error',
    // node10 has no `exports` support, so the `./react-hook-form` subpath
    // can't resolve there; the root entry is still covered via main/types.
    profile: 'node16',
    // Stylesheets, not JS modules.
    excludeEntrypoints: ['./index.css', './theme.css'],
  },
})
