import type {
  ColorValueNormalized,
  DimensionValue,
  Plugin,
  ShadowValueNormalized,
  TokenNormalized,
  TokenNormalizedSet,
} from '@terrazzo/parser'

/**
 * Terrazzo plugin that turns the SnowUI DTCG tokens (tokens/*.tokens.json)
 * into:
 *
 * - `css`: a Tailwind v4 stylesheet. Every token as a theme variable in
 *   `@theme static` (light values), and the theme scopes in `@layer base`:
 *   the tokens that differ between the `theme` modifier's contexts on
 *   `:root, [data-theme="light"]`, `[data-theme="dark"]` and, for the OS
 *   preference, `:root:not([data-theme="light"])`; plus `[data-theme]`, which
 *   re-declares the tokens whose value refers to a switching token.
 * - `ts`: the token data behind Storybook's Foundations pages.
 * - `scales`: the token scales tailwind-merge needs (`src/utils/tw-merge.ts`).
 *
 * CSS naming: a token `<namespace>.<name>` is `--<namespace>-<name>`, where
 * the namespace is the Tailwind theme namespace (`color`, `radius`, `shadow`,
 * `inset-shadow`, `ring-color`, `blur`, `font`, `text`). `channels.<name>`
 * (deprecated) is `--<name>`, in the theme scopes only.
 *
 * Values: sRGB colours are written as `#rgb` / `#rrggbb` when opaque and as
 * `rgb(r g b / a)` otherwise; `radius` and `text` dimensions in rem, the rest
 * in px. A colour whose value is the same alias in every mode is written as
 * `var(--<target>)`, so it follows the theme scopes; an alias that differs by
 * mode (Figma's `Primary`) is written as the resolved colour of each mode.
 * `$extensions["com.holakirr.snow-ui"].css` replaces a colour's CSS value
 * with a formula (`{color.primary}` → `var(--color-primary)`); its `$value`
 * must be the formula's result in that mode (checked for `color-mix()`).
 */

export interface SnowUIPluginOptions {
  /** Output paths, relative to the Terrazzo `outDir`. */
  css: string
  ts: string
  scales: string
  /** The modifier that holds the colour modes. @default "theme" */
  modifier?: string
}

const EXTENSION = 'com.holakirr.snow-ui'
const LIGHT = 'light'
const DARK = 'dark'

/** Namespaces, in output order. */
const NAMESPACES = [
  'font',
  'text',
  'color',
  'radius',
  'shadow',
  'inset-shadow',
  'ring-color',
  'blur',
  'channels',
] as const
type Namespace = (typeof NAMESPACES)[number]

interface SnowExtension {
  figma?: string
  css?: string
  fontFeatureSettings?: string
}

/** One CSS custom property. */
interface Variable {
  name: string
  light: string
  dark: string
  comment?: string
  /** Only in the theme scopes, not a Tailwind theme variable. */
  scopeOnly?: boolean
  /** A comment for the variables from this one on, after a blank line. */
  groupComment?: string
}

interface Section {
  namespace: Namespace
  comment?: string
  variables: Variable[]
}

interface ColorDoc {
  name: string
  figma: string
  light: string
  dark: string
  swatch: string
  resolved?: { light: string; dark: string }
  note?: string
}

export default function snowUI(options: SnowUIPluginOptions): Plugin {
  const modifier = options.modifier ?? 'theme'

  return {
    name: 'snow-ui',
    build({ resolver, outputFile }) {
      const light = resolver.apply({ [modifier]: LIGHT })
      const dark = resolver.apply({ [modifier]: DARK })
      const model = createModel(light, dark)

      outputFile(options.css, renderCss(model))
      outputFile(options.ts, renderTs(model))
      outputFile(options.scales, renderScales(model))
    },
  }
}

// ─── Model ────────────────────────────────────────────────────────────────

