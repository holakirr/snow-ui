import { readdirSync, statSync } from 'node:fs'
import { join, posix, relative, sep } from 'node:path'

/** `SnowUIProvider` → `snow-ui-provider`, `KBD` → `kbd`, `InputSmall` → `input-small`. */
export const kebabCase = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

/** `use-toast` → `useToast`. */
export const camelCase = (name: string) =>
  name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())

/** The file name without its extension: `components/Button/Button.tsx` → `Button`. */
export const baseName = (file: string) =>
  posix.basename(file).replace(/\.[^.]+$/, '')

export const toPosix = (path: string) => path.split(sep).join('/')

/** `path` without its `.ts` / `.tsx` extension. */
export const withoutExtension = (path: string) => path.replace(/\.tsx?$/, '')

/**
 * A glob (`*`, `**`, `?`, `{a,b}`) as a regular expression on posix paths.
 * `**` matches any number of directories, `*` anything but `/`.
 */
export function globToRegExp(glob: string): RegExp {
  let source = ''
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i]
    if (char === '*') {
      if (glob[i + 1] === '*') {
        const slash = glob[i + 2] === '/'
        source += slash ? '(?:.*/)?' : '.*'
        i += slash ? 2 : 1
      } else {
        source += '[^/]*'
      }
    } else if (char === '?') {
      source += '[^/]'
    } else if (char === '{') {
      const end = glob.indexOf('}', i)
      if (end === -1) throw new Error(`Unclosed "{" in glob ${glob}`)
      source += `(?:${glob
        .slice(i + 1, end)
        .split(',')
        .map((part) => part.replace(/[.+^$()|[\]\\]/g, '\\$&'))
        .join('|')})`
      i = end
    } else {
      source += char.replace(/[.+^$()|[\]\\]/g, '\\$&')
    }
  }
  return new RegExp(`^${source}$`)
}

export const matchesAny = (path: string, globs: readonly string[]) =>
  globs.some((glob) => globToRegExp(glob).test(path))

/** Every file under `dir`, as posix paths relative to it, sorted. */
export function listFiles(dir: string): string[] {
  const files: string[] = []
  const walk = (current: string) => {
    for (const entry of readdirSync(current)) {
      const path = join(current, entry)
      if (statSync(path).isDirectory()) walk(path)
      else files.push(toPosix(relative(dir, path)))
    }
  }
  walk(dir)
  return sorted(files)
}

/** A relative module specifier from `from` (a file) to `to` (a file), both posix. */
export function relativeSpecifier(from: string, to: string) {
  const path = posix.relative(posix.dirname(from), withoutExtension(to))
  const specifier = path.replace(/\/index$/, '').replace(/^index$/, '.')
  return specifier.startsWith('.') ? specifier : `./${specifier}`
}

/**
 * The import path of a `target` in a project with the default aliases:
 * `@components/snow-ui` → `@/components/snow-ui`.
 */
export const importPrefix = (target: string) =>
  target
    .replace(/^@components\//, '@/components/')
    .replace(/^@ui\//, '@/components/ui/')
    .replace(/^@(lib|hooks)\//, '@/$1/')
    .replace(/^~\//, '@/')

/** Unique and sorted by code unit (not by locale: the output is committed). */
export const sorted = (values: Iterable<string>) =>
  [...new Set(values)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

/** The npm package of a bare specifier: `date-fns/locale` → `date-fns`. */
export function packageName(specifier: string) {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

/** An error that lists every problem found (shown without a stack trace). */
export class RegistryError extends Error {
  constructor(messages: string | string[]) {
    const list = Array.isArray(messages) ? messages : [messages]
    super(
      list.length === 1
        ? list[0]
        : `${list.length} problems:\n${list.map((m) => `  - ${m}`).join('\n')}`,
    )
    this.name = 'RegistryError'
  }
}
