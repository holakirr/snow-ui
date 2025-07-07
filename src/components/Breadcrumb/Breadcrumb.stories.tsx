import { ArrowLineRightIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
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
          <BreadcrumbLink href="/docs/components/breadcrumbs">
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
          <BreadcrumbLink href="/docs/components/breadcrumbs">
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
