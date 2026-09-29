import { ArrowLineRightIcon, ArrowLineUpIcon } from '@holakirr/snow-ui-icons'
import {
  ChartPieSliceIcon,
  ChatsTeardropIcon,
  FolderOpenIcon,
  IdentificationBadgeIcon,
  IdentificationCardIcon,
  NotebookIcon,
  ShoppingBagOpenIcon,
  UserIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { Avatar, AvatarFallback, AvatarImage } from '../Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { Typography } from '../Text'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from './Sidebar'

// Menu items.
const items = [
  {
    title: 'Overview',
    url: '#',
    icon: ChartPieSliceIcon,
    isActive: true,
  },
  {
    title: 'eCommerce',
    url: '#',
    icon: ShoppingBagOpenIcon,
  },
  {
    title: 'Projects',
    url: '#',
    icon: FolderOpenIcon,
  },
  {
    title: 'User Profile',
    url: '#',
    icon: IdentificationBadgeIcon,
  },
  {
    title: 'Account',
    url: '#',
    icon: IdentificationCardIcon,
  },
  {
    title: 'Corporate',
    url: '#',
    icon: UsersThreeIcon,
  },
  {
    title: 'Blog',
    url: '#',
    icon: NotebookIcon,
  },
  {
    title: 'Social',
    url: '#',
    icon: ChatsTeardropIcon,
  },
]

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=34611-43783',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A composable, themeable and customizable sidebar component. It follows the Figma dashboard Sidebar: 212px wide, no fill (it sits on the page background), a 0.5px Black/10% edge, 14 Regular Black/40% section headings and 36px items with radius 12 and a Black/4% fill on hover and on the active item.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

const Header = () => (
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <picture>
            <Avatar size="sm" className="group-data-[collapsible=icon]:size-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </picture>
          <Typography asChild>
            <span>Profile</span>
          </Typography>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
)

const Content = () => (
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
)

const AppSidebar = () => (
  <Sidebar collapsible="icon">
    <Header />
    <SidebarSeparator />
    <Content />
    <SidebarSeparator />
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <UserIcon /> Username
                <ArrowLineUpIcon className="ms-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-(--radix-popper-anchor-width)"
            >
              <DropdownMenuItem>
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
)

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <main className="w-full h-full flex justify-center items-center">
        <AppSidebar />
        <SidebarTrigger size="lg" />
      </main>
    </SidebarProvider>
  ),
}

const rtlItems = [
  { title: 'نظرة عامة', icon: ChartPieSliceIcon, isActive: true },
  { title: 'المشاريع', icon: FolderOpenIcon },
  { title: 'الحساب', icon: IdentificationCardIcon },
]

/**
 * Right-to-left text: `side="start"` (the default) puts the sidebar on the
 * right, its edge line on the left, and the trigger icon is mirrored.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>التطبيق</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rtlItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href="#rtl">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex flex-1 items-start p-4">
        <SidebarTrigger size="lg" />
      </main>
    </SidebarProvider>
  ),
  play: async ({ canvas, canvasElement }) => {
    const sidebar = canvasElement.querySelector('[data-side]') as HTMLElement
    await expect(sidebar).toHaveAttribute('data-side', 'right')

    const link = canvas.getByRole('link', { name: 'نظرة عامة' })
    const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' })
    await expect(link.getBoundingClientRect().left).toBeGreaterThan(
      trigger.getBoundingClientRect().right,
    )
  },
}

/**
 * The default `collapsible="offcanvas"`: the trigger slides the sidebar off
 * the screen. Once it is out, the sidebar is `visibility: hidden`, so Tab
 * skips its links and screen readers don't find them; the trigger reports
 * the state with `aria-expanded` and points to the sidebar with
 * `aria-controls`.
 */
