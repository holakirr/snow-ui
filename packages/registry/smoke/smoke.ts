/**
 * Smoke test of the registry: builds it for a local server, serves it, and
 * installs every item with the pinned shadcn CLI into fresh apps, which then
 * have to typecheck and build.
 *
 *   bun run build     # the packages, installed into the apps as tarballs
 *   bun packages/registry/smoke/smoke.ts [--app next] [--app vite] [--app next-shadcn] [--work dir]
 *
 * Apps (all by default):
 * - `next`: create-next-app (App Router, RSC) + `shadcn init <registry>/snow-ui.json`
 *   + `shadcn add @snow-ui/all @snow-ui/snow-ui-charts`: 'use client' kept,
 *   server rendering of a server and a client page.
 * - `vite`: create-vite react-ts + Tailwind v4 (a strict tsconfig with
 *   verbatimModuleSyntax, erasableSyntaxOnly, noUnused*) + the same: with
 *   `rsc: false` the CLI removes 'use client'.
 * - `next-shadcn`: an existing shadcn/ui project (radix-nova, with shadcn's
 *   button, card, `cn` and theme variables: fixtures.ts) that adds the
 *   @snow-ui registry, every item and the SnowUI theme: nothing of shadcn's
 *   may change.
 *
 * The workspace packages are installed from tarballs of the local build
 * (item dependencies and package overrides), so unreleased versions work.
 * The two files `shadcn init` reads from shadcn's own registry are served
 * locally too (fixtures.ts), so the run needs npm but not ui.shadcn.com.
 * The registry server is stopped when the run ends.
 */
import { spawn } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { buildRegistry, shadcnBin } from '../src/build'
import { loadConfig } from '../src/cli'
import { createPlan, type Manifest } from '../src/plan'
import {
  SHADCN_PROJECT,
  SHADCN_PROJECT_DEPENDENCIES,
  SHADCN_REGISTRY,
} from './fixtures'

/** Scaffolder versions: bump them in a batch, like the shadcn CLI. */
const CREATE_NEXT_APP = 'create-next-app@16.3.7'
const CREATE_VITE = 'create-vite@9.2.1'

const APPS = ['next', 'vite', 'next-shadcn'] as const
type App = (typeof APPS)[number]

const repoRoot = resolve(import.meta.dirname, '../../..')
const HEADER_MARK = 'SnowUI for React ('

interface Context {
  work: string
  registryUrl: string
  manifest: Manifest
  tarballs: Record<string, string>
  env: NodeJS.ProcessEnv
}

const log = (message: string) => console.log(`\n▶ ${message}`)

/** Runs a command (asynchronously, so the registry server keeps answering). */
function run(
  command: string,
  args: string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv; quiet?: boolean },
): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = ''
    const collect = (chunk: Buffer) => {
      output += chunk.toString()
      if (!options.quiet) process.stdout.write(chunk)
    }
    child.stdout.on('data', collect)
    child.stderr.on('data', collect)
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise(output)
        return
      }
      if (options.quiet) process.stdout.write(output)
      reject(
        new Error(
          `${command} ${args.join(' ')} exited with ${code} (in ${options.cwd})`,
        ),
      )
    })
  })
}

const shadcn = (ctx: Context, cwd: string, ...args: string[]) =>
  run('node', [shadcnBin(), ...args, '--cwd', cwd], { cwd, env: ctx.env })

function serve(dir: string, port: number): Promise<Server> {
  const types: Record<string, string> = {
    '.json': 'application/json',
    '.txt': 'text/plain; charset=utf-8',
  }
  const server = createServer((request, response) => {
    const path = join(
      dir,
      decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname),
    )
    if (
      !path.startsWith(dir) ||
      !existsSync(path) ||
      statSync(path).isDirectory()
    ) {
      response.writeHead(404).end('Not found')
      return
    }
    response.writeHead(200, {
      'Content-Type': types[extname(path)] ?? 'application/octet-stream',
    })
    response.end(readFileSync(path))
  })
  return new Promise((resolvePromise) =>
    server.listen(port, '127.0.0.1', () => resolvePromise(server)),
  )
}

