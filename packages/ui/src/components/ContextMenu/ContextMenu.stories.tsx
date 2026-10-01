import {
  CopyIcon,
  PencilSimpleIcon,
  PushPinIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { colorOf } from '../../test/colors'
import { settleLayout } from '../../test/layout'
import { popoverItemDestructiveClasses } from '../Popover/surface'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuSwitchItem,
  ContextMenuTrigger,
} from './ContextMenu'

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-70296',
    },
    docs: {
      description: {
        component:
          'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ContextMenu>

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-16 border border-dashed text-14">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut keys={['⌘', '[']} separator="" />
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut keys={['⌘', ']']} separator="" />
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut keys={['⌘', 'R']} separator="" />
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut keys={['⇧', '⌘', 'S']} separator="" />
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenuShortcut keys={['⇧', '⌘', 'B']} separator="" />
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

/**
 * The 5.2 items in a context menu: `variant="destructive"` on a
 * `ContextMenuItem` (the kit's red row, text and icon in `red-text`) and a
 * `ContextMenuSwitchItem` (a checkbox item that ends in the kit's Switch),
 * as in DropdownMenu.
 */
export const Destructive: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-16 border border-dashed text-14">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-60">
        <ContextMenuItem>
          <PencilSimpleIcon />
          Rename
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon />
          Duplicate
          <ContextMenuShortcut keys={['⌘', 'D']} separator="" />
        </ContextMenuItem>
        <ContextMenuSwitchItem checked>
          <PushPinIcon />
          Pin to top
        </ContextMenuSwitchItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <TrashIcon />
          Delete
          <ContextMenuShortcut keys={['⌫']} separator="" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.pointer({
      keys: '[MouseRight]',
      target: canvas.getByText('Right click here'),
    })
    const menu = await page.findByRole('menu')
    const item = page.getByRole('menuitem', { name: /^Delete/ })
    item.focus()
    await settleLayout(menu)
    const red = colorOf(popoverItemDestructiveClasses, menu)
    await expect(getComputedStyle(item).color).toBe(red)
    await expect(
      getComputedStyle(item.querySelector('svg') as SVGElement).color,
    ).toBe(red)
    const pin = page.getByRole('menuitemcheckbox', { name: 'Pin to top' })
    await expect(pin).toHaveAttribute('aria-checked', 'true')
    await expect(pin.querySelector(':scope > [aria-hidden]')).toHaveClass(
      'w-7',
      'h-4',
    )
  },
}
