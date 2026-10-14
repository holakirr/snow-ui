import { appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export async function resolveProductionCommits(
  env: NodeJS.ProcessEnv,
  fetcher: typeof fetch = fetch,
) {
  let site = env.SITE_SHA
  const demo = env.DEMO_SHA || env.GITHUB_SHA
  if (!site) {
    try {
      const response = await fetcher(
        `${env.GITHUB_API_URL}/repos/${env.GITHUB_REPOSITORY}/git/ref/heads/release`,
        {
          headers: {
            Authorization: `Bearer ${env.GH_TOKEN}`,
            Accept: 'application/vnd.github+json',
          },
          redirect: 'error',
        },
      )
      if (!response.ok) throw new Error('GitHub rejected release lookup')
      site = (await response.json()).object.sha
    } catch {
      throw new Error(
        'Cannot resolve release branch; request details suppressed',
      )
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
