import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen',
  },
  viteFinal: async (config) => {
    config.plugins = config.plugins?.filter((plugin) => {
      if (typeof plugin === 'object' && plugin !== null && 'name' in plugin) {
        return !plugin.name?.includes('tailwind')
      }
      return true
    })

    return config
  },
}

export default config
