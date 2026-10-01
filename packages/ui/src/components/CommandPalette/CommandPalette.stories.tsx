import { SearchIcon } from '@holakirr/snow-ui-icons'
import { FileTextIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useEffect, useState } from 'react'
import { expect, fn, waitFor, within } from 'storybook/test'
import { expectClosed } from '../../test/animations'
import { colorOf } from '../../test/colors'
import { Avatar, AvatarFallback } from '../Avatar'
import { Button } from '../Button'
import { IconBox } from '../IconBox'
import { searchStyles } from '../Search'
import { KBD, Typography } from '../Text'
import {
  CommandPalette,
  type CommandPaletteGroup,
  type CommandPaletteItem,
} from './CommandPalette'

/**
 * A button that looks like the Figma Search field (the dashboard header opens
 * the SearchPopup from it).
 */
const SearchButton = ({
  label = 'Search',
  shortcut = '/',
  ...props
}: ComponentProps<'button'> & { label?: string; shortcut?: string }) => (
  <button
    type="button"
    className={searchStyles({
      // Figma: Black/20% (1.6:1); the label is text, so text-secondary.
      className: 'w-40 cursor-pointer text-secondary',
    })}
    {...props}
  >
    <SearchIcon size={16} />
    <span className="flex-1 text-left">{label}</span>
    <KBD
      keys={[shortcut]}
      aria-hidden
      // No fill of its own, like Search's hint: KBD's Black/4% on the gray
      // field took the dark-mode text under 4.5:1 (4.37:1; 3.89:1 hovered).
      className="inline-flex h-4 items-center rounded-[6px] border-[0.5px] border-black-10 bg-transparent px-1 text-12 text-secondary"
    />
  </button>
)

const searchIcon = (
  <IconBox size={16}>
    <SearchIcon />
  </IconBox>
)

const avatar = (initials: string, className?: string) => (
  <IconBox size={24}>
    <Avatar>
      <AvatarFallback className={className ?? 'text-static-black'}>
        {initials}
      </AvatarFallback>
    </Avatar>
  </IconBox>
)

// The content of the Figma SearchPopup.
const groups: CommandPaletteGroup[] = [
  {
    id: 'recent',
    heading: 'Recent search',
    items: [
      { id: 'landing', label: 'Landing page design', icon: searchIcon },
      {
        id: 'byewind',
        label: 'ByeWind',
        icon: avatar('BW'),
        keywords: ['designer'],
      },
      { id: 'tokens', label: 'Design tokens', icon: searchIcon },
    ],
  },
  {
    id: 'visited',
    heading: 'Recently visited',
    items: [
      { id: 'overview', label: 'Overview', icon: searchIcon },
      { id: 'projects', label: 'Projects', icon: searchIcon },
      {
        id: 'archive',
        label: 'Archived projects',
        icon: searchIcon,
        disabled: true,
      },
      { id: 'profile', label: 'User Profile', icon: searchIcon },
    ],
  },
  {
    id: 'contacts',
    heading: 'Contacts',
    items: [
      { id: 'byewind-contact', label: 'ByeWind', icon: avatar('BW') },
      {
        id: 'emma',
        label: 'Emma Smith',
        icon: avatar('ES', 'bg-purple text-static-black'),
      },
      {
        id: 'melody',
        label: 'Melody Macy',
        icon: avatar('MM', 'bg-orange text-static-black'),
      },
    ],
  },
]

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33509-104723',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Figma "SearchPopup": a searchable, grouped list in a dialog (Radix Dialog). Type to filter; ↑ / ↓ move the highlight (the first result is highlighted), Enter or a click selects (⌘/Ctrl is available on the event to open in a new tab), Escape or a click outside closes. The field is a `combobox` controlling a `listbox` with `aria-activedescendant`.',
      },
      story: { inline: false, height: '640px' },
    },
  },
  tags: ['autodocs'],
  args: {
    groups,
    hotkey: '/',
    trigger: <SearchButton />,
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { onSelect: fn() },
  parameters: {
    // Inline on the docs page: the trigger, and the palette opens over the
    // page. Storybook doesn't run an inline story's play function in docs;
    // in an iframe it ran, next to the iframes of the stories that open the
    // palette on load, which took the focus it checks.
    docs: { story: { inline: true, height: 'auto' } },
  },
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Search' })

    await step(
      'the trigger opens it with focus in the search field',
      async () => {
        await userEvent.click(trigger)
        await page.findByRole('dialog', { name: 'Search' })
        await waitFor(() =>
          expect(page.getByRole('combobox', { name: 'Search' })).toHaveFocus(),
        )
      },
    )

    await step('typing filters and highlights the first result', async () => {
      const field = page.getByRole('combobox', { name: 'Search' })
      await userEvent.keyboard('tok')
      const options = page.getAllByRole('option')
      await expect(options).toHaveLength(1)
      await expect(options[0]).toHaveTextContent('Design tokens')
      await expect(options[0]).toHaveAttribute('aria-selected', 'true')
      await expect(field).toHaveAttribute(
        'aria-activedescendant',
        options[0].id,
      )
    })

    await step('Enter selects it and closes the palette', async () => {
      const dialog = page.getByRole('dialog', { name: 'Search' })
      await userEvent.keyboard('{Enter}')
      await expect(args.onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'tokens', label: 'Design tokens' }),
        expect.anything(),
      )
      await expectClosed(dialog)
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveFocus()
    })

    await step('the hotkey opens it, Escape closes it', async () => {
      await userEvent.keyboard('/')
      const dialog = await page.findByRole('dialog', { name: 'Search' })
      await userEvent.keyboard('{ArrowDown}')
      await expect(page.getAllByRole('option')[1]).toHaveAttribute(
        'aria-selected',
        'true',
      )
      await userEvent.keyboard('{Escape}')
      await expectClosed(dialog)
      await waitFor(() =>
        expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
      )
      await expect(args.onSelect).toHaveBeenCalledTimes(1)
    })
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
}