interface Model {
  sections: Section[]
  colors: ColorDoc[]
  deprecatedColors: { name: string; use: string }[]
  font: { family: string; featureSettings?: string }
  textStyles: {
    size: number
    lineHeight: number
    weights: number[]
    utility: string
  }[]
  radii: { px: number; utility: string }[]
  shadows: EffectDoc[]
  focusRing?: EffectDoc
  blurs: EffectDoc[]
  scales: Record<string, string[]>
}

interface EffectDoc {
  variable: string
  figma: string
  value: string
  utility: string
  note?: string
}

function createModel(light: TokenNormalizedSet, dark: TokenNormalizedSet) {
  const ids = Object.keys(light)
  const darkIds = new Set(Object.keys(dark))
  for (const id of ids) {
    if (!darkIds.delete(id)) fail(id, `is missing from the "${DARK}" mode`)
  }
  for (const id of darkIds) fail(id, `is missing from the "${LIGHT}" mode`)

  const byNamespace = new Map<Namespace, string[]>()
  for (const id of ids) {
    const namespace = id.split('.')[0] as Namespace
    if (!NAMESPACES.includes(namespace)) {
      fail(
        id,
        `is in an unknown group "${namespace}" (expected one of ${NAMESPACES.join(', ')}); add it to scripts/terrazzo-plugin-snow-ui.ts`,
      )
    }
    byNamespace.set(namespace, [...(byNamespace.get(namespace) ?? []), id])
    // Only colours are written per theme scope.
    if (
      !['color', 'ring-color', 'channels'].includes(namespace) &&
      JSON.stringify(light[id].$value) !== JSON.stringify(dark[id].$value)
    ) {
      fail(id, 'differs between the modes; only colours can')
    }
  }
  // Regular tokens before deprecated ones, in source order otherwise.
  const tokensOf = (namespace: Namespace) =>
    (byNamespace.get(namespace) ?? [])
      .map((id) => ({ id, light: light[id], dark: dark[id] }))
      .sort((a, b) => +isDeprecated(a.light) - +isDeprecated(b.light))

  const model: Model = {
    sections: [],
    colors: [],
    deprecatedColors: [],
    font: { family: '' },
    textStyles: [],
    radii: [],
    shadows: [],
    blurs: [],
    scales: {},
  }
  const section = (namespace: Namespace, first?: TokenNormalized) => {
    const created: Section = {
      namespace,
      comment: first?.group.$description,
      variables: [],
    }
    model.sections.push(created)
    return created
  }

  // font.<name>: fontFamily (+ font-feature-settings from $extensions).
  const fonts = tokensOf('font')
  const fontSection = section('font', fonts[0]?.light)
  for (const { id, light: token } of fonts) {
    const family = cssFontFamily(expect(token, 'fontFamily').$value)
    const name = `--font-${localName(id)}`
    fontSection.variables.push(same(name, family, token.$description))
    const { fontFeatureSettings } = extension(token)
    if (fontFeatureSettings) {
      fontSection.variables.push(
        same(`${name}--font-feature-settings`, fontFeatureSettings),
      )
    }
    if (id === 'font.sans') {
      model.font = { family, featureSettings: fontFeatureSettings }
    }
  }

  // text.<size>.<style>: typography. The styles of a size share its size.
  const texts = tokensOf('text')
  const textSection = section('text', texts[0]?.light)
  const sizes = new Map<string, TokenNormalized[]>()
  for (const { id, light: token } of texts) {
    const [, size, style] = id.split('.')
    if (!style) fail(id, 'must be text.<size>.<style>, e.g. text.14.regular')
    sizes.set(size, [...(sizes.get(size) ?? []), token])
  }
  for (const [size, styles] of sizes) {
    const [first] = styles
    const value = expect(first, 'typography').$value
    for (const other of styles.slice(1)) {
      const otherValue = expect(other, 'typography').$value
      for (const key of ['fontSize', 'lineHeight', 'letterSpacing'] as const) {
        if (JSON.stringify(otherValue[key]) !== JSON.stringify(value[key])) {
          fail(other.id, `must have the same ${key} as ${first.id}`)
        }
      }
    }
    const fontSize = dimension(value.fontSize, first.id)
    const lineHeight = dimension(value.lineHeight, first.id)
    textSection.variables.push(
      same(`--text-${size}`, rem(fontSize)),
      same(`--text-${size}--line-height`, rem(lineHeight)),
    )
    if (value.letterSpacing && dimension(value.letterSpacing, first.id)) {
      textSection.variables.push(
        same(
          `--text-${size}--letter-spacing`,
          px(dimension(value.letterSpacing, first.id)),
        ),
      )
    }
    model.textStyles.push({
      size: Number(size),
      lineHeight,
      weights: styles.map(
        (style) => expect(style, 'typography').$value.fontWeight as number,
      ),
      utility: `text-${size}`,
    })
  }

  // color.<name>: the colour modes.
  const colors = tokensOf('color')
  const colorSection = section('color', colors[0]?.light)
  let firstDeprecated = true
  for (const { id, light: lightToken, dark: darkToken } of colors) {
    const name = localName(id)
    const value = colorValues(id, light, dark)
    const deprecated = lightToken.$deprecated
    colorSection.variables.push({
      name: `--color-${name}`,
      ...value,
      comment: deprecated
        ? `@deprecated ${deprecated === true ? '' : deprecated}`.trim()
        : lightToken.$description,
      ...(deprecated && firstDeprecated
        ? {
            groupComment:
              'Deprecated colour names, kept as aliases of the tokens that replaced them.',
          }
        : {}),
    })
    if (deprecated) {
      firstDeprecated = false
      const target = lightToken.aliasChain?.[0]
      if (!target) fail(id, 'is deprecated, so it must alias its replacement')
      model.deprecatedColors.push({ name, use: localName(target) })
      continue
    }
    const resolved = {
      light: cssColor(expect(lightToken, 'color').$value, id),
      dark: cssColor(expect(darkToken, 'color').$value, id),
    }
    model.colors.push({
      name,
      figma: extension(lightToken).figma ?? '—',
      light: value.light,
      dark: value.dark,
      swatch: `bg-${name}`,
      ...(resolved.light !== value.light || resolved.dark !== value.dark
        ? { resolved }
        : {}),
      ...(lightToken.$description ? { note: lightToken.$description } : {}),
    })
  }

  // radius.<px>: dimension, in rem.
  const radii = tokensOf('radius')
  const radiusSection = section('radius', radii[0]?.light)
  for (const { id, light: token } of radii) {
    const value = dimension(expect(token, 'dimension').$value, id)
    radiusSection.variables.push(
      same(`--radius-${localName(id)}`, rem(value), token.$description),
    )
    model.radii.push({ px: value, utility: `rounded-${localName(id)}` })
  }

  // shadow.<name>, inset-shadow.<name>: shadows.
  for (const namespace of ['shadow', 'inset-shadow'] as const) {
    const shadows = tokensOf(namespace)
    const shadowSection = section(namespace, shadows[0]?.light)
    for (const { id, light: token } of shadows) {
      const value = cssShadow(expect(token, 'shadow').$value, id)
      const variable = `--${namespace}-${localName(id)}`
      if (namespace === 'inset-shadow' && !value.startsWith('inset ')) {
        fail(id, 'is an inset-shadow, so every layer needs "inset": true')
      }
      shadowSection.variables.push(same(variable, value, token.$description))
      model.shadows.push({
        variable,
        figma: extension(token).figma ?? '—',
        value,
        utility: `${namespace}-${localName(id)}`,
        ...(token.$description ? { note: token.$description } : {}),
      })
    }
  }

  // ring-color.<name>: colours.
  const rings = tokensOf('ring-color')
  const ringSection = section('ring-color', rings[0]?.light)
  for (const { id, light: lightToken } of rings) {
    const value = colorValues(id, light, dark)
    const variable = `--ring-color-${localName(id)}`
    ringSection.variables.push({
      name: variable,
      ...value,
      comment: lightToken.$description,
    })
    if (id === 'ring-color.focus') {
      model.focusRing = {
        variable,
        figma: extension(lightToken).figma ?? '—',
        value: value.light,
        utility: `ring-4 ring-${localName(id)}`,
      }
    }
  }

  // blur.<name>: dimension, in px.
  const blurs = tokensOf('blur')
  const blurSection = section('blur', blurs[0]?.light)
  for (const { id, light: token } of blurs) {
    const value = px(dimension(expect(token, 'dimension').$value, id))
    const variable = `--blur-${localName(id)}`
    blurSection.variables.push(same(variable, value, token.$description))
    model.blurs.push({
      variable,
      figma: extension(token).figma ?? '—',
      value,
      utility: `backdrop-blur-${localName(id)}`,
    })
  }

  // channels.<name>: deprecated `--<name>: r, g, b[, a]`, scopes only.
  const channels = tokensOf('channels')
  const channelSection = section('channels', channels[0]?.light)
  for (const [index, { id, light: lightToken, dark: darkToken }] of [
    ...channels.entries(),
  ]) {
    const { $description, $deprecated } = lightToken.group
    channelSection.variables.push({
      name: `--${localName(id)}`,
      light: cssChannels(expect(lightToken, 'color').$value, id),
      dark: cssChannels(expect(darkToken, 'color').$value, id),
      scopeOnly: true,
      ...(index === 0
        ? {
            groupComment: [
              typeof $deprecated === 'string' && `@deprecated ${$deprecated}`,
              $description,
            ]
              .filter(Boolean)
              .join(' '),
          }
        : {}),
    })
  }

  if (!model.focusRing) fail('ring-color.focus', 'is missing')
  if (!model.font.family) fail('font.sans', 'is missing')

  model.scales = {
    text: [...sizes.keys()].sort((a, b) => Number(a) - Number(b)),
    radius: radii.map(({ id }) => localName(id)),
    shadow: tokensOf('shadow').map(({ id }) => localName(id)),
    'inset-shadow': tokensOf('inset-shadow').map(({ id }) => localName(id)),
    blur: blurs.map(({ id }) => localName(id)),
  }

  return model
}

