import type { StorybookConfig } from '@storybook/react-vite'
import { workspaceAliases } from '../packages/ui/workspace-aliases'

// One Storybook for every workspace package (deployed to snow-ui.holakirr.com).
// Run it from the repository root: `bun run storybook` / `bun run build:storybook`.
const config: StorybookConfig = {
  stories: [
    '../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/icons/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
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
