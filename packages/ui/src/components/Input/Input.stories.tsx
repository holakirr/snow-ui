import {
  ArrowLineUpDownIcon,
  SearchIcon,
  XCircleIcon,
} from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { hasInsetRing, hasMoreContrast } from '../../test/colors'
import { Combobox, MultiSelect } from '../Combobox'
import { Search } from '../Search'
import { KBD } from '../Text'
import { Input } from './Input'
import { InputSmall } from './InputSmall'
import { Textarea } from './Textarea'

const meta: Meta<typeof Input> = {
  title: 'Components/Input/Input',
  component: Input,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33319-47513',
    },
  },
  tags: ['autodocs'],
  args: {
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

/** Figma "1 row". */
export const Default: Story = {
  args: {
    placeholder: 'Placeholder text',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    placeholder: 'Input with value',
    defaultValue: 'Initial value',
  },
}

/** Figma "Static": read-only, the stroke doesn't react to hover or focus. */
export const Static: Story = {
  args: {
    title: 'Title',
    defaultValue: 'Read-only value',
    readOnly: true,
  },
}

export const WithCustomClass: Story = {
  args: {
    placeholder: 'Custom class',
    className: 'inset-ring-red',
  },
}

/** Figma "2 row vertical": a static title above the value. */
export const WithTitle: Story = {
  args: {
    placeholder: 'Input with title',
    title: 'Title',
  },
}

/**
 * Figma "2 row horizontal": the title at the start of the one 44px row, the
 * value at the end.
 */
export const WithHorizontalTitle: Story = {
  args: {
    title: 'Title',
    titleLayout: 'horizontal',
    defaultValue: 'Text',
    className: 'w-60',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Title')
    const title = canvas.getByText('Title')
    const field = input.closest('[data-slot="input"]') as HTMLElement

    await expect(field.getBoundingClientRect().height).toBe(44)
    // One row: the title and the value share it, the value at the end.
    await expect(title.getBoundingClientRect().right).toBeLessThan(
      input.getBoundingClientRect().left + 1,
    )
    await expect(getComputedStyle(input).textAlign).toBe('end')
  },
}

/** A long horizontal title is cut at half the row; the value keeps room. */
export const WithLongHorizontalTitle: Story = {
  tags: ['!autodocs'],
  args: {
    title: 'The billing address of the company',
    titleLayout: 'horizontal',
    defaultValue: 'Text',
    className: 'w-60',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('The billing address of the company')
    const field = input.closest('[data-slot="input"]') as HTMLElement

    await expect(field.getBoundingClientRect().height).toBe(44)
    await expect(input.getBoundingClientRect().width).toBeGreaterThan(
      field.getBoundingClientRect().width / 3,
    )
  },
}

export const WithTitleAndValue: Story = {
  args: {
    placeholder: 'Input with title and value',
    title: 'Title',
    defaultValue: 'Initial value',
  },
}

export const WithStartContent: Story = {
  args: {
    placeholder: 'Search',
    startContent: <SearchIcon />,
    endContent: <KBD keys={['/']} variant="border" />,
  },
}

/** A select-style field: the 2-row input with a trailing ArrowLineUpDown. */
export const WithEndContent: Story = {
  args: {
    title: 'Country',
    defaultValue: 'Spain',
    endContent: <ArrowLineUpDownIcon />,
  },
}

/**
 * Right-to-left text: `startContent` is on the right, `endContent` on the
 * left, and the text starts on the right.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        aria-label="بحث"
        placeholder="بحث"
        startContent={<SearchIcon />}
        endContent={<KBD keys={['/']} variant="border" />}
      />
      <Input
        title="البلد"
        defaultValue="إسبانيا"
        endContent={<ArrowLineUpDownIcon />}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox', { name: 'بحث' })
    const shell = field.closest('[data-slot="input"]') as HTMLElement
    const [start, end] = Array.from(shell.children) as HTMLElement[]
    await expect(start.getBoundingClientRect().left).toBeGreaterThan(
      end.getBoundingClientRect().left,
    )
    await expect(getComputedStyle(field).direction).toBe('rtl')
  },
}

/** The Figma Input states (hover and focus the first two fields). */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input placeholder="Text" aria-label="1 row" />
      <Input
        title="Title"
        placeholder="Text"
        endContent={<XCircleIcon />}
        aria-label="2 row"
      />
      <Input title="Static" defaultValue="Text" readOnly />
      <Input title="Disabled" defaultValue="Text" disabled />
    </div>
  ),
}

/**
 * Invalid: `aria-invalid`, which `FormControl` sets while the field has an
 * error (the kit's Error state). A 1px Secondary/Red stroke, also on hover and focus (2px on focus with more contrast), and the kit's 16px `Warning` icon at the end, in Secondary/Red. Pair it with the error text: see Form.
 */
