import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { colorOf, hasInsetRing } from '../../test/colors'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './Select'

const meta: Meta<typeof Select> = {
  title: 'Components/Input/Select',
  component: Select,
  tags: ['autodocs', 'a11y'],
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25559-12043',
    },
    docs: {
      description: {
        component:
          'Displays a list of options for the user to pick from—triggered by a button.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' })
    await expect(trigger).toHaveTextContent('Select a fruit')

    await step('the chevron is text-secondary (3:1 or more)', async () => {
      const chevron = trigger.querySelector('svg') as SVGElement
      await expect(getComputedStyle(chevron).fill).toBe(
        colorOf('text-secondary', trigger),
      )
    })

    await step('selects an option with the pointer', async () => {
      await userEvent.click(trigger)
      const listbox = await page.findByRole('listbox')
      // It fades in (only fades, with reduced motion): wait for it.
      await waitFor(() => expect(listbox).toBeVisible())
      await userEvent.click(page.getByRole('option', { name: 'Banana' }))
      await waitFor(() =>
        expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveTextContent('Banana')
      await expect(trigger).toHaveFocus()
    })

    await step('selects an option with the keyboard', async () => {
      await userEvent.keyboard('{Enter}')
      await waitFor(() =>
        expect(page.getByRole('option', { name: 'Banana' })).toHaveFocus(),
      )
      await userEvent.keyboard('{ArrowDown}')
      await expect(
        page.getByRole('option', { name: 'Blueberry' }),
      ).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await waitFor(() =>
        expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
      )
      await expect(trigger).toHaveTextContent('Blueberry')
    })
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]" aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]" aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithDisabledOption: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]" aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
          <SelectItem disabled value="disabled">
            Disabled
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/**
 * A list longer than the menu scrolls with the kit's scrollbar
 * (`scrollbar-snow`), which Radix would hide, and keeps the scroll buttons.
 */
export const Scrollable: Story = {
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Timezone' }))
    const listbox = await page.findByRole('listbox')
    await waitFor(() => expect(listbox).toBeVisible())

    await step('the list scrolls, with the kit scrollbar', async () => {
      const viewport = listbox.querySelector(
        '[data-radix-select-viewport]',
      ) as HTMLElement
      await expect(viewport).toHaveClass('scrollbar-snow')
      await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
      // Radix sets `scrollbar-width: none`. Chrome, Edge and Safari draw
      // the utility's thumb with `auto`, Firefox its thin scrollbar.
      // Headless Firefox hides every scrollbar (`none` on any element):
      // nothing to compare there.
      const { scrollbarWidth } = getComputedStyle(viewport)
      const probe = document.createElement('div')
      document.body.append(probe)
      const allHidden = getComputedStyle(probe).scrollbarWidth === 'none'
      probe.remove()
      if (scrollbarWidth !== undefined && !allHidden) {
        await expect(scrollbarWidth).toBe(
          CSS.supports('selector(::-webkit-scrollbar)') ? 'auto' : 'thin',
        )
      }
    })

    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
    )
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]" aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
          <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
          <SelectItem value="west">
            Western European Summer Time (WEST)
          </SelectItem>
          <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
          <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
          <SelectItem value="ist_indonesia">
            Indonesia Central Standard Time (WITA)
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          <SelectItem value="awst">
            Australian Western Standard Time (AWST)
          </SelectItem>
          <SelectItem value="acst">
            Australian Central Standard Time (ACST)
          </SelectItem>
          <SelectItem value="aest">
            Australian Eastern Standard Time (AEST)
          </SelectItem>
          <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
          <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="art">Argentina Time (ART)</SelectItem>
          <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
          <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
          <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/** The Figma select pattern: the Input field and the Popover menu, open. */
export const Open: Story = {
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [
          {
            // False positive: while the listbox is open, Radix hides the rest
            // of the page with aria-hidden and traps focus in the listbox
            // (FocusScope), so the trigger inside the hidden page can't be
            // focused. axe sees a focusable button under aria-hidden but not
            // the focus trap. The closed Select passes this rule.
            id: 'aria-hidden-focus',
            enabled: false,
          },
        ],
      },
    },
  },
  render: () => (
    <div className="h-80">
      <Select defaultOpen defaultValue="banana">
        <SelectTrigger className="w-[240px]" aria-label="Fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (no Figma state). The trigger gets the red Input stroke, also while the list is open. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]" aria-label="Fruit" aria-invalid>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' })

    await expect(trigger).toBeInvalid()
    await expect(
      await hasInsetRing(trigger, 'text-control-border-invalid', '1px'),
    ).toBe(true)
  },
}

/**
 * `title` on `SelectTrigger`: the Figma "2 row" field of a form, the title
 * inside the field above the value. It names the trigger.
 */
export const WithTitle: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-4">
      <Select defaultValue="gpt-4">
        <SelectTrigger title="Model">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4">GPT-4</SelectItem>
          <SelectItem value="claude">Claude</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger title="Country">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="fr">France</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('combobox', { name: 'Model' }),
    ).toHaveTextContent('GPT-4')
    await expect(
      canvas.getByRole('combobox', { name: 'Country' }),
    ).toHaveTextContent('Select a country')
  },
}
