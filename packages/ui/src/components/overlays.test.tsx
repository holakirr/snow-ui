import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuShortcut,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { Select, SelectTrigger, SelectValue } from './Input'
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
    expect(menu).toHaveClass('p-3', 'rounded-16', 'inset-ring-surface-1')
    expect(profile).toHaveClass('p-2', 'rounded-12', 'text-14')
    // Taller than the room on its side, it scrolls, with the kit scrollbar.
    expect(menu).toHaveClass(
      'max-h-(--radix-dropdown-menu-content-available-height)',
      'overflow-x-hidden',
      'overflow-y-auto',
      'scrollbar-snow',
    )
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
    expect(menu).toHaveClass('p-3', 'bg-background-3', 'scrollbar-snow')
    // It doesn't scroll by default: that would clip a submenu that isn't
    // portalled.
    expect(menu.className).not.toMatch(/overflow/)
    expect(screen.getByRole('menuitem', { name: 'Back' })).toHaveClass(
      'rounded-12',
    )
  })
})

describe('menu shortcuts', () => {
  it('are plain text-secondary text, and keep the KBD key cap with a variant', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Edit</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Copy
            <DropdownMenuShortcut keys={['⌘', 'C']} separator="" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Paste
            <DropdownMenuShortcut keys={['⌘', 'V']} variant="solid" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    const plain = screen.getByText('⌘C')
    expect(plain.tagName).toBe('KBD')
    expect(plain).toHaveAttribute('aria-keyshortcuts', '⌘C')
    expect(plain).toHaveClass('ms-auto', 'text-secondary', 'bg-transparent')
    // At the end of a right-to-left item too: the `<kbd>` is `dir="ltr"`.
    expect(plain).toHaveClass(
      'in-[[role=menu][dir=rtl]]:mr-auto',
      'in-[[role=menu][dir=rtl]]:ml-0',
    )
    expect(plain).not.toHaveClass('bg-black-4', 'text-black', 'min-w-7')
    // Dimmed with its item when the item is disabled.
    expect(plain).toHaveClass('in-data-[disabled]:text-black-20')

    const cap = screen.getByText('⌘+V')
    expect(cap).toHaveClass('ms-auto', 'bg-black-4', 'text-black', 'min-w-7')
    expect(cap).not.toHaveClass('text-secondary')
  })

  it('look the same in ContextMenu', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut keys={['⌘', 'R']} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('Area'))

    const shortcut = screen.getByText('⌘+R')
    expect(shortcut.tagName).toBe('KBD')
    expect(shortcut).toHaveClass('ms-auto', 'text-secondary', 'bg-transparent')
    expect(shortcut).not.toHaveClass('bg-black-4')
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
    // The kit's Black/20% chevron is 1.6:1: `text-secondary`, 3:1 or more.
    expect(chevron).toHaveClass('ms-auto', 'text-secondary')
  })
})

describe('submenu value hint', () => {
  /** The hint before the chevron, which follows it at the item's gap. */
  const expectHint = (name: string, hint: string) => {
    const item = screen.getByRole('menuitem', { name: new RegExp(`^${name}`) })
    const hintElement = within(item).getByText(hint)
    expect(hintElement).toHaveClass('ms-auto', 'text-12', 'text-secondary')
    expect(hintElement.nextElementSibling?.tagName).toBe('svg')
    expect(item.querySelector('svg:last-child')).toHaveClass('ms-0')
    expect(item).toHaveTextContent(`${name}${hint}`)
  }

  it('shows the hint before the chevron in DropdownMenu', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>View</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger hint="Multi-Select">
              Type
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Plain</DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    expectHint('Type', 'Multi-Select')
    // Without a hint: no hint element, the chevron takes the free space.
    const plain = screen.getByRole('menuitem', { name: 'Plain' })
    expect(plain.querySelectorAll('span')).toHaveLength(0)
    expect(plain.querySelector('svg')).toHaveClass('ms-auto')
  })

  it('shows the hint before the chevron in ContextMenu', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger hint="Grid">Layout</ContextMenuSubTrigger>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText('Area'))

    expectHint('Layout', 'Grid')
  })
})

describe('Select chevron', () => {
  it('is text-secondary (3:1 or more), dimmed when disabled', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
      </Select>,
    )
    const chevron = screen
      .getByRole('combobox', { name: 'Fruit' })
      .querySelector('svg')
    expect(chevron).toHaveClass(
      'fill-text-secondary',
      'group-disabled:fill-black-20',
    )
    expect(chevron?.getAttribute('class')).not.toMatch(/control-border/)
  })
})
