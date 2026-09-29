import { describe, expect, it } from 'vitest'
import { firstParagraph, storyId } from './plan'
import {
  globToRegExp,
  importPrefix,
  kebabCase,
  packageName,
  relativeSpecifier,
} from './util'

describe('kebabCase', () => {
  it.each([
    ['Button', 'button'],
    ['InputSmall', 'input-small'],
    ['SnowUIProvider', 'snow-ui-provider'],
    ['KBD', 'kbd'],
    ['use-toast', 'use-toast'],
  ])('%s → %s', (name, expected) => {
    expect(kebabCase(name)).toBe(expected)
  })
})

describe('globToRegExp', () => {
  it.each([
    ['**/*.stories.{ts,tsx}', 'components/Button/Button.stories.tsx', true],
    ['**/*.stories.{ts,tsx}', 'Button.stories.ts', true],
    ['**/*.stories.{ts,tsx}', 'components/Button/Button.tsx', false],
    ['hooks/*.ts', 'hooks/use-toast.ts', true],
    ['hooks/*.ts', 'hooks/nested/use-x.ts', false],
    ['utils/**', 'utils/a/b.ts', true],
    ['index.ts', 'components/index.ts', false],
  ])('%s matches %s: %s', (glob, path, expected) => {
    expect(globToRegExp(glob).test(path)).toBe(expected)
  })
})

describe('packageName', () => {
  it.each([
    ['date-fns/locale', 'date-fns'],
    ['@phosphor-icons/react/dist/csr/Check', '@phosphor-icons/react'],
    ['react', 'react'],
  ])('%s → %s', (specifier, expected) => {
    expect(packageName(specifier)).toBe(expected)
  })
})

describe('relativeSpecifier', () => {
  it.each([
    [
      'components/Button/Button.tsx',
      'components/Text/Text.tsx',
      '../Text/Text',
    ],
    ['components/Button/Button.tsx', 'components/Text/index.ts', '../Text'],
    ['components/Menu/Menu.tsx', 'components/Menu/surface.ts', './surface'],
    [
      'components/Sidebar/Sidebar.tsx',
      'hooks/use-is-mobile.ts',
      '../../hooks/use-is-mobile',
    ],
  ])('%s → %s: %s', (from, to, expected) => {
    expect(relativeSpecifier(from, to)).toBe(expected)
  })
})

describe('importPrefix', () => {
  it('maps the target placeholders to the default aliases', () => {
    expect(importPrefix('@components/snow-ui')).toBe('@/components/snow-ui')
    expect(importPrefix('@ui/x')).toBe('@/components/ui/x')
    expect(importPrefix('@lib/x')).toBe('@/lib/x')
  })
})

describe('storyId', () => {
  it('follows Storybook', () => {
    expect(storyId('Components/Input/Checkbox')).toBe(
      'components-input-checkbox',
    )
    expect(storyId('Guides/Getting started')).toBe('guides-getting-started')
  })
})

describe('firstParagraph', () => {
  it('reads the intro of a usage page, as plain text', () => {
    const mdx = [
      "import { Meta } from '@storybook/addon-docs/blocks'",
      "import * as Stories from './Button.stories'",
      '',
      '<Meta of={Stories} />',
      '',
      '<Title />',
      '',
      'Button starts an action: saving, [opening a dialog](?path=/x).',
      'It has five variants.',
      '',
      '```tsx',
      '<Button />',
      '```',
    ].join('\n')
    expect(firstParagraph(mdx)).toBe(
      'Button starts an action: saving, opening a dialog. It has five variants.',
    )
  })

  it('keeps to about 200 characters of whole sentences', () => {
    const sentence = `${'word '.repeat(30).trim()}.`
    expect(firstParagraph(`${sentence} ${sentence}`)).toBe(sentence)
  })
})
