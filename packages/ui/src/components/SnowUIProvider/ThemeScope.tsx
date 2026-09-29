'use client'

import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import { SnowUIProvider, type SnowUITheme } from './SnowUIProvider'

export type ThemeScopeProps = ComponentProps<'div'> & {
  /** The theme of the subtree, and of the overlays opened from it. */
  theme: SnowUITheme
  /**
   * Puts `data-theme` on the only child element instead of a `<div>`.
   * @default false
   */
  asChild?: boolean
}

/**
 * A scoped theme that portals follow. It renders a `<div data-theme>` (or,
 * with `asChild`, sets `data-theme` on its child), so the subtree takes that
 * theme's tokens, and tells the overlays opened inside it (dialogs, sheets,
 * popovers, menus, selects, comboboxes, date pickers, tooltips, the command
 * palette), which render at
 * the end of `<body>`, to take it too. A plain `data-theme` attribute themes
 * the subtree only. Paint it yourself: a scope sets tokens, not a
 * background.
 *
 * @example
 * <ThemeScope theme="dark" className="bg-background-1 text-black">
 *   <Select>…</Select>
 * </ThemeScope>
 */
export const ThemeScope = ({
  theme,
  asChild = false,
  ...props
}: ThemeScopeProps) => {
  const Component = asChild ? Slot : 'div'

  return (
    <SnowUIProvider theme={theme}>
      <Component data-theme={theme} {...props} />
    </SnowUIProvider>
  )
}
ThemeScope.displayName = 'ThemeScope'
