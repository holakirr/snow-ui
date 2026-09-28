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
const SKIP_TAG = 'skip-visual'
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

type RenderPhase = string | undefined
interface PreviewWindow {
  __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: RenderPhase } }
}

async function gotoStory(page: Page, id: string, theme: string) {
  await page.clock.setFixedTime(FIXED_NOW)
  await page.route(
    (url) => url.hostname !== '127.0.0.1' && url.hostname !== 'localhost',
    (route) =>
      route.request().resourceType() === 'image'
        ? route.fulfill({
            contentType: 'image/svg+xml',
            body: PLACEHOLDER_IMAGE,
          })
        : route.continue(),
  )

  await page.goto(
    `/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=theme:${theme}`,
  )

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
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)

  // Web fonts and images (placeholders above) must be in before the shot.
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
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
}

for (const [title, stories] of storiesByTitle) {
  test.describe(title, () => {
    for (const story of stories) {
      for (const theme of THEMES) {
        test(`${story.name} [${theme}]`, async ({ page }) => {
          await gotoStory(page, story.id, theme)
          await expect(page).toHaveScreenshot(`${story.id}--${theme}.png`, {
            fullPage: true,
          })
        })
      }
    }
  })
}
