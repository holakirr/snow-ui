import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, resolve } from 'node:path'
import { type BuildOptions, build, type Plugin } from 'esbuild'

const SKIPPED_FILE =
  /\.(test|spec|stories)\.|\.d\.ts$|^tsconfig\.|\.css$|^\.DS_Store$/

// Every file is built separately (keeps 'use client' directives per module),
// so imports stay external. Relative specifiers get explicit `.js` paths,
// otherwise Node can't resolve them (no extension / directory imports).
const explicitRelativeImports: Plugin = {
  name: 'explicit-relative-imports',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind === 'entry-point') {
        return undefined
      }

      if (!args.path.startsWith('.')) {
        return { path: args.path, external: true }
      }

      const absolutePath = resolve(args.resolveDir, args.path)

      if (['.ts', '.tsx'].some((ext) => existsSync(`${absolutePath}${ext}`))) {
        return { path: `${args.path}.js`, external: true }
      }

      if (
        ['index.ts', 'index.tsx'].some((file) =>
          existsSync(join(absolutePath, file)),
        )
      ) {
        return { path: `${args.path}/index.js`, external: true }
      }

      return { path: args.path, external: true }
    })
  },
}

const baseConfig: BuildOptions = {
  bundle: true,
  target: 'es2020',
  minify: true,
  plugins: [explicitRelativeImports],
}

async function buildLib(path: string) {
  const dist = `dist/${path}`

  for (const fileName of readdirSync(path)) {
    const pathName = `${path}/${fileName}`
    const pathStat = statSync(pathName)

    if (pathStat.isDirectory()) {
      if (fileName === 'test') {
        continue
      }

      await buildLib(pathName)
    } else if (pathStat.isFile()) {
      if (SKIPPED_FILE.test(fileName)) {
        continue
      }

      await build({
        ...baseConfig,
        format: 'cjs',
        outdir: dist.replace('src', 'cjs'),
        entryPoints: [pathName],
      })
      await build({
        ...baseConfig,
        format: 'esm',
        outdir: dist.replace('src', 'esm'),
        entryPoints: [pathName],
      })

      console.log(`Built ${pathName}`)
    }
  }
}

await buildLib('src')

// The package is "type": "module", so the CJS output needs its own marker
mkdirSync('dist/cjs', { recursive: true })
writeFileSync(
  'dist/cjs/package.json',
  `${JSON.stringify({ type: 'commonjs' })}\n`,
)
