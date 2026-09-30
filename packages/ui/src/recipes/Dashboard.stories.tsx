import {
  ArrowFallIcon,
  ArrowLineDownIcon,
  ArrowLineRightIcon,
  ArrowRiseIcon,
  SearchIcon,
} from '@holakirr/snow-ui-icons'
import {
  BellIcon,
  BroadcastIcon,
  BugBeetleIcon,
  ChartPieSliceIcon,
  ChatsTeardropIcon,
  ClockCounterClockwiseIcon,
  FolderOpenIcon,
  IdentificationBadgeIcon,
  IdentificationCardIcon,
  NotebookIcon,
  ShoppingBagOpenIcon,
  SidebarIcon,
  StarIcon,
  SunIcon,
  UserIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, type ReactNode, useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CommandPalette,
  type CommandPaletteGroup,
  Group,
  IconBox,
  IconText,
  KBD,
  ListItem,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  Strip,
  searchStyles,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography,
} from '../components'

/*
 * Recipes compose the library's components into the layouts of the SnowUI
 * dashboard pages ("Dashboard - Light mode" / "Dark mode" in Figma): a 212px
 * Sidebar, a Header, the content and a 280px RightSidebar. They are not
 * exported components — copy them into your app and adapt them.
 */

const avatar = (initials: string, className?: string) => (
  <IconBox size={24}>
    <Avatar>
      <AvatarFallback className={className ?? 'text-static-black'}>
        {initials}
      </AvatarFallback>
    </Avatar>
  </IconBox>
)

const iconButton = (label: string, icon: ReactNode, onClick?: () => void) => (
  <Button
    key={label}
    aria-label={label}
    title={label}
    onClick={onClick}
    startContent={<IconBox size={20}>{icon}</IconBox>}
    className="rounded-12 p-1"
  />
)

/* ------------------------------ Sidebar ------------------------------ */

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Typography asChild size={14} className="px-3 py-1 text-secondary">
    <h2>{children}</h2>
  </Typography>
)

type NavItem = {
  label: string
  icon: typeof ChartPieSliceIcon
  active?: boolean
  /** A directory (it has sub-pages): only these get the chevron. */
  directory?: boolean
}

// Figma: a single page (Overview) has no chevron, only the directories do;
// its icon stays in the icon column.
const navItems: NavItem[] = [
  { label: 'Overview', icon: ChartPieSliceIcon, active: true },
  { label: 'eCommerce', icon: ShoppingBagOpenIcon, directory: true },
  { label: 'Projects', icon: FolderOpenIcon, directory: true },
]

const pageItems: NavItem[] = [
  { label: 'User Profile', icon: IdentificationBadgeIcon, directory: true },
  { label: 'Account', icon: IdentificationCardIcon, directory: true },
  { label: 'Corporate', icon: UsersThreeIcon, directory: true },
  { label: 'Blog', icon: NotebookIcon, directory: true },
  { label: 'Social', icon: ChatsTeardropIcon, directory: true },
]

const NavList = ({ items }: { items: NavItem[] }) => (
  <ul className="flex flex-col gap-1">
    {items.map(({ label, icon: Icon, active = false, directory }) => (
      <li key={label}>
        <IconText
          asChild
          interactive
          active={active}
          className="flex gap-1"
          icon={
            <span className="flex items-center gap-1">
              {directory ? (
                <IconBox size={16} className="text-black-20">
                  <ArrowLineRightIcon className="rtl:-scale-x-100" />
                </IconBox>
              ) : (
                <span aria-hidden className="size-4 shrink-0" />
              )}
              <IconBox size={20}>
                <Icon weight={active ? 'fill' : 'duotone'} />
              </IconBox>
            </span>
          }
        >
          <a
            href={`#${label.toLowerCase()}`}
            aria-current={active ? 'page' : undefined}
          >
            {label}
          </a>
        </IconText>
      </li>
    ))}
  </ul>
)

