import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { colorOf } from '../../test/colors'
import { settleLayout } from '../../test/layout'
import { Button } from '../Button'
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
      'a separator between two groups is 8px from their items',
      async () => {
        // Figma: 8 + 0.5 + 8. The groups' 4px margins merge into the
        // separator's 8px.
        await settleLayout(page.getByRole('menu'))
        const above = page
          .getByRole('menuitem', { name: /^Keyboard shortcuts/ })
          .getBoundingClientRect()
        const below = page
          .getByRole('menuitem', { name: 'Team' })
          .getBoundingClientRect()
        const line = (above.bottom + below.top) / 2
        const separator = page
          .getAllByRole('separator')
          .map((element) => element.getBoundingClientRect())
          .find((rect) => rect.top > above.bottom && rect.bottom < below.top)
        await expect(separator).toBeDefined()
        await expect(below.top - above.bottom).toBeCloseTo(16.5, 0)
        await expect((separator?.top ?? 0) + 0.25).toBeCloseTo(line, 0)
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
      await userEvent.keyboard('{Escape}')
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
    await userEvent.keyboard('{Escape}')
    await userEvent.keyboard('{Escape}')
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

    await step('a separator is 8px from the items on each side', async () => {
      const above = page
        .getByRole('menuitem', { name: /^Density/ })
        .getBoundingClientRect()
      const line = within(menu).getByRole('separator').getBoundingClientRect()
      const below = page
        .getByRole('menuitem', { name: 'API' })
        .getBoundingClientRect()
      await expect(line.top - above.bottom).toBeCloseTo(8, 1)
      await expect(below.top - line.bottom).toBeCloseTo(8, 1)
    })

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
