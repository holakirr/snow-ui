'use client'

import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import {
  type SnowUIContrast,
  SnowUIProvider,
  type SnowUITheme,
} from './SnowUIProvider'

export type ThemeScopeProps = ComponentProps<'div'> & {
  /**
   * The theme of the subtree, and of the overlays opened from it. Without
   * it, they keep the theme around the scope.
   */
  theme?: SnowUITheme
  /**
   * The contrast level of the subtree and its overlays (`more`: the
   * high-contrast control borders and placeholders). Without it, they keep
   * the contrast around the scope.
   */
  contrast?: SnowUIContrast
  /**
   * Puts `data-theme` on the only child element instead of a `<div>`.
   * @default false
   */
  asChild?: boolean
}

/**
 * A scoped theme and contrast level that portals follow. It renders a
 * `<div data-theme data-contrast>` (or, with `asChild`, sets them on its
 * child), so the subtree takes those tokens, and tells the overlays opened
 * inside it (dialogs, sheets, popovers, menus, selects, comboboxes, date
 * pickers, tooltips, the command palette), which render at the end of
 * `<body>`, to take them too. Plain `data-theme` and `data-contrast`
 * attributes scope the subtree only. Paint it yourself: a scope sets tokens,
 * not a background.
 *
 * @example
 * <ThemeScope theme="dark" className="bg-background-1 text-black">
 *   <Select>…</Select>
 * </ThemeScope>
 * <ThemeScope contrast="more">…</ThemeScope>
 */
export const ThemeScope = ({
  theme,
  contrast,
  asChild = false,
  ...props
}: ThemeScopeProps) => {
  const Component = asChild ? Slot : 'div'

  return (
    <SnowUIProvider theme={theme} contrast={contrast}>
      <Component data-theme={theme} data-contrast={contrast} {...props} />
    </SnowUIProvider>
  )
}
ThemeScope.displayName = 'ThemeScope'