const ShortcutList = ({
  prefix,
  items,
}: {
  prefix: string
  items: string[]
}) => (
  <ul className="flex flex-col gap-1">
    {items.map((label) => (
      <li key={label}>
        <IconText
          asChild
          interactive
          className="flex"
          icon={
            <IconBox size={16} className="text-black-20">
              <span className="size-1.5! rounded-full bg-current" />
            </IconBox>
          }
        >
          <a href={`#${prefix}-${label.toLowerCase()}`}>{label}</a>
        </IconText>
      </li>
    ))}
  </ul>
)

const DashboardSidebar = () => (
  <Sidebar
    collapsible="none"
    aria-label="Main"
    className="h-auto min-h-svh w-53 shrink-0 gap-4 border-e-[0.5px] border-black-10 bg-transparent p-4"
  >
    <SidebarHeader className="gap-4 p-0">
      <IconText interactive icon={avatar('BW')}>
        ByeWind
      </IconText>
      {/* Figma: two text tabs, Favorites in Black/40% and Recently in
          Black/20% (2.85:1 and 1.6:1, under AA). Here they are the library's
          Tabs, which are readable and switch the list: the selected tab in
          Primary with its line, the other in text-secondary. */}
      <Tabs defaultValue="favorites" className="flex flex-col gap-1">
        <TabsList aria-label="Shortcuts" className="justify-start gap-2 px-2">
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recently">Recently</TabsTrigger>
        </TabsList>
        <TabsContent value="favorites" className="mt-0">
          <ShortcutList prefix="fav" items={['Overview', 'Projects']} />
        </TabsContent>
        <TabsContent value="recently" className="mt-0">
          <ShortcutList prefix="recent" items={['eCommerce', 'Blog']} />
        </TabsContent>
      </Tabs>
    </SidebarHeader>
    <SidebarContent className="gap-4">
      <nav aria-label="Dashboards" className="flex flex-col gap-1">
        <SectionTitle>Dashboards</SectionTitle>
        <NavList items={navItems} />
      </nav>
      <nav aria-label="Pages" className="flex flex-col gap-1">
        <SectionTitle>Pages</SectionTitle>
        <NavList items={pageItems} />
      </nav>
    </SidebarContent>
    <SidebarFooter className="items-center p-0">
      <Typography size={14} semibold className="text-secondary">
        SnowUI
      </Typography>
    </SidebarFooter>
  </Sidebar>
)

/* ------------------------------ Header ------------------------------ */