/** The CSS value of a colour token in each mode. */
function colorValues(
  id: string,
  light: TokenNormalizedSet,
  dark: TokenNormalizedSet,
) {
  const value = (set: TokenNormalizedSet) => {
    const token = set[id]
    const formula = extension(token).css
    if (formula) {
      checkFormula(token, formula, set)
      return formula.replace(/\{([^}]+)\}/g, (_, ref: string) => {
        if (!set[ref]) fail(id, `refers to a missing token {${ref}}`)
        return cssVar(ref)
      })
    }
    return cssColor(expect(token, 'color').$value, id)
  }
  const lightAlias = directAlias(light[id])
  if (lightAlias && lightAlias === directAlias(dark[id])) {
    return { light: cssVar(lightAlias), dark: cssVar(lightAlias) }
  }
  return { light: value(light), dark: value(dark) }
}

/**
 * `color-mix(in srgb, {a}, {b} N%)` of opaque colours: the token's `$value`
 * in this mode must be its result (±1 per channel).
 */
function checkFormula(
  token: TokenNormalized,
  formula: string,
  set: TokenNormalizedSet,
) {
  const match = formula.match(
    /^color-mix\(in srgb, \{([^}]+)\}, \{([^}]+)\} ([\d.]+)%\)$/,
  )
  if (!match) return
  const [, a, b, percent] = match
  const [from, to] = [a, b].map((ref) => {
    if (!set[ref]) fail(token.id, `refers to a missing token {${ref}}`)
    return expect(set[ref], 'color').$value
  })
  if ((from.alpha ?? 1) !== 1 || (to.alpha ?? 1) !== 1) return
  const p = Number(percent) / 100
  const expected: ColorValueNormalized = {
    colorSpace: 'srgb',
    components: srgb(from, a).map(
      (c, i) => (c * (1 - p) + (srgb(to, b)[i] ?? 0) * p) / 255,
    ),
    alpha: 1,
  }
  const actual = expect(token, 'color').$value
  const [x, y] = [srgb(expected, token.id), srgb(actual, token.id)]
  if (x.some((c, i) => Math.abs(c - (y[i] ?? 0)) > 1)) {
    fail(
      token.id,
      `has the $value ${cssColor(actual, token.id)}, but ${formula} is ${cssColor(expected, token.id)} in this mode`,
    )
  }
}

