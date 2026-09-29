import type { Preview } from '@storybook/react'
import { StoryWrapper } from './StoryWrapper'
import { withLocale } from './withLocale'
import { withTheme } from './withTheme'

// The self-hosted Inter (@holakirr/snow-ui/fonts.css): no web font requests.
import '../packages/ui/src/fonts.css'
import './index.css'

const preview: Preview = {
  // Toolbar switchers, applied by `withLocale` through `SnowUIProvider`. A
  // story can pin one: `globals: { dir: 'rtl' }`.
  globalTypes: {
    locale: {
      description: 'Component messages and date locale (SnowUIProvider)',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English (default messages)', right: 'en' },
          { value: 'ru', title: 'Русский (example messages)', right: 'ru' },
        ],
        dynamicTitle: true,
      },
    },
    dir: {
      description: 'Text direction (SnowUIProvider dir and <html dir>)',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left to right', right: 'ltr' },
          { value: 'rtl', title: 'Right to left', right: 'rtl' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: 'en',
    dir: 'ltr',
  },

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
        order: [
          'Guides',
          ['Getting started', 'Theming', 'Localization and RTL'],
          'Foundations',
          'Components',
          'Icons',
        ],
      },
    },
  },

  // The last decorator is the outermost: the theme scope wraps the locale
  // and direction, which wrap the frame.
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
    withLocale,
    withTheme,
  ],

  tags: ['autodocs'],
}

export default preview
