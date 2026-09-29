import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps, ElementType, HTMLAttributes } from 'react'
import { slotted } from './slot'

type HostElement = 'a' | 'button' | 'div'

type SlotHostProps<E extends HostElement> = ComponentProps<E> & {
  /** The element rendered without `asChild`. */
  element: E
  /** Render the only child element instead, through Radix `Slot`. */
  asChild?: boolean
}

/**
 * `element`, or with `asChild` the only child element, with the child's
 * `className` merged into `className` by the token-aware `twMerge` (see
 * `slotted`). For components whose `asChild` has no content of their own
 * to put around the child's.
 */
export const SlotHost = <E extends HostElement>({
  element,
  asChild = false,
  className,
  children,
  ...props
}: SlotHostProps<E>) => {
  // The props of `element`; typed loosely, as `E` is only known per call.
  const hostProps = props as HTMLAttributes<HTMLElement>

  if (asChild) {
    const slot = slotted(children, className)
    return (
      <Slot {...hostProps} className={slot.className}>
        {slot.child}
      </Slot>
    )
  }

  const Element: ElementType = element
  return (
    <Element className={className} {...hostProps}>
      {children}
    </Element>
  )
}