export const Offcanvas: Story = {
  // The same picture as the other stories once the play function has
  // reopened the sidebar.
  tags: ['skip-visual'],
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <Content />
      </Sidebar>
      <main className="flex flex-1 items-start gap-4 p-4">
        <SidebarTrigger size="lg" />
        <a href="#offcanvas" className="rounded-8 text-14 focus-ring">
          Main content
        </a>
      </main>
    </SidebarProvider>
  ),
  play: async ({ canvas, userEvent, step }) => {
    const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' })
    const main = canvas.getByRole('link', { name: 'Main content' })
    const sidebar = document.getElementById(
      trigger.getAttribute('aria-controls') ?? '',
    )
    const firstLink = canvas.getByRole('link', { name: 'Overview' })
    await expect(sidebar).toContainElement(firstLink)

    await step('expanded: Tab goes through the sidebar links', async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')
      trigger.focus()
      await userEvent.tab({ shift: true })
      await expect(canvas.getByRole('link', { name: 'Social' })).toHaveFocus()
    })

    await step('collapsed: Tab skips the sidebar', async () => {
      await userEvent.click(trigger)
      await expect(trigger).toHaveAttribute('aria-expanded', 'false')
      // Hidden once the 200ms slide has ended.
      await waitFor(() =>
        expect(
          canvas.queryByRole('link', { name: 'Overview' }),
        ).not.toBeInTheDocument(),
      )
      // The browser refuses to focus its links…
      firstLink.focus()
      await expect(firstLink).not.toHaveFocus()
      // …and Tab goes from the trigger to the page, never into the sidebar.
      trigger.focus()
      await userEvent.tab({ shift: true })
      await expect(sidebar).not.toContainElement(
        document.activeElement as HTMLElement,
      )
      trigger.focus()
      await userEvent.tab()
      await expect(main).toHaveFocus()
    })

    await step('expanded again: the links are back', async () => {
      // Also saves the open state (the sidebar_state cookie) for the other
      // stories.
      await userEvent.click(trigger)
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')
      // Visible from the first frame of the slide.
      await waitFor(() =>
        expect(
          canvas.getByRole('link', { name: 'Overview' }),
        ).toBeInTheDocument(),
      )
    })
  },
}

export const Floating: Story = {
  render: () => (
    <SidebarProvider>
      <main className="w-full h-full flex justify-center items-center">
        <Sidebar variant="floating">
          <Header />
          <Content />
        </Sidebar>
        <SidebarTrigger size="lg" />
      </main>
    </SidebarProvider>
  ),
}

export const Inset: Story = {
  render: () => (
    <SidebarProvider>
      <main className="w-full h-full flex justify-center items-center">
        <Sidebar variant="inset">
          <Header />
          <Content />
        </Sidebar>
        <SidebarTrigger size="lg" />
      </main>
    </SidebarProvider>
  ),
}

const Chevron = ({ open }: { open?: boolean }) => (
  <ArrowLineRightIcon
    aria-hidden
    className={`!size-4 text-black-20 transition-transform ${open ? 'rotate-90' : ''}`}
  />
)

const dashboards = items.slice(0, 3)
const pages = items.slice(3)
const profilePages = ['Overview', 'Projects', 'Campaigns', 'Documents']

/** The Figma dashboard sidebar (`Type=Complex`, `Fold=False`). */
export const Dashboard: Story = {
  render: () => (
    <SidebarProvider className="min-h-0 h-[760px] bg-background-1">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded-8">
                <Avatar size="sm">
                  <AvatarFallback>BW</AvatarFallback>
                </Avatar>
                <span>ByeWind</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex gap-2 text-12">
            {/* Figma: Black/40% and Black/20% (2.85:1, 1.6:1); text-black-80 and text-secondary here. */}
            <span className="px-3 py-1 text-black-80">Favorites</span>
            <span className="px-3 py-1 text-secondary">Recently</span>
          </div>
          <SidebarMenu>
            {['Overview', 'Projects'].map((title) => (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton>
                  <span
                    aria-hidden
                    className="mx-1 size-1.5 shrink-0 rounded-full bg-black-20"
                  />
                  <span>{title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboards.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url} className="gap-1">
                        {item.isActive ? (
                          <span className="size-4 shrink-0" />
                        ) : (
                          <Chevron />
                        )}
                        <item.icon
                          weight={item.isActive ? 'fill' : 'duotone'}
                        />
                        <span className="ml-1">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {pages.map((item, index) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="gap-1">
                        <Chevron open={index === 0} />
                        <item.icon weight="duotone" />
                        <span className="ml-1">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {index === 0 && (
                      <SidebarMenuSub className="ml-12 mr-0 border-l-0 px-0">
                        {profilePages.map((title) => (
                          <SidebarMenuSubItem key={title}>
                            <SidebarMenuSubButton href="#">
                              <span>{title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const DashboardDark: Story = {
  ...Dashboard,
  globals: { theme: 'dark' },
}
