import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, posix, resolve } from 'node:path'
import {
  type Registry,
  type RegistryItem,
  registryItemSchema,
  registrySchema,
} from 'shadcn/schema'
import type { RegistryConfig } from './config'
import { renderLlms } from './llms'
import {
  buildContext,
  createPlan,
  type ManifestItem,
  type PackageJson,
  type Plan,
} from './plan'
import { transformSource } from './transform'
import { RegistryError } from './util'

export interface RenderOptions {
  baseUrl: string
  /** Commit the registry is built from (item `meta`). */
  commit?: string
  /** npm specs that replace the resolved range of a package. */
  dependencyOverrides?: Record<string, string>
}

export interface RenderedRegistry {
  registry: Registry
  /** Staged file contents by path (relative to the registry.json). */
  files: Map<string, string>
}

const isLocal = (ref: string) => !ref.startsWith('@') && !ref.includes('://')

/**
 * npm version ranges of the items' dependencies: the source package's own
 * ranges, except for the workspace packages, whose floor is their version
 * at this commit (`^5.1.0`). The site serves the registry built from the
 * commit the release workflow published (the `release` branch), so every
 * floor is a version npm has, and the items' sources never need more than
 * that version's theme and icons.
 */
function versionRanges(plan: Plan, config: RegistryConfig) {
  const ranges = new Map<string, string>()
  const { packageJson } = plan
  for (const field of [
    'devDependencies',
    'peerDependencies',
    'dependencies',
  ] as const) {
    for (const [name, range] of Object.entries(packageJson[field] ?? {})) {
      ranges.set(name, range)
    }
  }
  for (const dir of config.workspacePackages) {
    const json = JSON.parse(
      readFileSync(
        join(resolve(plan.paths.configDir, dir), 'package.json'),
        'utf8',
      ),
    ) as PackageJson
    ranges.set(json.name, `^${json.version}`)
  }
  return ranges
}

/** The deepest directory holding every file (`components/Button`). */
function commonDir(files: string[]) {
  const parts = files.map((file) => posix.dirname(file).split('/'))
  const common: string[] = []
  for (let i = 0; parts.every((p) => i < p.length); i++) {
    const segment = parts[0][i]
    if (!parts.every((p) => p[i] === segment)) break
    common.push(segment)
  }
  return common.join('/').replace(/^\.$/, '')
}

/** The registry.json (with staged paths) and the staged file contents. */
export function renderRegistry(
  plan: Plan,
  config: RegistryConfig,
  options: RenderOptions,
): RenderedRegistry {
  const { manifest, graph, rewrites, packageJson } = plan
  const context = buildContext(config, options.baseUrl, packageJson.version)
  const ranges = versionRanges(plan, config)
  const overrides = options.dependencyOverrides ?? {}
  const problems: string[] = []
  const files = new Map<string, string>()

  const dependency = (name: string) => {
    if (overrides[name]) return `${name}@${overrides[name]}`
    const range = ranges.get(name)
    if (!range) {
      problems.push(
        `No version range for "${name}": add it to ${packageJson.name}'s dependencies`,
      )
      return name
    }
    return `${name}@${range}`
  }
  const ref = (name: string) => (isLocal(name) ? context.ref(name) : name)
  const stagedPath = (file: string) => posix.join(config.name, file)
  const sourceUrl = (path: string) =>
    `${config.sourceUrl}${manifest.package.source}/${path}`

  const stage = (file: string) => {
    const path = stagedPath(file)
    if (files.has(path)) return path
    const module = graph.modules.get(file)
    if (!module) throw new Error(`Unknown module ${file}`)
    files.set(
      path,
      transformSource(
        module,
        rewrites.get(file) ?? [],
        config.header({ source: file, url: sourceUrl(file) }),
      ),
    )
    return path
  }

  const licenseText = config.license.file
    ? readFileSync(resolve(plan.paths.configDir, config.license.file), 'utf8')
    : undefined

  const meta = (item: ManifestItem) => ({
    package: manifest.package.name,
    version: packageJson.version,
    ...(options.commit ? { commit: options.commit } : {}),
    license: config.license.spdx,
    ...(item.files?.length
      ? { source: sourceUrl(commonDir(item.files)).replace(/\/$/, '') }
      : {}),
    ...(item.import ? { import: item.import } : {}),
    ...(item.docs && config.docsUrl ? { docs: config.docsUrl(item.docs) } : {}),
  })

  // Items defined in the config are rendered for this build's base URL.
  const extras = new Map(
    (
      config.extraItems?.({
        ...context,
        items: manifest.items
          .filter((item) => item.files)
          .map(({ name, type }) => ({ name, type })),
      }) ?? []
    ).map((extra) => {
      const {
        name,
        type: _type,
        title: _title,
        description: _description,
        dependencies: _dependencies,
        registryDependencies: _registryDependencies,
        ...rest
      } = extra
      return [name, rest] as const
    }),
  )

  const items = manifest.items.map((item): RegistryItem => {
    const extra = item.extra ? (extras.get(item.name) ?? item.extra) : undefined
    const itemFiles: NonNullable<RegistryItem['files']> = (
      item.files ?? []
    ).map((file) => ({
      path: stage(file),
      type: item.type as 'registry:ui',
      target: `${config.target}/${file}`,
    }))
    if (item.license && licenseText !== undefined) {
      const path = stagedPath('LICENSE')
      files.set(path, licenseText)
      itemFiles.push({
        path,
        type: 'registry:file',
        target: `${config.target}/LICENSE`,
      })
    }
    const docs =
      extra?.docs ?? (item.files ? config.itemDocs?.(item) : undefined)
    const rendered = {
      ...(extra ?? {}),
      name: item.name,
      type: item.type,
      title: item.title,
      description: plan.descriptions.get(item.name) ?? item.title,
      author: config.author,
      ...(item.dependencies?.length
        ? { dependencies: item.dependencies.map(dependency) }
        : {}),
      ...(item.registryDependencies?.length
        ? { registryDependencies: item.registryDependencies.map(ref) }
        : {}),
      ...(itemFiles.length ? { files: itemFiles } : {}),
      ...(docs ? { docs } : {}),
      meta: meta(item),
    }
    const parsed = registryItemSchema.safeParse(rendered)
    if (!parsed.success) problems.push(`${item.name}: ${parsed.error.message}`)
    return rendered as RegistryItem
  })

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: config.name,
    homepage: config.homepage,
    items,
  }
  const parsed = registrySchema.safeParse(registry)
  if (!parsed.success) problems.push(`registry.json: ${parsed.error.message}`)
  if (problems.length) throw new RegistryError(problems)
  return { registry: registry as Registry, files }
}

