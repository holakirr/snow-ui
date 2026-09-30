import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './ContextMenu'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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

describe('menu check marks', () => {
  /** The check mark of a checked item: a 16px slot at the end. */
  const expectCheckAtEnd = (item: HTMLElement) => {
    expect(item).toHaveClass('pe-8')
    const slot = item.lastElementChild as HTMLElement
    expect(slot).toHaveClass('absolute', 'end-2', 'size-4')
    expect(slot.querySelector('svg')).not.toBeNull()
  }

  it('puts the check at the end in DropdownMenu, for checkbox and radio items', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>View</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="top">
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expectCheckAtEnd(
      screen.getByRole('menuitemcheckbox', { name: 'Status bar' }),
    )
    expectCheckAtEnd(screen.getByRole('menuitemradio', { name: 'Top' }))
  })

  it('puts the same check at the end in ContextMenu, and a chevron on sub triggers', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value="a">
            <ContextMenuRadioItem value="a">Alpha</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Inner</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('Area'))

    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Show grid' })
    const radio = screen.getByRole('menuitemradio', { name: 'Alpha' })
    expectCheckAtEnd(checkbox)
    expectCheckAtEnd(radio)
    // The radio item shows the checkbox item's mark (no dot).
    expect(radio.lastElementChild?.innerHTML).toBe(
      checkbox.lastElementChild?.innerHTML,
    )
    // The chevron (ArrowLineRight), as in DropdownMenu, not an arrow.
    const chevron = screen
      .getByRole('menuitem', { name: 'More' })
      .querySelector('svg:last-child')
    expect(chevron?.innerHTML).toBe(
      render(<ArrowLineRightIcon />).container.querySelector('svg')?.innerHTML,
    )
  })
})
