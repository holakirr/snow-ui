import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import { StoryWrapper } from './StoryWrapper'

import './index.css'

const preview: Preview = {
  parameters: {
    // Storybook tests (`bun run test:storybook`) run axe on every story.
    // 'todo' reports violations as warnings in the Storybook UI without
    // failing the run; switch to 'error' once the existing violations are
    // fixed (a story or component can opt in earlier with its own
    // `parameters.a11y.test = 'error'`).
    a11y: {
      test: 'todo',
    },
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