export const OpenDark: Story = {
  args: { defaultOpen: true },
  globals: { theme: 'dark' },
}

export const Empty: Story = {
  args: { defaultOpen: true, defaultQuery: 'Quarterly report' },
}

export const Loading: Story = {
  args: { defaultOpen: true, loading: true, groups: [] },
}

export const WithButtonTrigger: Story = {
  args: {
    hotkey: 'mod+k',
    trigger: <Button variant="gray" label="Search ⌘K" />,
  },
}

const people = ['Natali Craig', 'Drew Cano', 'Andi Lane', 'Koray Okumus']

/** Results fetched as the user types: `filter={false}` and `loading`. */
export const AsyncResults: Story = {
  args: { defaultOpen: true },
  render: (args) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<CommandPaletteItem[]>([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<string>()

    useEffect(() => {
      setLoading(true)
      const timer = setTimeout(() => {
        setResults(
          people
            .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
            .map((name) => ({
              id: name,
              label: name,
              icon: avatar(
                name
                  .split(' ')
                  .map((part) => part[0])
                  .join(''),
              ),
            })),
        )
        setLoading(false)
      }, 400)
      return () => clearTimeout(timer)
    }, [query])

    return (
      <div className="flex flex-col items-center gap-2">
        <CommandPalette
          {...args}
          groups={[{ id: 'people', heading: 'People', items: results }]}
          filter={false}
          loading={loading}
          query={query}
          onQueryChange={setQuery}
          onSelect={(item) => setSelected(item.label)}
        />
        <Typography size={12} className="text-secondary">
          Selected: {selected ?? 'nothing'}
        </Typography>
      </div>
    )
  },
}

const pageIcon = (
  <IconBox size={16}>
    <FileTextIcon />
  </IconBox>
)

// The kit's "Search results": a user, a page, text on a page (with the
// matching text under it) and data in a table.
const searchResults: CommandPaletteGroup[] = [
  {
    id: 'results',
    items: [
      { id: 'user', label: 'ByeWind', icon: avatar('BW') },
      { id: 'page', label: 'ByeWind', icon: pageIcon },
      {
        id: 'text',
        label: 'Overview',
        icon: pageIcon,
        snippet: 'I’m ByeWind, a Product UX/UI Designer, based in China.',
      },
      { id: 'profile', label: 'ByeWind’s profile', icon: pageIcon },
      { id: 'farewell', label: 'Farewell to Wind', icon: pageIcon },
      {
        id: 'twitter',
        label: 'https://twitter.com/FarewelltoWind',
        icon: pageIcon,
      },
    ],
  },
]

/**
 * The kit's search results (added in 5.2): `showCount` shows "105 results"
 * (`resultCount`, when the list holds only the first ones), `highlightMatches`
 * marks the query in each label and snippet, and an item's `snippet` is the
 * second line.
 */
export const SearchResults: Story = {
  decorators: [
    (Story) => (
      <>
        {/* The palette is translucent (Background/3 at 90%): the app's
            background-1 page under it, as in an app. The test runner's page
            is white, which would put the dark-mode palette on white. */}
        <div aria-hidden className="fixed inset-0 bg-background-1" />
        <Story />
      </>
    ),
  ],
  args: {
    defaultOpen: true,
    groups: searchResults,
    defaultQuery: 'Wind',
    showCount: true,
    resultCount: 105,
    highlightMatches: true,
  },
  play: async ({ canvasElement, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const dialog = await page.findByRole('dialog')

    await step('the count, announced politely', async () => {
      const count = within(dialog).getByText('105 results')
      await expect(count).toHaveAttribute('role', 'status')
      await expect(getComputedStyle(count).fontSize).toBe('12px')
      await expect(getComputedStyle(count).color).toBe(
        colorOf('text-secondary', dialog),
      )
    })

    await step('the match is marked in indigo, without a fill', async () => {
      const [first] = page.getAllByRole('option')
      const mark = first.querySelector('mark') as HTMLElement
      await expect(mark).toHaveTextContent('Wind')
      await expect(getComputedStyle(mark).backgroundColor).toBe(
        'rgba(0, 0, 0, 0)',
      )
      await expect(getComputedStyle(mark).color).toBe(
        colorOf(
          'text-indigo-text dark:text-[color:color-mix(in_srgb,var(--color-indigo-text),var(--color-black)_30%)]',
          first,
        ),
      )
      await expect(first).toHaveAccessibleName('BW ByeWind')
    })

    await step(
      'the snippet is the second line and the description',
      async () => {
        const option = page.getByRole('option', { name: 'Overview' })
        await expect(option).toHaveAccessibleDescription(
          'I’m ByeWind, a Product UX/UI Designer, based in China.',
        )
        const snippet = within(option).getByText(/Product UX\/UI/)
        await expect(getComputedStyle(snippet).fontSize).toBe('12px')
        await expect(snippet.querySelector('mark')).toHaveTextContent('Wind')
      },
    )
  },
}
