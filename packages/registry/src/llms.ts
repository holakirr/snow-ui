import type { BuildContext, RegistryConfig } from './config'
import type { Manifest, ManifestItem } from './plan'
import { importPrefix } from './util'

const SECTIONS: [string, (item: ManifestItem) => boolean][] = [
  ['Components', (item) => item.type === 'registry:ui'],
  ['Hooks', (item) => item.type === 'registry:hook'],
  ['Utilities', (item) => item.type === 'registry:lib'],
  [
    'Theme and bundles',
    (item) =>
      !['registry:ui', 'registry:hook', 'registry:lib'].includes(item.type),
  ],
]

/**
 * llms.txt (https://llmstxt.org): what the library is, how to install it
 * (npm or the registry) and every registry item with its install command,
 * import path and docs link.
 */
export function renderLlms(
  manifest: Manifest,
  descriptions: ReadonlyMap<string, string>,
  config: RegistryConfig,
  context: BuildContext,
): string {
  const llms = config.llms
  if (!llms) return ''
  const line = (item: ManifestItem) => {
    const docs =
      item.docs && config.docsUrl
        ? config.docsUrl(item.docs)
        : context.url(item.name)
    const install =
      item.type === 'registry:base'
        ? `\`npx shadcn@latest init ${context.url(item.name)}\``
        : `\`npx shadcn@latest add ${manifest.namespace}/${item.name}\``
    const using = item.import
      ? ` Import from \`${importPrefix(manifest.target)}/${item.import}\`${
          item.exports?.length ? ` (${item.exports.join(', ')})` : ''
        }.`
      : ''
    const description = descriptions.get(item.name) ?? item.description ?? ''
    return `- [${item.title}](${docs}): ${description} Install: ${install}.${using} Registry JSON: ${context.url(item.name)}`
  }
  const sections = SECTIONS.map(([title, test]) => {
    const items = manifest.items.filter(test)
    return items.length
      ? `## ${title}\n\n${items.map(line).join('\n')}`
      : undefined
  }).filter(Boolean)
  return `${[`# ${llms.title}`, `> ${llms.summary}`, llms.intro(context), ...sections].join('\n\n')}\n`
}
