import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { request } from '@playwright/test'
import { productionGet, targets } from './access'
import { completeSuite, requireDocsCoverage } from './coverage'

const out = 'test-results/production'
mkdirSync(out, { recursive: true })
const siteSha = process.env.PRODUCTION_SITE_SHA
const demoSha = process.env.PRODUCTION_DEMO_SHA
if (
  !/^[a-f0-9]{40}$/.test(siteSha ?? '') ||
  !/^[a-f0-9]{40}$/.test(demoSha ?? '')
) {
  throw new Error('Expected production commit SHAs are required')
}
const secrets = Object.keys(targets).map((name) => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
})
const redact = (value: string) =>
  secrets.reduce((text, secret) => text.replaceAll(secret, '[redacted]'), value)
let docsCount = 0
const client = await request.newContext({ ignoreHTTPSErrors: false })
const demoClient = await request.newContext({ ignoreHTTPSErrors: false })
try {
  const deadline = Date.now() + 15 * 60_000
  let ready = false
  while (Date.now() < deadline) {
    try {
      const site = await productionGet(
        client,
        targets.SNOWUI_SITE_AUTOMATION_SECRET,
        '/r/button.json',
        'SNOWUI_SITE_AUTOMATION_SECRET',
      )
      const demo = await productionGet(
        demoClient,
        targets.SNOWUI_DEMO_AUTOMATION_SECRET,
        '/api/release',
        'SNOWUI_DEMO_AUTOMATION_SECRET',
      )
      if (site.ok() && demo.ok()) {
        const siteData = await site.json()
        const demoData = await demo.json()
        if (siteData.meta?.commit === siteSha && demoData.sha === demoSha) {
          ready = true
          break
        }
      }
    } catch {
      /* A deployment may still be coming online; no sensitive request logs. */
    }
    await new Promise((resolve) => setTimeout(resolve, 10_000))
  }
  if (!ready)
    throw new Error(
      'Production domains did not serve the expected commits within 15 minutes',
    )
  console.log(`Production commits verified: site ${siteSha}, demo ${demoSha}`)
  const response = await productionGet(
    client,
    targets.SNOWUI_SITE_AUTOMATION_SECRET,
    '/index.json',
    'SNOWUI_SITE_AUTOMATION_SECRET',
  )
  if (!response.ok()) throw new Error('Published Storybook index unavailable')
  const index = await response.json()
  const docs = Object.values(index.entries ?? {}).filter(
    (entry) => (entry as { type?: string }).type === 'docs',
  )
  if (!docs.length)
    throw new Error('Published Storybook index has no docs pages')
  requireDocsCoverage(docs)
  docsCount = docs.length
  writeFileSync(`${out}/index.json`, redact(JSON.stringify(index)))
  console.log(`Published docs pages: ${docs.length}`)
} catch {
  throw new Error(
    'Production readiness/index check failed; sensitive request details suppressed',
  )
} finally {
  await Promise.all([client.dispose(), demoClient.dispose()])
}

const codes = await Promise.all(
  ['docs', 'demo'].map(
    (name) =>
      new Promise<number>((resolve, reject) => {
        const env: NodeJS.ProcessEnv = {
          ...process.env,
          PRODUCTION_E2E: 'true',
        }
        delete env.DEBUG
        delete env.PWDEBUG
        const child = spawn(
          'node',
          [
            'node_modules/@playwright/test/cli.js',
            'test',
            '-c',
            `production/${name}.config.ts`,
          ],
          { env, stdio: ['ignore', 'pipe', 'pipe'] },
        )
        const chunks: Buffer[] = []
        child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk))
        child.stderr.on('data', (chunk: Buffer) => chunks.push(chunk))
        child.on('error', reject)
        child.on('close', (code) => {
          writeFileSync(
            `${out}/${name}.log`,
            redact(Buffer.concat(chunks).toString()),
          )
          const report = `${out}/${name}.json`
          try {
            const sanitized = redact(
              readFileSync(`${out}/${name}.raw.json`, 'utf8'),
            )
            writeFileSync(report, sanitized)
            const stats = JSON.parse(sanitized).stats
            console.log(
              `${name}: passed=${stats.expected}, failed=${stats.unexpected}, skipped=${stats.skipped}, flaky=${stats.flaky}`,
            )
            resolve(
              code === 0 &&
                completeSuite(stats, name === 'docs' ? docsCount : 33)
                ? 0
                : 1,
            )
          } catch {
            resolve(1)
          }
        })
      }),
  ),
)
process.exitCode = codes.some((code) => code !== 0) ? 1 : 0
