// Minimal static file server for the built Storybook, used as Playwright's
// `webServer` by the visual tests. Plain Node (no dependencies), so it runs
// as-is inside the Playwright Docker image.
//
// Usage: node visual/serve.mjs <dir> <port>
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const root = resolve(process.argv[2] ?? 'storybook-static')
const port = Number(process.argv[3] ?? 6007)

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

try {
  await stat(join(root, 'index.json'))
} catch {
  console.error(
    `No built Storybook in ${root} (index.json is missing). Run \`bun run build:storybook\` first.`,
  )
  process.exit(1)
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost')
  let file = normalize(join(root, decodeURIComponent(pathname)))
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end()
    return
  }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    await stat(file)
  } catch {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  createReadStream(file).pipe(res)
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} on http://127.0.0.1:${port}`)
})
