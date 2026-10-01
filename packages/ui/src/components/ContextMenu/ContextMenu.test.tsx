import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import { SnowUIProvider } from '../SnowUIProvider'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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