function directAlias(token: TokenNormalized) {
  const original = token.originalValue as { $value?: unknown } | undefined
  const value = original?.$value
  return typeof value === 'string' && /^\{[^}]+\}$/.test(value)
    ? value.slice(1, -1)
    : undefined
}

// ─── Values ───────────────────────────────────────────────────────────────

function cssVar(id: string) {
  const [namespace] = id.split('.')
  return namespace === 'channels'
    ? `var(--${localName(id)})`
    : `var(--${id.replaceAll('.', '-')})`
}

function cssColor(value: ColorValueNormalized, id: string) {
  const [r, g, b] = srgb(value, id)
  const alpha = value.alpha ?? 1
  if (alpha === 1) {
    const hex = [r, g, b].map((c) => c.toString(16).padStart(2, '0'))
    return hex.every(([x, y]) => x === y)
      ? `#${hex.map(([x]) => x).join('')}`
      : `#${hex.join('')}`
  }
  return `rgb(${r} ${g} ${b} / ${number(alpha)})`
}

function cssChannels(value: ColorValueNormalized, id: string) {
  const alpha = value.alpha ?? 1
  return [...srgb(value, id), ...(alpha === 1 ? [] : [number(alpha)])].join(
    ', ',
  )
}

function srgb(value: ColorValueNormalized, id: string) {
  if (value.colorSpace !== 'srgb') {
    fail(id, `must be an sRGB colour (got ${value.colorSpace})`)
  }
  return value.components.map((c) => Math.round((c ?? 0) * 255))
}

