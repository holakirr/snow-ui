import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'
// The ui and icons packages from source (the charts import `@holakirr/snow-ui`).
import { workspaceAliases } from '../packages/charts/workspace-aliases.ts'

// One Storybook for every workspace package (deployed to snow-ui.holakirr.com).
// Run it from the repository root: `bun run storybook` / `bun run build:storybook`.
const config: StorybookConfig = {
  stories: [
    // Guides: Getting started, Theming, Localization and RTL.
    '../docs/**/*.mdx',
    // A component's usage page (`<Meta of={…Stories} />`) sits next to its
    // stories and replaces its automatic docs page.
    '../packages/ui/src/**/*.mdx',
    '../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/icons/src/**/*.mdx',
    '../packages/icons/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/charts/src/**/*.mdx',
    '../packages/charts/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      // GitHub-flavoured Markdown: MDX 3 has no tables without it, and the
      // usage pages document props, tokens and keyboard support in tables.
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    // The "Design" panel: the Figma node of `parameters.design` (the owner's
    // licensed copy of the SnowUI kit; it only loads for people with access).
    '@storybook/addon-designs',
    // Runs the story tests (root vitest.config.ts) from Storybook's sidebar.
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen',
  },
  viteFinal: async (viteConfig) => {
    const { default: react } = await import('@vitejs/plugin-react')
    const { default: tailwindcss } = await import('@tailwindcss/vite')

    viteConfig.plugins = [...(viteConfig.plugins ?? []), react(), tailwindcss()]
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: { ...workspaceAliases },
    }

    return viteConfig
  },
}

export default config
