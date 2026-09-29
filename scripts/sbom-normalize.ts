/** The parts of a CycloneDX 1.5 BOM (as `npm sbom` writes it) that we touch. */
export interface CycloneDxComponent {
  'bom-ref': string
  name: string
  version: string
  [key: string]: unknown
}

export interface CycloneDxBom {
  metadata: { component: CycloneDxComponent; [key: string]: unknown }
  components: CycloneDxComponent[]
  dependencies?: { ref: string; dependsOn?: string[] }[]
  [key: string]: unknown
}

/** `@scope/name` from a `@scope/name@1.2.3` bom-ref (npm sbom's refs). */
const nameFromRef = (component: CycloneDxComponent) => {
  const suffix = `@${component.version}`
  const ref = component['bom-ref']
  return ref.endsWith(suffix) ? ref.slice(0, -suffix.length) : component.name
}

/**
 * Turns the BOM `npm sbom --workspace <dir>` writes for a workspace package
 * into the BOM of that package, as published:
 *
 * - its subject (`metadata.component`) is the package, not the private
 *   monorepo root, which is dropped from the dependency graph;
 * - workspace packages are named after their package name (npm names them
 *   after their folder: `ui`, `icons`), like every other component.
 *
 * Throws when the package isn't in the BOM.
 */
export const normalizeSbom = (
  bom: CycloneDxBom,
  name: string,
  version: string,
): CycloneDxBom => {
  const ref = `${name}@${version}`
  const components = bom.components.map((component) => ({
    ...component,
    name: nameFromRef(component),
  }))
  const subject = components.find((component) => component['bom-ref'] === ref)
  if (!subject) {
    throw new Error(`${ref} is not in the SBOM that npm sbom wrote`)
  }
  const rootRef = bom.metadata.component['bom-ref']
  return {
    ...bom,
    metadata: { ...bom.metadata, component: subject },
    components: components.filter((component) => component !== subject),
    dependencies: bom.dependencies?.filter(
      (dependency) => dependency.ref !== rootRef,
    ),
  }
}
