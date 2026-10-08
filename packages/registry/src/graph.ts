import { join, posix } from 'node:path'
import {
  type ExportDeclaration,
  type ImportDeclaration,
  ModuleKind,
  ModuleResolutionKind,
  Node,
  Project,
  ScriptTarget,
  type SourceFile,
  SyntaxKind,
  ts,
} from 'ts-morph'
import { packageName, RegistryError } from './util'

/** A name in `import { … }` / `export { … } from`. */
export interface Binding {
  /** The name in the imported module. */
  name: string
  /** The local name (`import { a as b }` → `b`), when renamed. */
  alias?: string
  typeOnly: boolean
}

/** An `import … from` or `export … from` declaration. */
export interface Edge {
  kind: 'import' | 'export'
  specifier: string
  /** Target module (relative to the source root) of a relative specifier. */
  file?: string
  /** npm package of a bare specifier. */
  pkg?: string
  /** `import type` / `export type`. */
  typeOnly: boolean
  /** Named bindings; `undefined` for `export *`, namespace or side-effect imports. */
  bindings?: Binding[]
  defaultImport: boolean
  namespace: boolean
  /** The declaration's text range in the file (for rewriting it). */
  start: number
  end: number
  quote: string
}

export interface Module {
  /** Path relative to the source root, posix. */
  path: string
  source: SourceFile
  edges: Edge[]
  /** Only `export … from` declarations. */
  barrel: boolean
  /** A leading `'use client'` (or other) directive. */
  directive?: string
}

export interface ModuleGraph {
  root: string
  modules: Map<string, Module>
  project: Project
}

const EXTENSIONS = ['.ts', '.tsx']

/** Resolves a relative specifier of `from` among the files `exists` accepts. */
export function resolveRelative(
  from: string,
  specifier: string,
  exists: (path: string) => boolean,
): string | undefined {
  const base = posix.normalize(
    posix.join(posix.dirname(from), specifier.replace(/\.js$/, '')),
  )
  const candidates = [
    ...(EXTENSIONS.some((ext) => base.endsWith(ext)) ? [base] : []),
    ...EXTENSIONS.map((ext) => `${base}${ext}`),
    ...EXTENSIONS.map((ext) => posix.join(base, `index${ext}`)),
  ]
  return candidates.find(exists)
}

function bindingsOf(
  declaration: ImportDeclaration | ExportDeclaration,
): Binding[] | undefined {
  const named = Node.isImportDeclaration(declaration)
    ? declaration.getNamedImports()
    : declaration.getNamedExports()
  if (!named.length) return undefined
  return named.map((specifier) => ({
    name: specifier.getName(),
    alias: specifier.getAliasNode()?.getText(),
    typeOnly: specifier.isTypeOnly(),
  }))
}

/**
 * Loads the runtime modules under `root` (posix paths in `files`) and their
 * import graph. Relative specifiers must resolve to one of `files`; bare ones
 * become npm packages. Dynamic `import()` and `require()` are rejected, since
 * the generator could not follow them.
 */
export function loadGraph(
  root: string,
  files: string[],
  excluded: string[] = [],
): ModuleGraph {
  const project = new Project({
    // Syntax and exports only: no lib or node_modules types to load.
    compilerOptions: {
      target: ScriptTarget.ES2022,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      allowImportingTsExtensions: true,
      noEmit: true,
      skipLibCheck: true,
      noResolve: true,
      noLib: true,
      types: [],
    },
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
  })
  const known = new Set(files)
  const excludedSet = new Set(excluded)
  const problems: string[] = []
  const modules = new Map<string, Module>()

  for (const path of files) {
    const source = project.addSourceFileAtPath(join(root, path))
    const edges: Edge[] = []
    const declarations = [
      ...source.getImportDeclarations(),
      ...source.getExportDeclarations().filter((d) => d.getModuleSpecifier()),
    ].sort((a, b) => a.getStart() - b.getStart())

    for (const declaration of declarations) {
      const literal = declaration.getModuleSpecifier()
      if (!literal) continue
      const specifier = literal.getLiteralValue()
      const isImport = Node.isImportDeclaration(declaration)
      const edge: Edge = {
        kind: isImport ? 'import' : 'export',
        specifier,
        typeOnly: declaration.isTypeOnly(),
        bindings: bindingsOf(declaration),
        defaultImport: isImport ? !!declaration.getDefaultImport() : false,
        namespace: isImport
          ? !!declaration.getNamespaceImport()
          : !!declaration.getNamespaceExport(),
        start: declaration.getStart(),
        end: declaration.getEnd(),
        quote: literal.getText()[0],
      }
      if (specifier.startsWith('.')) {
        const file = resolveRelative(path, specifier, (p) => known.has(p))
        if (!file) {
          const hidden = resolveRelative(path, specifier, (p) =>
            excludedSet.has(p),
          )
          problems.push(
            hidden
              ? `${path} imports ${hidden}, which is excluded from the registry (stories, tests, docs, Figma templates and test helpers must not be imported by runtime code)`
              : `${path}: cannot resolve "${specifier}"`,
          )
          continue
        }
        edge.file = file
      } else if (specifier.startsWith('node:')) {
        problems.push(`${path} imports the Node built-in "${specifier}"`)
        continue
      } else {
        edge.pkg = packageName(specifier)
      }
      edges.push(edge)
    }

    for (const call of source.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const callee = call.getExpression()
      if (
        callee.getKind() === SyntaxKind.ImportKeyword ||
        (Node.isIdentifier(callee) && callee.getText() === 'require')
      ) {
        problems.push(
          `${path}: dynamic ${callee.getText()}() is not supported by the registry generator`,
        )
      }
    }

    const statements = source.getStatements()
    const first = statements[0]
    let directive: string | undefined
    if (
      first &&
      Node.isExpressionStatement(first) &&
      Node.isStringLiteral(first.getExpression())
    ) {
      directive = first.getExpression().getText().slice(1, -1)
      // The shadcn CLI drops comments before the first statement.
      if (first.getLeadingCommentRanges().length) {
        problems.push(
          `${path}: comments before '${directive}' (the directive must be the first line)`,
        )
      }
    }

    modules.set(path, {
      path,
      source,
      edges,
      barrel:
        statements.length > 0 &&
        statements.every(
          (statement) =>
            Node.isExportDeclaration(statement) &&
            !!statement.getModuleSpecifier(),
        ),
      directive,
    })
  }

  if (problems.length) throw new RegistryError(problems)
  return { root, modules, project }
}
