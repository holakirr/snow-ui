import { defineConfig } from 'tsdown'

export default defineConfig({
  // The package, and `./recharts`: Recharts re-exported, so composable charts
  // use the package's own copy.
  entry: ['src/index.ts', 'src/recharts.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'es2020',
  tsconfig: 'tsconfig.build.json',
  // One output file per source module, so every 'use client' directive stays
  // on the module that declares it (React Server Components boundaries) and
  // importing one chart doesn't pull in the others.
  unbundle: true,
  // Rolldown warns that directives "may not be preserved when bundling";
  // with `unbundle` each module is its own chunk, so they are kept as-is.
  checks: { moduleLevelDirective: false },
  // `build` cleans dist and copies dist/styles.css first, so publint/attw
  // below see the complete package.
  clean: false,
  dts: true,
  // recharts and react-is (dependencies), react, react-dom and
  // @holakirr/snow-ui (peer dependencies) stay external.
  exports: {
    customExports: (exports) => ({
      ...exports,
      // Copied from src/ by the `build:css` script.
      './styles.css': './dist/styles.css',
    }),
  },
  publint: true,
  attw: {
    level: 'error',
    profile: 'node16',
    // A stylesheet, not a JS module.
    excludeEntrypoints: ['./styles.css'],
  },
})
