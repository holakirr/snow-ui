import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeSlashIcon,
  FunnelIcon,
  SparkleIcon,
  TagIcon,
  TextAlignLeftIcon,
  TextTIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, waitFor, within } from 'storybook/test'

import { animationsEnded, expectClosed } from '../../test/animations'
import { colorOf } from '../../test/colors'
import { settleLayout } from '../../test/layout'
import { Button } from '../Button'
import { popoverItemDestructiveClasses } from '../Popover/surface'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSwitchItem,
  DropdownMenuTrigger,
} from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-70296',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {
  args: {},
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Open' })

    await step('Enter opens the menu on its first item', async () => {
      trigger.focus()
      await userEvent.keyboard('{Enter}')
      const menu = await page.findByRole('menu')
      // It fades in (only fades, with reduced motion): wait for it.
      await waitFor(() => expect(menu).toBeVisible())
      await waitFor(() =>
        expect(page.getByRole('menuitem', { name: /^Profile/ })).toHaveFocus(),
      )
    })

    await step(
      'two groups are 16px apart, the line 7px under the upper one',
      async () => {
        // Figma: the item group's 8px padding above and below, a 1px stroke
        // inside its bottom edge. The groups' 4px margins merge into the
        // separator's 7 and 8px.
        await settleLayout(page.getByRole('menu'))
        const above = page
          .getByRole('menuitem', { name: /^Keyboard shortcuts/ })
          .getBoundingClientRect()
        const below = page
          .getByRole('menuitem', { name: 'Team' })
          .getBoundingClientRect()
        const separator = page
          .getAllByRole('separator')
          .map((element) => element.getBoundingClientRect())
          .find((rect) => rect.top > above.bottom && rect.bottom < below.top)
        await expect(separator).toBeDefined()
        await expect(below.top - above.bottom).toBeCloseTo(16, 1)
        await expect((separator?.top ?? 0) - above.bottom).toBeCloseTo(7, 1)
        await expect(separator?.height).toBeCloseTo(1, 1)
      },
    )

    await step('arrow keys move through the items', async () => {
      await userEvent.keyboard('{ArrowDown}')
      await expect(
        page.getByRole('menuitemcheckbox', { name: 'Dark mode' }),
      ).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      await expect(
        page.getByRole('menuitem', { name: /^Keyboard shortcuts/ }),
      ).toHaveFocus()
      await userEvent.keyboard('{ArrowUp}')
      await expect(
        page.getByRole('menuitemcheckbox', { name: 'Dark mode' }),
      ).toHaveFocus()
    })

    await step('End and Home jump to the last and first items', async () => {
      await userEvent.keyboard('{End}')
      await expect(
        page.getByRole('menuitem', { name: /^Log out/ }),
      ).toHaveFocus()
      await userEvent.keyboard('{Home}')
      await expect(
        page.getByRole('menuitem', { name: /^Profile/ }),
      ).toHaveFocus()
    })

    await step('ArrowRight opens a submenu, ArrowLeft closes it', async () => {
      const invite = page.getByRole('menuitem', { name: 'Invite users' })
      invite.focus()
      await userEvent.keyboard('{ArrowRight}')
      await waitFor(() =>
        expect(page.getByRole('menuitem', { name: 'Email' })).toHaveFocus(),
      )
      await userEvent.keyboard('{ArrowLeft}')
      await waitFor(() => expect(invite).toHaveFocus())
    })

    await step('Escape closes the menu and returns focus', async () => {
      // The menu, and the submenu if it is still closing.
      const menus = page.getAllByRole('menu')
      await userEvent.keyboard('{Escape}')
      await expectClosed(...menus)
      await waitFor(() =>
        expect(page.queryByRole('menu')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveFocus()
    })
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut keys={['⇧', '⌘', 'P']} separator="" />
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Dark mode</DropdownMenuCheckboxItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut keys={['⌘', 'S']} separator="" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={8}>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut keys={['⌘', 'T']} separator="" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuRadioGroup value="bottom">
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut keys={['⇧', '⌘', 'Q']} separator="" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Right-to-left text: the menu content gets `dir` from `SnowUIProvider`,
 * the check mark and shortcuts swap sides, the submenu arrow points left and
 * ArrowLeft opens the submenu (to the left).
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex h-96 items-start justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" label="الحساب" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>حسابي</DropdownMenuLabel>
          <DropdownMenuItem>
            الملف الشخصي
            <DropdownMenuShortcut keys={['⌘', 'P']} separator="" />
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>
            الوضع الداكن
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>دعوة المستخدمين</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>البريد الإلكتروني</DropdownMenuItem>
                <DropdownMenuItem>رسالة</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    canvas.getByRole('button', { name: 'الحساب' }).focus()
    await userEvent.keyboard('{Enter}')
    const menu = await page.findByRole('menu')
    await expect(menu).toHaveAttribute('dir', 'rtl')

    const item = page.getByRole('menuitem', { name: /^الملف الشخصي/ })
    const shortcut = item.querySelector('kbd') as HTMLElement
    // The shortcut is at the end of the item: on the left, at its 8px
    // padding (the `<kbd>` is left-to-right, its auto margin is not).
    await settleLayout(menu)
    await expect(
      shortcut.getBoundingClientRect().left - item.getBoundingClientRect().left,
    ).toBeCloseTo(8, 0)

    const sub = page.getByRole('menuitem', { name: 'دعوة المستخدمين' })
    sub.focus()
    await userEvent.keyboard('{ArrowLeft}')
    const submenu = (await page.findAllByRole('menu'))[1]
    await waitFor(() =>
      expect(
        page.getByRole('menuitem', { name: 'البريد الإلكتروني' }),
      ).toHaveFocus(),
    )
    // The submenu opens on the left of its trigger.
    await waitFor(() =>
      expect(submenu.getBoundingClientRect().right).toBeLessThanOrEqual(
        sub.getBoundingClientRect().left + 1,
      ),
    )

    // Close both menus, so axe checks the page in a stable state.
    const menus = page.getAllByRole('menu')
    await userEvent.keyboard('{Escape}')
    await userEvent.keyboard('{Escape}')
    await expectClosed(...menus)
    await waitFor(() =>
      expect(page.queryByRole('menu')).not.toBeInTheDocument(),
    )
  },
}

