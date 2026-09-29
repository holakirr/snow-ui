import { Project } from 'ts-morph'
import { describe, expect, it } from 'vitest'
import { renderRegistry } from './build'
import { fixtureConfig, writeFixture } from './fixture'
import { createPlan, type ManifestItem } from './plan'

const plan = (changes?: Record<string, string | null>) =>
  createPlan(fixtureConfig(), writeFixture(changes))

const byName = (items: ManifestItem[]) =>
  Object.fromEntries(items.map((item) => [item.name, item]))

describe('createPlan', () => {
  const { manifest, rewrites, descriptions } = plan()
  const items = byName(manifest.items)

  it('makes one item per component module, hook and group', () => {
    expect(manifest.items.map((item) => `${item.name} (${item.type})`)).toEqual(
      [
        'button (registry:ui)',
        'menu (registry:ui)',
        'kbd (registry:ui)',
        'text (registry:ui)',
        'use-other (registry:hook)',
        'use-thing (registry:hook)',
        'core (registry:lib)',
        'base (registry:base)',
        'all (registry:item)',
      ],
    )
  })

  it('makes every component module an item, without directory barrels', () => {
    expect(items.button.files).toEqual(['components/Button/Button.tsx'])
    expect(items.button.import).toBe('components/Button/Button')
    // Text/index.ts re-exports two items: each ships its own module.
    expect(items.text.files).toEqual(['components/Text/Text.tsx'])
    expect(items.kbd.files).toEqual(['components/Text/Kbd.tsx'])
    expect(items.kbd.import).toBe('components/Text/Kbd')
    expect(items.menu.files).toEqual([
      'components/Menu/Menu.tsx',
      'components/Menu/surface.ts',
    ])
    expect(items.menu.import).toBe('components/Menu/Menu')
    expect(items['use-thing'].files).toEqual(['hooks/use-thing.ts'])
  })

  it('never ships stories, entry points or unshipped barrels', () => {
    const shipped = manifest.items.flatMap((item) => item.files ?? [])
    expect(shipped).not.toContain('index.ts')
    expect(shipped).not.toContain('components/index.ts')
    expect(shipped).not.toContain('components/Text/index.ts')
    expect(shipped).not.toContain('components/Button/index.ts')
    expect(shipped).not.toContain('hooks/index.ts')
    expect(shipped.filter((file) => file.includes('.stories.'))).toEqual([])
  })

  it('derives npm and registry dependencies from the imports', () => {
    expect(items.button.dependencies).toEqual(['@radix-ui/react-slot'])
    expect(items.button.registryDependencies).toEqual(['core', 'text'])
    expect(items.menu.dependencies).toEqual([])
    expect(items.menu.registryDependencies).toEqual([
      'kbd',
      'text',
      'use-thing',
    ])
    expect(items.kbd.registryDependencies).toEqual(['text'])
    expect(items.core.dependencies).toEqual(['clsx'])
    // react is a peer of every project.
    expect(items['use-thing'].dependencies).toEqual([])
  })

  it('rewrites imports through a barrel that ships with no single item', () => {
    const edits = (file: string) =>
      (rewrites.get(file) ?? []).map((edit) => edit.text)
    expect(edits('components/Button/Button.tsx')).toEqual([
      "import { Text } from '../Text/Text'",
    ])
    expect(edits('components/Menu/Menu.tsx')).toEqual([
      "import { useThing } from '../../hooks/use-thing'",
      "import { Kbd } from '../Text/Kbd'\nimport type { TextProps } from '../Text/Text'",
    ])
    expect(rewrites.has('components/Text/Kbd.tsx')).toBe(false)
  })

  it('rewrites re-exports through a barrel too', () => {
    const { rewrites: edits } = plan({
      'pkg/src/components/Menu/Menu.tsx':
        "import { surface } from './surface'\nexport { Kbd, type TextProps } from '../Text'\nexport const Menu = () => surface\n",
    })
    expect(
      (edits.get('components/Menu/Menu.tsx') ?? []).map((edit) => edit.text),
    ).toEqual([
      "export { Kbd } from '../Text/Kbd'\nexport type { TextProps } from '../Text/Text'",
    ])
  })

  it('ships the licence with the items that reach no other copy of it', () => {
    expect(items.core.license).toBe(true)
    expect(items.button.license).toBeUndefined()
    // Neither `use-thing` nor `text` depends on core.
    expect(items['use-thing'].license).toBe(true)
    expect(items.text.license).toBe(true)
  })

  it('describes items from their usage page, JSDoc or config', () => {
    expect(descriptions.get('button')).toBe(
      'Button starts an action. It has one variant.',
    )
    expect(descriptions.get('kbd')).toBe('A keyboard key.')
    expect(descriptions.get('core')).toBe('Shared utilities.')
    expect(items.button.docs).toBe('components-button')
    // Generated descriptions are not committed (they follow the docs).
    expect(items.button.description).toBeUndefined()
  })

  it('lists every generated item in the aggregate', () => {
    expect(items.all.registryDependencies).toEqual([
      'button',
      'menu',
      'kbd',
      'text',
      'use-other',
      'use-thing',
      'core',
    ])
  })
})

