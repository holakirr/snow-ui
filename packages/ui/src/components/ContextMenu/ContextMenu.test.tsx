import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { SnowUIProvider } from '../SnowUIProvider'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSwitchItem,
  ContextMenuTrigger,
} from './ContextMenu'

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
})

describe('ContextMenu destructive item', () => {
  it('is red-text with variant="destructive", in right-to-left text too', async () => {
    render(
      <SnowUIProvider dir="rtl">
        <ContextMenu>
          <ContextMenuTrigger>Area</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SnowUIProvider>,
    )
    fireEvent.contextMenu(screen.getByText('Area'))

    const remove = await screen.findByRole('menuitem', { name: 'Delete' })
    expect(screen.getByRole('menu')).toHaveAttribute('dir', 'rtl')
    expect(remove).toHaveAttribute('data-variant', 'destructive')
    expect(remove).toHaveClass('text-red-text')
    expect(screen.getByRole('menuitem', { name: 'Rename' })).not.toHaveClass(
      'text-red-text',
    )
  })
})

describe('ContextMenuSwitchItem', () => {
  it('is a menuitemcheckbox with a hidden switch, toggled by a click', async () => {
    const onCheckedChange = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSwitchItem checked onCheckedChange={onCheckedChange}>
            Pin to top
          </ContextMenuSwitchItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('Area'))
    const item = await screen.findByRole('menuitemcheckbox', {
      name: 'Pin to top',
    })
    expect(item).toHaveAttribute('aria-checked', 'true')
    expect(item.querySelector(':scope > span')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    fireEvent.click(item)
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })
})