const regions = [
  'Africa',
  'Antarctica',
  'Asia',
  'Australia',
  'Caribbean',
  'Central America',
  'Central Asia',
  'East Asia',
  'Eastern Europe',
  'Middle East',
  'North Africa',
  'North America',
  'Northern Europe',
  'Oceania',
  'South America',
  'South Asia',
  'Southeast Asia',
  'Southern Europe',
  'Sub-Saharan Africa',
  'Western Europe',
  'West Africa',
  'Pacific Islands',
  'Polar regions',
  'Everywhere else',
]

/**
 * A menu taller than the room below its trigger stops at the edge of the
 * window and scrolls, with the kit's scrollbar (`scrollbar-snow`).
 */
export const Scrollable: Story = {
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Region' }))
    const menu = await page.findByRole('menu')
    await settleLayout(menu)

    await step('the menu fits in the window and scrolls', async () => {
      const style = getComputedStyle(menu)
      await expect(style.maxHeight).toBe(
        style
          .getPropertyValue('--radix-dropdown-menu-content-available-height')
          .trim(),
      )
      await expect(style.overflowY).toBe('auto')
      await expect(menu).toHaveClass('scrollbar-snow')
      await expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight)
      // Radix may place it half a pixel off.
      await expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        window.innerHeight + 1,
      )
    })

    await step('the keyboard scrolls the last item into view', async () => {
      await userEvent.keyboard('{End}')
      const last = page.getByRole('menuitem', { name: 'Everywhere else' })
      await waitFor(() => expect(last).toHaveFocus())
      await expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        menu.getBoundingClientRect().bottom,
      )
    })

    await userEvent.keyboard('{Escape}')
    await expectClosed(menu)
    await waitFor(() =>
      expect(page.queryByRole('menu')).not.toBeInTheDocument(),
    )
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" label="Region" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        {regions.map((region) => (
          <DropdownMenuItem key={region}>{region}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/** The Figma Popover as a menu, open: 36px items, a 12px radius, shortcuts. */