export const Invalid: Story = {
  args: {
    title: 'Email',
    defaultValue: 'name@',
    'aria-invalid': true,
  },
  play: async ({ canvas, userEvent, step }) => {
    const input = canvas.getByLabelText('Email')
    const field = input.closest('[data-slot="input"]') as HTMLElement

    await expect(input).toBeInvalid()
    await expect(
      await hasInsetRing(field, 'text-control-border-invalid', '1px'),
    ).toBe(true)

    await step(
      'the Warning icon shows at the end, in the stroke colour',
      async () => {
        const icon = field.querySelector(
          '[data-slot="input-invalid-icon"]',
        ) as HTMLElement
        await expect(icon).toBeVisible()
        await expect(icon).toHaveAttribute('aria-hidden', 'true')
        await expect(field.lastElementChild).toBe(icon)
        const svg = icon.querySelector('svg') as SVGElement
        await expect(svg.getBoundingClientRect().width).toBe(16)
        const probe = document.createElement('span')
        probe.style.color = 'var(--color-control-border-invalid)'
        field.append(probe)
        await expect(getComputedStyle(icon).color).toBe(
          getComputedStyle(probe).color,
        )
        probe.remove()

        // A valid input hides it.
        input.setAttribute('aria-invalid', 'false')
        await expect(icon).not.toBeVisible()
        input.setAttribute('aria-invalid', 'true')
        await expect(icon).toBeVisible()
      },
    )

    await step('the stroke stays red on focus', async () => {
      await userEvent.click(input)
      // 2px with more contrast: the focus indicator.
      const width = hasMoreContrast(field) ? '2px' : '1px'
      await expect(
        await hasInsetRing(field, 'text-control-border-invalid', width),
      ).toBe(true)
      await userEvent.tab()
    })
  },
}

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
]

/**
 * Focus with more contrast (`data-contrast="more"` here, or the OS's
 * `prefers-contrast: more`): every text field's focus stroke is 2px, in
 * `control-border-strong` (Black/80%), `control-border` when read-only. Its
 * inner pixel was the fill, so the focused field differs from the unfocused
 * one by at least 5.59:1 (WCAG 2.4.7, 1.4.11). The standard contrast keeps
 * the Figma 0.5px Black/40% stroke (2.85:1 on the fill).
 */
export const FocusWithMoreContrast: Story = {
  // A behaviour check: the focus states with more contrast.
  tags: ['skip-visual'],
  render: () => (
    <div className="flex gap-8">
      <div data-contrast="standard" className="flex w-64 flex-col gap-4">
        <Input title="Standard" defaultValue="Text" />
      </div>
      <div data-contrast="more" className="flex w-64 flex-col gap-4">
        <Input title="Input" defaultValue="Text" />
        <Input title="Read-only" defaultValue="Text" readOnly />
        <Textarea aria-label="Textarea" defaultValue="Text" />
        <InputSmall aria-label="Gray" defaultValue="Text" />
        <InputSmall
          aria-label="Outline"
          variant="outline"
          defaultValue="Text"
        />
        <Search defaultValue="Text" />
        <Combobox aria-label="Combobox" options={fruits} />
        <MultiSelect aria-label="MultiSelect" options={fruits} />
      </div>
    </div>
  ),
  play: async ({ canvas, userEvent, step }) => {
    const shell = (input: HTMLElement) =>
      input.closest('[data-slot="input"]') as HTMLElement
    const fields: [string, HTMLElement, HTMLElement, string][] = [
      [
        'Input',
        canvas.getByLabelText('Input'),
        shell(canvas.getByLabelText('Input')),
        'text-control-border-strong',
      ],
      [
        'Read-only',
        canvas.getByLabelText('Read-only'),
        shell(canvas.getByLabelText('Read-only')),
        'text-control-border',
      ],
      [
        'Textarea',
        canvas.getByLabelText('Textarea'),
        canvas.getByLabelText('Textarea'),
        'text-control-border-strong',
      ],
      [
        'Gray',
        canvas.getByLabelText('Gray'),
        canvas.getByLabelText('Gray'),
        'text-control-border-strong',
      ],
      [
        'Outline',
        canvas.getByLabelText('Outline'),
        canvas.getByLabelText('Outline'),
        'text-control-border-strong',
      ],
    ]
    const search = canvas.getByRole('searchbox')
    fields.push([
      'Search',
      search,
      search.parentElement as HTMLElement,
      'text-control-border-strong',
    ])
    for (const [name, slot] of [
      ['Combobox', 'combobox'],
      ['MultiSelect', 'multi-select'],
    ]) {
      const input = canvas.getByRole('combobox', { name })
      fields.push([
        name,
        input,
        input.closest(`[data-slot="${slot}"]`) as HTMLElement,
        'text-control-border-strong',
      ])
    }

    for (const [name, input, ring, color] of fields) {
      await step(`${name}: a 2px stroke on focus`, async () => {
        await userEvent.click(input)
        await expect(input).toHaveFocus()
        await expect(await hasInsetRing(ring, color, '2px')).toBe(true)
      })
    }

    await step(
      'the standard contrast keeps the Figma 0.5px stroke',
      async () => {
        const input = canvas.getByLabelText('Standard')
        await userEvent.click(input)
        await expect(
          await hasInsetRing(
            shell(input),
            'text-control-border-strong',
            '0.5px',
          ),
        ).toBe(true)
        await userEvent.tab()
      },
    )
  },
}
