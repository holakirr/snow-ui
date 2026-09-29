import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

// One test per docs page of the built Storybook (the `docs` entries of
// storybook-static/index.json: the guides, the MDX usage pages and the
// automatic docs pages), opened in docs mode like snow-ui.holakirr.com shows
// it. The page fails when, while it and its stories render and play:
//   - an exception goes uncaught or anything logs a console error, on the
//     page or in one of its story iframes (`<Canvas>` with
//     `story={{ inline: false }}`, or `parameters.docs.story.inline: false`);
//   - Storybook shows its error display (an MDX page that throws);
//   - a story's render or play function fails. Inline stories only play with
//     `parameters.docs.story.autoplay`; a story in an iframe always plays.
// Every story iframe is loaded, not only those in the viewport. Nothing
// leaves the machine: remote images get a placeholder, any other remote
// request fails (and its console error fails the page).

interface IndexEntry {
  id: string
  title: string
  type: 'story' | 'docs'
}

/** What `instrument` records in each frame (the page and its iframes). */
interface FrameRecord {
  docsRendered: boolean
  errors: string[]
}

interface CheckWindow {
  __DOCS_CHECK__?: FrameRecord
  __STORYBOOK_PREVIEW__?: {
    currentRender?: { phase?: string }
    storyRenders?: { phase?: string }[]
  }
}

// Stand-in for remote images (avatars etc.), as in the visual tests.
const PLACEHOLDER_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#a8c5da"/><circle cx="32" cy="26" r="12" fill="#e5ecf6"/><rect x="12" y="42" width="40" height="22" rx="11" fill="#e5ecf6"/></svg>`

const indexPath = fileURLToPath(
  new URL('../storybook-static/index.json', import.meta.url),
)
if (!existsSync(indexPath)) {
  throw new Error(
    `${indexPath} not found. Build Storybook first: bun run build:storybook`,
  )
}

const { entries } = JSON.parse(readFileSync(indexPath, 'utf8')) as {
  entries: Record<string, IndexEntry>
}
const docsPages = Object.values(entries).filter(
  (entry) => entry.type === 'docs',
)

/**
 * Runs in every frame before Storybook does (an init script): records the
 * preview channel's error events, which Storybook sets as
 * `__STORYBOOK_ADDONS_CHANNEL__`. A failing inline story only shows its
 * error in the page, without logging it.
 */
function instrument() {
  type Listener = (...args: never[]) => void
  interface Channel {
    on: (event: string, listener: Listener) => void
  }
  const record: FrameRecord = { docsRendered: false, errors: [] }
  ;(window as CheckWindow).__DOCS_CHECK__ = record
  const describe = (error: unknown) =>
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : String(error)
  let channel: Channel | undefined
  Object.defineProperty(window, '__STORYBOOK_ADDONS_CHANNEL__', {
    configurable: true,
    get: () => channel,
    set(value: Channel) {
      channel = value
      value.on('docsRendered', () => {
        record.docsRendered = true
      })
      value.on('playFunctionThrewException', (error: unknown) => {
        record.errors.push(`play function failed: ${describe(error)}`)
      })
      value.on('storyThrewException', (error: unknown) => {
        record.errors.push(`render failed: ${describe(error)}`)
      })
      value.on(
        'storyErrored',
        ({ title, description }: { title: string; description: string }) => {
          record.errors.push(`story errored: ${title}: ${description}`)
        },
      )
      value.on('storyMissing', (id: string) => {
        record.errors.push(`story missing: ${id}`)
      })
      value.on('unhandledErrorsWhilePlaying', (errors: unknown[]) => {
        for (const error of errors) {
          record.errors.push(
            `unhandled error while playing: ${describe(error)}`,
          )
        }
      })
      // An inline story that throws (render, loaders, play): its only trace.
      // Failed reports alone are axe's (the Storybook tests gate those).
      value.on(
        'storyFinished',
        ({
          storyId,
          status,
          reporters,
        }: {
          storyId: string
          status: string
          reporters: { status: string }[]
        }) => {
          if (
            status === 'error' &&
            !reporters.some((report) => report.status === 'failed')
          ) {
            record.errors.push(`story ${storyId} failed`)
          }
        },
      )
    },
  })
}

/**
 * What the page is still waiting for: the docs to render (unless Storybook
 * shows its error display), each story to render and play, each image to
 * load (a failed load has logged its console error by then). Empty once the
 * page is done. Also starts loading the lazy story iframes out of view.
 */
