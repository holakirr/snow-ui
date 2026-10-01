import {
  ArrowLineUpDownIcon,
  SearchIcon,
  XCircleIcon,
} from '@holakirr/snow-ui-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState } from 'react'
import { expect, waitFor } from 'storybook/test'
import { colorOf, hasInsetRing, hasMoreContrast } from '../../test/colors'
import { settleLayout } from '../../test/layout'
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

/**
 * The kit's clear button (`clearable`, added in 5.2): a 16px `XCircle` at
 * the end of a focused field with a value. It is a button (Tab reaches it,
 * Enter or Space clears), named by `messages.input.clear`; clearing fires
 * `onChange` with an empty value and puts the focus back in the input. The
 * story ends on the kit's Focus state: the first field focused, with a value.
 */
export const Clearable: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input aria-label="Name" defaultValue="Ada Lovelace" clearable />
      <Input title="Email" defaultValue="ada@example.com" clearable />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const name = canvas.getByRole('textbox', { name: 'Name' })
    const email = canvas.getByRole('textbox', { name: 'Email' })
    const clearOf = (input: HTMLElement) =>
      input
        .closest('[data-slot="input"]')
        ?.querySelector('[data-slot="input-clear"]') as HTMLElement | null
    await settleLayout(canvasElement)

    await step('hidden while the field is not focused', async () => {
      for (const input of [name, email]) {
        await expect(
          getComputedStyle(clearOf(input) as HTMLElement).display,
        ).toBe('none')
      }
    })

    await step('shown on focus: 16px, Black/100%, at the end', async () => {
      await userEvent.click(email)
      const button = clearOf(email) as HTMLElement
      const field = email.closest('[data-slot="input"]') as HTMLElement
      await expect(button).toBeVisible()
      await expect(button).toHaveAccessibleName('Clear')
      const box = field.getBoundingClientRect()
      const icon = button.getBoundingClientRect()
      await expect(icon.width).toBe(16)
      await expect(icon.height).toBe(16)
      await expect(box.right - icon.right).toBe(16)
      await expect(icon.top - box.top).toBe(box.bottom - icon.bottom)
      await expect(getComputedStyle(button).color).toBe(
        colorOf('text-black', field),
      )
    })

    await step('a click clears and keeps the focus in the input', async () => {
      await userEvent.click(clearOf(email) as HTMLElement)
      await expect(email).toHaveValue('')
      await expect(email).toHaveFocus()
      await expect(clearOf(email)).toBeNull()
    })

    await step('Tab reaches it, Enter clears', async () => {
      await userEvent.click(name)
      await userEvent.tab()
      await expect(clearOf(name)).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect(name).toHaveValue('')
      await expect(name).toHaveFocus()
    })

    await step('it comes back with a value', async () => {
      await userEvent.type(name, 'Ada Lovelace')
      await expect(clearOf(name)).toBeVisible()
    })
  },
}

/**
 * Right-to-left text: the clear button and the kit's Error and Done icons
 * are at the end of the field, on the left, 16px from the edge.
 */
export const EndIconsRTL: Story = {
  globals: { dir: 'rtl' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input aria-label="الاسم" defaultValue="آدا" clearable />
      <Input title="البريد" defaultValue="ada@" aria-invalid />
      <Input aria-label="المدينة" defaultValue="مدريد" status="success" />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const leftGap = (input: HTMLElement, slot: string) => {
      const field = input.closest('[data-slot="input"]') as HTMLElement
      const icon = field.querySelector(`[data-slot="${slot}"]`) as HTMLElement
      const { left, right } = icon.getBoundingClientRect()
      return {
        gap: left - field.getBoundingClientRect().left,
        beforeInput: right <= input.getBoundingClientRect().left,
      }
    }
    await settleLayout(canvasElement)
    const name = canvas.getByRole('textbox', { name: 'الاسم' })
    // Ends focused, so the screenshot shows the clear button.
    await userEvent.click(name)
    await expect(leftGap(name, 'input-clear')).toEqual({
      gap: 16,
      beforeInput: true,
    })
    await expect(
      leftGap(canvas.getByLabelText('البريد'), 'input-invalid-icon'),
    ).toEqual({ gap: 16, beforeInput: true })
    await expect(
      leftGap(canvas.getByLabelText('المدينة'), 'input-status-icon'),
    ).toEqual({ gap: 16, beforeInput: true })
  },
}

