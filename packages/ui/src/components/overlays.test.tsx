import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ContextMenu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './DropdownMenu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'

beforeAll(() => {
  // Radix positions popovers with ResizeObserver and scrolls items into view;
  // jsdom has neither.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
})

describe('Tooltip', () => {
  it('opens on keyboard focus, with the light variant', async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Save</TooltipTrigger>
          <TooltipContent variant="light">Save the file</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    await act(async () => {
      screen.getByRole('button', { name: 'Save' }).focus()
    })

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('Save the file')

    const content = document.querySelector('[data-variant="light"]')
    expect(content).toHaveClass('rounded-12', 'bg-black-4', 'text-black')
  })
})

describe('DropdownMenu', () => {
  it('opens from the keyboard and focuses the first item', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut keys={['⌘', 'P']} />
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    const trigger = screen.getByRole('button', { name: 'Menu' })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter' })

    const menu = await screen.findByRole('menu')
    const [profile] = screen.getAllByRole('menuitem')

    // The Figma Popover surface and 36px items with a 12px radius.
    expect(menu).toHaveClass('p-3', 'rounded-16', 'border-surface-1')
    expect(profile).toHaveClass('p-2', 'rounded-12', 'text-14')
    expect(profile).toHaveFocus()
    expect(screen.getByText('⌘+P').tagName).toBe('KBD')
  })
})

describe('ContextMenu', () => {
  it('opens on the context-menu event', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )

    fireEvent.contextMenu(screen.getByText('Area'))

    const menu = await screen.findByRole('menu')
    expect(menu).toHaveClass('p-3', 'bg-background-3')
    expect(screen.getByRole('menuitem', { name: 'Back' })).toHaveClass(
      'rounded-12',
    )
  })
})
