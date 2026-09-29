import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { defineConfig, type RegistryConfig } from './config'

/** A small component library for the generator's tests. */
export const FIXTURE_FILES: Record<string, string> = {
  LICENSE: 'MIT License\n\nCopyright (c) 2024 Test\n',
  'pkg/package.json': JSON.stringify({
    name: '@test/ui',
    version: '1.2.3',
    dependencies: { '@radix-ui/react-slot': '^1.3.0', clsx: '^2.1.0' },
    peerDependencies: { react: '^19.0.0' },
  }),
  'pkg/src/index.ts': "export * from './components'\nexport * from './hooks'\n",
  'pkg/src/components/index.ts':
    "export * from './Button'\nexport * from './Menu'\nexport * from './Text'\n",
  'pkg/src/components/Button/index.ts': "export * from './Button'\n",
  'pkg/src/components/Button/Button.tsx': `import { Slot } from '@radix-ui/react-slot'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Text } from '../Text'

/** Button runs an action. */
export const Button = ({ asChild, children }: { asChild?: boolean; children?: ReactNode }) => {
  const Component = asChild ? Slot : 'button'
  return <Component className={cn('px-2')}><Text>{children}</Text></Component>
}
`,
  'pkg/src/components/Button/Button.stories.tsx': `import type { Meta } from '@storybook/react-vite'
import { Button } from './Button'

const meta = { title: 'Components/Button', component: Button } satisfies Meta<typeof Button>
export default meta
`,
  'pkg/src/components/Button/Button.mdx': `import { Meta } from '@storybook/addon-docs/blocks'

<Meta title="Components/Button" />

Button starts an action. It has one variant.
`,
  'pkg/src/components/Text/index.ts':
    "export * from './Kbd'\nexport * from './Text'\n",
  'pkg/src/components/Text/Text.tsx': `import type { ReactNode } from 'react'

export type TextProps = { children?: ReactNode }

export const Text = ({ children }: TextProps) => <span>{children}</span>
`,
  'pkg/src/components/Text/Kbd.tsx': `import { Text } from './Text'

/** A keyboard key. */
export const Kbd = ({ keys }: { keys: string }) => <kbd><Text>{keys}</Text></kbd>
`,
  'pkg/src/components/Menu/index.ts': "export * from './Menu'\n",
  'pkg/src/components/Menu/Menu.tsx': `'use client'

import { useThing } from '../../hooks'
import { Kbd, type TextProps } from '../Text'
import { surface } from './surface'

export const Menu = (props: TextProps) => {
  useThing()
  return <div className={surface}><Kbd keys="K" />{props.children}</div>
}
`,
  'pkg/src/components/Menu/surface.ts': "export const surface = 'rounded-12'\n",
  'pkg/src/hooks/index.ts':
    "export * from './use-other'\nexport * from './use-thing'\n",
  'pkg/src/hooks/use-other.ts': 'export const useOther = () => 1\n',
  'pkg/src/hooks/use-thing.ts': `'use client'

import { useState } from 'react'

export function useThing() {
  return useState(0)
}
`,
  'pkg/src/utils/cn.ts': `import { clsx } from 'clsx'

export const cn = (...classes: string[]) => clsx(classes)
`,
  'pkg/src/utils/env.ts':
    '/** Development build. */\nexport const dev = true\n',
}

export const fixtureConfig = (
  overrides: Partial<RegistryConfig> = {},
): RegistryConfig =>
  defineConfig({
    name: 'test-ui',
    namespace: '@test-ui',
    homepage: 'https://ui.example.test',
    baseUrl: 'https://ui.example.test/r',
    author: 'Test',
    dependencyStyle: 'url',
    package: '../pkg',
    srcDir: 'src',
    target: '@components/test-ui',
    exclude: ['index.ts', 'components/index.ts', '**/*.stories.tsx'],
    ignoreDependencies: ['react'],
    workspacePackages: ['../pkg'],
    groups: [
      { kind: 'components', dir: 'components' },
      { kind: 'each', files: ['hooks/*.ts'], type: 'registry:hook' },
      {
        kind: 'group',
        name: 'core',
        type: 'registry:lib',
        title: 'Core',
        description: 'Shared utilities.',
        files: ['utils/**'],
      },
    ],
    license: {
      spdx: 'MIT',
      copyright: 'Copyright (c) 2024 Test',
      url: 'https://example.test/LICENSE',
      file: '../LICENSE',
      item: 'core',
    },
    sourceUrl: 'https://example.test/blob/main/',
    header: ({ url }) => ['Test UI', url, 'MIT License'],
    docsUrl: (id) => `https://ui.example.test/?path=/docs/${id}--docs`,
    extraItems: ({ url, namespace, items }) => [
      {
        name: 'base',
        type: 'registry:base',
        extends: 'none',
        title: 'Base',
        description: 'The theme.',
        dependencies: ['@test/ui'],
        registryDependencies: ['core'],
        config: { registries: { [namespace]: url('{name}') } },
        css: { '@import "@test/ui/theme.css"': {} },
      },
      {
        name: 'all',
        type: 'registry:item',
        title: 'All',
        description: 'Everything.',
        registryDependencies: items.map((item) => item.name),
      },
    ],
    manifest: 'manifest.json',
    outDir: 'out/r',
    ...overrides,
  })

/**
 * Writes the fixture (with `changes`: a path → content, or `null` to leave
 * a file out) to a new temporary directory; returns the config directory.
 */
export function writeFixture(changes: Record<string, string | null> = {}) {
  const root = mkdtempSync(join(tmpdir(), 'registry-fixture-'))
  // A repository root, for the repository-relative source paths.
  mkdirSync(join(root, '.git'))
  for (const [path, content] of Object.entries({
    ...FIXTURE_FILES,
    ...changes,
  })) {
    if (content === null) continue
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  const configDir = join(root, 'registry')
  mkdirSync(configDir, { recursive: true })
  return configDir
}