async function pack(ctx: Context) {
  const out = join(ctx.work, 'tarballs')
  mkdirSync(out, { recursive: true })
  for (const [name, dir] of [
    ['@holakirr/snow-ui-icons', 'packages/icons'],
    ['@holakirr/snow-ui', 'packages/ui'],
    ['@holakirr/snow-ui-charts', 'packages/charts'],
  ] as const) {
    if (!existsSync(join(repoRoot, dir, 'dist'))) {
      throw new Error(`${dir}/dist is missing: run \`bun run build\` first.`)
    }
    const before = new Set(readdirSync(out))
    await run('bun', ['pm', 'pack', '--destination', out, '--quiet'], {
      cwd: join(repoRoot, dir),
      quiet: true,
    })
    const tarball = readdirSync(out).find((f) => !before.has(f))
    if (!tarball) throw new Error(`bun pm pack wrote nothing for ${name}`)
    ctx.tarballs[name] = join(out, tarball)
  }
}

/** package.json `overrides`: the local tarballs, also for transitive deps. */
function useLocalPackages(ctx: Context, app: string) {
  const file = join(app, 'package.json')
  const json = JSON.parse(readFileSync(file, 'utf8'))
  json.overrides = Object.fromEntries(
    Object.entries(ctx.tarballs).map(([name, path]) => [name, `file:${path}`]),
  )
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`)
}

async function createNext(ctx: Context, name: string) {
  await run(
    'bunx',
    [
      CREATE_NEXT_APP,
      name,
      '--ts',
      '--tailwind',
      '--app',
      '--src-dir',
      '--no-eslint',
      '--use-bun',
      '--import-alias',
      '@/*',
      '--disable-git',
      '--yes',
    ],
    { cwd: ctx.work, env: ctx.env, quiet: true },
  )
  const dir = join(ctx.work, name)
  useLocalPackages(ctx, dir)
  return dir
}

async function createVite(ctx: Context) {
  // A name relative to the cwd: create-vite reads an absolute path as relative.
  await run(
    'bunx',
    [CREATE_VITE, 'vite', '--template', 'react-ts', '--no-interactive'],
    { cwd: ctx.work, env: ctx.env, quiet: true },
  )
  const dir = join(ctx.work, 'vite')
  useLocalPackages(ctx, dir)
  await run('bun', ['install'], { cwd: dir, env: ctx.env, quiet: true })
  await run('bun', ['add', 'tailwindcss@4', '@tailwindcss/vite@4'], {
    cwd: dir,
    env: ctx.env,
    quiet: true,
  })
  // shadcn's Vite setup: the Tailwind plugin and the `@/*` alias.
  writeFileSync(join(dir, 'src/index.css'), '@import "tailwindcss";\n')
  writeFileSync(
    join(dir, 'vite.config.ts'),
    `import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
})
`,
  )
  const root = JSON.parse(readFileSync(join(dir, 'tsconfig.json'), 'utf8'))
  root.compilerOptions = { paths: { '@/*': ['./src/*'] } }
  writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify(root, null, 2))
  const appConfig = readFileSync(join(dir, 'tsconfig.app.json'), 'utf8')
  writeFileSync(
    join(dir, 'tsconfig.app.json'),
    appConfig.replace(
      /"compilerOptions":\s*\{/,
      '"compilerOptions": {\n    "paths": { "@/*": ["./src/*"] },',
    ),
  )
  return dir
}

/** A page that imports every item's module and renders a few components. */
function smokePage(manifest: Manifest, clientDirective: boolean) {
  const modules = manifest.items.filter((item) => item.import && item.files)
  const imports = modules.map(
    (item, i) => `import * as m${i} from '@/components/snow-ui/${item.import}'`,
  )
  return `${clientDirective ? "'use client'\n\n" : ''}${imports.join('\n')}
import { Button } from '@/components/snow-ui/components/Button'
import { SnowUIProvider } from '@/components/snow-ui/components/SnowUIProvider'
import { Typography } from '@/components/snow-ui/components/Text/Text'
import { Sparkline } from '@holakirr/snow-ui-charts'

const modules: Record<string, object> = {
${modules.map((item, i) => `  ${JSON.stringify(item.name)}: m${i},`).join('\n')}
}

export function Smoke() {
  return (
    <SnowUIProvider>
      <main className="flex flex-col gap-4 bg-background-1 p-8 text-black">
        <Typography size={24}>SnowUI registry smoke test</Typography>
        <Button variant="filled" size="md" label="Save" />
        <Button asChild label="Home">
          <a href="/" />
        </Button>
        <Sparkline data={[1, 3, 2, 5]} title="Trend" />
        <pre>
          {Object.entries(modules)
            .map(([name, m]) => \`\${name}: \${Object.keys(m).length}\`)
            .join('\\n')}
        </pre>
      </main>
    </SnowUIProvider>
  )
}
`
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Smoke check failed: ${message}`)
}

/** Every file the registry put in `components/snow-ui`. */
function installedFiles(app: string) {
  const root = join(app, 'src/components/snow-ui')
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry)
      if (statSync(path).isDirectory()) walk(path)
      else files.push(relative(root, path))
    }
  }
  walk(root)
  return { root, files }
}

/** The copied sources: every file, its licence header, its directive. */
function checkSources(ctx: Context, app: string, rsc: boolean) {
  const { root, files } = installedFiles(app)
  const expected = new Set(
    ctx.manifest.items.flatMap((item) => [
      ...(item.files ?? []),
      ...(item.license ? ['LICENSE'] : []),
    ]),
  )
  const missing = [...expected].filter((file) => !files.includes(file))
  assert(!missing.length, `files not installed: ${missing.join(', ')}`)
  const extra = files.filter((file) => !expected.has(file))
  assert(!extra.length, `unexpected files: ${extra.join(', ')}`)
  for (const file of files.filter((f) => /\.tsx?$/.test(f))) {
    const text = readFileSync(join(root, file), 'utf8')
    assert(text.includes(HEADER_MARK), `${file} lost its licence header`)
    const source = readFileSync(
      join(repoRoot, ctx.manifest.package.source, file),
      'utf8',
    )
    const client = /^'use client'/.test(source)
    if (rsc) {
      assert(
        /^'use client'/.test(text) === client,
        `${file}: 'use client' ${client ? 'missing' : 'added'}`,
      )
    } else {
      // With `rsc: false` shadcn 4.21 removes the directive from only about
      // every other file (its regex has the `g` flag, so `test()` keeps
      // `lastIndex` between files). Harmless outside React Server
      // Components; only an added directive would be a bug here.
      assert(
        client || !/^['"]use client['"]/.test(text),
        `${file}: 'use client' added`,
      )
    }
  }
  console.log(`  ${files.length} files: headers and directives OK`)
}

function cssOf(dir: string) {
  let css = ''
  const walk = (current: string) => {
    for (const entry of readdirSync(current)) {
      const path = join(current, entry)
      if (statSync(path).isDirectory()) walk(path)
      else if (entry.endsWith('.css')) css += readFileSync(path, 'utf8')
    }
  }
  walk(dir)
  return css
}

function checkCss(css: string, where: string) {
  for (const [what, pattern] of [
    ['the SnowUI tokens', /--color-black-4:/],
    ['the self-hosted Inter', /@font-face\s*\{[^}]*font-family:\s*"?Inter/],
    ['the data-theme="dark" scope', /\[data-theme=["']?dark["']?\]/],
    ['the .dark scope', /\.dark\s*[,{]/],
    ['component utilities', /\.focus-ring/],
    ['the charts stylesheet', /\.snow-chart/],
  ] as const) {
    assert(pattern.test(css), `${where} has no ${what}`)
  }
  console.log(`  ${where}: tokens, fonts, dark scopes and utilities OK`)
}

const addEverything = (ctx: Context, app: string) =>
  shadcn(ctx, app, 'add', '@snow-ui/all', '@snow-ui/snow-ui-charts', '--yes')

async function smokeNext(ctx: Context) {
  log('next: create-next-app, shadcn init (SnowUI base), add every item')
  const app = await createNext(ctx, 'next')
  await shadcn(ctx, app, 'init', `${ctx.registryUrl}/snow-ui.json`, '--yes')
  const components = JSON.parse(
    readFileSync(join(app, 'components.json'), 'utf8'),
  )
  assert(components.style === 'radix-nova', `style is ${components.style}`)
  assert(components.registries?.['@snow-ui'], 'no @snow-ui registry')
  await addEverything(ctx, app)
  checkSources(ctx, app, true)
  writeFileSync(join(app, 'src/smoke.tsx'), smokePage(ctx.manifest, true))
  writeFileSync(
    join(app, 'src/app/page.tsx'),
    `import { Button } from '@/components/snow-ui/components/Button'
import { Smoke } from '@/smoke'

// A server component: Button has no 'use client'.
export default function Home() {
  return (
    <>
      <Button label="Server" />
      <Smoke />
    </>
  )
}
`,
  )
  log('next: typecheck, build (prerenders the page)')
  await run('bunx', ['tsc', '--noEmit'], { cwd: app, env: ctx.env })
  await run('bun', ['run', 'build'], { cwd: app, env: ctx.env })
  const html = readFileSync(join(app, '.next/server/app/index.html'), 'utf8')
  assert(html.includes('SnowUI registry smoke test'), 'the page did not render')
  assert(html.includes('button: '), 'the module list did not render')
  checkCss(cssOf(join(app, '.next/static')), 'next build CSS')
}

async function smokeVite(ctx: Context) {
  log('vite: create-vite + Tailwind, shadcn init (SnowUI base), add every item')
  const app = await createVite(ctx)
  await shadcn(ctx, app, 'init', `${ctx.registryUrl}/snow-ui.json`, '--yes')
  await addEverything(ctx, app)
  checkSources(ctx, app, false)
  writeFileSync(join(app, 'src/smoke.tsx'), smokePage(ctx.manifest, false))
  writeFileSync(
    join(app, 'src/App.tsx'),
    `import { Smoke } from './smoke'\n\nexport default function App() {\n  return <Smoke />\n}\n`,
  )
  log('vite: tsc -b && vite build')
  await run('bun', ['run', 'build'], { cwd: app, env: ctx.env })
  checkCss(cssOf(join(app, 'dist')), 'vite build CSS')
  assert(
    readdirSync(join(app, 'dist/assets')).some((f) => f.endsWith('.woff2')),
    'no Inter font files in dist',
  )
}

async function smokeExistingShadcn(ctx: Context) {
  log('next-shadcn: an existing shadcn/ui project (radix-nova) adds @snow-ui')
  const app = await createNext(ctx, 'next-shadcn')
  for (const [file, content] of Object.entries(SHADCN_PROJECT)) {
    mkdirSync(dirname(join(app, file)), { recursive: true })
    writeFileSync(join(app, file), content)
  }
  await run('bun', ['add', ...SHADCN_PROJECT_DEPENDENCIES], {
    cwd: app,
    env: ctx.env,
    quiet: true,
  })
  const own = [
    'src/components/ui/button.tsx',
    'src/components/ui/card.tsx',
    'src/lib/utils.ts',
  ]
  const before = own.map((file) => readFileSync(join(app, file), 'utf8'))
  await shadcn(
    ctx,
    app,
    'registry',
    'add',
    `@snow-ui=${ctx.registryUrl}/{name}.json`,
  )
  await addEverything(ctx, app)
  own.forEach((file, i) => {
    assert(
      readFileSync(join(app, file), 'utf8') === before[i],
      `${file} changed`,
    )
  })
  checkSources(ctx, app, true)
  // What the items' docs ask of an existing project: the SnowUI theme.
  await run(
    'bun',
    ['add', `@holakirr/snow-ui@file:${ctx.tarballs['@holakirr/snow-ui']}`],
    { cwd: app, env: ctx.env, quiet: true },
  )
  const globals = join(app, 'src/app/globals.css')
  writeFileSync(
    globals,
    readFileSync(globals, 'utf8').replace(
      '@import "tailwindcss";',
      '@import "tailwindcss";\n@import "@holakirr/snow-ui/theme.css";\n@import "@holakirr/snow-ui/fonts.css";',
    ),
  )
  writeFileSync(join(app, 'src/smoke.tsx'), smokePage(ctx.manifest, true))
  writeFileSync(
    join(app, 'src/app/page.tsx'),
    `import { Button as ShadcnButton } from '@/components/ui/button'
import { Smoke } from '@/smoke'

export default function Home() {
  return (
    <>
      <ShadcnButton>shadcn</ShadcnButton>
      <Smoke />
    </>
  )
}
`,
  )
  log('next-shadcn: typecheck, build')
  await run('bunx', ['tsc', '--noEmit'], { cwd: app, env: ctx.env })
  await run('bun', ['run', 'build'], { cwd: app, env: ctx.env })
  checkCss(cssOf(join(app, '.next/static')), 'next-shadcn build CSS')
}

async function main() {
  const { values } = parseArgs({
    options: {
      app: { type: 'string', multiple: true },
      work: { type: 'string' },
      port: { type: 'string', default: '4173' },
    },
  })
  const apps = (values.app ?? [...APPS]) as App[]
  for (const app of apps) {
    if (!APPS.includes(app)) {
      throw new Error(`Unknown app "${app}" (${APPS.join(', ')})`)
    }
  }
  const work = resolve(
    values.work ?? mkdtempSync(join(tmpdir(), 'snow-ui-registry-smoke-')),
  )
  mkdirSync(work, { recursive: true })
  const registryUrl = `http://127.0.0.1:${values.port}/r`
  const { config, configDir } = await loadConfig(
    resolve(import.meta.dirname, '../registry.config.ts'),
  )
  const ctx: Context = {
    work,
    registryUrl,
    manifest: createPlan(config, configDir).manifest,
    tarballs: {},
    env: {
      ...process.env,
      CI: '1',
      NO_COLOR: '1',
      NEXT_TELEMETRY_DISABLED: '1',
      // shadcn's own registry: the local fixtures (see fixtures.ts).
      REGISTRY_URL: `http://127.0.0.1:${values.port}/shadcn/r`,
    },
  }
  console.log(`Registry smoke test in ${work} (${apps.join(', ')})`)

  log('packing the local packages')
  await pack(ctx)
  log(`building the registry for ${registryUrl}`)
  await buildRegistry(config, configDir, {
    outDir: join(work, 'public/r'),
    baseUrl: registryUrl,
    llmsFile: null,
    stageDir: join(work, 'stage'),
    dependencyOverrides: Object.fromEntries(
      Object.entries(ctx.tarballs).map(([name, path]) => [
        name,
        `file:${path}`,
      ]),
    ),
  })
  for (const [file, content] of Object.entries(SHADCN_REGISTRY)) {
    const path = join(work, 'public/shadcn/r', file)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, JSON.stringify(content))
  }
  const server = await serve(join(work, 'public'), Number(values.port))
  const results: [App, string][] = []
  try {
    for (const app of apps) {
      const started = Date.now()
      try {
        if (app === 'next') await smokeNext(ctx)
        if (app === 'vite') await smokeVite(ctx)
        if (app === 'next-shadcn') await smokeExistingShadcn(ctx)
        results.push([
          app,
          `passed in ${Math.round((Date.now() - started) / 1000)} s`,
        ])
      } catch (error) {
        results.push([app, `FAILED: ${(error as Error).message}`])
      }
    }
  } finally {
    server.close()
  }
  const shadcnVersion = JSON.parse(
    readFileSync(join(repoRoot, 'packages/registry/package.json'), 'utf8'),
  ).devDependencies.shadcn
  const summary = [
    '### Registry smoke test',
    '',
    `${ctx.manifest.items.length} items, shadcn ${shadcnVersion}`,
    '',
    ...results.map(([app, result]) => `- **${app}**: ${result}`),
  ].join('\n')
  console.log(`\n${summary}`)
  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`, {
      flag: 'a',
    })
  }
  if (results.some(([, result]) => result.startsWith('FAILED'))) {
    process.exit(1)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
