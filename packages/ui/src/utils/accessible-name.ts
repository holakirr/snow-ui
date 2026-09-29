import { Children, isValidElement, type ReactNode } from 'react'
import { isIconOnly } from './children'
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

/** Whether `node` is an icon: an `<svg>`, or an element without children. */
const isIconElement = (node: ReactNode): boolean =>
  isValidElement<NameProps>(node) &&
  (node.type === 'svg' || node.props.children == null)

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
  const iconElements =
    adornments.length > 0
      ? content == null && adornments.every(isIconElement)
        ? adornments
        : []
      : isIconOnly(content)
        ? Children.toArray(content)
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