export const Open: Story = {
  parameters: { layout: 'padded' },
  play: async ({ canvasElement, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const menu = await page.findByRole('menu')
    await settleLayout(menu)

    await step(
      'a separator is 7px under the item above, 8px over the one below',
      async () => {
        const above = page
          .getByRole('menuitem', { name: /^Density/ })
          .getBoundingClientRect()
        const line = within(menu).getByRole('separator').getBoundingClientRect()
        const below = page
          .getByRole('menuitem', { name: 'API' })
          .getBoundingClientRect()
        await expect(line.top - above.bottom).toBeCloseTo(7, 1)
        await expect(below.top - line.bottom).toBeCloseTo(8, 1)
      },
    )

    await step('the shortcut is plain text-secondary text', async () => {
      const shortcut = within(
        page.getByRole('menuitem', { name: /^Profile/ }),
      ).getByText('⌘P')
      const style = getComputedStyle(shortcut)
      await expect(style.color).toBe(colorOf('text-secondary', menu))
      await expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
      await expect(style.fontSize).toBe('12px')
      await expect(style.color).not.toBe(
        getComputedStyle(shortcut.parentElement as HTMLElement).color,
      )
    })

    await step('the submenu chevron is text-secondary', async () => {
      const chevron = page
        .getByRole('menuitem', { name: 'Invite users' })
        .querySelector('svg') as SVGElement
      await expect(getComputedStyle(chevron).color).toBe(
        colorOf('text-secondary', menu),
      )
    })

    await step('a value hint sits 8px before the chevron', async () => {
      const item = page.getByRole('menuitem', { name: 'Density Compact' })
      const hint = within(item).getByText('Compact')
      const chevron = item.querySelector('svg') as SVGElement
      await expect(getComputedStyle(hint).color).toBe(
        colorOf('text-secondary', menu),
      )
      await expect(getComputedStyle(hint).fontSize).toBe('12px')
      const hintBox = hint.getBoundingClientRect()
      const chevronBox = chevron.getBoundingClientRect()
      await expect(chevronBox.left - hintBox.right).toBeCloseTo(8, 1)
      // The chevron stays at the end of the item (8px padding).
      await expect(
        item.getBoundingClientRect().right - chevronBox.right,
      ).toBeCloseTo(8, 1)
    })
  },
  render: () => (
    <div className="h-96">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" label="Open" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut keys={['⌘', 'P']} separator="" />
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Dark mode</DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger hint="Compact">
              Density
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>API</DropdownMenuItem>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}

/**
 * The kit's property menu ("Popover interactive guidance"): more than ten
 * items, so it gets the search field.
 */
const PropertyMenuItems = () => (
  <>
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <SparkleIcon />
        Ask AI
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger hint="Multi-Select">
          <TagIcon />
          Tags
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent sideOffset={8}>
            <DropdownMenuItem>Text</DropdownMenuItem>
            <DropdownMenuItem>Single select</DropdownMenuItem>
            <DropdownMenuItem>Multi-Select</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuItem>
        <TextTIcon />
        Edit property
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <ArrowUpIcon />
        Sort ascending
        <DropdownMenuShortcut keys={['⌘', 'U']} separator="" />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ArrowDownIcon />
        Sort descending
        <DropdownMenuShortcut keys={['⌘', 'D']} separator="" />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FunnelIcon />
        Filter
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <EyeSlashIcon />
        Hide in view
      </DropdownMenuItem>
      <DropdownMenuCheckboxItem checked>
        <TextAlignLeftIcon />
        Wrap column
      </DropdownMenuCheckboxItem>
    </DropdownMenuGroup>
  </>
)

/**
 * `search` (added in 5.2) puts the kit's search field at the top of the
 * menu: it takes the focus when the menu opens, typing filters the items,
 * ArrowDown moves into them, Escape clears the field and then closes the
 * menu.
 */
export const WithSearch: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" label="Property" />
      </DropdownMenuTrigger>
      <DropdownMenuContent search align="start" className="w-60">
        <PropertyMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Property' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const field = await page.findByRole('searchbox', { name: 'Search' })
    const content = field.closest('[data-radix-menu-content]') as HTMLElement

    await step('the field takes the focus, outside the menu', async () => {
      await waitFor(() => expect(field).toHaveFocus())
      await expect(page.getByRole('menu')).not.toContainElement(field)
      await expect(page.getByRole('menu')).toHaveAccessibleName('Property')
    })

    await step('typing filters the items', async () => {
      await userEvent.keyboard('sort')
      await expect(field).toHaveFocus()
      await expect(
        page.getAllByRole('menuitem').map((item) => item.textContent),
      ).toEqual(['Sort ascending⌘U', 'Sort descending⌘D'])
      await expect(page.queryByRole('separator')).not.toBeInTheDocument()
    })

    await step('ArrowDown moves into the items, ArrowUp back', async () => {
      await userEvent.keyboard('{ArrowDown}')
      await expect(
        page.getByRole('menuitem', { name: /^Sort ascending/ }),
      ).toHaveFocus()
      await userEvent.keyboard('{ArrowUp}')
      await expect(field).toHaveFocus()
    })

    await step('nothing matches: "No results", announced', async () => {
      await userEvent.keyboard('zzz')
      await expect(page.getByRole('status')).toHaveTextContent('No results')
      await expect(page.queryByRole('menu')).not.toBeInTheDocument()
    })

    await step('Escape clears the field, the next one closes', async () => {
      await userEvent.keyboard('{Escape}')
      await expect(field).toHaveValue('')
      await expect(page.getAllByRole('menuitem')).toHaveLength(7)
      await userEvent.keyboard('{Escape}')
      await expectClosed(content)
      await waitFor(() =>
        expect(page.queryByRole('menu')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveFocus()
    })
  },
}

/**
 * The menu with its search open (Figma: the focused Search Gray, 200×28,
 * in a 44px row at the top of the 240px Popover).
 */
export const SearchOpen: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="h-120">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" label="Property" />
        </DropdownMenuTrigger>
        <DropdownMenuContent search align="start" className="w-60">
          <PropertyMenuItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = await page.findByRole('searchbox', { name: 'Search' })
    const content = field.closest('[data-radix-menu-content]') as HTMLElement
    await settleLayout(content)

    await step('the kit sizes: a 200×28 field in a 44px row', async () => {
      const search = field.closest('[data-variant]') as HTMLElement
      const box = search.getBoundingClientRect()
      const row = (search.parentElement as HTMLElement).getBoundingClientRect()
      await expect(content.getBoundingClientRect().width).toBeCloseTo(240, 0)
      // Figma: 200 = 240 - 2 × 12 - 2 × 8. The popover's 1px stroke is
      // inside its 240px here, as for the items (214 for the kit's 216).
      await expect(box.width).toBeCloseTo(198, 0)
      await expect(box.height).toBeCloseTo(28, 0)
      await expect(row.height).toBeCloseTo(44, 0)
      // 12px inside the popover's 1px stroke; the first item under the row
      // (after its group's 4px margin).
      await expect(row.top - content.getBoundingClientRect().top).toBeCloseTo(
        13,
        0,
      )
      const first = page
        .getByRole('menuitem', { name: 'Ask AI' })
        .getBoundingClientRect()
      await expect(first.top - row.bottom).toBeCloseTo(4, 0)
    })
  },
}

