import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import { StoryWrapper } from './StoryWrapper'

import './index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      disabled: true,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
        withThemeByDataAttribute: true,
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        order: ['Foundations', 'Components', 'Icons'],
      },
    },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      attributeName: 'data-theme',
      defaultTheme: 'light',
    }),
    (Story, { parameters }) =>
      // `storyWrapper: false` opts a story out of the dashed component frame.
      parameters.storyWrapper === false ? (
        <Story />
      ) : (
        <StoryWrapper>
          <Story />
        </StoryWrapper>
      ),
  ],

  tags: ['autodocs'],
}

export default preview
