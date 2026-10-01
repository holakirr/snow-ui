import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { type ComponentProps, useState } from 'react'
import { userEvent } from 'storybook/test'
import { beforeAll, describe, expect, expectTypeOf, it, vi } from 'vitest'

import { SnowUIProvider } from '../SnowUIProvider'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type DropdownMenuSearchOptions,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSwitchItem,
  type DropdownMenuSwitchItemProps,
  DropdownMenuTrigger,
  defaultDropdownMenuSearchFilter,
} from './DropdownMenu'

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

const SearchMenu = ({
  search = true,
  onSelect,
}: {
  search?: DropdownMenuContentProps['search']
  onSelect?: () => void
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger>Properties</DropdownMenuTrigger>
    <DropdownMenuContent search={search}>
      <DropdownMenuLabel>Property</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem onSelect={onSelect}>Ask AI</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger hint="Multi-Select">
            Tags
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Single select</DropdownMenuItem>
              <DropdownMenuItem>Multi-Select</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem textValue="Edit property">
          <span aria-hidden>✎</span> Edit
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Sort ascending
          <DropdownMenuShortcut keys={['⌘', 'U']} separator="" />
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Sort descending</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Wrap column</DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value="table">
        <DropdownMenuRadioItem value="table">
          Show as table
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="board">
          Show as board
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)

// userEvent without a pause between keys (`delay: null`): with one, each key
// of a word waited for a timer, about 30% of the time spent typing under
// coverage on an idle machine. The events and their order are the same; 0 ms
// timers (such as Radix's typeahead focus) run after the whole input instead
// of between keys, and these tests don't depend on them: the search field
// stops the typeahead keys.
const setupUser = () => userEvent.setup({ delay: null })

const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Properties' }))
  return screen.findByRole('searchbox', { name: 'Search' })
}

/** The text of the items shown, in order (with `hidden`, a hidden menu's). */
const itemNames = () =>
  Array.from(
    document.querySelectorAll(
      '[data-radix-menu-content] > [role="menu"] [role^="menuitem"]',
    ),
  ).map((item) => item.textContent?.trim())