/** A query that matches nothing: the kit's "No results" under the field. */
export const SearchNoResults: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="h-48">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" label="Property" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          search={{ defaultQuery: 'Status' }}
          align="start"
          className="w-60"
        >
          <PropertyMenuItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await expect(await page.findByRole('status')).toHaveTextContent(
      'No results',
    )
    await expect(page.queryByRole('menuitem')).not.toBeInTheDocument()
  },
}

/**
 * Right-to-left text: the search field, the items, the switch item (its
 * thumb at the left when on) and the destructive item follow the menu's
 * `dir`.
 */
export const SearchRTL: Story = {
  globals: { dir: 'rtl' },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex h-72 items-start justify-center">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" label="الخاصية" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          search={{ label: 'بحث', placeholder: 'بحث' }}
          align="start"
          className="w-60"
        >
          <DropdownMenuItem>
            <SparkleIcon />
            اسأل الذكاء الاصطناعي
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowUpIcon />
            ترتيب تصاعدي
            <DropdownMenuShortcut keys={['⌘', 'U']} separator="" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FunnelIcon />
            تصفية
          </DropdownMenuItem>
          <DropdownMenuSwitchItem checked>
            <TextAlignLeftIcon />
            التفاف العمود
          </DropdownMenuSwitchItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            حذف الخاصية
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = await page.findByRole('searchbox', { name: 'بحث' })
    const menu = page.getByRole('menu')
    await expect(menu).toHaveAttribute('dir', 'rtl')
    const content = field.closest('[data-radix-menu-content]') as HTMLElement
    await settleLayout(content)
    // The field's icon is at its start: on the right.
    const box = (
      field.closest('[data-variant]') as HTMLElement
    ).getBoundingClientRect()
    const icon = (field.closest('[data-variant]') as HTMLElement)
      .querySelector('svg')
      ?.getBoundingClientRect()
    await expect((icon?.right ?? 0) > box.right - 16).toBe(true)
    // The switch is at the end of its item (the left), its thumb at the
    // switch's end (the left) when on.
    const item = page.getByRole('menuitemcheckbox', { name: 'التفاف العمود' })
    const track = item.querySelector('[aria-hidden] > span')
      ?.parentElement as HTMLElement
    const thumb = track.firstElementChild as HTMLElement
    await expect(
      track.getBoundingClientRect().left - item.getBoundingClientRect().left,
    ).toBeCloseTo(8, 0)
    await expect(
      thumb.getBoundingClientRect().left - track.getBoundingClientRect().left,
    ).toBeCloseTo(2, 0)
  },
}

