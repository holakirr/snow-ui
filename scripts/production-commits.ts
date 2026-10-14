import { appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export async function resolveProductionCommits(
  env: NodeJS.ProcessEnv,
  fetcher: typeof fetch = fetch,
) {
  const api = `${env.GITHUB_API_URL}/repos/${env.GITHUB_REPOSITORY}`
  const get = async (path: string) => {
    try {
      const response = await fetcher(`${api}${path}`, {
        headers: {
          Authorization: `Bearer ${env.GH_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
        redirect: 'error',
      })
      if (!response.ok) throw new Error('GitHub rejected production lookup')
      return await response.json()
    } catch {
      throw new Error(
        'Cannot resolve production commits; request details suppressed',
      )
    }
  }
  let site = env.SITE_SHA
  let demo = env.DEMO_SHA
  if (!site) site = (await get('/git/ref/heads/release')).object.sha
  if (!demo) {
    // Vercel intentionally skips workflow-only commits. A manual run verifies
    // the active production deployment; release callers always pass exact SHAs.
    const deployments: { id: number; sha: string }[] = await get(
      `/deployments?environment=${encodeURIComponent('Production – snow-ui-demo')}&per_page=100`,
    )
    for (const deployment of deployments) {
      const statuses: { state: string }[] = await get(
        `/deployments/${deployment.id}/statuses?per_page=1`,
      )
      if (statuses[0]?.state === 'success') {
        demo = deployment.sha
        break
      }
    }
  }
  if (
    !/^[a-f0-9]{40}$/.test(site ?? '') ||
    !/^[a-f0-9]{40}$/.test(demo ?? '')
  ) {
    throw new Error('Expected production commits must be full Git SHAs')
  }
  return { site, demo }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { site, demo } = await resolveProductionCommits(process.env)
  if (!process.env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT is required')
  appendFileSync(process.env.GITHUB_OUTPUT, `site=${site}\ndemo=${demo}\n`)
}
