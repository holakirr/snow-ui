import { describe, expect, it } from 'vitest'
import { type CycloneDxBom, normalizeSbom } from './sbom-normalize'

// What `npm sbom --workspace packages/ui` writes (trimmed): the monorepo
// root as the subject, the workspace packages named after their folders.
const npmSbom = (): CycloneDxBom => ({
  bomFormat: 'CycloneDX',
  specVersion: '1.5',
  metadata: {
    timestamp: '2026-09-29T14:41:14.458Z',
    component: {
      'bom-ref': 'snow-ui-monorepo@0.0.0',
      name: 'infra',
      version: '0.0.0',
    },
  },
  components: [
    {
      'bom-ref': '@holakirr/snow-ui@5.0.0',
      name: 'ui',
      version: '5.0.0',
      purl: 'pkg:npm/%40holakirr/snow-ui@5.0.0',
    },
    {
      'bom-ref': '@holakirr/snow-ui-icons@2.2.0',
      name: 'icons',
      version: '2.2.0',
    },
    {
      'bom-ref': '@radix-ui/react-slot@1.3.3',
      name: '@radix-ui/react-slot',
      version: '1.3.3',
    },
  ],
  dependencies: [
    { ref: 'snow-ui-monorepo@0.0.0', dependsOn: ['@holakirr/snow-ui@5.0.0'] },
    {
      ref: '@holakirr/snow-ui@5.0.0',
      dependsOn: [
        '@holakirr/snow-ui-icons@2.2.0',
        '@radix-ui/react-slot@1.3.3',
      ],
    },
  ],
})

describe('normalizeSbom', () => {
  const bom = normalizeSbom(npmSbom(), '@holakirr/snow-ui', '5.0.0')

  it('makes the package the subject', () => {
    expect(bom.metadata.component).toEqual({
      'bom-ref': '@holakirr/snow-ui@5.0.0',
      name: '@holakirr/snow-ui',
      version: '5.0.0',
      purl: 'pkg:npm/%40holakirr/snow-ui@5.0.0',
    })
    expect(bom.metadata.timestamp).toBe('2026-09-29T14:41:14.458Z')
  })

  it('lists its dependencies by package name, without itself', () => {
    expect(bom.components.map((c) => c.name)).toEqual([
      '@holakirr/snow-ui-icons',
      '@radix-ui/react-slot',
    ])
  })

  it('drops the monorepo root from the dependency graph', () => {
    expect(bom.dependencies?.map((d) => d.ref)).toEqual([
      '@holakirr/snow-ui@5.0.0',
    ])
  })

  it('throws when the package is not in the SBOM', () => {
    expect(() =>
      normalizeSbom(npmSbom(), '@holakirr/snow-ui', '6.0.0'),
    ).toThrow('@holakirr/snow-ui@6.0.0 is not in the SBOM')
  })
})
