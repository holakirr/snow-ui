import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from '@typescript/typescript6'
import { type ComponentDoc, withCustomConfig } from 'react-docgen-typescript'
import { beforeAll, describe, expect, it } from 'vitest'
import { reactDocgenTypescriptOptions } from '../.storybook/docgen.ts'

// The components' docs pages (`packages/*/src/**/*.mdx`), checked against
// the docgen Storybook builds their props tables from (.storybook/docgen.ts,
// the same options): every exported component has a props table on a page,
// no table is empty, and every page has the outline CONTRIBUTING.md asks for.

const repo = fileURLToPath(new URL('..', import.meta.url))

/** The packages' entry points: their exports are the public components. */
const ENTRY_POINTS = [
  'packages/ui/src/index.ts',
  'packages/ui/src/react-hook-form.tsx',
  'packages/charts/src/index.ts',
  'packages/icons/src/main.tsx',
]

/** Pages of components that have no keyboard interaction of their own. */
const STATIC_PAGES = new Set([
  'Avatar',
  'AvatarGroup',
  'Badge',
  'DonutChart',
  'Group',
  'IconBox',
  'Icons',
  'KBD',
  'Label',
  'Separator',
  'Skeleton',
  'SnowUIProvider',
  'Sparkline',
  'Strip',
  'Text',
])

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return entry.name === 'node_modules' || entry.name === 'dist'
        ? []
        : walk(path)
    }
    return [path]
  })

/** A `packages/ui/src/**\/*.tsx`-style glob (`**`, `*`) as a RegExp. */
const globToRegExp = (glob: string) =>
  new RegExp(
    `^${glob
      .split(/(\*\*\/|\*)/)
      .map((part) =>
        part === '**/'
          ? '(?:.*/)?'
          : part === '*'
            ? '[^/]*'
            : part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'),
      )
      .join('')}$`,
  )

const { include, exclude, tsconfigPath, ...parserOptions } =
  reactDocgenTypescriptOptions
const included = include.map(globToRegExp)
const excluded = exclude.map(globToRegExp)
const packageFiles = walk(join(repo, 'packages'))
const sourceFiles = packageFiles
  .map((file) => relative(repo, file))
  .filter(
    (file) =>
      included.some((glob) => glob.test(file)) &&
      !excluded.some((glob) => glob.test(file)),
  )

const pages = packageFiles
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => ({
    file,
    name: relative(repo, file),
    title: file.replace(/^.*\/|\.mdx$/g, ''),
    source: readFileSync(file, 'utf8'),
  }))

type Page = (typeof pages)[number]

/** The `component` of the stories file a page is attached to. */
const metaComponent = (page: Page) => {
  const meta = page.source.match(/<Meta of=\{(\w+)\}/)?.[1]
  if (!meta) return undefined
  const from = page.source.match(
    new RegExp(`import \\* as ${meta} from '([^']+)'`),
  )?.[1]
  if (!from) return undefined
  const storiesFile = ['.tsx', '.ts']
    .map((extension) => resolve(dirname(page.file), `${from}${extension}`))
    .find((file) => existsSync(file))
  if (!storiesFile) return undefined
  return readFileSync(storiesFile, 'utf8').match(/\bcomponent: (\w+)/)?.[1]
}

/** The components whose props tables a page shows. */
const documentedComponents = (page: Page) => {
  const names = new Set<string>()
  const meta = metaComponent(page)
  const namespaces = new Set(
    [...page.source.matchAll(/import \* as (\w+) from/g)].map(
      ([, name]) => name,
    ),
  )
  for (const [, of] of page.source.matchAll(
    /<(?:Controls|ArgTypes)\b(?:[^>]*?\bof=\{([\w.]+)\})?[^>]*\/>/g,
  )) {
    // `<Controls />`, `<ArgTypes />` and `of={XStories…}` show the stories'
    // component; `of={X}` shows component X.
    const name = !of || namespaces.has(of.split('.')[0]) ? meta : of
    if (name) names.add(name)
  }
  return names
}

let docs: ComponentDoc[] = []