export interface BuildOptions extends Partial<RenderOptions> {
  outDir?: string
  /** `null`: no llms.txt. */
  llmsFile?: string | null
  /** Where the sources are staged for `shadcn build` (default `.build`). */
  stageDir?: string
}

const require = createRequire(import.meta.url)

/** The entry point of the pinned shadcn CLI of this package. */
export function shadcnBin() {
  // `shadcn/package.json` isn't exported: walk up from an entry point.
  let dir = dirname(require.resolve('shadcn/schema'))
  while (!existsSync(join(dir, 'package.json'))) dir = dirname(dir)
  const { bin } = JSON.parse(
    readFileSync(join(dir, 'package.json'), 'utf8'),
  ) as { bin: string | Record<string, string> }
  return join(dir, typeof bin === 'string' ? bin : bin.shadcn)
}

function gitCommit(cwd: string) {
  const env = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA
  if (env) return env
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return undefined
  }
}

/**
 * Builds the registry: stages the transformed sources and registry.json,
 * validates them (zod schemas, `shadcn registry validate`), runs `shadcn
 * build` into `outDir` (one JSON per item plus the registry.json catalog)
 * and writes llms.txt.
 */
export async function buildRegistry(
  config: RegistryConfig,
  configDir: string,
  options: BuildOptions = {},
) {
  const plan = createPlan(config, configDir)
  const baseUrl = (options.baseUrl ?? config.baseUrl).replace(/\/+$/, '')
  const outDir = options.outDir ?? resolve(configDir, config.outDir)
  const stageDir = options.stageDir ?? resolve(configDir, '.build')
  const { registry, files } = renderRegistry(plan, config, {
    baseUrl,
    commit: options.commit ?? gitCommit(configDir),
    dependencyOverrides: options.dependencyOverrides,
  })

  rmSync(stageDir, { recursive: true, force: true })
  for (const [path, content] of files) {
    mkdirSync(dirname(join(stageDir, path)), { recursive: true })
    writeFileSync(join(stageDir, path), content)
  }
  writeFileSync(
    join(stageDir, 'registry.json'),
    `${JSON.stringify(registry, null, 2)}\n`,
  )

  const shadcn = (...args: string[]) =>
    execFileSync('node', [shadcnBin(), ...args], {
      cwd: stageDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1' },
    })
  try {
    shadcn('registry', 'validate', './registry.json')
    rmSync(outDir, { recursive: true, force: true })
    mkdirSync(outDir, { recursive: true })
    shadcn('build', './registry.json', '--output', outDir)
  } catch (error) {
    const { stdout, stderr } = error as { stdout?: string; stderr?: string }
    throw new RegistryError(
      `shadcn failed:\n${[stdout, stderr].filter(Boolean).join('\n')}`,
    )
  }

  // shadcn build writes one file per item plus the catalog.
  const written = new Set(readdirSync(outDir))
  const missing = [
    ...registry.items.map((item) => `${item.name}.json`),
    'registry.json',
  ].filter((file) => !written.has(file))
  if (missing.length) {
    throw new RegistryError(`shadcn build did not write ${missing.join(', ')}`)
  }

  const llmsFile =
    options.llmsFile === null
      ? undefined
      : (options.llmsFile ??
        (config.llms ? resolve(configDir, config.llms.file) : undefined))
  if (llmsFile && config.llms) {
    mkdirSync(dirname(llmsFile), { recursive: true })
    writeFileSync(
      llmsFile,
      renderLlms(
        plan.manifest,
        plan.descriptions,
        config,
        buildContext(config, baseUrl, plan.packageJson.version),
      ),
    )
  }

  return { items: registry.items, outDir, baseUrl, stageDir, llmsFile }
}
