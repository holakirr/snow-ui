import { defineConfig, type UserConfig } from 'tsdown'

type OutputOptions = Exclude<
  UserConfig['outputOptions'],
  // biome-ignore lint/complexity/noBannedTypes: narrowing the union
  Function | undefined
>

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
    // StatusIcon's two phosphor glyphs are inlined, so consumers don't need
    // @phosphor-icons/react (whose CJS build is a single ~5 MB file).
    onlyBundle: ['@phosphor-icons/react'],
  },
  // npm never packs nested `node_modules` folders, so the inlined phosphor
  // modules are emitted under `dist/vendor/` instead.
  outputOptions: (options) => ({
    ...options,
    entryFileNames: vendorPath(options.entryFileNames),
  }),
  exports: true,
  publint: true,
  attw: { profile: 'strict', level: 'error' },
})

function vendorPath(
  fileNames: OutputOptions['entryFileNames'],
): OutputOptions['entryFileNames'] {
  return (chunk) => {
    const fileName =
      typeof fileNames === 'function' ? fileNames(chunk) : (fileNames ?? '')
    return fileName.replace(
      '[name]',
      chunk.name.replace(/^.*node_modules\//, 'vendor/'),
    )
  }
}
