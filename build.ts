import { type BuildOptions, build } from 'esbuild'
import { readdirSync, statSync } from 'node:fs'

async function buildLib(path: string) {
  const paths = readdirSync(path)
  const dist = `dist/${path}`

  const cjsConfig: BuildOptions = {
    bundle: false,
    format: 'cjs',
    target: 'es2020',
    outdir: dist.replace('src', 'cjs'),
    minify: true,
  }

  const esmConfig: BuildOptions = {
    ...cjsConfig,
    outdir: dist.replace('src', 'esm'),
    format: 'esm',
  }

  for (const fileName of paths) {
    const pathName = `${path}/${fileName}`

    const pathStat = statSync(pathName)

    if (pathStat.isDirectory()) {
      if (fileName.includes('test')) {
        continue
      }

      await buildLib(pathName)
    } else if (pathStat.isFile()) {
      if (
        fileName.includes('test') ||
        fileName.includes('stories') ||
        fileName.includes('.d.') ||
        fileName.includes('tsconfig.') ||
        fileName.includes('.css')
      ) {
        continue
      }

      await build({
        ...cjsConfig,
        entryPoints: [pathName],
      })
      await build({
        ...esmConfig,
        entryPoints: [pathName],
      })

      console.log(`Built ${pathName}`)
    }
  }
}

buildLib('src')