// The Done check's colour: Secondary/Green, mixed with 40% of `black` with
// more contrast (as in Input).
const doneColorClasses =
  'text-green contrast-more:text-[color:color-mix(in_srgb,var(--color-green),var(--color-black)_40%)]'

/**
 * The kit's In progress and Done states (`status`, added in 5.2), in the
 * 1 row and 2 row fields: a turning ring in Black/100% (the input is
 * `aria-busy`), or a check in Secondary/Green, 16px at the end of the field.
 */
export const Status: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input aria-label="Username" defaultValue="ada" status="progress" />
      <Input aria-label="Nickname" defaultValue="ada" status="success" />
      <Input title="Email" defaultValue="ada@example.com" status="progress" />
      <Input title="Website" defaultValue="ada.dev" status="success" />
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    await settleLayout(canvasElement)
    for (const [name, status] of [
      ['Username', 'progress'],
      ['Nickname', 'success'],
      ['Email', 'progress'],
      ['Website', 'success'],
    ] as const) {
      await step(`${name}: ${status}`, async () => {
        const input = canvas.getByLabelText(name)
        const field = input.closest('[data-slot="input"]') as HTMLElement
        const icon = field.querySelector(
          '[data-slot="input-status-icon"]',
        ) as HTMLElement
        const box = field.getBoundingClientRect()
        const glyph = icon.getBoundingClientRect()
        await expect(icon).toHaveAttribute('data-status', status)
        await expect(glyph.width).toBe(16)
        await expect(glyph.height).toBe(16)
        await expect(box.right - glyph.right).toBe(16)
        await expect(glyph.top - box.top).toBe(box.bottom - glyph.bottom)
        await expect(getComputedStyle(icon).color).toBe(
          colorOf(
            status === 'progress' ? 'text-black' : doneColorClasses,
            field,
          ),
        )
        if (status === 'progress') {
          await expect(input).toHaveAttribute('aria-busy', 'true')
        } else {
          await expect(input).not.toHaveAttribute('aria-busy')
        }
      })
    }
  },
}

/**
 * The end of the field with several states at once: the end content, then
 * the status icon, the clear button and the Error icon. The kit draws one at
 * a time, each 16px from the end; in this order each keeps that place in
 * its own state, the Warning stays at the edge, and a field shows one status
 * mark: In progress hides the Warning while the value is checked again, and
 * an invalid field hides the Done check. The story ends with the last field
 * focused: the ring, then the clear button.
 */
