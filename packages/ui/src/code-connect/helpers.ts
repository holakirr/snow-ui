/**
 * Helpers for the Figma Code Connect templates (`components/**\/*.figma.ts`).
 * `figma connect` bundles them into each template; they are not part of the
 * package. See CONTRIBUTING.md, "Figma Code Connect".
 */
import figma from 'figma'

/** A JSX attribute value; `{ code }` is rendered as an expression. */
export type Attr = string | number | boolean | { code: string } | undefined

/** Attributes of a component: `satisfies AttrsOf<ButtonProps>` checks names. */
export type AttrsOf<P> = { [K in keyof P]?: Attr }

/** A JSX expression attribute value, e.g. `code('<DefaultIcon />')`. */
export const code = (value: string) => ({ code: value })

/**
 * A "True" / "False" variant of the selected instance, or a boolean component
 * property. The first of `names` the instance has wins, so a template can
 * accept the names the kit uses for the same idea.
 */
export const isOn = (...names: string[]) => {
  for (const name of names) {
    let value: unknown
    try {
      value = figma.selectedInstance.getPropertyValue(name)
    } catch {
      continue
    }
    if (typeof value === 'boolean') return value
    if (value === 'True' || value === 'False') return value === 'True'
  }
  return false
}

/** JSX attributes: `true` → `name`, strings quoted, `{ code }` in braces. */
export const jsxAttrs = (attrs: Record<string, Attr>) =>
  Object.entries(attrs)
    .flatMap(([name, value]) => {
      if (value === undefined || value === false) return []
      if (value === true) return [` ${name}`]
      if (typeof value === 'string') return [` ${name}="${value}"`]
      if (typeof value === 'number') return [` ${name}={${value}}`]
      return [` ${name}={${value.code}}`]
    })
    .join('')

/** A JSX element: self-closing without children. */
export const jsx = (
  name: string,
  attrs: Record<string, Attr>,
  children = '',
) =>
  children
    ? `<${name}${jsxAttrs(attrs)}>${children}</${name}>`
    : `<${name}${jsxAttrs(attrs)} />`

/** `import { … } from '@holakirr/snow-ui'`. */
export const uiImport = (...names: string[]) =>
  `import { ${names.join(', ')} } from '@holakirr/snow-ui'`

/** `import { … } from '@holakirr/snow-ui-icons'`. */
export const iconsImport = (...names: string[]) =>
  `import { ${names.join(', ')} } from '@holakirr/snow-ui-icons'`
