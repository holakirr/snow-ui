import type { Preview } from '@storybook/react'
import { StoryWrapper } from './StoryWrapper'
import { withTheme } from './withTheme'

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