describe('createPlan problems', () => {
  it('rejects runtime code that imports a story or test file', () => {
    expect(() =>
      plan({
        'pkg/src/components/Button/helper.ts':
          "export { default } from './Button.stories'\n",
      }),
    ).toThrow(
      /imports components\/Button\/Button\.stories\.tsx, which is excluded/,
    )
  })

  it('rejects a file no rule matches', () => {
    expect(() =>
      plan({ 'pkg/src/lib/other.ts': 'export const x = 1\n' }),
    ).toThrow(/lib\/other\.ts belongs to no item/)
  })

  it('rejects renamed re-exports it would have to rewrite', () => {
    expect(() =>
      plan({
        'pkg/src/components/Text/index.ts':
          "export { Kbd as Key } from './Kbd'\nexport * from './Text'\n",
        'pkg/src/components/Menu/Menu.tsx':
          "import { Key } from '../Text'\nexport const Menu = () => <Key keys='K' />\n",
      }),
    ).toThrow(/renames "Kbd" to "Key"/)
  })

  it('rejects dynamic imports', () => {
    expect(() =>
      plan({
        'pkg/src/utils/lazy.ts': "export const load = () => import('./cn')\n",
      }),
    ).toThrow(/dynamic import\(\) is not supported/)
  })

  it('rejects comments before a directive (the CLI would drop them)', () => {
    expect(() =>
      plan({
        'pkg/src/hooks/use-thing.ts':
          "// A hook.\n'use client'\n\nexport function useThing() {}\n",
      }),
    ).toThrow(/comments before 'use client'/)
  })
})

describe('renderRegistry', () => {
  const config = fixtureConfig()
  const rendered = renderRegistry(createPlan(config, writeFixture()), config, {
    baseUrl: 'http://localhost:4173/r',
    dependencyOverrides: { '@test/ui': 'file:/abs/test-ui.tgz' },
  })

  it('matches the snapshot', async () => {
    await expect(
      `${JSON.stringify(
        {
          registry: rendered.registry,
          files: Object.fromEntries(rendered.files),
        },
        null,
        2,
      )}\n`,
    ).toMatchFileSnapshot('./__snapshots__/fixture-registry.snap')
  })

  it('references items by URL of the build and resolves version ranges', () => {
    const button = rendered.registry.items.find((i) => i.name === 'button')
    expect(button?.registryDependencies).toEqual([
      'http://localhost:4173/r/core.json',
      'http://localhost:4173/r/text.json',
    ])
    expect(button?.dependencies).toEqual(['@radix-ui/react-slot@^1.3.0'])
    const base = rendered.registry.items.find((i) => i.name === 'base')
    expect(base?.dependencies).toEqual(['@test/ui@file:/abs/test-ui.tgz'])
    expect(base).toMatchObject({
      config: {
        registries: { '@test-ui': 'http://localhost:4173/r/{name}.json' },
      },
    })
  })

  it("keeps the header through the CLI's rewrite (getText, 'use client' removal)", () => {
    const project = new Project({ useInMemoryFileSystem: true })
    for (const [path, content] of rendered.files) {
      if (!/\.tsx?$/.test(path)) continue
      const source = project.createSourceFile(path, content, {
        overwrite: true,
      })
      // What the shadcn CLI writes: getText() drops leading comments…
      expect(source.getText(), path).toContain('Test UI')
      // …and with `rsc: false` it removes a leading 'use client' first.
      const directive = source.getStatements()[0]
      if (directive?.getText() === "'use client'") {
        directive.remove()
        expect(source.getText(), path).toContain('Test UI')
      }
    }
  })
})
