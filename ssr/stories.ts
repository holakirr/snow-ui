import { composeStories } from '@storybook/react'
import type { ComponentType } from 'react'
import preview from '../.storybook/preview'

/**
 * The stories the SSR test renders on the server and hydrates in the
 * browser: every story of the ui package, with the project annotations of
 * .storybook/preview (the theme, locale and frame decorators), in the same
 * order in both phases.
 *
 * A story that can't be rendered on the server by design opts out with the
 * `skip-ssr` tag, with the reason next to it.
 */
export interface SsrStory {
  /** The Storybook id, e.g. `components-button--primary`. */
  id: string
  Story: ComponentType
}

/** Where the server phase writes the HTML of every story (gitignored). */
export const SERVER_HTML = '.tmp/ssr/stories.json'

/** The same clock as the visual tests, so date-dependent stories match. */
export const FIXED_NOW = new Date('2025-06-16T10:00:00Z')

const modules = import.meta.glob<Parameters<typeof composeStories>[0]>(
  '../packages/ui/src/**/*.stories.tsx',
  { eager: true },
)

/** A composed story: a component that renders the story with its decorators. */
type ComposedStory = ComponentType & { id: string; tags: string[] }

export const stories: SsrStory[] = Object.keys(modules)
  .sort()
  .flatMap(
    (path) =>
      Object.values(composeStories(modules[path], preview)) as ComposedStory[],
  )
  .filter((Story) => !Story.tags.includes('skip-ssr'))
  .map((Story) => ({ id: Story.id, Story }))

/**
 * Collects what the code under test logs with `console.error` (React's
 * hydration and render warnings) instead of printing it, with React's `%s`
 * placeholders filled in.
 */
export const captureConsoleErrors = () => {
  const messages: string[] = []
  const original = console.error
  console.error = (...args: unknown[]) => {
    const [first, ...rest] = args
    if (typeof first === 'string') {
      let index = 0
      const message = first.replace(/%[sdio]/g, () => String(rest[index++]))
      messages.push([message, ...rest.slice(index).map(String)].join(' '))
    } else {
      messages.push(args.map(String).join(' '))
    }
  }
  return {
    messages,
    restore: () => {
      console.error = original
    },
  }
}