beforeAll(() => {
  const config = ts.getParsedCommandLineOfConfigFile(
    join(repo, tsconfigPath),
    {},
    { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
  )
  if (!config) throw new Error(`Can't read ${tsconfigPath}`)
  const program = ts.createProgram(
    [...ENTRY_POINTS, ...sourceFiles].map((file) => join(repo, file)),
    config.options,
  )
  const checker = program.getTypeChecker()
  const exported = new Set(
    ENTRY_POINTS.flatMap((file) => {
      const sourceFile = program.getSourceFile(join(repo, file))
      const module = sourceFile && checker.getSymbolAtLocation(sourceFile)
      // Components: callable values whose name starts with a capital (not
      // the props types, the constants, the cva variants or the hooks).
      return module
        ? checker
            .getExportsOfModule(module)
            .filter((symbol) => {
              const target =
                symbol.flags & ts.SymbolFlags.Alias
                  ? checker.getAliasedSymbol(symbol)
                  : symbol
              if (!(target.flags & ts.SymbolFlags.Value)) return false
              if (!target.valueDeclaration || !/^[A-Z]/.test(symbol.name)) {
                return false
              }
              return (
                checker
                  .getTypeOfSymbolAtLocation(target, target.valueDeclaration)
                  .getCallSignatures().length > 0
              )
            })
            .map((symbol) => symbol.name)
        : []
    }),
  )
  const parser = withCustomConfig(join(repo, tsconfigPath), {
    ...parserOptions,
    savePropValueAsString: true,
  })
  docs = parser
    .parseWithProgramProvider(
      sourceFiles.map((file) => join(repo, file)),
      () => program,
    )
    .filter((doc) => exported.has(doc.displayName))
}, 120_000)

describe('docs pages', () => {
  it('finds the components and the pages', () => {
    expect(sourceFiles.length).toBeGreaterThan(40)
    expect(pages.length).toBeGreaterThan(40)
    expect(docs.length).toBeGreaterThan(100)
  })

  it('show a props table for every exported component', () => {
    const documented = new Set(
      pages.flatMap((page) => [...documentedComponents(page)]),
    )
    const missing = docs
      .filter((doc) => !documented.has(doc.displayName))
      .map((doc) => `${doc.displayName} (${relative(repo, doc.filePath)})`)
    expect(
      missing,
      'Add `<ArgTypes of={Component} />` for these to their page:',
    ).toEqual([])
  })

  it('have no empty props table', () => {
    const byName = new Map<string, ComponentDoc[]>()
    for (const doc of docs) {
      byName.set(doc.displayName, [...(byName.get(doc.displayName) ?? []), doc])
    }
    const empty = pages.flatMap((page) =>
      [...documentedComponents(page)]
        .filter((name) => {
          const found = byName.get(name)
          return (
            !found || found.every((doc) => Object.keys(doc.props).length === 0)
          )
        })
        .map((name) => `${page.name}: ${name}`),
    )
    expect(
      empty,
      'No props reach these tables (see the propFilter in .storybook/docgen.ts):',
    ).toEqual([])
  })

  it('leave the stories independent of the docgen', () => {
    // Storybook's implicit actions (`actions.argTypesRegex`) turn every `on*`
    // prop the docgen finds into an action arg, and Storybook throws when a
    // play function calls one. The built Storybook runs the docgen but
    // `bun run test:storybook` doesn't (addon-vitest leaves it out), so such
    // a story passes there and fails in the visual tests. Stories that check
    // a handler pass `fn()` from storybook/test instead.
    const preview = readFileSync(join(repo, '.storybook/preview.tsx'), 'utf8')
    expect(preview).not.toMatch(/argTypesRegex\s*:/)
  })

  it.each(pages.map((page) => [page.name, page] as const))(
    '%s has the page outline',
    (_, page) => {
      const checks: [RegExp, string][] = [
        [/<FigmaLinks\b/, 'the Figma links (<FigmaLinks />)'],
        [/```tsx\s*\n[^`]*from '@holakirr\/snow-ui/, 'an import example'],
        [/<(Canvas|Primary)\b/, 'an example (<Canvas /> or <Primary />)'],
        [/^## Accessibility/m, 'an Accessibility section'],
        [/^## Props/m, 'a Props section'],
        [/<(Controls|ArgTypes)\b/, 'a props table'],
      ]
      if (!STATIC_PAGES.has(page.title)) {
        checks.push([
          /^### Keyboard\n+(?:[^\n]+\n+)?\| Key \| Action \|/m,
          'a keyboard table (### Keyboard, | Key | Action |)',
        ])
      }
      const missing = checks
        .filter(([pattern]) => !pattern.test(page.source))
        .map(([, what]) => what)
      expect(missing).toEqual([])
    },
  )
})