function cssShadow(
  value: ShadowValueNormalized | ShadowValueNormalized[],
  id: string,
) {
  return (Array.isArray(value) ? value : [value])
    .map((layer) =>
      [
        ...(layer.inset ? ['inset'] : []),
        ...[layer.offsetX, layer.offsetY, layer.blur, layer.spread].map((d) =>
          px(dimension(d, id)),
        ),
        cssColor(layer.color, id),
      ].join(' '),
    )
    .join(', ')
}

function cssFontFamily(families: string[]) {
  const generic = new Set([
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    'ui-serif',
    'ui-sans-serif',
    'ui-monospace',
    'ui-rounded',
    'math',
    'emoji',
  ])
  return families
    .map((family) =>
      generic.has(family) || /^[a-z][\w-]*$/i.test(family)
        ? family
        : JSON.stringify(family),
    )
    .join(', ')
}

/** A dimension in px. */
function dimension(value: DimensionValue | number | undefined, id: string) {
  if (typeof value !== 'object' || value.unit !== 'px') {
    fail(id, `dimensions must be in px (got ${JSON.stringify(value)})`)
  }
  return value.value
}

const px = (value: number) => (value === 0 ? '0' : `${number(value)}px`)
const rem = (value: number) => `${number(value / 16)}rem`
const number = (value: number) => String(Number(value.toFixed(4)))

// ─── Helpers ──────────────────────────────────────────────────────────────

function same(name: string, value: string, comment?: string): Variable {
  return { name, light: value, dark: value, comment }
}

function localName(id: string) {
  return id.split('.').slice(1).join('-')
}

function extension(token: TokenNormalized): SnowExtension {
  return (token.$extensions?.[EXTENSION] ?? {}) as SnowExtension
}

function isDeprecated(token: TokenNormalized) {
  return Boolean(token.$deprecated)
}

function expect<T extends TokenNormalized['$type']>(
  token: TokenNormalized,
  type: T,
): Extract<TokenNormalized, { $type: T }> {
  if (token.$type !== type) {
    fail(token.id, `must be a ${type} token (got ${token.$type})`)
  }
  return token as Extract<TokenNormalized, { $type: T }>
}

