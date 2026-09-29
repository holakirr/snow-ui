import { cloneElement, isValidElement, type ReactNode } from 'react'
import { twMerge } from './tw-merge'

type HostProps = { className?: string; children?: ReactNode }

/**
 * Prepares the `asChild` rendering of a component. The only child element is
 * rendered instead of the component's own element, through Radix `Slot`,
 * which composes the refs and the event handlers (the child's run first) and
 * merges `style` (the child's win). This adds what `Slot` doesn't do:
 *
 * - the child's `className` is merged into the component's with the
 *   token-aware `twMerge`, so the child's utilities win conflicts (`Slot`
 *   only concatenates class names and leaves conflicts to stylesheet order);
 * - `render` puts the component's own content (icons, a label) around the
 *   child's children, which `Slot` would otherwise replace.
 *
 * Anything but a single element is returned as is; `Slot` then throws its
 * "expected a single React element child" error.
 */
export const slotted = (
  children: ReactNode,
  className: string | undefined,
  render?: (content: ReactNode) => ReactNode,
): { className: string | undefined; child: ReactNode } => {
  if (!isValidElement<HostProps>(children)) {
    return { className, child: children }
  }
  const { className: childClassName, children: content } = children.props
  const props = { className: undefined }

  return {
    className: twMerge(className, childClassName),
    child: render
      ? cloneElement(children, props, render(content))
      : cloneElement(children, props),
  }
}

/**
 * For a component that passes `asChild` on to another one: with `asChild`,
 * the child element with `render(its children)` as its children; without,
 * `render(children)`.
 */
export const withSlotContent = (
  asChild: boolean | undefined,
  children: ReactNode,
  render: (content: ReactNode) => ReactNode,
): ReactNode =>
  asChild && isValidElement<HostProps>(children)
    ? cloneElement(children, undefined, render(children.props.children))
    : render(children)
