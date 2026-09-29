import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { buildRegistry } from './build'
import type { RegistryConfig } from './config'
import { createPlan } from './plan'
import { RegistryError } from './util'

const USAGE = `Usage: bun packages/registry/src/cli.ts <command> [options]

Commands:
  generate            write the manifest (manifest.json) from the sources
  generate --check    fail when the committed manifest is out of date
  build               build the registry: /r/*.json with the shadcn CLI, llms.txt

Options:
  --config <path>     registry config (default: packages/registry/registry.config.ts)
  --out <dir>         output directory of build (default: the config's outDir)
  --base-url <url>    public URL of the output directory (default: the config's baseUrl)
  --llms <path>       llms.txt path (default: the config's llms.file; "none" to skip)
  --dependency <spec> replace an npm dependency spec, e.g.
                      --dependency @holakirr/snow-ui=file:/abs/snow-ui.tgz (repeatable)
`

export async function loadConfig(path: string) {
  const module = (await import(path)) as { default: RegistryConfig }
  return { config: module.default, configDir: dirname(path) }
}

/** The manifest as committed: 2-space JSON with a final newline. */
export const serializeManifest = (manifest: unknown) =>
  `${JSON.stringify(manifest, null, 2)}\n`

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      config: {
        type: 'string',
        default: resolve(import.meta.dirname, '../registry.config.ts'),
      },
      check: { type: 'boolean', default: false },
      out: { type: 'string' },
      'base-url': { type: 'string' },
      llms: { type: 'string' },
      dependency: { type: 'string', multiple: true },
      help: { type: 'boolean', short: 'h' },
    },
  })
  const command = positionals[0]
  if (values.help || !command) {
    console.log(USAGE)
    process.exit(values.help ? 0 : 1)
  }
  const { config, configDir } = await loadConfig(resolve(values.config))

  if (command === 'generate') {
    const plan = createPlan(config, configDir)
    const file = resolve(configDir, config.manifest)
    const text = serializeManifest(plan.manifest)
    let current = ''
    try {
      current = readFileSync(file, 'utf8')
    } catch {
      // No manifest yet.
    }
    if (values.check) {
      // Compared as data: the committed file is formatted by Biome.
      let same = false
      try {
        same =
          JSON.stringify(JSON.parse(current)) === JSON.stringify(plan.manifest)
      } catch {
        // Missing or invalid.
      }
      if (!same) {
        console.error(
          `${config.manifest} is out of date: run \`bun run registry\` and commit it.`,
        )
        process.exit(1)
      }
      console.log(`${config.manifest} is up to date.`)
      return
    }
    writeFileSync(file, text)
    console.log(
      `Wrote ${config.manifest}: ${plan.manifest.items.length} items.`,
    )
    return
  }

  if (command === 'build') {
    const overrides = Object.fromEntries(
      (values.dependency ?? []).map((spec) => {
        const at = spec.indexOf('=', 1)
        if (at < 1) {
          throw new RegistryError(`--dependency ${spec}: use name=spec`)
        }
        return [spec.slice(0, at), spec.slice(at + 1)]
      }),
    )
    const result = await buildRegistry(config, configDir, {
      outDir: values.out ? resolve(values.out) : undefined,
      baseUrl: values['base-url'],
      llmsFile:
        values.llms === 'none'
          ? null
          : values.llms
            ? resolve(values.llms)
            : undefined,
      dependencyOverrides: overrides,
    })
    console.log(
      `Built ${result.items.length} items into ${result.outDir} (${result.baseUrl}).`,
    )
    return
  }

  console.error(`Unknown command "${command}".\n\n${USAGE}`)
  process.exit(1)
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof RegistryError ? error.message : error)
    process.exit(1)
  })
}