function fail(id: string, message: string): never {
  throw new Error(`[snow-ui tokens] ${id} ${message}`)
}

// ─── Output ───────────────────────────────────────────────────────────────

const HEADER = [
  'Generated by `bun run tokens` (Terrazzo, scripts/terrazzo-plugin-snow-ui.ts)',
  'from tokens/*.tokens.json. Do not edit: change the tokens and regenerate.',
]

function comment(text: string, indent: string) {
  const lines = wrap(text, 76 - indent.length)
  return lines.length === 1
    ? `${indent}/* ${lines[0]} */`
    : [
        `${indent}/*`,
        ...lines.map((line) => `${indent} * ${line}`),
        `${indent} */`,
      ].join('\n')
}

function wrap(text: string, width: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (line && line.length + word.length + 1 > width) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)
  return lines
}

/**
 * `--name: value;` lines. `comments`: "all" (theme), "groups" (scopes: only
 * the group comments of scope-only variables) or "none".
 */
function declarations(
  variables: Variable[],
  mode: 'light' | 'dark',
  indent: string,
  comments: 'all' | 'groups' | 'none',
) {
  return variables.flatMap((variable) => [
    ...(variable.groupComment &&
    (comments === 'all' || (comments === 'groups' && variable.scopeOnly))
      ? ['', comment(variable.groupComment, indent)]
      : []),
    ...(comments === 'all' && variable.comment
      ? [comment(variable.comment, indent)]
      : []),
    declaration(variable.name, variable[mode], indent),
  ])
}

/** One line, or one line per top-level list item when it is too long. */
function declaration(name: string, value: string, indent: string) {
  const line = `${indent}${name}: ${value};`
  const items = value.split(/,(?![^(]*\))/).map((item) => item.trim())
  if (line.length <= 80 || items.length < 2) return line
  return [
    `${indent}${name}:`,
    ...items.map(
      (item, i) => `${indent}  ${item}${i === items.length - 1 ? ';' : ','}`,
    ),
  ].join('\n')
}

function renderCss({ sections }: Model) {
  const all = sections.flatMap((section) => section.variables)
  const theme = sections
    .map((section) => ({
      ...section,
      variables: section.variables.filter((v) => !v.scopeOnly),
    }))
    .filter((section) => section.variables.length)
  const switching = all.filter((v) => v.scopeOnly || v.light !== v.dark)
  const switchingNames = new Set(switching.map((v) => v.name))

  // Tokens whose value refers to a switching token, directly or not: a var()
  // is computed where it is declared, so every scope re-declares them.
  const derived = new Set<string>()
  let grew = true
  while (grew) {
    grew = false
    for (const variable of all) {
      if (derived.has(variable.name) || switchingNames.has(variable.name)) {
        continue
      }
      const refs = [...variable.light.matchAll(/var\((--[\w-]+)\)/g)].map(
        ([, ref]) => ref,
      )
      if (refs.some((ref) => switchingNames.has(ref) || derived.has(ref))) {
        derived.add(variable.name)
        grew = true
      }
    }
  }
  const rederived = all.filter((v) => derived.has(v.name))

  const scope = (selector: string, mode: 'light' | 'dark', indent: string) =>
    [
      `${indent}${selector} {`,
      `${indent}  color-scheme: ${mode};`,
      '',
      ...declarations(switching, mode, `${indent}  `, 'groups'),
      `${indent}}`,
    ].join('\n')

  return `${[
    comment(HEADER.join(' '), ''),
    '',
    '@theme static {',
    theme
      .map((section) =>
        [
          ...(section.comment ? [comment(section.comment, '  ')] : []),
          ...declarations(section.variables, 'light', '  ', 'all'),
        ].join('\n'),
      )
      .join('\n\n'),
    '}',
    '',
    '@layer base {',
    comment(
      'Theme scopes. `data-theme="dark"` on any element switches the tokens of its subtree to the dark mode and `data-theme="light"` switches them back (a light panel in a dark page); with no data-theme on <html>, the page follows the OS preference. The tokens are inherited CSS variables, so an element gets the values of its nearest data-theme ancestor, at any depth. `color-scheme` follows, for native controls, scrollbars and system colours. Only the tokens that differ between the modes are listed; the light values repeat `@theme static` so that a light scope can override a dark parent.',
      '  ',
    ),
    scope(':root,\n  [data-theme="light"]', 'light', '  '),
    '',
    comment(
      'Dark mode. The same values as the OS-preference block below.',
      '  ',
    ),
    scope('[data-theme="dark"]', 'dark', '  '),
    '',
    comment('No data-theme on <html>: dark when the OS prefers dark.', '  '),
    '  @media (prefers-color-scheme: dark) {',
    scope(':root:not([data-theme="light"])', 'dark', '    '),
    '  }',
    ...(rederived.length
      ? [
          '',
          comment(
            'A variable defined with var() is computed on the element that declares it and inherited as a value, so the `@theme static` values built on switching tokens would keep the values of <html>. Each scope re-declares them.',
            '  ',
          ),
          '  [data-theme] {',
          ...declarations(rederived, 'light', '    ', 'none'),
          '  }',
        ]
      : []),
    '}',
  ].join('\n')}\n`
}

