import { CopyIcon, StarIcon, TextAIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { SIZES } from '../../constants'
import { Typography } from '../Text'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsVariant,
} from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  args: {},
  parameters: {
    docs: {
      description: {
        component:
          'A set of layered sections of content—known as tab panels—that are displayed one at a time. `TabsList variant` picks the Figma Tab variant: `line` (Underline), `pill`, `icon-toggle` or `solid`.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="team" disabled>
          Team
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
}

export const Pill: Story = {
  render: () => (
    <Tabs defaultValue="day">
      <TabsList variant="pill">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

export const IconToggle: Story = {
  render: () => (
    <Tabs defaultValue="text">
      <TabsList variant="icon-toggle">
        <TabsTrigger value="text" icon={<TextAIcon />}>
          Text
        </TabsTrigger>
        <TabsTrigger value="notes" icon={<CopyIcon />}>
          Notes
        </TabsTrigger>
        <TabsTrigger value="star" icon={<StarIcon />}>
          Starred
        </TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

export const Solid: Story = {
  render: () => (
    <Tabs defaultValue="day">
      <TabsList variant="solid">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <Tabs defaultValue="text">
      <TabsList variant="pill">
        <TabsTrigger value="text" icon={<TextAIcon />} aria-label="Text" />
        <TabsTrigger value="notes" icon={<CopyIcon />} aria-label="Notes" />
        <TabsTrigger value="star" icon={<StarIcon />} aria-label="Starred" />
      </TabsList>
    </Tabs>
  ),
}

const variants: TabsVariant[] = ['line', 'pill', 'icon-toggle', 'solid']

/** The Figma Tab set: every variant in every size (hover a tab). */
export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-10 gap-y-6">
      <span />
      {Object.values(SIZES).map((size) => (
        <Typography key={size} size={12} className="text-black-40">
          {size}
        </Typography>
      ))}
      {variants.map((variant) => (
        <Fragment key={variant}>
          <Typography size={12} className="text-black-40">
            {variant}
          </Typography>
          {Object.values(SIZES).map((size) => (
            <Tabs key={size} defaultValue="one">
              <TabsList variant={variant} size={size}>
                {/* Figma: Underline, Pill and Solid tabs are text only. */}
                <TabsTrigger
                  value="one"
                  icon={variant === 'icon-toggle' && <TextAIcon />}
                >
                  Text
                </TabsTrigger>
                <TabsTrigger
                  value="two"
                  icon={variant === 'icon-toggle' && <CopyIcon />}
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="three"
                  icon={variant === 'icon-toggle' && <StarIcon />}
                >
                  Starred
                </TabsTrigger>
              </TabsList>
            </Tabs>
          ))}
        </Fragment>
      ))}
    </div>
  ),
}