describe('DropdownMenu search', () => {
  it('puts the field outside the menu, which names itself after the trigger', async () => {
    const user = setupUser()
    render(<SearchMenu />)
    const field = await open(user)

    const menu = screen.getByRole('menu')
    // A menu may only contain items: the field is next to it, in the popover.
    expect(menu).not.toContainElement(field)
    expect(menu).toHaveAttribute('aria-orientation', 'vertical')
    expect(menu).toHaveAccessibleName('Properties')
    expect(field).toHaveAttribute('aria-controls', menu.id)
    // The Radix content keeps the surface and the keys, without the role.
    const content = menu.parentElement as HTMLElement
    expect(content).toHaveAttribute('data-radix-menu-content')
    expect(content).not.toHaveAttribute('role')
    expect(content).toHaveClass('rounded-16', 'flex', 'flex-col', 'p-0')
    expect(menu).toHaveClass(
      'overflow-y-auto',
      'scrollbar-snow',
      'px-3',
      'pb-3',
    )
    // Figma: the gray Search, 28px high, in a row with 8px of padding.
    const row = field.closest('[data-variant]')?.parentElement
    expect(row).toHaveClass('mx-3', 'mt-3', 'p-2')
    expect(field.closest('[data-variant]')).toHaveAttribute(
      'data-variant',
      'gray',
    )
  })

  it('focuses the field when the menu opens, from the keyboard too', async () => {
    const user = setupUser()
    render(<SearchMenu />)
    screen.getByRole('button', { name: 'Properties' }).focus()
    await user.keyboard('{Enter}')

    await waitFor(() =>
      expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveFocus(),
    )
  })

  it('filters the items by their text as you type, without the typeahead', async () => {
    const user = setupUser()
    render(<SearchMenu />)
    const field = await open(user)

    await user.type(field, 'so')
    expect(field).toHaveFocus()
    expect(field).toHaveValue('so')
    expect(itemNames()).toEqual(['Sort ascending⌘U', 'Sort descending'])
    // The matches are one list: no group titles, separators or gaps.
    expect(screen.queryByText('Property')).not.toBeInTheDocument()
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    // The two DropdownMenuGroups (the third group is the radio group).
    const groups = within(screen.getByRole('menu')).getAllByRole('group')
    for (const group of groups.slice(0, 2)) {
      expect(group).toHaveClass('my-0')
    }

    // Every word, in any case; a submenu trigger matches too.
    await user.clear(field)
    await user.type(field, 'TAGS')
    expect(itemNames()).toEqual(['TagsMulti-Select'])

    // `textValue` wins over the children.
    await user.clear(field)
    await user.type(field, 'edit prop')
    expect(itemNames()).toEqual(['✎ Edit'])

    // Clearing shows everything again.
    await user.clear(field)
    expect(itemNames()).toHaveLength(8)
    expect(screen.getByText('Property')).toBeInTheDocument()
    expect(screen.getAllByRole('separator')).toHaveLength(2)
  })

  it('shows and announces the empty state, and hides the empty menu', async () => {
    const user = setupUser()
    render(<SearchMenu />)
    const field = await open(user)

    await user.type(field, 'zzz')
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('No results')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(
      document.querySelector('[role="menu"]') as HTMLElement,
    ).toHaveAttribute('hidden')

    await user.type(field, '{Backspace}{Backspace}{Backspace}')
    expect(screen.getByRole('menu')).toBeVisible()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('moves into the items with the arrow keys, and back up to the field', async () => {
    const user = setupUser()
    render(<SearchMenu />)
    const field = await open(user)

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Ask AI' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(field).toHaveFocus()

    // ArrowUp from the field: the last item.
    await user.keyboard('{ArrowUp}')
    expect(
      screen.getByRole('menuitemradio', { name: 'Show as board' }),
    ).toHaveFocus()

    // Disabled items are skipped, as in the menu.
    await user.click(field)
    await user.type(field, 'sort desc')
    await user.keyboard('{ArrowDown}')
    expect(field).toHaveFocus()
  })

  it('sends a letter typed on an item to the field', async () => {
    const user = setupUser()
    render(<SearchMenu />)
    const field = await open(user)

    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: /^Tags/ })).toHaveFocus()
    await user.keyboard('w')
    expect(field).toHaveFocus()
    expect(field).toHaveValue('w')
    expect(itemNames()).toEqual([
      'Wrap column',
      'Show as table',
      'Show as board',
    ])
  })

  it('selects an item with Enter, and Space still selects (no typeahead)', async () => {
    const user = setupUser()
    const onSelect = vi.fn()
    render(<SearchMenu onSelect={onSelect} />)
    await open(user)

    await user.keyboard('{ArrowDown} ')
    expect(onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    )
  })

  it('clears the field with Escape, and closes the menu with the next one', async () => {
    const user = setupUser()
    const onQueryChange = vi.fn()
    render(<SearchMenu search={{ onQueryChange }} />)
    const field = await open(user)

    await user.type(field, 'ask')
    await user.keyboard('{Escape}')
    expect(field).toHaveValue('')
    expect(field).toHaveFocus()
    expect(onQueryChange).toHaveBeenLastCalledWith('')
    expect(itemNames()).toHaveLength(8)

    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: 'Properties' })).toHaveFocus()
  })

  it('leaves the Escape that cancels an IME composition to the IME', async () => {
    const user = setupUser()
    render(<SearchMenu />)
    const field = await open(user)

    await user.type(field, 'ask')
    // `isComposing`, or the keyCode 229 WebKit gives a key that ends one.
    fireEvent.keyDown(field, { key: 'Escape', isComposing: true })
    fireEvent.keyDown(field, { key: 'Escape', keyCode: 229 })
    expect(field).toHaveValue('ask')
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('resets the query when the menu opens again', async () => {
    const user = setupUser()
    render(<SearchMenu search={{ defaultQuery: 'sort' }} />)
    let field = await open(user)
    expect(field).toHaveValue('sort')
    await user.type(field, ' asc')
    expect(itemNames()).toEqual(['Sort ascending⌘U'])

    await user.keyboard('{Escape}{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    )
    field = await open(user)
    expect(field).toHaveValue('sort')
  })

  it('takes a controlled query and a custom filter', async () => {
    const user = setupUser()
    const Controlled = () => {
      const [query, setQuery] = useState('')
      return (
        <>
          <output data-testid="query">{query}</output>
          <SearchMenu
            search={{
              query,
              onQueryChange: setQuery,
              // Starts with the query.
              filter: (text, value) =>
                text.toLowerCase().startsWith(value.toLowerCase()),
              label: 'Filter properties',
              placeholder: 'Type a property',
              emptyMessage: 'Nothing here',
            }}
          />
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Properties' }))
    const field = await screen.findByRole('searchbox', {
      name: 'Filter properties',
    })
    expect(field).toHaveAttribute('placeholder', 'Type a property')

    await user.type(field, 'as')
    expect(screen.getByTestId('query')).toHaveTextContent('as')
    expect(itemNames()).toEqual(['Ask AI'])
    await user.type(field, 'x')
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here')
  })

  it("doesn't filter a submenu", async () => {
    const user = setupUser()
    render(<SearchMenu />)
    const field = await open(user)
    await user.type(field, 'tags')
    await user.keyboard('{ArrowDown}{ArrowRight}')

    const submenu = (await screen.findAllByRole('menu'))[1]
    expect(
      within(submenu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['Single select', 'Multi-Select'])
  })

  it('takes its strings from the provider', async () => {
    const user = setupUser()
    render(
      <SnowUIProvider
        messages={{
          dropdownMenu: { search: 'Поиск', empty: 'Ничего не найдено' },
          search: { placeholder: 'Найти' },
        }}
      >
        <SearchMenu />
      </SnowUIProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Properties' }))
    const field = await screen.findByRole('searchbox', { name: 'Поиск' })
    expect(field).toHaveAttribute('placeholder', 'Найти')
    await user.type(field, 'zzz')
    expect(screen.getByRole('status')).toHaveTextContent('Ничего не найдено')
  })

  it('puts the direction on the menu in right-to-left text', async () => {
    const user = setupUser()
    render(
      <SnowUIProvider dir="rtl">
        <SearchMenu />
      </SnowUIProvider>,
    )
    await open(user)
    expect(screen.getByRole('menu')).toHaveAttribute('dir', 'rtl')
  })

  it('is off by default: the content is the menu, the first item focused', async () => {
    render(<SearchMenu search={false} />)
    const trigger = screen.getByRole('button', { name: 'Properties' })
    trigger.focus()
    await act(async () => {
      trigger.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      )
    })
    const menu = await screen.findByRole('menu')
    expect(menu).toHaveAttribute('data-radix-menu-content')
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Ask AI' })).toHaveFocus(),
    )
  })
})

describe('DropdownMenu search refs and types', () => {
  it('forwards the ref to the popover (the Radix content)', async () => {
    let node: HTMLDivElement | null = null
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent
          search
          ref={(current) => {
            node = current
          }}
        >
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await screen.findByRole('searchbox')

    expect(node).toBeInstanceOf(HTMLDivElement)
    expect(node).toHaveAttribute('data-radix-menu-content')
  })

  it('types `search` as a flag or the field options', () => {
    expectTypeOf<DropdownMenuContentProps['search']>().toEqualTypeOf<
      boolean | DropdownMenuSearchOptions | undefined
    >()
    expectTypeOf<DropdownMenuSearchOptions['filter']>().toEqualTypeOf<
      ((text: string, query: string) => boolean) | undefined
    >()
  })
})

describe('defaultDropdownMenuSearchFilter', () => {
  it('matches every word of the query, in any case and order', () => {
    expect(defaultDropdownMenuSearchFilter('Sort ascending', 'ASC sort')).toBe(
      true,
    )
    expect(defaultDropdownMenuSearchFilter('Sort ascending', 'sort desc')).toBe(
      false,
    )
  })
})

describe('DropdownMenu destructive item', () => {
  it('is red-text, text and icons, only with variant="destructive"', async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" className="ps-8">
            <svg aria-hidden />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled>
            Delete all
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const remove = await screen.findByRole('menuitem', { name: 'Delete' })

    expect(remove).toHaveAttribute('data-variant', 'destructive')
    expect(remove).toHaveClass(
      'text-red-text',
      'dark:text-[color:color-mix(in_srgb,var(--color-red-text),var(--color-black)_40%)]',
      'ps-8',
    )
    expect(remove).not.toHaveClass('text-black')
    // Icons take the item's colour (`currentColor`); it keeps the highlight.
    expect(remove).toHaveClass('data-[highlighted]:bg-black-4')
    // Disabled: dimmed like any item (`data-[disabled]` wins).
    expect(screen.getByRole('menuitem', { name: 'Delete all' })).toHaveClass(
      'data-[disabled]:text-black-20',
    )

    const edit = screen.getByRole('menuitem', { name: 'Edit' })
    expect(edit).not.toHaveAttribute('data-variant')
    expect(edit).toHaveClass('text-black')
    expect(edit).not.toHaveClass('text-red-text')
  })

  it('keeps the menuitem role and selects as usual', async () => {
    const onSelect = vi.fn()
    const user = setupUser()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive" onSelect={onSelect}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    screen.getByRole('button', { name: 'Menu' }).focus()
    await user.keyboard('{Enter}')
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus(),
    )
    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('types the variant', () => {
    expectTypeOf<
      ComponentProps<typeof DropdownMenuItem>['variant']
    >().toEqualTypeOf<'default' | 'destructive' | undefined>()
  })
})

describe('DropdownMenuSwitchItem', () => {
  const Menu = (props: Partial<DropdownMenuSwitchItemProps>) => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Hide</DropdownMenuItem>
        <DropdownMenuSwitchItem {...props}>Wrap column</DropdownMenuSwitchItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  it('is a menuitemcheckbox with aria-checked, and a switch that only shows it', async () => {
    render(<Menu checked />)
    const item = await screen.findByRole('menuitemcheckbox', {
      name: 'Wrap column',
    })
    expect(item).toHaveAttribute('aria-checked', 'true')
    expect(item).toHaveAttribute('data-state', 'checked')
    expect(item).toHaveClass('group/switch-item', 'p-2', 'rounded-12')

    // No control inside the menu item: a hidden picture of the state.
    const track = item.querySelector(':scope > span') as HTMLElement
    expect(track).toHaveAttribute('aria-hidden', 'true')
    expect(within(item).queryByRole('switch')).not.toBeInTheDocument()
    expect(item.querySelector('button, input')).toBeNull()
    // Forced colours drop the fills: the track and the thumb are outlined.
    for (const part of [track, track.firstElementChild]) {
      expect(part).toHaveClass(
        'forced-colors:outline',
        'forced-colors:outline-[CanvasText]',
        'forced-colors:group-data-[disabled]/switch-item:outline-[GrayText]',
      )
    }
    expect(track).toHaveClass(
      'h-4',
      'w-7',
      'rounded-80',
      'bg-control-border',
      'group-data-[state=checked]/switch-item:bg-primary',
      'ms-auto',
    )
    expect(track.firstElementChild).toHaveClass(
      'size-3',
      'bg-static-white',
      'group-data-[state=checked]/switch-item:translate-x-3',
      'rtl:group-data-[state=checked]/switch-item:-translate-x-3',
    )
    // The item has no check mark.
    expect(item.querySelector('svg')).toBeNull()
  })

  it('toggles with Space and calls onCheckedChange with a boolean', async () => {
    const user = setupUser()
    const onCheckedChange = vi.fn()
    render(
      <Menu
        checked={false}
        onCheckedChange={onCheckedChange}
        onSelect={(event) => event.preventDefault()}
      />,
    )
    const item = await screen.findByRole('menuitemcheckbox')
    expect(item).toHaveAttribute('aria-checked', 'false')
    item.focus()
    await user.keyboard(' ')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    // `onSelect` kept it open.
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('is uncontrolled without `checked` (off), and dims when disabled', async () => {
    render(<Menu disabled />)
    const item = await screen.findByRole('menuitemcheckbox')
    expect(item).toHaveAttribute('aria-checked', 'false')
    expect(item).toHaveAttribute('aria-disabled', 'true')
    expect(item.querySelector(':scope > span')).toHaveClass(
      'group-data-[disabled]/switch-item:bg-black-10',
      'group-data-[disabled]/switch-item:group-data-[state=checked]/switch-item:bg-black-20',
    )
  })

  it('is filtered by a search like the other items', async () => {
    const user = setupUser()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent search>
          <DropdownMenuItem>Hide</DropdownMenuItem>
          <DropdownMenuSwitchItem>Wrap column</DropdownMenuSwitchItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.type(await screen.findByRole('searchbox'), 'wrap')
    expect(itemNames()).toEqual(['Wrap column'])
  })

  it('forwards its ref and types `checked` as a boolean', async () => {
    let node: HTMLDivElement | null = null
    render(
      <Menu
        ref={(current) => {
          node = current
        }}
      />,
    )
    await screen.findByRole('menuitemcheckbox')
    expect(node).toBeInstanceOf(HTMLDivElement)
    expectTypeOf<DropdownMenuSwitchItemProps['checked']>().toEqualTypeOf<
      boolean | undefined
    >()
  })
})
