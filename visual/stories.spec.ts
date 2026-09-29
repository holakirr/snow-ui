import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, type Page, test } from '@playwright/test'

// One screenshot test per story and theme, generated from the built
// Storybook's index (storybook-static/index.json). Opt a story (or a whole
// component, via its meta) out with the `skip-visual` tag.

interface IndexEntry {
  id: string
  title: string
  name: string
  type: 'story' | 'docs'
  tags?: string[]
}

const THEMES = ['light', 'dark'] as const
type Theme = (typeof THEMES)[number]
const SKIP_TAG = 'skip-visual'
// The toolbar globals every story starts from (`initialGlobals` in
// .storybook/preview.tsx), spelled out so a changed default can't silently
// change every baseline. A story's own `globals` (`{ dir: 'rtl' }`,
// `{ theme: 'dark' }`) still wins over these, as in Storybook.
const GLOBALS = { locale: 'en', dir: 'ltr' }
// Date.now() / new Date() are pinned, so date-dependent stories (Calendar,
// Scheduler) render the same days on every run.
const FIXED_NOW = new Date('2025-06-16T10:00:00Z')
// Stand-in for remote images (avatars etc.): the network must not decide
// what a screenshot looks like.
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

const storiesByTitle = new Map<string, IndexEntry[]>()
for (const entry of Object.values(entries)) {
  if (entry.type !== 'story' || entry.tags?.includes(SKIP_TAG)) continue
  const stories = storiesByTitle.get(entry.title) ?? []
  stories.push(entry)
  storiesByTitle.set(entry.title, stories)
}

interface PreviewWindow {
  __STORYBOOK_PREVIEW__?: {
    currentRender?: {
      phase?: string
      story?: { storyGlobals?: Record<string, unknown> }
    }
  }
}

const storyUrl = (id: string, theme: Theme) => {
  const globals = Object.entries({ theme, ...GLOBALS })
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
  return `/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=${globals}`
}

/**
 * Opens the story in the given theme and waits until it can be
 * screenshotted. Returns the theme the story renders in: its own
 * (`globals: { theme: 'dark' }`) when it pins one.
 */
async function gotoStory(page: Page, id: string, theme: Theme) {
  await page.clock.setFixedTime(FIXED_NOW)
  // Only the local Storybook server is reachable: remote images get the
  // placeholder, any other remote request fails right away.
  await page.route(
    (url) => url.hostname !== '127.0.0.1' && url.hostname !== 'localhost',
    (route) =>
      route.request().resourceType() === 'image'
        ? route.fulfill({
            contentType: 'image/svg+xml',
            body: PLACEHOLDER_IMAGE,
          })
        : route.abort('internetdisconnected'),
  )

  await page.goto(storyUrl(id, theme))

  // Wait until Storybook has rendered the story and run its play function.
  const phase = await page
    .waitForFunction(() => {
      const current = (window as unknown as PreviewWindow).__STORYBOOK_PREVIEW__
        ?.currentRender?.phase
      return current === 'finished' ||
        current === 'errored' ||
        current === 'aborted'
        ? current
        : undefined
    })
    .then((handle) => handle.jsonValue())
  expect(phase, 'story render phase').toBe('finished')
  await expect(page.locator('body')).not.toHaveClass(/sb-show-errordisplay/)

  const pinnedTheme = await page.evaluate(
    () =>
      (window as unknown as PreviewWindow).__STORYBOOK_PREVIEW__?.currentRender
        ?.story?.storyGlobals?.theme,
  )
  const renderedTheme =
    pinnedTheme === 'light' || pinnedTheme === 'dark' ? pinnedTheme : theme
  // withTheme (.storybook/withTheme.tsx) puts the theme on <html> in canvas
  // mode, for the story and for its portals.
  await expect(page.locator('html')).toHaveAttribute(
    'data-theme',
    renderedTheme,
  )

  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    // The self-hosted Inter (fonts.css) is split by unicode-range and each
    // face only loads once text needs it: load them all up front, so no text
    // is shot in the fallback font (`font-display: swap`).
    await Promise.all(
      Array.from(document.fonts, (font) => font.load().catch(() => undefined)),
    )
    await document.fonts.ready
    // Charts (@holakirr/snow-ui-charts) draw once their font has loaded and
    // their size is known, and flag it with data-chart-ready.
    // Bounded: a chart that never gets a size or its font fails the test with
    // its name instead of hanging page.evaluate.
    await new Promise<void>((resolve, reject) => {
      const deadline = performance.now() + 15_000
      const pending = () =>
        Array.from(document.querySelectorAll('[data-slot="chart"]')).filter(
          (chart) => !chart.hasAttribute('data-chart-ready'),
        )
      const check = () => {
        const notReady = pending()
        if (notReady.length === 0) return resolve()
        if (performance.now() > deadline) {
          const names = notReady.map(
            (chart) =>
              chart.getAttribute('aria-label') ??
              chart.querySelector('figcaption')?.textContent ??
              '(unnamed chart)',
          )
          return reject(
            new Error(
              `Charts not ready after 15 s (no data-chart-ready): ${names.join(', ')}`,
            ),
          )
        }
        requestAnimationFrame(check)
      }
      check()
    })
    // Images (the placeholders above) must be decoded before the shot.
    await Promise.all(
      Array.from(document.images, (image) =>
        image.complete ? undefined : image.decode().catch(() => undefined),
      ),
    )
    // `animations: 'disabled'` covers CSS and Web Animations but not SVG
    // (SMIL) ones, like the loading icons': freeze those at their start.
    for (const svg of document.querySelectorAll('svg')) {
      svg.pauseAnimations()
      svg.setCurrentTime(0)
    }
  })

  return renderedTheme
}

for (const [title, stories] of storiesByTitle) {
  test.describe(title, () => {
    for (const story of stories) {
      for (const theme of THEMES) {
        test(`${story.name} [${theme}]`, async ({ page }) => {
          const renderedTheme = await gotoStory(page, story.id, theme)
          // A story that pins its theme (the "Dark" twins) looks the same in
          // both runs: only the run of that theme keeps a baseline.
          test.skip(renderedTheme !== theme, `pins the ${renderedTheme} theme`)
          await expect(page).toHaveScreenshot(`${story.id}--${theme}.png`, {
            fullPage: true,
          })
        })
      }
    }
  })
}
