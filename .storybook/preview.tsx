import type { Preview } from '@storybook/react'
import { StoryWrapper } from './StoryWrapper'
import { withTheme } from './withTheme'

import './index.css'

const preview: Preview = {
  parameters: {
    // Storybook tests (`bun run test:storybook`) run axe on every story, in
    // the light and the dark theme, after its `play` function: any violation
    // fails the test. Turn off a rule only for one story, with the reason in
    // a comment (`parameters.a11y.config.rules`), when it is a false positive
    // or a documented design exception; see CONTRIBUTING.md.
    a11y: {
      test: 'error',
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

  // The last decorator is the outermost: the theme scope wraps the frame.
  decorators: [
    (Story, { parameters }) =>
      // `storyWrapper: false` opts a story out of the dashed component frame.
      parameters.storyWrapper === false ? (
        <Story />
      ) : (
        <StoryWrapper>
          <Story />
        </StoryWrapper>
      ),
    withTheme,
  ],

  tags: ['autodocs'],
}

export default preview
