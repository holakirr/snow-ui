import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-themes',
    '@storybook/theming',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  docs: {
    autodocs: true,
  },
}

export default config
