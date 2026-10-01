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
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33534-46913',
    },
    docs: {
      description: {
        component:
          'A set of layered sections of content—known as tab panels—that are displayed one at a time. `TabsList variant` picks the Figma Tab variant: `line` (Underline), `pill`, `icon-toggle` or `solid`, or `filled` (5.2).',
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

/**
 * `underline="short"` (added in 5.2): the kit's Line docs draw the underline
 * of the active tab as a short rounded dash — 6×3px, Primary, centred under
 * the label and 2px lower than the full line — instead of the full width.
 */
export const ShortUnderline: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      {Object.values(SIZES).map((size) => (
        <Tabs key={size} defaultValue="overview">
          <TabsList
            size={size}
            underline="short"
            aria-label={`Sections (${size})`}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <Panels values={['overview', 'projects', 'team']} />
        </Tabs>
      ))}
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    await canvasElement.ownerDocument.fonts.ready
    const [overview] = canvas.getAllByRole('tab', { name: 'Overview' })
    const [projects] = canvas.getAllByRole('tab', { name: 'Projects' })
    const geometry = (tab: HTMLElement) => {
      tab.getBoundingClientRect()
      const label = (
        tab.firstElementChild as HTMLElement
      ).getBoundingClientRect()
      const dash = (tab.lastElementChild as HTMLElement).getBoundingClientRect()
      return { label, dash }
    }

    await step('a 6×3px dash, centred, 6px under the label', async () => {
      const { label, dash } = geometry(overview)
      await expect(dash.width).toBeCloseTo(6, 0)
      await expect(dash.height).toBeCloseTo(3, 0)
      await expect(dash.left + dash.width / 2).toBeCloseTo(
        label.left + label.width / 2,
        0,
      )
      await expect(dash.top - label.bottom).toBeCloseTo(6, 0)
      // Primary, like the label (after the colour transitions).
      await settledColor(overview)
      await expect(
        getComputedStyle(overview.lastElementChild as Element).backgroundColor,
      ).toBe(colorOf('text-primary', canvasElement))
    })

    await step('it moves with the selection', async () => {
      await userEvent.click(projects)
      await expect(projects).toHaveAttribute('aria-selected', 'true')
      const { label, dash } = geometry(projects)
      await expect(dash.left + dash.width / 2).toBeCloseTo(
        label.left + label.width / 2,
        0,
      )
    })
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

/**
 * `filled` (added in 5.2): the kit's segmented control with a Filled active
 * item ("Daily / Weekly / Monthly"): black with a white label (indigo with a
 * black one in dark mode) on the Pill track; the others are Borderless. The
 * keyboard is the same as every TabsList: the arrow keys, Home and End.
 */
export const Filled: Story = {
  render: () => (
    <Tabs defaultValue="daily">
      <TabsList variant="filled" aria-label="Period">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
      <Panels values={['daily', 'weekly', 'monthly']} />
    </Tabs>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const daily = canvas.getByRole('tab', { name: 'Daily' })
    const weekly = canvas.getByRole('tab', { name: 'Weekly' })
    const white = colorOf('text-white', canvasElement)
    // After the transitions (settledColor finishes them).
    const fill = async (element: HTMLElement) => {
      await settledColor(element)
      return getComputedStyle(element).backgroundColor
    }

    await step('the active item is Filled, the label white', async () => {
      const probe = canvasElement.ownerDocument.createElement('span')
      probe.className = 'bg-primary'
      canvasElement.appendChild(probe)
      const primaryFill = getComputedStyle(probe).backgroundColor
      probe.remove()
      await expect(await settledColor(daily)).toBe(white)
      await expect(await fill(daily)).toBe(primaryFill)
      await expect(await settledColor(weekly)).toBe(
        colorOf('text-secondary', canvasElement),
      )
    })

    await step('the arrow keys move the selection and the fill', async () => {
      await userEvent.tab()
      await expect(daily).toHaveFocus()
      await userEvent.keyboard('{ArrowRight}')
      await expect(weekly).toHaveFocus()
      await expect(weekly).toHaveAttribute('aria-selected', 'true')
      // Focused and selected, the label stays white.
      await expect(await settledColor(weekly)).toBe(white)
      await expect(await fill(daily)).toBe('rgba(0, 0, 0, 0)')
      await userEvent.keyboard('{End}')
      await expect(canvas.getByRole('tab', { name: 'Monthly' })).toHaveFocus()
      await userEvent.keyboard('{Home}')
      await expect(daily).toHaveFocus()
    })
  },
}

/** Filled tabs in every size, with icons, and a disabled one. */
export const FilledSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {Object.values(SIZES).map((size) => (
        <Tabs key={size} defaultValue="card">
          <TabsList variant="filled" size={size} aria-label={`View (${size})`}>
            <TabsTrigger value="card" icon={<TextAIcon />}>
              Card
            </TabsTrigger>
            <TabsTrigger value="list" icon={<CopyIcon />}>
              List
            </TabsTrigger>
            <TabsTrigger value="star" icon={<StarIcon />} disabled>
              Starred
            </TabsTrigger>
          </TabsList>
          <Panels values={['card', 'list', 'star']} />
        </Tabs>
      ))}
    </div>
  ),
}

/** Right-to-left text: the first tab on the right, ArrowLeft goes next. */
export const FilledRTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <Tabs defaultValue="daily">
      <TabsList variant="filled" aria-label="الفترة">
        <TabsTrigger value="daily">يومي</TabsTrigger>
        <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
        <TabsTrigger value="monthly">شهري</TabsTrigger>
      </TabsList>
      <Panels values={['daily', 'weekly', 'monthly']} />
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const daily = canvas.getByRole('tab', { name: 'يومي' })
    const weekly = canvas.getByRole('tab', { name: 'أسبوعي' })
    await expect(daily.getBoundingClientRect().left).toBeGreaterThan(
      weekly.getBoundingClientRect().left,
    )
    await userEvent.tab()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(weekly).toHaveFocus()
    await expect(weekly).toHaveAttribute('aria-selected', 'true')
  },
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
