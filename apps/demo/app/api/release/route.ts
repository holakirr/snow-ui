export const dynamic = 'force-static'

// Snapshotted at build time; no credentials or runtime configuration.
export function GET() {
  return Response.json({ sha: process.env.VERCEL_GIT_COMMIT_SHA ?? null })
}
