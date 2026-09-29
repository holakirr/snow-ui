/**
 * CycloneDX SBOMs of the workspace packages, for the release job of
 * .github/workflows/release.yml, which attaches each one to the package's
 * GitHub release: `npm sbom` of the package's production dependency tree
 * (dependencies at the versions installed from bun.lock; dev and peer
 * dependencies left out), with the package itself as the BOM's subject
 * (sbom-normalize.ts).
 *
 *   bun scripts/sbom.ts <out dir>                 # every public package
 *   bun scripts/sbom.ts <out dir> @holakirr/snow-ui @holakirr/snow-ui-icons
 *
 * Needs `bun install` (npm reads the installed tree in node_modules). Prints
 * one line per SBOM: `<name>@<version>` and the file, separated by a tab.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { type CycloneDxBom, normalizeSbom } from './sbom-normalize'

interface WorkspacePackage {
  name: string
  version: string
  dir: string
}

const root = join(import.meta.dirname, '..')
const [outDir, ...names] = process.argv.slice(2)
if (!outDir) {
  console.error('Usage: bun scripts/sbom.ts <out dir> [<package name> ...]')
  process.exit(1)
}

const packages: WorkspacePackage[] = readdirSync(join(root, 'packages'))
  .flatMap((dir) => {
    try {
      const json = JSON.parse(
        readFileSync(join(root, 'packages', dir, 'package.json'), 'utf8'),
      ) as { name: string; version: string; private?: boolean }
      return json.private
        ? []
        : [{ name: json.name, version: json.version, dir: `packages/${dir}` }]
    } catch {
      return []
    }
  })
  .filter((pkg) => names.length === 0 || names.includes(pkg.name))

const unknown = names.filter((name) => !packages.some((p) => p.name === name))
if (unknown.length > 0) {
  console.error(`Not a public workspace package: ${unknown.join(', ')}`)
  process.exit(1)
}

// npm sbom can't describe a root package without a version (the private
// monorepo root has none): give it one for the run.
const rootManifest = join(root, 'package.json')
const rootSource = readFileSync(rootManifest, 'utf8')
mkdirSync(outDir, { recursive: true })
try {
  writeFileSync(
    rootManifest,
    `${JSON.stringify({ ...JSON.parse(rootSource), version: '0.0.0' }, null, 2)}\n`,
  )
  for (const pkg of packages) {
    const result = spawnSync(
      'npm',
      [
        'sbom',
        '--sbom-format=cyclonedx',
        '--sbom-type=library',
        '--omit=dev',
        '--omit=peer',
        `--workspace=${pkg.dir}`,
      ],
      { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    )
    if (result.error || result.status !== 0) {
      throw new Error(
        `npm sbom for ${pkg.name} failed: ${result.error?.message ?? result.stderr}`,
      )
    }
    const bom = normalizeSbom(
      JSON.parse(result.stdout) as CycloneDxBom,
      pkg.name,
      pkg.version,
    )
    const file = join(
      outDir,
      `${pkg.name.replace(/^@/, '').replace('/', '-')}-${pkg.version}.cdx.json`,
    )
    writeFileSync(file, `${JSON.stringify(bom, null, 2)}\n`)
    console.log(`${pkg.name}@${pkg.version}\t${file}`)
  }
} finally {
  writeFileSync(rootManifest, rootSource)
}
