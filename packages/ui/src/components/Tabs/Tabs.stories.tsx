import { CopyIcon, StarIcon, TextAIcon } from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { expect } from 'storybook/test'
import { SIZES } from '../../constants'
import { colorOf, settledColor } from '../../test/colors'
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

/**
 * A panel per tab: each tab's `aria-controls` points at its panel, so a tab
 * list without panels is invalid ARIA (a view switcher without panels is a
 * `ToggleGroup`).
 */
const Panels = ({ values }: { values: string[] }) => (
  <>
    {values.map((value) => (
      <TabsContent key={value} value={value} className="text-12 text-secondary">
        {value[0].toUpperCase() + value.slice(1)} panel
      </TabsContent>
    ))}
  </>
)

export const Default: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const account = canvas.getByRole('tab', { name: 'Account' })
    const password = canvas.getByRole('tab', { name: 'Password' })

    await step('Tab moves into the list, onto the selected tab', async () => {
      await userEvent.tab()
      await expect(account).toHaveFocus()
      await expect(account).toHaveAttribute('aria-selected', 'true')
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
        'Make changes to your account here.',
      )
    })

    await step(
      'ArrowRight selects the next tab and shows its panel',
      async () => {
        await userEvent.keyboard('{ArrowRight}')
        await expect(password).toHaveFocus()
        await expect(password).toHaveAttribute('aria-selected', 'true')
        await expect(account).toHaveAttribute('aria-selected', 'false')
        await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
          'Change your password here.',
        )
      },
    )

    await step('the disabled tab is skipped and focus wraps', async () => {
      await userEvent.keyboard('{ArrowRight}')
      await expect(account).toHaveFocus()
      await userEvent.keyboard('{ArrowLeft}')
      await expect(password).toHaveFocus()
      await userEvent.keyboard('{End}')
      await expect(password).toHaveFocus()
      await userEvent.keyboard('{Home}')
      await expect(account).toHaveFocus()
    })

    await step('Tab leaves the list for the panel', async () => {
      await userEvent.tab()
      await expect(canvas.getByRole('tabpanel')).toHaveFocus()
    })
  },
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

/**
 * Right-to-left text: the tabs start on the right, and the arrow keys follow
 * the reading direction (Radix reads `dir` from `SnowUIProvider`):
 * ArrowLeft moves to the next tab.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList variant="pill">
        <TabsTrigger value="account" icon={<StarIcon />}>
          الحساب
        </TabsTrigger>
        <TabsTrigger value="password" icon={<CopyIcon />}>
          كلمة المرور
        </TabsTrigger>
        <TabsTrigger value="team" icon={<TextAIcon />}>
          الفريق
        </TabsTrigger>
      </TabsList>
      <Panels values={['account', 'password', 'team']} />
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const account = canvas.getByRole('tab', { name: 'الحساب' })
    const password = canvas.getByRole('tab', { name: 'كلمة المرور' })

    // The first tab is on the right.
    await expect(account.getBoundingClientRect().left).toBeGreaterThan(
      password.getBoundingClientRect().left,
    )

    await userEvent.tab()
    await expect(account).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(password).toHaveFocus()
    await expect(password).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowRight}')
    await expect(account).toHaveFocus()
  },
}

export const Pill: Story = {
  render: () => (
    <Tabs defaultValue="day">
      <TabsList variant="pill">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
      </TabsList>
      <Panels values={['day', 'week', 'month']} />
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
      <Panels values={['text', 'notes', 'star']} />
    </Tabs>
  ),
}

export const Solid: Story = {
  render: () => (
    <Tabs defaultValue="day">
      <TabsList variant="solid">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month" disabled>
          Month
        </TabsTrigger>
      </TabsList>
      <Panels values={['day', 'week', 'month']} />
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
      <Panels values={['text', 'notes', 'star']} />
    </Tabs>
  ),
}

/**
 * Triggers rendered as links with `asChild` (a router's `<Link>`, say): the
 * link is the tab, and gets the tab's colours in every state (they don't
 * depend on `:enabled`, which a link never matches).
 */
export const Links: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['line', 'pill'] as const).map((variant) => (
        <Tabs key={variant} defaultValue="overview">
          <TabsList variant={variant} aria-label={`Sections (${variant})`}>
            <TabsTrigger value="overview" asChild>
              <a href="#overview">Overview</a>
            </TabsTrigger>
            <TabsTrigger value="projects" asChild>
              <a href="#projects">Projects</a>
            </TabsTrigger>
          </TabsList>
          <Panels values={['overview', 'projects']} />
        </Tabs>
      ))}
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const [lineActive, pillActive] = canvas.getAllByRole('tab', {
      name: 'Overview',
    })
    const [lineIdle, pillIdle] = canvas.getAllByRole('tab', {
      name: 'Projects',
    })
    const secondary = colorOf('text-secondary', canvasElement)

    await step('the links are the tabs', async () => {
      await expect(lineActive.tagName).toBe('A')
      await expect(lineActive).toHaveAttribute('aria-selected', 'true')
    })

    await step('the active link has the active colour', async () => {
      await expect(await settledColor(lineActive)).toBe(
        colorOf('text-primary', canvasElement),
      )
      await expect(await settledColor(pillActive)).toBe(
        colorOf('text-black', canvasElement),
      )
      await expect(await settledColor(lineIdle)).toBe(secondary)
      await expect(await settledColor(pillIdle)).toBe(secondary)
    })

    await step('selecting another link moves the colour', async () => {
      pillActive.focus()
      await userEvent.keyboard('{ArrowRight}')
      await expect(pillIdle).toHaveAttribute('aria-selected', 'true')
      await expect(await settledColor(pillIdle)).toBe(
        colorOf('text-black', canvasElement),
      )
      pillIdle.blur()
      await expect(await settledColor(pillActive)).toBe(secondary)
    })
  },
}

const variants: TabsVariant[] = ['line', 'pill', 'icon-toggle', 'solid']

/** The Figma Tab set: every variant in every size (hover a tab). */
export const Matrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-10 gap-y-6">
      <span />
      {Object.values(SIZES).map((size) => (
        <Typography key={size} size={12} className="text-secondary">
          {size}
        </Typography>
      ))}
      {variants.map((variant) => (
        <Fragment key={variant}>
          <Typography size={12} className="text-secondary">
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
              <Panels values={['one', 'two', 'three']} />
            </Tabs>
          ))}
        </Fragment>
      ))}
    </div>
  ),
}
