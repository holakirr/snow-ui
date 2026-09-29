import type { Decorator } from '@storybook/react-vite'
import { type ReactNode, useLayoutEffect } from 'react'
import {
  SnowUIProvider,
  type TextDirection,
} from '../packages/ui/src/components/SnowUIProvider'
import { type StoryLocale, storyLocales } from './locales'

const toDirection = (value: unknown): TextDirection =>
  value === 'rtl' ? 'rtl' : 'ltr'

const toLocale = (value: unknown): StoryLocale => (value === 'ru' ? 'ru' : 'en')

/** The component that last set `<html dir lang>`, so a stale one doesn't reset it. */
let documentOwner: symbol | undefined

/**
 * Sets `dir` and `lang` on `<html>` while mounted, like an app would: the
 * layout, the `rtl:` styles and portalled content follow the DOM.
 */
const DocumentDirection = ({
  dir,
  lang,
  children,
}: {
  dir: TextDirection
  lang: string
  children: ReactNode
}) => {
  useLayoutEffect(() => {
    const html = document.documentElement
    const previous = { dir: html.getAttribute('dir'), lang: html.lang }
    const owner = Symbol(dir)
    documentOwner = owner
    html.setAttribute('dir', dir)
    html.lang = lang
    return () => {
      if (documentOwner !== owner) return
      documentOwner = undefined
      if (previous.dir === null) html.removeAttribute('dir')
      else html.setAttribute('dir', previous.dir)
      html.lang = previous.lang
    }
  }, [dir, lang])

  return children
}

/**
 * The toolbar's locale (`locale` global: component messages and the date
 * locale) and direction (`dir` global), or the story's own
 * (`globals: { dir: 'rtl' }`), through `SnowUIProvider`.
 *
 * - Canvas: `dir` and `lang` go on `<html>`, as in an app.
 * - Docs: a page shows several stories, so each gets its own `dir` scope;
 *   portalled content takes the direction from the provider.
 */
export const withLocale: Decorator = (Story, context) => {
  const dir = toDirection(context.globals.dir)
  const { lang, ...provider } = storyLocales[toLocale(context.globals.locale)]

  const story = (
    <SnowUIProvider dir={dir} {...provider}>
      <Story />
    </SnowUIProvider>
  )

  if (context.viewMode === 'docs') {
    return (
      <div dir={dir} lang={lang}>
        {story}
      </div>
    )
  }

  return (
    <DocumentDirection dir={dir} lang={lang}>
      {story}
    </DocumentDirection>
  )
}