export const CombinedStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        aria-label="Checked again"
        defaultValue="ada"
        aria-invalid
        status="progress"
      />
      <Input
        aria-label="Invalid and done"
        defaultValue="ada"
        aria-invalid
        status="success"
      />
      <Input
        aria-label="Invalid with content"
        defaultValue="ada"
        aria-invalid
        clearable
        endContent={<ArrowLineUpDownIcon />}
      />
      <Input
        title="Everything"
        defaultValue="ada"
        aria-invalid
        status="progress"
        clearable
        endContent={<ArrowLineUpDownIcon />}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    // The shown parts at the end of the field, in order, with their boxes.
    const endParts = (name: string) => {
      const input = canvas.getByLabelText(name)
      const field = input.closest('[data-slot="input"]') as HTMLElement
      const parts = Array.from(field.children)
        .slice(1)
        .filter(
          (part) =>
            getComputedStyle(part).display !== 'none' &&
            !part.classList.contains('sr-only'),
        ) as HTMLElement[]
      return {
        field,
        slots: parts.map(
          (part) =>
            part.getAttribute('data-status') ??
            part.getAttribute('data-slot') ??
            'end-content',
        ),
        boxes: parts.map((part) => part.getBoundingClientRect()),
      }
    }
    const expectEnd = async (name: string, slots: string[]) => {
      const { field, slots: shown, boxes } = endParts(name)
      await expect(shown).toEqual(slots)
      // 8px apart, never overlapping, the last one 16px from the end.
      for (let i = 1; i < boxes.length; i++) {
        await expect(boxes[i].left - boxes[i - 1].right).toBe(8)
      }
      await expect(
        field.getBoundingClientRect().right - (boxes.at(-1)?.right ?? 0),
      ).toBe(16)
    }
    await settleLayout(canvasElement)

    await step('In progress hides the Warning', () =>
      expectEnd('Checked again', ['progress']),
    )
    await step('an invalid field hides the Done check', () =>
      expectEnd('Invalid and done', ['input-invalid-icon']),
    )
    await step('the clear button comes before the Warning', async () => {
      await expectEnd('Invalid with content', [
        'end-content',
        'input-invalid-icon',
      ])
      await userEvent.click(canvas.getByLabelText('Invalid with content'))
      await expectEnd('Invalid with content', [
        'end-content',
        'input-clear',
        'input-invalid-icon',
      ])
    })
    await step('end content, status, clear button', async () => {
      await userEvent.click(canvas.getByLabelText('Everything'))
      await expectEnd('Everything', ['end-content', 'progress', 'input-clear'])
    })
  },
}

const takenNames = ['admin', 'ada']

/** A username field that checks the value when it loses focus. */
const UsernameCheck = () => {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'progress' | 'success'>()
  const [error, setError] = useState('')
  // The pending check: cancelled when the value changes or on unmount, so a
  // stale result never overwrites the status of a newer value.
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const check = () => {
    if (!value) return
    setError('')
    setStatus('progress')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const taken = takenNames.includes(value.toLowerCase())
      setStatus(taken ? undefined : 'success')
      setError(taken ? 'This username is taken.' : '')
    }, 400)
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        title="Username"
        value={value}
        onChange={(event) => {
          window.clearTimeout(timer.current)
          setValue(event.target.value)
          setStatus(undefined)
        }}
        onBlur={check}
        status={status}
        statusLabel={
          status === 'success' ? 'Username available' : 'Checking the username'
        }
        aria-invalid={!!error}
        aria-describedby={error ? 'username-error' : undefined}
      />
      {error && (
        <p id="username-error" role="alert" className="text-12 text-red-text">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * The kit's rule: "some forms need to check what you enter; the check will
 * occur when the form loses focus". Leaving the field shows In progress,
 * then Done, or the Error icon with a message for a taken name ("ada"). The
 * status region announces "Checking the username", then "Username
 * available" (`statusLabel`).
 */
export const CheckOnBlur: Story = {
  tags: ['skip-visual'],
  render: () => <UsernameCheck />,
  play: async ({ canvas, userEvent, step }) => {
    const input = canvas.getByLabelText('Username')
    const region = () =>
      input
        .closest('[data-slot="input"]')
        ?.querySelector('[role="status"]') as HTMLElement | null

    await step('an available name: In progress, then Done', async () => {
      await userEvent.type(input, 'lovelace')
      await userEvent.tab()
      await waitFor(() =>
        expect(region()).toHaveTextContent('Checking the username'),
      )
      await expect(input).toHaveAttribute('aria-busy', 'true')
      await waitFor(() =>
        expect(region()).toHaveTextContent('Username available'),
      )
      await expect(input).not.toHaveAttribute('aria-busy')
    })

    await step('a taken name: the Error icon and the message', async () => {
      await userEvent.clear(input)
      await userEvent.type(input, 'ada')
      await userEvent.tab()
      await waitFor(() => expect(input).toBeInvalid())
      await expect(input).toHaveAccessibleDescription('This username is taken.')
      await expect(region()).toBeNull()
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
