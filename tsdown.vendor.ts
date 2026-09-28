import type { UserConfig } from 'tsdown'

type OutputOptions = Exclude<
  UserConfig['outputOptions'],
  // biome-ignore lint/complexity/noBannedTypes: narrowing the union
  Function | undefined
>

/**
 * `unbundle` mirrors module paths, so inlined dependencies would land in
 * `dist/node_modules/…`, which npm never packs. Emit them under
 * `dist/vendor/…` instead.
 */
export const vendorOutputOptions: UserConfig['outputOptions'] = (options) => ({
  ...options,
  entryFileNames: vendorPath(options.entryFileNames),
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
