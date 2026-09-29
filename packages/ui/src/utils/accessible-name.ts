import { Children, isValidElement, type ReactNode } from 'react'
import { isDevelopment } from './env'

/** Props that name an element (or an icon: `alt`) without its content. */
type NameProps = {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  title?: string
  alt?: string
  children?: ReactNode
}

const hasNameProp = (props: NameProps | undefined): boolean =>
  !!(
    props?.['aria-label'] ||
    props?.['aria-labelledby'] ||
    props?.title ||
    props?.alt
  )

/**
 * Whether `node` is an element that names the control (a labelled icon). An
 * `aria-hidden` one is left out of the accessibility tree, so its label
 * names nothing.
 */
const isNamedElement = (node: ReactNode): boolean =>
  isValidElement<NameProps>(node) &&
  node.props['aria-hidden'] !== true &&
  node.props['aria-hidden'] !== 'true' &&
  hasNameProp(node.props)

/** A component's name: its `displayName`, or that of what it wraps. */
const componentName = (type: unknown): string => {
  if (typeof type === 'function') {
    const { displayName, name } = type as { displayName?: string; name: string }
    return displayName ?? name
  }
  if (type && typeof type === 'object') {
    // forwardRef ({ render }) and memo ({ type }) components.
    const {
      displayName,
      render,
      type: inner,
    } = type as {
      displayName?: string
      render?: unknown
      type?: unknown
    }
    return displayName ?? componentName(render ?? inner)
  }
  return ''
}

/**
 * Whether `node` is certainly an icon: an `<svg>` or `<img>` element, or a
 * component named like one (`StarIcon` from @holakirr/snow-ui-icons,
 * heroicons or MUI; `IconStar`). Any other element may render text, e.g.
 * `<FormattedMessage id="save" />` or `<Trans i18nKey="save" />`, so it
 * isn't taken for an icon (an icon library with other names isn't
 * recognised: no warning rather than a wrong one).
 */
const isIconElement = (node: ReactNode): boolean => {
  if (!isValidElement(node)) return false
  const { type } = node
  if (typeof type === 'string') return type === 'svg' || type === 'img'
  return /Icon$|^Icon[A-Z]/.test(componentName(type))
}

/**
 * Whether a control whose content is `children` (between `icons`, e.g. a
 * `startContent` and an `endContent`) is icons without an accessible name:
 * no text, no `aria-label`, `aria-labelledby` or `title`, and no icon with
 * `alt` or a label of its own. With `asChild`, the child element is the
 * control, so its content and props count too.
 */
const isUnnamedIconOnly = (
  props: NameProps,
  asChild: boolean,
  icons: ReactNode[],
): boolean => {
  const childProps =
    asChild && isValidElement<NameProps>(props.children)
      ? props.children.props
      : undefined
  const content = childProps ? childProps.children : props.children
  const adornments = icons.filter(
    (icon) => icon != null && typeof icon !== 'boolean',
  )
  // `children` next to icons may be screen-reader-only text: they count as a
  // name. Without icons, only a lone icon child is icon-only content.
  const items = Children.toArray(content)
  const iconElements =
    adornments.length > 0
      ? content == null && adornments.every(isIconElement)
        ? adornments
        : []
      : items.length === 1 && isIconElement(items[0])
        ? items
        : []
  return (
    iconElements.length > 0 &&
    !hasNameProp(props) &&
    !hasNameProp(childProps) &&
    !iconElements.some(isNamedElement)
  )
}

/** The components already reported in this session. */
const warned = new Set<string>()

/**
 * Logs, once per component and in development builds only, that an
 * icon-only control has no accessible name (as `TabsTrigger` does). Safe to
 * call during render, so components without hooks (server components) can
 * use it too.
 * @param props The control's props, with its `children`.
 * @param options.icons Icons rendered around the `children` (start and end
 * content).
 */
export const warnIfUnnamedIconOnly = (
  component: string,
  control: string,
  props: NameProps,
  {
    asChild = false,
    icons = [],
  }: { asChild?: boolean; icons?: ReactNode[] } = {},
): void => {
  if (warned.has(component) || !isDevelopment()) return
  if (!isUnnamedIconOnly(props, asChild, icons)) return
  warned.add(component)
  console.warn(
    `${component}: an icon-only ${control} needs an \`aria-label\` or \`aria-labelledby\`.`,
  )
}

/** Forgets the reported components, so tests can assert each warning. */
export const resetUnnamedIconOnlyWarnings = (): void => {
  warned.clear()
}