/**
 * `variant="destructive"` (added in 5.2): the kit's red "Delete Property"
 * row, its text and icon in `red-text` (lighter in dark mode, so it keeps
 * 4.5:1 on the highlight). Here it is highlighted, as under the pointer.
 */
export const Destructive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="h-72">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" label="Property" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuItem>
            <TextTIcon />
            Edit property
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeSlashIcon />
            Hide in view
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete property
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled>
            <TrashIcon />
            Delete all properties
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const menu = await page.findByRole('menu')
    const item = page.getByRole('menuitem', { name: 'Delete property' })
    item.focus()
    await settleLayout(menu)

    await step('the text and the icon are red-text', async () => {
      const red = colorOf(popoverItemDestructiveClasses, menu)
      await expect(item).toHaveAttribute('data-variant', 'destructive')
      await expect(item).toHaveAttribute('data-highlighted')
      await expect(getComputedStyle(item).color).toBe(red)
      await expect(
        getComputedStyle(item.querySelector('svg') as SVGElement).color,
      ).toBe(red)
    })

    await step('a disabled one is dimmed like the others', async () => {
      const disabled = page.getByRole('menuitem', {
        name: 'Delete all properties',
      })
      await expect(getComputedStyle(disabled).color).toBe(
        colorOf('text-black-20', menu),
      )
    })
  },
}

/**
 * The kit's confirmation in place: the first selection keeps the menu open
 * and asks "Confirm deletion?", the second one deletes. A screen reader may
 * not announce the new name of the focused item: for an action that can't
 * be undone, confirm in an AlertDialog with a `destructive` action.
 */
