import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The Figma dashboard breadcrumb: 12 Regular items with the Button Small "Borderless" padding (4/12, radius 12, Black/4% on hover), `text-secondary` parents (Figma: Black/40%, 2.85:1), a Black/100% current page and Black/10% "/" separators, 4px apart.',
      },
    },
  },
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/docs/components/breadcrumbs"
            aria-current="page"
          >
            Breadcrumb
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
}

export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  args: {},
}

/** The Figma dashboard header: "Dashboards / Default". */
export const Dashboard: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#dashboards">Dashboards</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Default</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
}

export const DashboardDark: Story = {
  ...Dashboard,
  globals: { theme: 'dark' },
}

const CustomSeparator = (
  <BreadcrumbSeparator>
    <ArrowLineRightIcon />
  </BreadcrumbSeparator>
)

export const WithCustomSeparator: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {CustomSeparator}
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
        </BreadcrumbItem>{' '}
        {CustomSeparator}
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        {CustomSeparator}
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/docs/components/breadcrumbs"
            aria-current="page"
          >
            Breadcrumb
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
}

export const WithEllipsis: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>WithEllipsis</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
}

/**
 * `asChild` renders a router link (here a plain `<a>` standing in for one)
 * with the link styles.
 */
export const AsChild: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#home" className="underline">
              Home
            </a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
  play: async ({ canvas }) => {
    const home = canvas.getByRole('link', { name: 'Home' })
    await expect(home).toHaveAttribute('href', '#home')
    await expect(home).toHaveClass('underline', 'rounded-12', 'px-3')
  },
}

/**
 * Right-to-left text: the trail starts on the right and icon separators (a
 * chevron) point left. The ellipsis is announced as
 * `messages.breadcrumb.more`.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">الرئيسية</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ArrowLineRightIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ArrowLineRightIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>لوحة التحكم</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
  play: async ({ canvas }) => {
    const home = canvas.getByRole('link', { name: 'الرئيسية' })
    const page = canvas.getByText('لوحة التحكم')
    await expect(home.getBoundingClientRect().left).toBeGreaterThan(
      page.getBoundingClientRect().left,
    )
    await expect(canvas.getByText('More pages')).toHaveClass('sr-only')
  },
}

export const WithDisabledLink: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components/breadcrumbs" disabled>
            Breadcrumb
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
}

// TODO: uncomment once dropdown is ready
// export const WithDropdown: Story = {
// 	args: {
// 		children: (
// 			<BreadcrumbList>
//         <BreadcrumbItem>
//           <BreadcrumbLink href="/">Home</BreadcrumbLink>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <DropdownMenu>
//             <DropdownMenuTrigger className="flex items-center gap-1">
//               <BreadcrumbEllipsis className="h-4 w-4" />
//               <span className="sr-only">Toggle menu</span>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               <DropdownMenuItem>Documentation</DropdownMenuItem>
//               <DropdownMenuItem>Themes</DropdownMenuItem>
//               <DropdownMenuItem>GitHub</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
//         </BreadcrumbItem>
//       </BreadcrumbList>
//     ),
//   },
// }
