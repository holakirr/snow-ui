import { SearchIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useEffect, useState } from 'react'
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
      className="inline-flex h-4 items-center rounded-[6px] border-[0.5px] border-black-10 px-1 text-12 text-secondary"
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

export const Default: Story = {}

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