export const DestructiveConfirm: Story = {
  render: function Render() {
    const [confirming, setConfirming] = useState(false)
    const [deleted, setDeleted] = useState(false)
    return (
      <div className="flex flex-col items-center gap-4">
        <DropdownMenu onOpenChange={() => setConfirming(false)}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" label="Property" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuItem>
              <TextTIcon />
              Edit property
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                if (confirming) {
                  setDeleted(true)
                  return
                }
                event.preventDefault()
                setConfirming(true)
              }}
            >
              <TrashIcon />
              {confirming ? 'Confirm deletion?' : 'Delete property'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-14" role="status">
          {deleted ? 'Property deleted' : ''}
        </p>
      </div>
    )
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Property' }))
    const menu = await page.findByRole('menu')
    // It fades in (only fades, with reduced motion): wait for it.
    await animationsEnded(menu)
    await userEvent.click(
      page.getByRole('menuitem', { name: 'Delete property' }),
    )
    // Still open, asking.
    const confirm = page.getByRole('menuitem', { name: 'Confirm deletion?' })
    await expect(confirm).toBeVisible()
    await userEvent.click(confirm)
    await expectClosed(menu)
    await waitFor(() =>
      expect(page.queryByRole('menu')).not.toBeInTheDocument(),
    )
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Property deleted',
    )
  },
}

/**
 * `DropdownMenuSwitchItem` (added in 5.2): the kit's "Wrap Column" row, a
 * checkbox item that ends in a Switch. It stays a `menuitemcheckbox`; here
 * `onSelect` keeps the menu open, so Space or Enter toggles in place.
 */
export const SwitchItem: Story = {
  parameters: { layout: 'padded' },
  render: function Render() {
    const [wrap, setWrap] = useState(true)
    const [frozen, setFrozen] = useState(false)
    return (
      <div className="h-64">
        <DropdownMenu defaultOpen modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" label="Column" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuItem>
              <EyeSlashIcon />
              Hide in view
            </DropdownMenuItem>
            <DropdownMenuSwitchItem
              checked={wrap}
              onCheckedChange={setWrap}
              onSelect={(event) => event.preventDefault()}
            >
              <TextAlignLeftIcon />
              Wrap column
            </DropdownMenuSwitchItem>
            <DropdownMenuSwitchItem
              checked={frozen}
              onCheckedChange={setFrozen}
              onSelect={(event) => event.preventDefault()}
            >
              <ArrowUpIcon />
              Freeze column
            </DropdownMenuSwitchItem>
            <DropdownMenuSwitchItem checked disabled>
              <TextTIcon />
              Show title
            </DropdownMenuSwitchItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
  play: async ({ canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const menu = await page.findByRole('menu')
    const wrap = page.getByRole('menuitemcheckbox', { name: 'Wrap column' })
    const track = (item: HTMLElement) =>
      item.querySelector(':scope > [aria-hidden]') as HTMLElement
    await settleLayout(menu)

    await step('the kit Switch at the end, 28×16, on', async () => {
      const box = track(wrap).getBoundingClientRect()
      await expect(wrap).toHaveAttribute('aria-checked', 'true')
      await expect(box.width).toBeCloseTo(28, 0)
      await expect(box.height).toBeCloseTo(16, 0)
      await expect(wrap.getBoundingClientRect().right - box.right).toBeCloseTo(
        8,
        0,
      )
      await expect(getComputedStyle(track(wrap)).backgroundColor).toBe(
        colorOf('text-primary', menu),
      )
      const thumb = (
        track(wrap).firstElementChild as HTMLElement
      ).getBoundingClientRect()
      await expect(box.right - thumb.right).toBeCloseTo(2, 0)
    })

    await step('Space toggles it in place, the menu stays open', async () => {
      wrap.focus()
      await userEvent.keyboard(' ')
      await waitFor(() => expect(wrap).toHaveAttribute('aria-checked', 'false'))
      await expect(menu).toBeVisible()
      await settleLayout(menu)
      await expect(getComputedStyle(track(wrap)).backgroundColor).toBe(
        colorOf('text-control-border', menu),
      )
      await userEvent.keyboard(' ')
      await waitFor(() => expect(wrap).toHaveAttribute('aria-checked', 'true'))
    })

    await step('disabled: a Black/20% track when on', async () => {
      const disabled = page.getByRole('menuitemcheckbox', {
        name: 'Show title',
      })
      await expect(disabled).toHaveAttribute('aria-disabled', 'true')
      await expect(getComputedStyle(track(disabled)).backgroundColor).toBe(
        colorOf('text-black-20', menu),
      )
    })
  },
}
