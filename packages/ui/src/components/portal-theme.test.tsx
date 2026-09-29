import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from './AlertDialog'
import { Combobox, MultiSelect } from './Combobox'
import { CommandPalette } from './CommandPalette'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ContextMenu'
import { DatePicker, DateRangePicker } from './DatePicker'
import { Dialog, DialogContent, DialogTitle } from './Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Input'
import { Popover, PopoverContent } from './Popover'
import { Sheet, SheetContent, SheetTitle } from './Sheet'
import { SnowUIProvider, ThemeScope } from './SnowUIProvider'
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
  Element.prototype.releasePointerCapture ??= () => {}
})

/** The portalled element with this text: outside the scope, in `<body>`. */
const portalled = (text: string, selector = '[data-theme]') => {
  const node = screen.getAllByText(text)[0].closest(selector)
  if (!node) throw new Error(`no ${selector} around ${text}`)
  return node
}

describe('portalled content in a ThemeScope', () => {
  it('takes the scope theme: dialog, alert dialog, sheet, popover, tooltip, command palette', () => {
    render(
      <ThemeScope theme="dark" data-testid="scope">
        <Dialog open>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
        <AlertDialog open>
          <AlertDialogContent aria-describedby={undefined}>
            <AlertDialogTitle>Alert dialog</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
        <Sheet open>
          <SheetContent aria-describedby={undefined}>
            <SheetTitle>Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
        <Popover open>
          <PopoverContent>Popover</PopoverContent>
        </Popover>
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Trigger</TooltipTrigger>
            <TooltipContent>Tip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CommandPalette open groups={[]} />
      </ThemeScope>,
    )
    const scope = screen.getByTestId('scope')

    expect(scope).toHaveAttribute('data-theme', 'dark')
    for (const text of ['Dialog', 'Alert dialog', 'Sheet', 'Popover', 'Tip']) {
      const content = portalled(text)
      // Rendered in <body>, outside the scope…
      expect(scope).not.toContainElement(content as HTMLElement)
      // …with the scope's theme.
      expect(content).toHaveAttribute('data-theme', 'dark')
    }
    expect(
      screen.getByRole('dialog', { name: 'Search' }).closest('[data-theme]'),
    ).toHaveAttribute('data-theme', 'dark')
  })

  it('takes the scope theme: dropdown and context menus', () => {
    render(
      <ThemeScope theme="dark">
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ContextMenu>
          <ContextMenuTrigger>Area</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Copy</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ThemeScope>,
    )
    fireEvent.contextMenu(screen.getByText('Area'))

    expect(portalled('Profile', '[role="menu"]')).toHaveAttribute(
      'data-theme',
      'dark',
    )
    expect(portalled('Copy', '[role="menu"]')).toHaveAttribute(
      'data-theme',
      'dark',
    )
  })

  it('takes the scope theme: select', () => {
    render(
      <ThemeScope theme="dark">
        <Select defaultOpen defaultValue="a">
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Apple</SelectItem>
          </SelectContent>
        </Select>
      </ThemeScope>,
    )

    expect(screen.getByRole('listbox').closest('[data-theme]')).toHaveAttribute(
      'data-theme',
      'dark',
    )
  })

  it('takes the scope theme: combobox, multi-select and date pickers', () => {
    const options = [{ value: 'a', label: 'Apple' }]
    render(
      <ThemeScope theme="dark" data-testid="scope">
        <Combobox aria-label="Fruit" options={options} defaultOpen />
        <MultiSelect aria-label="Fruits" options={options} defaultOpen />
        <DatePicker
          aria-label="Due"
          defaultValue={new Date(2025, 0, 20)}
          defaultOpen
        />
        <DateRangePicker
          aria-label="Stay"
          defaultValue={{
            from: new Date(2025, 0, 13),
            to: new Date(2025, 0, 16),
          }}
          defaultOpen
        />
      </ThemeScope>,
    )
    const scope = screen.getByTestId('scope')
    const lists = screen.getAllByRole('listbox', { hidden: true })
    const calendars = screen.getAllByRole('dialog', { hidden: true })

    expect(lists).toHaveLength(2)
    expect(calendars).toHaveLength(2)
    for (const popup of [...lists, ...calendars]) {
      const themed = popup.closest('[data-theme]') as HTMLElement
      expect(scope).not.toContainElement(themed)
      expect(themed).toHaveAttribute('data-theme', 'dark')
    }
  })

  it('follows the nearest scope, a provider theme, and yields to data-theme', () => {
    render(
      <ThemeScope theme="dark">
        <ThemeScope theme="light" asChild>
          <section>
            <Popover open>
              <PopoverContent>Inner</PopoverContent>
            </Popover>
          </section>
        </ThemeScope>
        <SnowUIProvider theme="light">
          <Popover open>
            <PopoverContent>Provider</PopoverContent>
          </Popover>
        </SnowUIProvider>
        <Popover open>
          <PopoverContent data-theme="light">Own</PopoverContent>
        </Popover>
      </ThemeScope>,
    )

    // `asChild` puts the scope on the child.
    expect(document.querySelector('section')).toHaveAttribute(
      'data-theme',
      'light',
    )
    expect(portalled('Inner')).toHaveAttribute('data-theme', 'light')
    expect(portalled('Provider')).toHaveAttribute('data-theme', 'light')
    expect(portalled('Own')).toHaveAttribute('data-theme', 'light')
  })

  it('sets no data-theme without a scope, so portals take the page theme', () => {
    render(
      <Popover open>
        <PopoverContent>Popover</PopoverContent>
      </Popover>,
    )

    expect(screen.getByText('Popover').closest('[data-theme]')).toBeNull()
  })
})
