import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-themes',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
	],
	framework: '@storybook/react-vite',
	typescript: {
		reactDocgen: 'react-docgen',
	},
	tags: ['autodocs'],
}

export default config
