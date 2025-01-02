import * as esbuild from 'esbuild'
import { readdirSync, statSync } from 'node:fs'

async function build(path) {
  const paths = readdirSync(path)
  const dist = `dist/${path}`

  const cjsConfig: esbuild.BuildOptions = {
    bundle: false,
    format: 'cjs',
    target: 'es2020',
    outdir: dist.replace('src', 'cjs'),
    minify: true,
  }

  const esmConfig: esbuild.BuildOptions = {
    ...cjsConfig,
    outdir: dist.replace('src', 'esm'),
    format: 'esm',
  }

  for (const fileName of paths) {
    const pathName = `${path}/${fileName}`

    const pathStat = statSync(pathName)

    if (pathStat.isDirectory()) {
      if (fileName.includes('test')) continue
      await build(pathName)
    } else if (pathStat.isFile()) {
      if (
        fileName.includes('test') ||
        fileName.includes('stories') ||
        fileName.includes('.d.')
      )
        continue
      await esbuild.build({
        ...cjsConfig,
        entryPoints: [pathName],
      })
      await esbuild.build({
        ...esmConfig,
        entryPoints: [pathName],
      })

      console.log(`Built ${pathName}`)
    }
  }
}

build('src')
