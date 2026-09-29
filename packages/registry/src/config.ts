import type { RegistryItem } from 'shadcn/schema'

export type ItemType =
  | 'registry:ui'
  | 'registry:lib'
  | 'registry:hook'
  | 'registry:component'
  | 'registry:block'
  | 'registry:page'
  | 'registry:file'
  | 'registry:base'
  | 'registry:item'
  | 'registry:theme'
  | 'registry:style'

/**
 * How source files become registry items. Rules are applied in order and a
 * file goes to the first rule that matches it; a runtime file that no rule
 * matches fails the generation (so a new top-level module needs a decision),
 * while a new component directory is picked up by its `components` rule.
 * Re-export-only files (`index.ts` barrels) are never matched: a barrel is
 * shipped with the item that holds everything it re-exports, and imports
 * through any other barrel are rewritten to the module that declares them.
 */
export type GroupRule =
  | {
      /**
       * Each subdirectory of `dir` is a component: one item, named after the
       * directory in kebab case, with every file of the directory. When the
       * directory's `index.ts` re-exports several component modules
       * (PascalCase `.tsx` files), each module is its own item (named after
       * the module) with the private files it imports.
       */
      kind: 'components'
      dir: string
      type?: ItemType
    }
  | {
      /** One item per matching file, named after the file (e.g. hooks). */
      kind: 'each'
      files: string[]
      type: ItemType
    }
  | {
      /** One named item with every matching file (e.g. shared utilities). */
      kind: 'group'
      name: string
      type: ItemType
      files: string[]
      title?: string
      description?: string
      /** Import path (relative to the target root, no extension) to document. */
      import?: string
    }

/** What the build knows when it renders the registry. */
export interface BuildContext {
  /** Public URL of the registry directory, e.g. `https://example.com/r`. */
  baseUrl: string
  /** The reference an item uses for another item of this registry. */
  ref: (name: string) => string
  /** The URL of an item's JSON. */
  url: (name: string) => string
  namespace: string
  /** Version of the source package (`package.json`). */
  version: string
}

/** An item without source files: a base, an aggregate, an npm-only item. */
export type ExtraItem = Omit<
  RegistryItem,
  'files' | 'registryDependencies' | 'dependencies'
> & {
  /** npm packages, without versions: the build adds the ranges. */
  dependencies?: string[]
  /** Item names of this registry, or `@namespace/name` / URLs of others. */
  registryDependencies?: string[]
}

export interface RegistryConfig {
  /** `registry.json` name; also the folder staged files are built from. */
  name: string
  /** The namespace users add to `components.json` (`@snow-ui`). */
  namespace: `@${string}`
  homepage: string
  /**
   * Production URL of the built registry directory, without a trailing
   * slash (`{baseUrl}/{name}.json`). `build --base-url` overrides it (CI
   * serves a local copy).
   */
  baseUrl: string
  author: string
  /**
   * How items reference other items of this registry: absolute URLs work
   * without any `components.json` setup; `namespace` references
   * (`@snow-ui/text`) are needed when the registry requires auth headers,
   * which the CLI only sends for configured namespaces.
   */
  dependencyStyle: 'url' | 'namespace'
  /** The source package (its `package.json` gives versions and ranges). */
  package: string
  /** Sources, relative to `package`. */
  srcDir: string
  /** Where files go in the user's project; source paths are kept below it. */
  target: string
  /** Source files that are never shipped (globs relative to `srcDir`). */
  exclude: string[]
  /** npm packages imported by the sources that items don't declare. */
  ignoreDependencies: string[]
  /**
   * Other workspace packages whose `package.json` versions resolve ranges
   * (`^<version>`) for items that depend on them.
   */
  workspacePackages: string[]
  groups: GroupRule[]
  /** Licence notice added to every shipped source file. */
  license: {
    spdx: string
    copyright: string
    url: string
    /** The licence text, shipped as `LICENSE` in the target root. */
    file?: string
    /** The item that carries the licence file. */
    item?: string
  }
  /** Lines of the header comment of a shipped file (`source`: its path). */
  header: (file: { source: string; url: string }) => string[]
  /** GitHub (or other) URL of the repository at a ref: `…/blob/main/`. */
  sourceUrl: string
  /** The docs page of an item from its Storybook id (`components-button`). */
  docsUrl?: (storyId: string) => string
  /** `docs` shown by the CLI after installing a generated item. */
  itemDocs?: (item: {
    name: string
    type: string
    title: string
    import?: string
    exports?: string[]
  }) => string | undefined
  /**
   * Items without source files. `registryDependencies` name items of this
   * registry (the build turns them into URLs or namespaced references).
   */
  extraItems?: (
    context: BuildContext & {
      /** The items generated from the sources. */
      items: { name: string; type: ItemType }[]
    },
  ) => ExtraItem[]
  /** Committed manifest (drift-checked), relative to the config file. */
  manifest: string
  /** Default output directory of `build`, relative to the config file. */
  outDir: string
  /** `llms.txt` written by `build`, relative to the config file. */
  llms?: {
    file: string
    title: string
    summary: string
    /** Markdown sections before the item lists. */
    intro: (context: BuildContext) => string
  }
}

export const defineConfig = (config: RegistryConfig) => config
