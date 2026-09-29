import { readdirSync, readFileSync } from 'node:fs'
import { join, posix, resolve } from 'node:path'
import { Node, Project } from 'ts-morph'
import { describe, expect, it } from 'vitest'
import { renderRegistry } from './build'
import { loadConfig, serializeManifest } from './cli'
import { resolveRelative } from './graph'
import { createPlan, type ManifestItem } from './plan'
import { matchesAny, packageName } from './util'

// Checks of the real @snow-ui registry, generated in memory from
// packages/ui/src: the invariants every item keeps so that `shadcn add`
// produces code that compiles in the user's project.

const { config, configDir } = await loadConfig(
  resolve(import.meta.dirname, '../registry.config.ts'),
)
const plan = createPlan(config, configDir)
const { manifest } = plan
const rendered = renderRegistry(plan, config, {
  baseUrl: 'https://snow-ui.holakirr.com/r',
})
const items = new Map(manifest.items.map((item) => [item.name, item]))
const staged = (file: string) => {
  const content = rendered.files.get(posix.join(config.name, file))
  if (content === undefined) throw new Error(`${file} is not staged`)
  return content
}
const withFiles = manifest.items.filter(
  (item): item is ManifestItem & { files: string[] } => !!item.files,
)

/** The item's files and those of every item it depends on, recursively. */
function closure(item: ManifestItem) {
  const files = new Set<string>()
  const seen = new Set<string>()
  const visit = (name: string) => {
    if (seen.has(name)) return
    seen.add(name)
    const current = items.get(name)
    for (const file of current?.files ?? []) files.add(file)
    for (const dep of current?.registryDependencies ?? []) visit(dep)
  }
  visit(item.name)
  return files
}

const project = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: { noLib: true, noResolve: true },
})
const parse = (path: string, content: string) =>
  project.createSourceFile(path, content, { overwrite: true })

describe('the committed manifest', () => {
  it('is up to date (run `bun run registry` and commit it)', () => {
    expect(
      readFileSync(resolve(configDir, config.manifest), 'utf8'),
      'packages/registry/manifest.json is out of date: run `bun run registry`',
    ).toBe(serializeManifest(manifest))
  })
})

describe('items', () => {
  it('cover every component directory', () => {
    const dirs = readdirSync(join(plan.paths.srcDir, 'components'), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `components/${entry.name}/`)
    const shipped = withFiles.flatMap((item) => item.files)
    expect(
      dirs.filter((dir) => !shipped.some((file) => file.startsWith(dir))),
    ).toEqual([])
  })

  it('stay clear of the names and packages the shadcn CLI treats specially', () => {
    // `utils` maps to the project's `@/lib/utils` (cn), and the `cn` package
    // has none of the SnowUI token scales tailwind-merge needs.
    expect(items.has('utils')).toBe(false)
    for (const item of manifest.items) {
      expect(item.dependencies ?? [], item.name).not.toContain('cn')
    }
  })

  it('ship no stories, tests, docs, Figma templates or test helpers', () => {
    const shipped = withFiles.flatMap((item) => item.files)
    expect(
      shipped.filter((file) =>
        matchesAny(file, [
          ...config.exclude,
          '**/*.mdx',
          '**/*.css',
          '**/*.stories.*',
          '**/*.test.*',
          '**/*.figma.ts',
        ]),
      ),
    ).toEqual([])
  })

  it('have a description and, for components, a docs page', () => {
    for (const item of manifest.items) {
      expect(plan.descriptions.get(item.name), item.name).toMatch(/\w/)
    }
    expect(
      withFiles
        .filter((item) => item.type === 'registry:ui' && !item.docs)
        .map((item) => item.name),
      // The adapter is documented on the Form page.
    ).toEqual(['react-hook-form'])
  })
})

describe.each(withFiles.map((item) => [item.name, item] as const))(
  '%s',
  (_, item) => {
    const files = item.files.filter((file) => /\.tsx?$/.test(file))

    it('resolves every relative import within itself and its dependencies', () => {
      const available = closure(item)
      const unresolved: string[] = []
      for (const file of files) {
        const source = parse(file, staged(file))
        for (const declaration of [
          ...source.getImportDeclarations(),
          ...source.getExportDeclarations(),
        ]) {
          const specifier = declaration.getModuleSpecifierValue()
          if (!specifier?.startsWith('.')) continue
          if (!resolveRelative(file, specifier, (p) => available.has(p))) {
            unresolved.push(`${file}: ${specifier}`)
          }
        }
      }
      expect(unresolved).toEqual([])
    })

    it('declares every npm package it imports, with a version range', () => {
      const declared = new Set([
        ...(item.dependencies ?? []),
        ...config.ignoreDependencies,
      ])
      const undeclared = new Set<string>()
      for (const file of files) {
        for (const declaration of parse(
          file,
          staged(file),
        ).getImportDeclarations()) {
          const specifier = declaration.getModuleSpecifierValue()
          if (
            !specifier.startsWith('.') &&
            !declared.has(packageName(specifier))
          ) {
            undeclared.add(`${file}: ${specifier}`)
          }
        }
      }
      expect([...undeclared]).toEqual([])
      const dependencies =
        rendered.registry.items.find((i) => i.name === item.name)
          ?.dependencies ?? []
      expect(dependencies.filter((dep) => !/.@[\^~]?\d/.test(dep))).toEqual([])
    })

    it("keeps 'use client' first and its licence header through the CLI", () => {
      for (const file of files) {
        const content = staged(file)
        const original = readFileSync(join(plan.paths.srcDir, file), 'utf8')
        expect(/^'use client'\n/.test(content), file).toBe(
          /^'use client'\n/.test(original),
        )
        const source = parse(file, content)
        // What the CLI writes: getText() (no leading comments)…
        expect(source.getText(), file).toContain('SnowUI for React (')
        // …after removing 'use client' in projects with `rsc: false`.
        const first = source.getStatements()[0]
        if (
          Node.isExpressionStatement(first) &&
          first.getText() === "'use client'"
        ) {
          first.remove()
          expect(source.getText(), file).toContain('SnowUI for React (')
        }
      }
    })
  },
)
