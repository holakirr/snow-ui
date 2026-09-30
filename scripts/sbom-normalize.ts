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
 *   after their folder: `ui`, `icons`), like every other component;
 * - only what the package pulls in is listed: the components reachable from
 *   it through the dependency graph. `npm sbom --workspace` lists the whole
 *   installed workspace tree, so the charts' BOM had their peer
 *   `@holakirr/snow-ui` and its dependencies, which the charts don't install.
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
  const graph = bom.dependencies?.filter(
    (dependency) => dependency.ref !== rootRef,
  )
  const reachable = graph ? reachableFrom(ref, graph) : undefined
  return {
    ...bom,
    metadata: { ...bom.metadata, component: subject },
    components: components.filter(
      (component) =>
        component !== subject &&
        (!reachable || reachable.has(component['bom-ref'])),
    ),
    dependencies: graph?.filter(
      (dependency) => !reachable || reachable.has(dependency.ref),
    ),
  }
}

/** The refs `ref` depends on, directly or not, and `ref` itself. */
const reachableFrom = (
  ref: string,
  graph: NonNullable<CycloneDxBom['dependencies']>,
) => {
  const edges = new Map(graph.map((node) => [node.ref, node.dependsOn ?? []]))
  const reachable = new Set([ref])
  const queue = [ref]
  for (let next = queue.shift(); next; next = queue.shift()) {
    for (const dependency of edges.get(next) ?? []) {
      if (reachable.has(dependency)) continue
      reachable.add(dependency)
      queue.push(dependency)
    }
  }
  return reachable
}
