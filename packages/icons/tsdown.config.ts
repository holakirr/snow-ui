import { defineConfig } from 'tsdown'
import { vendorOutputOptions } from '../../tsdown.vendor.ts'

export default defineConfig({
  entry: ['src/main.tsx'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'es2020',
  tsconfig: 'tsconfig.build.json',
  // One file per icon keeps single-icon imports tiny in consumer bundles.
  unbundle: true,
  dts: true,
  deps: {
    // StatusIcon's two phosphor glyphs are inlined (under dist/vendor), so
    // consumers don't install @phosphor-icons/react, whose CommonJS build
    // can't be require()d: it is `dist/index.cjs.js` in a "type": "module"
    // package, so Node loads it as ESM and throws.
    onlyBundle: ['@phosphor-icons/react'],
  },
  outputOptions: vendorOutputOptions,
  exports: true,
  publint: true,
  attw: { profile: 'strict', level: 'error' },
})