/** A button styled as the Figma Search field; it opens the CommandPalette. */
const SearchButton = (props: ComponentProps<'button'>) => (
  <button
    type="button"
    className={searchStyles({
      // Figma: Black/20% (1.6:1); the label is text, so text-secondary.
      className: 'w-40 cursor-pointer text-secondary',
    })}
    {...props}
  >
    <SearchIcon size={16} />
    <span className="flex-1 text-left">Search</span>
    <KBD
      keys={['/']}
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

const searchGroups: CommandPaletteGroup[] = [
  {
    id: 'recent',
    heading: 'Recent search',
    items: [
      { id: 'landing', label: 'Landing page design', icon: searchIcon },
      { id: 'byewind', label: 'ByeWind', icon: avatar('BW') },
    ],
  },
  {
    id: 'pages',
    heading: 'Recently visited',
    items: [...navItems, ...pageItems].map(({ label }) => ({
      id: label,
      label,
      icon: searchIcon,
    })),
  },
]

const DashboardHeader = ({
  searchOpen,
  onToggleRightSidebar,
}: {
  searchOpen?: boolean
  onToggleRightSidebar: () => void
}) => (
  // Figma: "Header is always fixed at the top". In an app, give the page a
  // matching `scroll-padding-top` so focused content below never scrolls
  // under it (WCAG 2.4.11).
  <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-[0.5px] border-black-10 bg-background-1 px-7 py-5">
    <div className="flex items-center gap-2">
      {/* Figma: the 28px icon buttons are ≈32px apart, so 4px gaps. */}
      <Group gap={4} aria-label="Layout">
        {iconButton('Toggle sidebar', <SidebarIcon />)}
        {iconButton('Add to favorites', <StarIcon />)}
      </Group>
      <Breadcrumb>
        <BreadcrumbList className="gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="#dashboards">Dashboards</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="px-3">Default</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div className="flex items-center gap-5">
      <CommandPalette
        groups={searchGroups}
        hotkey="/"
        defaultOpen={searchOpen}
        trigger={<SearchButton />}
      />
      <Group gap={4} aria-label="Tools">
        {iconButton('Switch theme', <SunIcon />)}
        {iconButton('History', <ClockCounterClockwiseIcon />)}
        {iconButton('Notifications', <BellIcon />)}
        {iconButton('Toggle notifications panel', <SidebarIcon />, () =>
          onToggleRightSidebar(),
        )}
      </Group>
    </div>
  </header>
)

/* ------------------------------ Content ------------------------------ */

const stats = [
  { label: 'Views', value: '7,265', delta: '+11.01%', up: true },
  { label: 'Visits', value: '3,671', delta: '-0.03%', up: false },
  { label: 'New Users', value: '256', delta: '+15.03%', up: true },
  { label: 'Active Users', value: '2,318', delta: '+6.08%', up: true },
]

// Shares of the traffic, in %. The Figma bars are three equal segments
// (Black, Black/40%, Black/10%) 2px apart, as long as the share: 79px for
// Pinterest's 28% (measured on the kit frame).
const traffic = [
  { site: 'Google', share: 11 },
  { site: 'YouTube', share: 21 },
  { site: 'Instagram', share: 14 },
  { site: 'Pinterest', share: 28 },
  { site: 'Facebook', share: 10 },
  { site: 'Twitter', share: 16 },
]

const DashboardContent = () => (
  <div className="flex flex-col gap-7 p-7">
    <div className="flex items-center justify-between">
      <Typography asChild size={14} semibold>
        <h1>Overview</h1>
      </Typography>
      <Button
        variant="bare"
        className="text-black"
        endContent={
          <IconBox size={16}>
            <ArrowLineDownIcon />
          </IconBox>
        }
      >
        Today
      </Button>
    </div>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-7">
      {stats.map(({ label, value, delta, up }, index) => (
        // Figma: 108px high, padding 24, radius 20 — the block, tinted.
        <Card
          key={label}
          variant="block"
          className={`flex flex-col gap-2 text-static-black ${
            index % 2 ? 'bg-color-2' : 'bg-color-1'
          }`}
        >
          <Typography size={14}>{label}</Typography>
          <div className="flex items-center justify-between gap-2">
            <Typography size={24} semibold>
              {value}
            </Typography>
            <IconText
              flip
              icon={
                <IconBox size={16}>
                  {up ? <ArrowRiseIcon /> : <ArrowFallIcon />}
                </IconBox>
              }
              className="gap-1 text-static-black"
            >
              <Typography size={12}>{delta}</Typography>
            </IconText>
          </div>
        </Card>
      ))}
    </div>
    <Card variant="block" className="flex flex-col gap-4">
      <Typography asChild size={14} semibold>
        <h2>Traffic by Website</h2>
      </Typography>
      <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4">
        {traffic.map(({ site, share }) => (
          <div key={site} className="contents">
            <Typography asChild size={12}>
              <dt>{site}</dt>
            </Typography>
            <dd>
              <span className="sr-only">{share}%</span>
              <Strip
                count={3}
                thickness={2}
                rounded
                style={{ width: `${(share * 79) / 28}px` }}
                className="gap-0.5 [&>:nth-child(2)]:bg-black-40 [&>:nth-child(3)]:bg-black-10"
              />
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  </div>
)

/* ---------------------------- RightSidebar ---------------------------- */

const notifications = [
  {
    icon: <BugBeetleIcon />,
    tint: 'bg-color-2',
    title: 'You fixed a bug.',
    time: 'Just now',
  },
  {
    icon: <UserIcon />,
    tint: 'bg-color-1',
    title: 'New user registered.',
    time: '59 minutes ago',
  },
  {
    icon: <BroadcastIcon />,
    tint: 'bg-color-1',
    title: 'Andi Lane subscribed to you.',
    time: 'Today, 11:59 AM',
  },
]

const activities = [
  {
    initials: 'EM',
    tint: 'bg-purple',
    title: 'Changed the style.',
    time: 'Just now',
  },
  {
    initials: 'DC',
    tint: 'bg-blue',
    title: 'Released a new version.',
    time: '59 minutes ago',
  },
  {
    initials: 'AL',
    tint: 'bg-mint',
    title: 'Submitted a bug.',
    time: '12 hours ago',
  },
]

const contacts = ['Natali Craig', 'Drew Cano', 'Andi Lane', 'Koray Okumus']

const PanelSection = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <section aria-label={title} className="flex flex-col gap-1">
    <Typography asChild size={14} className="px-1 py-2">
      <h2>{title}</h2>
    </Typography>
    <ul className="flex flex-col gap-1">{children}</ul>
  </section>
)

const DashboardRightSidebar = () => (
  <aside
    aria-label="Notifications and activity"
    className="flex w-70 shrink-0 flex-col gap-4 border-s-[0.5px] border-black-10 p-4"
  >
    <PanelSection title="Notifications">
      {notifications.map((item) => (
        <ListItem
          key={item.time}
          asChild
          interactive
          icon={
            <IconBox
              size={16}
              background
              className={`${item.tint} text-static-black`}
            >
              {item.icon}
            </IconBox>
          }
          title={item.title}
          description={item.time}
        >
          <li />
        </ListItem>
      ))}
    </PanelSection>
    <PanelSection title="Activities">
      {activities.map((item, index) => (
        <ListItem
          key={item.time}
          asChild
          interactive
          icon={avatar(item.initials, `${item.tint} text-static-black`)}
          title={item.title}
          description={item.time}
          className="relative"
        >
          <li>
            {index < activities.length - 1 && (
              <span
                aria-hidden
                className="absolute top-[39px] start-[19.5px] h-[17px] w-px bg-black-10"
              />
            )}
          </li>
        </ListItem>
      ))}
    </PanelSection>
    <PanelSection title="Contacts">
      {contacts.map((name) => (
        <ListItem
          key={name}
          asChild
          interactive
          icon={avatar(
            name
              .split(' ')
              .map((part) => part[0])
              .join(''),
          )}
          title={name}
        >
          <li />
        </ListItem>
      ))}
    </PanelSection>
  </aside>
)

/* ------------------------------ Layout ------------------------------ */

const Dashboard = ({ searchOpen }: { searchOpen?: boolean }) => {
  const [showRightSidebar, setShowRightSidebar] = useState(true)

  return (
    <SidebarProvider className="bg-background-1 text-black">
      <DashboardSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          searchOpen={searchOpen}
          onToggleRightSidebar={() => setShowRightSidebar((show) => !show)}
        />
        <DashboardContent />
      </main>
      {showRightSidebar && <DashboardRightSidebar />}
    </SidebarProvider>
  )
}

const meta = {
  title: 'Recipes/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    storyWrapper: false,
    docs: {
      description: {
        component:
          'The SnowUI dashboard layout built from the library: `Sidebar` (212px, `Tabs` for Favorites / Recently, IconText nav items), a sticky header (`Group` of icon `Button`s, `Breadcrumb`, a Search-styled trigger for the `CommandPalette` — press "/"), the content (`Card variant="block"` tiles and blocks, `Strip`) and a 280px right sidebar (`ListItem` rows for Notifications, Activities and Contacts). A recipe, not an exported component: copy it and adapt it.',
      },
      story: { inline: false, height: '900px' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = {
  globals: { theme: 'dark' },
}

export const WithSearchOpen: Story = {
  args: { searchOpen: true },
}
