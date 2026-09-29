import { defineConfig } from './src/config'

const SITE = 'https://snow-ui.holakirr.com'
const REPO = 'https://github.com/holakirr/snow-ui'

/**
 * The public `@snow-ui` registry: every component of @holakirr/snow-ui as
 * copy-paste source for the shadcn CLI, generated from packages/ui/src and
 * served from the Storybook deployment at https://snow-ui.holakirr.com/r/.
 * Paths are relative to this file.
 */
export default defineConfig({
  name: 'snow-ui',
  namespace: '@snow-ui',
  homepage: SITE,
  baseUrl: `${SITE}/r`,
  author: 'Kirill Petunin (https://holakirr.com)',
  dependencyStyle: 'url',

  package: '../ui',
  srcDir: 'src',
  // `@components/` is the project's `components` alias (`@/components`):
  // src/components/Button/Button.tsx → components/snow-ui/components/Button/Button.tsx.
  // The layout mirrors packages/ui/src, so relative imports work as they are.
  target: '@components/snow-ui',
  exclude: [
    // Package entry points (every component) and build-only files.
    'index.ts',
    'components/index.ts',
    'vite-env.d.ts',
    // Docs, tests, stories, Figma Code Connect, Storybook-only pages.
    '**/*.stories.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    '**/*.figma.ts',
    'code-connect/**',
    'test/**',
    'foundations/**',
    'recipes/**',
  ],
  ignoreDependencies: ['react', 'react-dom'],
  workspacePackages: ['../ui', '../icons', '../charts'],

  groups: [
    { kind: 'components', dir: 'components' },
    { kind: 'each', files: ['hooks/*.ts'], type: 'registry:hook' },
    {
      kind: 'group',
      name: 'react-hook-form',
      type: 'registry:ui',
      title: 'React Hook Form',
      description:
        'Form and FormField bound to React Hook Form: field state, validation messages and accessible descriptions from a useForm() form.',
      files: ['react-hook-form.tsx'],
      import: 'react-hook-form',
    },
    {
      kind: 'group',
      name: 'snow-date',
      type: 'registry:lib',
      title: 'Date utilities',
      description:
        'Date helpers of the Calendar and the Scheduler (date-fns): weeks, months and event layout.',
      files: ['utils/date.ts'],
      import: 'utils/date',
    },
    {
      kind: 'group',
      name: 'snow-slot-host',
      type: 'registry:lib',
      title: 'Slot host',
      description:
        'SlotHost renders an element or, with asChild, its child with the element’s props (Radix Slot).',
      files: ['utils/slot-host.tsx'],
      import: 'utils/slot-host',
    },
    {
      kind: 'group',
      name: 'snow-core',
      type: 'registry:lib',
      title: 'SnowUI core',
      description:
        'What every SnowUI component uses: twMerge configured with the SnowUI token scales (text sizes, radii, shadows), the asChild helpers, constants and shared types.',
      files: ['utils/**', 'constants/**', 'types/**'],
      import: 'utils/tw-merge',
    },
  ],

  license: {
    spdx: 'MIT',
    copyright: 'Copyright (c) 2024 Kirill Petunin',
    url: `${REPO}/blob/main/LICENSE`,
    file: '../../LICENSE',
    item: 'snow-core',
  },
  sourceUrl: `${REPO}/blob/main/`,
  // Stable text (no version or commit): `shadcn add --diff` then only shows
  // real changes. The version and commit are in each item's `meta`.
  header: ({ url }) => [
    `SnowUI for React (${SITE}), from @holakirr/snow-ui:`,
    url,
    `Copyright (c) 2024 Kirill Petunin. MIT License: ${REPO}/blob/main/LICENSE`,
    'Design: SnowUI by ByeWind (https://snowui.byewind.com).',
  ],
  docsUrl: (id) => `${SITE}/?path=/docs/${id}--docs`,
  // Printed by the CLI after an install, for every item it installed: the
  // import line of each component, the requirements once (every component
  // depends on snow-core).
  itemDocs: (item) => {
    if (item.name === 'snow-core') {
      return `SnowUI components need the SnowUI theme (npx shadcn@latest init ${SITE}/r/snow-ui.json in a new project; npm i @holakirr/snow-ui and @import "@holakirr/snow-ui/theme.css" and "@holakirr/snow-ui/fonts.css" after Tailwind in an existing one), a radix-* style in components.json (a base-* style rewrites asChild and breaks them) and React 19. Guide: ${SITE}/?path=/docs/guides-registry--docs`
    }
    if (item.type !== 'registry:ui' || !item.import || !item.exports?.length) {
      return undefined
    }
    const name = item.exports.includes(item.title)
      ? item.title
      : item.exports[0]
    return `import { ${name} } from '@/components/snow-ui/${item.import}'`
  },

  extraItems: ({ url, namespace, items }) => [
    {
      name: 'snow-ui',
      type: 'registry:base',
      extends: 'none',
      title: 'SnowUI',
      description:
        'The SnowUI design system for a new project: tokens and dark mode (@holakirr/snow-ui/theme.css), the self-hosted Inter with the kit’s ss01/cv01 features, the core utilities and SnowUIProvider. Pins Radix UI and registers the @snow-ui namespace.',
      dependencies: ['@holakirr/snow-ui'],
      registryDependencies: ['snow-core', 'snow-ui-provider'],
      config: {
        style: 'radix-nova',
        registries: { [namespace]: url('{name}') },
      },
      css: {
        '@import "@holakirr/snow-ui/theme.css"': {},
        '@import "@holakirr/snow-ui/fonts.css"': {},
      },
      docs: [
        'SnowUI: the theme and fonts come from the @holakirr/snow-ui package (its CSS only); add components with npx shadcn@latest add @snow-ui/<name>.',
        'Wrap the app in <SnowUIProvider> (components/snow-ui/components/SnowUIProvider) for locale, direction and messages. Dark mode: data-theme="dark" or the .dark class on <html>, else the OS preference.',
        'Remove the starter styles your template put in the global stylesheet (body font-family, --background/--foreground and their @theme inline colors): they override the SnowUI tokens.',
      ].join('\n'),
    },
    {
      name: 'all',
      type: 'registry:item',
      title: 'All SnowUI components',
      description:
        'Every SnowUI component, hook and utility (with their npm dependencies).',
      registryDependencies: items.map((item) => item.name),
    },
    {
      name: 'snow-ui-charts',
      type: 'registry:item',
      title: 'SnowUI charts',
      description:
        'The SnowUI charts (Recharts 3) from npm: @holakirr/snow-ui-charts and its stylesheet. They read the locale and direction from the npm package’s SnowUIProvider.',
      dependencies: ['@holakirr/snow-ui-charts', '@holakirr/snow-ui'],
      css: { '@import "@holakirr/snow-ui-charts/styles.css"': {} },
      docs: "import { BarChart } from '@holakirr/snow-ui-charts'. The charts stay an npm package (not copied source). They take the locale and direction from @holakirr/snow-ui's own SnowUIProvider (import it from '@holakirr/snow-ui' around the charts), not from a copied one.",
    },
  ],

  manifest: 'manifest.json',
  outDir: '../../storybook-static/r',
  llms: {
    file: '../../storybook-static/llms.txt',
    title: 'SnowUI',
    summary:
      'React 19 components (Radix UI, Tailwind CSS v4) implementing the SnowUI design system by ByeWind. Install them from npm (@holakirr/snow-ui) or copy their source into your project with the shadcn CLI from the @snow-ui registry.',
    intro: ({ baseUrl }) =>
      [
        '## Install',
        '',
        '- npm package: `npm install @holakirr/snow-ui`; in a Tailwind CSS v4 stylesheet `@import "tailwindcss"; @import "@holakirr/snow-ui/theme.css"; @import "@holakirr/snow-ui/fonts.css";` (without Tailwind: `@import "@holakirr/snow-ui/index.css";`). Import components from `@holakirr/snow-ui`, the React Hook Form adapter from `@holakirr/snow-ui/react-hook-form`.',
        `- shadcn registry (copy the source): new project \`npx shadcn@latest init ${baseUrl}/snow-ui.json\`, then \`npx shadcn@latest add @snow-ui/<name>\`. Existing project: \`npx shadcn@latest registry add @snow-ui=${baseUrl}/{name}.json\` and the theme imports above. Files land in \`components/snow-ui/\` with the source layout of the package, e.g. \`import { Button } from "@/components/snow-ui/components/Button"\`. Needs a radix-* style in components.json.`,
        `- Catalog: ${baseUrl}/registry.json; item JSON: ${baseUrl}/<name>.json.`,
        '- MCP: `npx shadcn@latest mcp init --client claude` (or cursor, vscode, codex, opencode) in a project whose components.json lists the @snow-ui registry.',
        '- Theming: tokens as Tailwind theme variables (`bg-black-4`, `text-14`, `rounded-12`); dark mode with `data-theme="dark"` or the `.dark` class on <html> (else the OS preference); scoped themes with `data-theme` on any element.',
        '',
        '## Docs',
        '',
        `- [Getting started](${SITE}/?path=/docs/guides-getting-started--docs)`,
        `- [Registry (shadcn CLI)](${SITE}/?path=/docs/guides-registry--docs)`,
        `- [Theming](${SITE}/?path=/docs/guides-theming--docs)`,
        `- [Localization and RTL](${SITE}/?path=/docs/guides-localization-and-rtl--docs)`,
      ].join('\n'),
  },
})
