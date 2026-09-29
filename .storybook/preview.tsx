import type { Preview } from '@storybook/react'
import { InstallTabs } from './InstallTabs'
import { StoryWrapper } from './StoryWrapper'
import {
  findSmallTargets,
  TARGET_SIZE_EXCEPTIONS,
  type TargetSizeParameters,
} from './targetSize'
import { withContrast } from './withContrast'
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
    contrast: {
      description:
        'Contrast of the form controls (<html data-contrast>): the Figma values, or WCAG AA ones',
      toolbar: {
        title: 'Contrast',
        icon: 'contrast',
        items: [
          { value: 'auto', title: 'Follow the OS (prefers-contrast)' },
          { value: 'standard', title: 'Standard (Figma)' },
          { value: 'more', title: 'More (WCAG AA)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: 'en',
    dir: 'ltr',
    contrast: 'auto',
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
    // No implicit actions (`argTypesRegex`): they turned every `on*` prop the
    // docgen finds into an action arg, so what a story ran depended on the
    // docgen, and Storybook throws when a play function calls one. Stories
    // that check a handler pass `fn()` from storybook/test.
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
        withThemeByDataAttribute: true,
      },
    },
    layout: 'centered',
    // Blocks that every MDX page can use without importing them.
    docs: { components: { InstallTabs } },
    options: {
      storySort: {
        order: [
          'Guides',
          [
            'Getting started',
            'Registry',
            'API conventions',
            'Theming',
            'Contrast',
            'Localization and RTL',
            'Next.js App Router',
            'Vite',
            'React Router 7',
          ],
          'Foundations',
          'Components',
          'Charts',
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
    withContrast,
    withTheme,
  ],

  // WCAG 2.5.8: after the `play` function, every interactive element of the
  // story needs a 24×24px hit area (see targetSize.ts). It fails the
  // Storybook tests; in the Storybook UI it only warns.
  afterEach: async ({ parameters, viewMode }) => {
    // Unit tests render stories in jsdom (`composeStories`): no layout there.
    if (viewMode !== 'story' || !('checkVisibility' in HTMLElement.prototype)) {
      return
    }
    const { exceptions = [] } = (parameters.targetSize ??
      {}) as TargetSizeParameters
    const failures = findSmallTargets(document.body, [
      ...TARGET_SIZE_EXCEPTIONS,
      ...exceptions,
    ])
    if (!failures.length) return
    const message = `WCAG 2.5.8: ${failures.length} target(s) smaller than 24×24px (add a hit area, or an exception with its reason in parameters.targetSize):\n${failures.join('\n')}`
    if (import.meta.env.VITEST_STORYBOOK === undefined) console.warn(message)
    else throw new Error(message)
  },

  tags: ['autodocs'],
}

export default preview