function renderTs(model: Model) {
  const json = (value: unknown) => JSON.stringify(value, null, 2)
  const sizes = model.textStyles.map(({ size }) => size).join(' | ')

  return `${comment(HEADER.join(' '), '')}

/** A colour token: \`--color-<name>\`, \`bg-<name>\`, \`text-<name>\`… */
export interface ColorToken {
  /** Tailwind colour name: \`bg-<name>\`, \`text-<name>\`, \`border-<name>\`… */
  name: string
  /** Figma variable name ("—" for library additions). */
  figma: string
  /** CSS value in the light mode. */
  light: string
  /** CSS value in the dark mode. */
  dark: string
  /** Swatch class; written out so Tailwind generates it. */
  swatch: string
  /** Computed light/dark colours, for tokens whose value is a formula or an alias. */
  resolved?: { light: string; dark: string }
  note?: string
}

export type TextSize = ${sizes}

export interface TextStyle {
  /** \`size\` prop of \`Typography\`. */
  size: TextSize
  /** Line height in px. */
  lineHeight: number
  /** Font weights of the Figma styles of this size (Regular, Semibold). */
  weights: number[]
  /** Tailwind utility (sets font size and line height). */
  utility: string
}

export interface EffectToken {
  /** CSS variable. */
  variable: string
  figma: string
  value: string
  /** Tailwind utility; written out so Tailwind generates it. */
  utility: string
  note?: string
}

export const colorTokens: ColorToken[] = ${json(model.colors)}

/** Old colour names, kept as aliases until the next major. */
export const deprecatedColors: { name: string; use: string }[] = ${json(model.deprecatedColors)}

/** \`--font-sans\`. */
export const fontFamily = ${json(model.font.family)}

export const fontFeatureSettings = ${json(model.font.featureSettings ?? 'normal')}

/** Figma text styles, largest first. */
export const textStyles: TextStyle[] = ${json(
    [...model.textStyles].sort((a, b) => b.size - a.size),
  )}

/** Figma "Corner Radius", in px. */
export const radii: { px: number; utility: string }[] = ${json(model.radii)}

/** Figma effect styles. Their colours are raw values: they don't flip in dark mode. */
export const shadows: EffectToken[] = ${json(model.shadows)}

export const focusRing: EffectToken = ${json(model.focusRing)}

/** Figma background blurs: CSS blur is half the Figma value. */
export const blurs: EffectToken[] = ${json(model.blurs)}
`
}

function renderScales(model: Model) {
  return `${comment(HEADER.join(' '), '')}

/** The SnowUI token scales that tailwind-merge doesn't know by default. */
export const tokenScales = ${JSON.stringify(model.scales, null, 2)}
`
}
