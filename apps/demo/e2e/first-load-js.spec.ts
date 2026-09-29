import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from './fixtures'

/*
 * First Load JS per route. Next.js 16 no longer prints it in the `next build`
 * output, so this measures what a browser downloads on a cold load of each
 * route: every same-origin script, compressed (as served by `next start`)
 * and uncompressed. The budgets are loose guards against regressions; the
 * numbers go to test-results/first-load-js.json and the test annotations.
 */

// Compressed kB, about 10% above the measured size: raise with a reason.
// The dashboard carries Recharts (about 100 kB of it).
const budgets: Record<string, number> = {
  '/dashboard': 420,
  '/settings': 290,
  '/sign-in': 275,
}
const routes = Object.keys(budgets)

const results: Record<
  string,
  { scripts: number; compressedKB: number; uncompressedKB: number }
> = {}

test.describe.configure({ mode: 'serial' })

for (const route of routes) {
  test(`first load JS of ${route}`, async ({ page, baseURL }) => {
    const scripts: Promise<{ transfer: number; size: number }>[] = []
    page.on('requestfinished', (request) => {
      if (
        request.resourceType() !== 'script' ||
        !request.url().startsWith(baseURL ?? '')
      ) {
        return
      }
      scripts.push(
        (async () => {
          const [sizes, response] = await Promise.all([
            request.sizes(),
            request.response(),
          ])
          const body = response ? await response.body() : Buffer.alloc(0)
          return { transfer: sizes.responseBodySize, size: body.length }
        })(),
      )
    })
    await page.goto(route, { waitUntil: 'networkidle' })
    const measured = await Promise.all(scripts)
    const compressed = measured.reduce((sum, item) => sum + item.transfer, 0)
    const uncompressed = measured.reduce((sum, item) => sum + item.size, 0)
    results[route] = {
      scripts: measured.length,
      compressedKB: Math.round(compressed / 102.4) / 10,
      uncompressedKB: Math.round(uncompressed / 102.4) / 10,
    }
    test.info().annotations.push({
      type: 'first-load-js',
      description: `${route}: ${results[route].compressedKB} kB compressed, ${results[route].uncompressedKB} kB uncompressed, ${measured.length} scripts`,
    })
    expect(compressed / 1024).toBeLessThan(budgets[route])
  })
}

test.afterAll(() => {
  mkdirSync('test-results', { recursive: true })
  writeFileSync(
    'test-results/first-load-js.json',
    `${JSON.stringify(results, null, 2)}\n`,
  )
  console.table(results)
})
