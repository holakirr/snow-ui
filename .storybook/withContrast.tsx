import type { Decorator } from '@storybook/react-vite'
import { type ReactNode, useLayoutEffect } from 'react'

/**
 * The "Contrast" toolbar (`contrast` global): `auto` follows the OS
 * (`prefers-contrast: more`), `standard` and `more` pin
 * `<html data-contrast>`, as an app's contrast setting would.
 */
export type StoryContrast = 'auto' | 'standard' | 'more'

const toContrast = (value: unknown): StoryContrast =>
  value === 'standard' || value === 'more' ? value : 'auto'

/** The component that last set `<html data-contrast>`, so a stale one doesn't reset it. */
let documentContrastOwner: symbol | undefined

const DocumentContrast = ({
  contrast,
  children,
}: {
  contrast: StoryContrast
  children: ReactNode
}) => {
  useLayoutEffect(() => {
    const html = document.documentElement
    const owner = Symbol(contrast)
    documentContrastOwner = owner
    if (contrast === 'auto') html.removeAttribute('data-contrast')
    else html.setAttribute('data-contrast', contrast)
    return () => {
      if (documentContrastOwner !== owner) return
      documentContrastOwner = undefined
      html.removeAttribute('data-contrast')
    }
  }, [contrast])

  return children
}

/**
 * The toolbar's contrast, or the story's own (`globals: { contrast: 'more' }`),
 * on `<html>`: the contrast scopes of the tokens and the `contrast-more:`
 * variant follow it, portals included, in the canvas and on Docs pages.
 */
export const withContrast: Decorator = (Story, context) => (
  <DocumentContrast contrast={toContrast(context.globals.contrast)}>
    <Story />
  </DocumentContrast>
)
