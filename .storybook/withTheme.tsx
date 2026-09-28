import { DecoratorHelpers } from '@storybook/addon-themes'
import type { Decorator } from '@storybook/react-vite'
import { type ReactNode, useLayoutEffect, useRef } from 'react'

type Theme = 'light' | 'dark'

const DEFAULT_THEME: Theme = 'light'

// The toolbar switcher of @storybook/addon-themes (the `theme` global).
DecoratorHelpers.initializeThemeState(['light', 'dark'], DEFAULT_THEME)

const toTheme = (value: unknown): Theme =>
  value === 'light' || value === 'dark' ? value : DEFAULT_THEME

/** The component that last set `<html data-theme>`, so a stale one doesn't reset it. */
let documentThemeOwner: symbol | undefined

/**
 * Sets `data-theme` on `<html>` while mounted: the theme of the page and of
 * portalled content (dialogs, popovers, menus), which renders in `<body>`.
 */
const DocumentTheme = ({
  theme,
  children,
}: {
  theme: Theme
  children: ReactNode
}) => {
  useLayoutEffect(() => {
    const owner = Symbol(theme)
    documentThemeOwner = owner
    document.documentElement.setAttribute('data-theme', theme)
    return () => {
      if (documentThemeOwner !== owner) return
      documentThemeOwner = undefined
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  return children
}

/**
 * A story on a Docs page: a `data-theme` scope, painted with its background.
 * The scope also goes on the story's preview box (`.docs-story`), so the
 * whole box, padding included, shows the story's theme.
 */
const DocsStoryTheme = ({
  theme,
  children,
}: {
  theme: Theme
  children: ReactNode
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const preview = ref.current?.closest('.docs-story')
    preview?.setAttribute('data-theme', theme)
    return () => preview?.removeAttribute('data-theme')
  }, [theme])

  return (
    <div ref={ref} data-theme={theme} className="bg-background-1 text-black">
      {children}
    </div>
  )
}

/**
 * The story's theme: the toolbar's, or its own (`globals: { theme: 'dark' }`,
 * or the addon's `parameters.themes.themeOverride`).
 *
 * - Canvas: on `<html>`, so portals get it too.
 * - Docs: a page shows several stories, possibly in different themes (a
 *   story and its "Dark" twin), so each story is its own `data-theme` scope.
 *   `<html>` keeps the toolbar's theme, for the page and for portals.
 *   Stories with `docs.story.inline: false` render in their own iframe, in
 *   canvas mode.
 */
export const withTheme: Decorator = (Story, context) => {
  const theme = toTheme(
    context.parameters.themes?.themeOverride ?? context.globals.theme,
  )

  if (context.viewMode !== 'docs') {
    return (
      <DocumentTheme theme={theme}>
        <Story />
      </DocumentTheme>
    )
  }

  return (
    <DocumentTheme theme={toTheme(context.userGlobals?.theme)}>
      <DocsStoryTheme theme={theme}>
        <Story />
      </DocsStoryTheme>
    </DocumentTheme>
  )
}
