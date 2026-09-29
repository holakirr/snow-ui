import { Children, isValidElement, type ReactNode } from 'react'
import { isIconOnly } from './children'
import { isDevelopment } from './env'

/** Props that name an element (or an icon: `alt`) without its content. */
type NameProps = {
  'aria-label'?: string
  'aria-labelledby'?: string
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

/** Whether `node` is an element that names itself (a labelled icon). */
const isNamedElement = (node: ReactNode): boolean =>
  isValidElement<NameProps>(node) && hasNameProp(node.props)

/**
 * Whether a control whose content is `children` (after `icon`, e.g. a
 * `startContent`) is an icon without an accessible name: no text, no
 * `aria-label`, `aria-labelledby` or `title`, and an icon without `alt` or a
 * label of its own. With `asChild`, the child element is the control, so its
 * content and props count too.
 */
const isUnnamedIconOnly = (
  props: NameProps,
  asChild: boolean,
  icon: ReactNode,
): boolean => {
  const childProps =
    asChild && isValidElement<NameProps>(props.children)
      ? props.children.props
      : undefined
  const content = childProps ? childProps.children : props.children
  const iconOnly = icon
    ? content === undefined || content === null
    : isIconOnly(content)
  if (!iconOnly) return false
  const iconElement = icon ?? Children.toArray(content)[0]
  return (
    !hasNameProp(props) &&
    !hasNameProp(childProps) &&
    !isNamedElement(iconElement)
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
 * @param options.icon An icon rendered before the `children`.
 */
export const warnIfUnnamedIconOnly = (
  component: string,
  control: string,
  props: NameProps,
  { asChild = false, icon }: { asChild?: boolean; icon?: ReactNode } = {},
): void => {
  if (warned.has(component) || !isDevelopment()) return
  if (!isUnnamedIconOnly(props, asChild, icon)) return
  warned.add(component)
  console.warn(
    `${component}: an icon-only ${control} needs an \`aria-label\` or \`aria-labelledby\`.`,
  )
}

/** Forgets the reported components, so tests can assert each warning. */
export const resetUnnamedIconOnlyWarnings = (): void => {
  warned.clear()
}
