import { ArrowLineUpIcon } from '@holakirr/snow-ui-icons'
import {
  ChartPieSlice,
  ChatsTeardrop,
  FolderNotch,
  IdentificationBadge,
  IdentificationCard,
  Notebook,
  ShoppingBagOpen,
  User,
  UsersThree,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react'

import { Avatar, AvatarFallback, AvatarImage } from '../Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { Text } from '../Text'
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
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from './Sidebar'

// Menu items.
const items = [
  {
    title: 'Overview',
    url: '#',
    icon: ChartPieSlice,
    isActive: true,
  },
  {
    title: 'eCommerce',
    url: '#',
    icon: ShoppingBagOpen,
  },
  {
    title: 'Projects',
    url: '#',
    icon: FolderNotch,
  },
  {
    title: 'User Profile',
    url: '#',
    icon: IdentificationBadge,
  },
  {
    title: 'Account',
    url: '#',
    icon: IdentificationCard,
  },
  {
    title: 'Corporate',
    url: '#',
    icon: UsersThree,
  },
  {
    title: 'Blog',
    url: '#',
    icon: Notebook,
  },
  {
    title: 'Social',
    url: '#',
    icon: ChatsTeardrop,
  },
]

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A composable, themeable and customizable sidebar component.',
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
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </picture>
          <Text>Profile</Text>
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
              <SidebarMenuButton
                variant="outline"
                asChild
                isActive={item.isActive}
              >
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
                <User /> Username
                <ArrowLineUpIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
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
