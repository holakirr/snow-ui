import {
  ChartPieSlice,
  ChatsTeardrop,
  FolderNotch,
  IdentificationBadge,
  IdentificationCard,
  Notebook,
  ShoppingBagOpen,
  UsersThree,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react'

import { ArrowLineDownIcon } from '@holakirr/snow-ui-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { Link } from '../Link'
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
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

const AppSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                Select Workspace
                <ArrowLineDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem>
                <span>Acme Inc</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Acme Corp.</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarSeparator />
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
)

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <main className="w-full h-full flex justify-center items-center">
        <AppSidebar />
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  ),
}

// export const Floating: Story = {
//   render: () => (
//     <div className="h-[400px] flex">
//       <Sidebar variant="floating">
//         <SidebarHeader>
//           <SidebarTrigger />
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton tooltip="Home">
//                 <Home />
//                 <span>Home</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//             <SidebarMenuItem>
//               <SidebarMenuButton tooltip="Users">
//                 <Users />
//                 <span>Users</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarContent>
//       </Sidebar>
//     </div>
//   ),
// }

// export const Inset: Story = {
//   render: () => (
//     <div className="h-[400px] flex">
//       <Sidebar variant="inset">
//         <SidebarHeader>
//           <SidebarTrigger />
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton tooltip="Home" isActive>
//                 <Home />
//                 <span>Home</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//             <SidebarMenuItem>
//               <SidebarMenuButton tooltip="Settings">
//                 <Settings />
//                 <span>Settings</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarContent>
//       </Sidebar>
//     </div>
//   ),
// }

// export const IconCollapsible: Story = {
//   render: () => (
//     <div className="h-[400px] flex">
//       <Sidebar collapsible="icon">
//         <SidebarHeader>
//           <SidebarTrigger />
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton tooltip="Home">
//                 <Home />
//                 <span>Home</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//             <SidebarMenuItem>
//               <SidebarMenuButton tooltip="Users">
//                 <Users />
//                 <span>Users</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarContent>
//       </Sidebar>
//     </div>
//   ),
// }
