import { Children, isValidElement, type ReactNode } from 'react'

/**
 * Whether `children` is a lone icon: exactly one element, no text, and no
 * children of its own (`<StarIcon />`, `<svg>…</svg>`). A label such as
 * `<span>Bold</span>` or `<Icon /> Bold` is not.
 */
export const isIconOnly = (children: ReactNode): boolean => {
  const items = Children.toArray(children)
  if (items.length !== 1) return false

  const [item] = items
  if (!isValidElement<{ children?: ReactNode }>(item)) return false

  const { children: inner } = item.props
  return item.type === 'svg' || inner === undefined || inner === null
}
