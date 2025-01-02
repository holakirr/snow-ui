import * as esbuild from 'esbuild'
import { readdirSync, statSync } from 'node:fs'

async function build(path) {
  const paths = readdirSync(path)
  const dist = `dist/${path}`.replace('src', '')

  const cjsConfig: esbuild.BuildOptions = {
    bundle: false,
    format: 'cjs',
    target: 'es2022',
    outdir: dist,
  }

  const esmConfig: esbuild.BuildOptions = {
    ...cjsConfig,
    format: 'esm',
    outExtension: { '.js': '.mjs' },
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
        fileName.includes('.d.') ||
        fileName.endsWith('.css')
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