function pendingWork() {
  const TERMINAL = ['finished', 'aborted', 'errored']
  const errorDisplay = (win: Window) =>
    win.document.body?.classList.contains('sb-show-errordisplay') ?? false
  const loading = (win: Window) =>
    Array.from(win.document.images).filter((image) => !image.complete).length
  if (errorDisplay(window)) return []

  const pending: string[] = []
  const docs = window as CheckWindow
  if (!docs.__DOCS_CHECK__?.docsRendered) pending.push('the docs render')
  const renders = docs.__STORYBOOK_PREVIEW__?.storyRenders ?? []
  const inlineStories = document.querySelectorAll(
    '[data-story-block]:not(:has(iframe))',
  ).length
  const done = renders.filter((render) =>
    TERMINAL.includes(render.phase ?? ''),
  ).length
  if (done < Math.max(inlineStories, renders.length)) {
    pending.push(`inline stories (${done}/${inlineStories} done)`)
  }
  if (loading(window)) pending.push(`${loading(window)} image(s) on the page`)

  for (const iframe of document.querySelectorAll('iframe')) {
    if (iframe.getAttribute('loading') === 'lazy') {
      iframe.setAttribute('loading', 'eager')
    }
    const story = iframe.contentWindow
    if (
      !story ||
      story.location.href === 'about:blank' ||
      story.document.readyState !== 'complete'
    ) {
      pending.push(`${iframe.id} to load`)
      continue
    }
    if (errorDisplay(story)) continue
    const phase = (story as CheckWindow).__STORYBOOK_PREVIEW__?.currentRender
      ?.phase
    if (!phase || !TERMINAL.includes(phase)) {
      pending.push(`${iframe.id} (phase: ${phase})`)
    } else if (loading(story)) {
      pending.push(`${loading(story)} image(s) in ${iframe.id}`)
    }
  }
  return pending
}

/**
 * The errors each frame recorded, and Storybook's error display if shown.
 * The page's preview channel also hears its story iframes' events: those
 * are reported once, for the iframe.
 */
function collectErrors() {
  const describe = (win: Window) => {
    const url = new URL(win.location.href)
    const errors = [...((win as CheckWindow).__DOCS_CHECK__?.errors ?? [])]
    if (win.document.body.classList.contains('sb-show-errordisplay')) {
      const message = win.document.getElementById('error-message')?.textContent
      errors.push(`Storybook's error display: ${message}`)
    }
    return {
      where: `${url.searchParams.get('id')} (${url.searchParams.get('viewMode')})`,
      errors,
    }
  }
  const stories = Array.from(document.querySelectorAll('iframe'), (iframe) => {
    if (!iframe.contentWindow) throw new Error(`${iframe.id} is detached`)
    return describe(iframe.contentWindow)
  })
  const inStories = new Set(stories.flatMap((story) => story.errors))
  const page = describe(window)
  page.errors = page.errors.filter((error) => !inStories.has(error))
  return [page, ...stories].flatMap(({ where, errors }) =>
    errors.map((error) => `${where}: ${error}`),
  )
}

for (const page of docsPages) {
  test(page.title, async ({ page: browserPage }) => {
    const errors: string[] = []
    browserPage.on('pageerror', (error) => {
      errors.push(`uncaught exception: ${error.message}`)
    })
    browserPage.on('console', (message) => {
      if (message.type() !== 'error') return
      // The first line: the rest is a minified stack.
      errors.push(`console error: ${message.text().split('\n')[0]}`)
    })
    // Only the local Storybook server is reachable (in every frame).
    await browserPage.route(
      (url) => url.hostname !== '127.0.0.1' && url.hostname !== 'localhost',
      (route) =>
        route.request().resourceType() === 'image'
          ? route.fulfill({
              contentType: 'image/svg+xml',
              body: PLACEHOLDER_IMAGE,
            })
          : route.abort('internetdisconnected'),
    )
    await browserPage.addInitScript(instrument)

    await browserPage.goto(
      `/iframe.html?id=${encodeURIComponent(page.id)}&viewMode=docs`,
    )
    await browserPage
      .waitForFunction(`(${pendingWork})().length === 0`, undefined, {
        polling: 100,
        timeout: 20_000,
      })
      .catch(async (error: Error) => {
        const pending = await browserPage.evaluate(pendingWork)
        throw new Error(`Still waiting for: ${pending.join(', ')}`, {
          cause: error,
        })
      })

    errors.push(...(await browserPage.evaluate(collectErrors)))
    // Testing Library appends the whole DOM to its errors: the first
    // paragraph says what failed.
    const summaries = errors.map((error) => {
      const summary = error.split('\n\n')[0]
      return summary.length > 500 ? `${summary.slice(0, 500)}…` : summary
    })
    expect(summaries, `errors on ${page.title} (${page.id})`).toEqual([])
  })
}
