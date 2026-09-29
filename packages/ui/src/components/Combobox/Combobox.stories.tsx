import { SearchIcon } from '@holakirr/snow-ui-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { expect, fn, waitFor, within } from 'storybook/test'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../react-hook-form'
import { Button } from '../Button'
import { Label } from '../Label'
import { Typography } from '../Text'
import { Combobox } from './Combobox'
import type { ComboboxOption, ComboboxOptionGroup } from './listbox'

const fruits: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'durian', label: 'Durian', disabled: true },
]

const timezones: ComboboxOptionGroup[] = [
  {
    label: 'Europe',
    options: [
      { value: 'Europe/London', label: 'London (GMT)', keywords: ['uk'] },
      { value: 'Europe/Paris', label: 'Paris (CET)', keywords: ['france'] },
      { value: 'Europe/Madrid', label: 'Madrid (CET)', keywords: ['spain'] },
      { value: 'Europe/Moscow', label: 'Moscow (MSK)', keywords: ['russia'] },
    ],
  },
  {
    label: 'Americas',
    options: [
      {
        value: 'America/New_York',
        label: 'New York (EST)',
        keywords: ['usa'],
      },
      { value: 'America/Chicago', label: 'Chicago (CST)', keywords: ['usa'] },
      {
        value: 'America/Los_Angeles',
        label: 'Los Angeles (PST)',
        keywords: ['usa'],
      },
      { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    ],
  },
  {
    label: 'Asia',
    options: [
      { value: 'Asia/Tokyo', label: 'Tokyo (JST)', keywords: ['japan'] },
      { value: 'Asia/Kolkata', label: 'Kolkata (IST)', keywords: ['india'] },
      { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    ],
  },
]

/** A Combobox with a visible `Label`, as in a form. */
const Labelled = ({
  label = 'Fruit',
  ...props
}: Parameters<typeof Combobox>[0] & { label?: string }) => {
  const id = useId()
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Combobox id={id} {...props} />
    </div>
  )
}

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs', 'a11y'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25559-12043',
    },
    docs: {
      description: {
        component:
          'A text field with a list of options that filters as the user types: the WAI-ARIA combobox with a listbox popup, in the look of the Figma Input and the Select menu. ↓ / ↑ open the list and move the highlight, Enter or a click selects, Escape closes the list (and clears the field while it is closed). Focus stays in the field; the highlighted option is its `aria-activedescendant`.',
      },
    },
  },
  args: {
    options: fruits,
    placeholder: 'Pick a fruit',
    onValueChange: fn(),
  },
  render: (args) => <Labelled {...args} />,
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Fruit' })
    await expect(field).toHaveAttribute('aria-expanded', 'false')

    await step(
      'typing opens the list, filters it and highlights the first match',
      async () => {
        await userEvent.click(field)
        await userEvent.clear(field)
        await userEvent.keyboard('b')
        const listbox = await page.findByRole('listbox', { name: 'Fruit' })
        await expect(field).toHaveAttribute('aria-expanded', 'true')
        await expect(field).toHaveAttribute('aria-controls', listbox.id)
        const options = within(listbox).getAllByRole('option')
        await expect(options.map((option) => option.textContent)).toEqual([
          'Banana',
          'Blueberry',
        ])
        await expect(field).toHaveAttribute(
          'aria-activedescendant',
          options[0]?.id,
        )
      },
    )

    await step('↓ moves the highlight, Enter selects and closes', async () => {
      await userEvent.keyboard('{ArrowDown}')
      const blueberry = page.getByRole('option', { name: 'Blueberry' })
      await expect(field).toHaveAttribute('aria-activedescendant', blueberry.id)
      await userEvent.keyboard('{Enter}')
      await expect(args.onValueChange).toHaveBeenLastCalledWith('blueberry')
      await waitFor(() =>
        expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
      )
      await expect(field).toHaveValue('Blueberry')
      await expect(field).toHaveFocus()
    })

    await step('↓ opens the list on the selected option', async () => {
      await userEvent.keyboard('{ArrowDown}')
      const blueberry = await page.findByRole('option', { name: 'Blueberry' })
      await expect(blueberry).toHaveAttribute('aria-selected', 'true')
      await expect(field).toHaveAttribute('aria-activedescendant', blueberry.id)
      // Every option shows again, the disabled one too.
      await expect(page.getAllByRole('option')).toHaveLength(6)
      await expect(
        page.getByRole('option', { name: 'Durian' }),
      ).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Escape closes the list, then clears the field', async () => {
      await userEvent.keyboard('{Escape}')
      await waitFor(() =>
        expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
      )
      await expect(field).toHaveValue('Blueberry')
      await userEvent.keyboard('{Escape}')
      await expect(field).toHaveValue('')
      await expect(args.onValueChange).toHaveBeenLastCalledWith(null)
    })

    await step('a click opens the list and selects', async () => {
      await userEvent.click(field)
      await userEvent.click(await page.findByRole('option', { name: 'Grapes' }))
      await expect(field).toHaveValue('Grapes')
      await waitFor(() =>
        expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
      )
    })

    await step('the clear button clears it', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Clear' }))
      await expect(field).toHaveValue('')
      await expect(field).toHaveFocus()
      await userEvent.tab()
    })
  },
}

/** Options in titled groups; the default filter also matches `keywords`. */
export const Grouped: Story = {
  args: {
    options: timezones,
    placeholder: 'Search time zones',
    defaultValue: 'Europe/Madrid',
  },
  render: (args) => <Labelled label="Time zone" {...args} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Time zone' })
    await expect(field).toHaveValue('Madrid (CET)')

    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.keyboard('usa')
    const americas = await page.findByRole('group', { name: 'Americas' })
    await expect(within(americas).getAllByRole('option')).toHaveLength(3)
    await expect(
      page.queryByRole('group', { name: 'Europe' }),
    ).not.toBeInTheDocument()

    // Leaving the field drops the query and keeps the value.
    await userEvent.tab()
    await waitFor(() =>
      expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
    )
    await expect(field).toHaveValue('Madrid (CET)')
  },
}

/** The Figma field with the Select menu, open on the selected option. */
export const Open: Story = {
  args: { defaultOpen: true, defaultValue: 'banana' },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-96">
      <Labelled {...args} />
    </div>
  ),
}

export const OpenDark: Story = {
  ...Open,
  globals: { theme: 'dark' },
}

/** `options` in groups, open. */
export const GroupedOpen: Story = {
  args: {
    options: timezones,
    defaultOpen: true,
    defaultValue: 'Europe/Paris',
  },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-[26rem]">
      <Labelled label="Time zone" {...args} />
    </div>
  ),
}

/** Nothing matches: the empty message (`emptyMessage`). */
export const Empty: Story = {
  args: { options: [], defaultOpen: true },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-40">
      <Labelled {...args} />
    </div>
  ),
}

/** `loading`: a spinner in the field and "Loading" in the list. */
export const Loading: Story = {
  args: { options: [], defaultOpen: true, loading: true },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-40">
      <Labelled label="Person" {...args} />
    </div>
  ),
}

const people = [
  'Natali Craig',
  'Drew Cano',
  'Andi Lane',
  'Koray Okumus',
  'Kate Morrison',
  'Melody Macy',
]

/**
 * Results from a server: `filter={false}` shows `options` as they are,
 * `onQueryChange` reports the text to search for, `loading` shows the spinner.
 */
export const AsyncResults: Story = {
  args: { placeholder: 'Search people' },
  render: (args) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<ComboboxOption[]>([])
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState<string | null>(null)

    useEffect(() => {
      setLoading(true)
      const timer = setTimeout(() => {
        setResults(
          people
            .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
            .map((name) => ({ value: name, label: name })),
        )
        setLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }, [query])

    return (
      <div className="flex flex-col gap-2">
        <Labelled
          {...args}
          label="Assignee"
          options={results}
          filter={false}
          loading={loading}
          onQueryChange={setQuery}
          value={value}
          onValueChange={setValue}
        />
        <Typography size={12} className="text-secondary">
          Assignee: {value ?? 'nobody'}
        </Typography>
      </div>
    )
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Assignee' })
    await userEvent.click(field)
    await userEvent.keyboard('an')
    await waitFor(() =>
      expect(page.getByRole('listbox')).not.toHaveAttribute('aria-busy'),
    )
    await expect(
      page.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['Drew Cano', 'Andi Lane'])
    await userEvent.keyboard('{Enter}')
    await expect(field).toHaveValue('Drew Cano')
    await expect(canvas.getByText('Assignee: Drew Cano')).toBeVisible()
  },
}

/** `creatable`: the query becomes a new option ("Create"). */
export const Creatable: Story = {
  args: { placeholder: 'Pick or create a label' },
  render: (args) => {
    const [options, setOptions] = useState<ComboboxOption[]>([
      { value: 'bug', label: 'bug' },
      { value: 'feature', label: 'feature' },
      { value: 'docs', label: 'docs' },
    ])
    return (
      <Labelled
        {...args}
        label="Label"
        options={options}
        creatable
        onCreate={(query) =>
          setOptions((current) => [...current, { value: query, label: query }])
        }
      />
    )
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Label' })
    await userEvent.click(field)
    await userEvent.keyboard('design')
    const create = await page.findByRole('option', {
      name: 'Create "design"',
    })
    await expect(field).toHaveAttribute('aria-activedescendant', create.id)
    await userEvent.keyboard('{Enter}')
    await expect(field).toHaveValue('design')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('design')

    // The new option is in the list now.
    await userEvent.keyboard('{ArrowDown}')
    await expect(
      await page.findByRole('option', { name: 'design' }),
    ).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Escape}')
  },
}

/** Icons in the options and at the start of the field (`startContent`). */
export const WithIcons: Story = {
  args: {
    options: timezones,
    placeholder: 'Search time zones',
    startContent: <SearchIcon />,
    clearable: false,
  },
  render: (args) => <Labelled label="Time zone" {...args} />,
}

/** Default, read-only (the Figma "Static"), invalid and disabled fields. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Labelled {...args} label="Default" />
      <Labelled {...args} label="Static" defaultValue="apple" readOnly />
      <Labelled {...args} label="Invalid" aria-invalid />
      <Labelled {...args} label="Disabled" defaultValue="apple" disabled />
    </div>
  ),
}

/**
 * Right-to-left text: the icons and the check marks swap sides and the text
 * starts on the right.
 */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  args: {
    options: [
      { value: 'apple', label: 'تفاح' },
      { value: 'banana', label: 'موز' },
      { value: 'grapes', label: 'عنب' },
    ],
    placeholder: 'اختر فاكهة',
    defaultValue: 'banana',
    defaultOpen: true,
  },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-72">
      <Labelled label="فاكهة" {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'فاكهة' })
    await expect(getComputedStyle(field).direction).toBe('rtl')
    // The clear button (at the end of the field) is on the left.
    const clear = canvas.getByRole('button', { name: 'Clear' })
    await expect(clear.getBoundingClientRect().right).toBeLessThanOrEqual(
      field.getBoundingClientRect().left,
    )
    const option = await page.findByRole('option', { name: 'موز' })
    const check = option.querySelector('svg') as SVGElement
    await expect(check.getBoundingClientRect().left).toBeLessThan(
      option.getBoundingClientRect().left + 40,
    )
  },
}

const formSchema = z.object({
  fruit: z.string({ error: 'Pick a fruit.' }).min(1, 'Pick a fruit.'),
})

const FormExample = () => {
  const [submitted, setSubmitted] = useState<string>()
  const form = useForm<
    z.input<typeof formSchema>,
    unknown,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => setSubmitted(values.fruit))}
        className="flex w-72 flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="fruit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fruit</FormLabel>
              <FormControl>
                <Combobox
                  options={fruits}
                  placeholder="Pick a fruit"
                  value={field.value ?? null}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>We ship it tomorrow.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="filled" type="submit" label="Order" />
        {submitted && (
          <Typography size={12} className="text-secondary">
            Ordered: {submitted}
          </Typography>
        )}
      </form>
    </Form>
  )
}

/**
 * With react-hook-form (`@holakirr/snow-ui/react-hook-form`): `value` and
 * `onValueChange` bind the field, `ref` lets the form focus it on an error,
 * and `FormControl` sets its `id`, `aria-invalid` and `aria-describedby`.
 */
export const InForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Fruit' })

    await step(
      'submitting it empty shows the error and focuses it',
      async () => {
        await userEvent.click(canvas.getByRole('button', { name: 'Order' }))
        await expect(await canvas.findByText('Pick a fruit.')).toBeVisible()
        await expect(field).toHaveAttribute('aria-invalid', 'true')
        await expect(field).toHaveAccessibleDescription(
          expect.stringContaining('Pick a fruit.'),
        )
        await expect(field).toHaveFocus()
        await expect(field.closest('[data-slot="combobox"]')).toHaveAttribute(
          'data-invalid',
        )
      },
    )

    await step('picking an option clears it and submits', async () => {
      await userEvent.keyboard('ban')
      await page.findByRole('option', { name: 'Banana' })
      await userEvent.keyboard('{Enter}')
      await waitFor(() =>
        expect(field).toHaveAttribute('aria-invalid', 'false'),
      )
      await userEvent.click(canvas.getByRole('button', { name: 'Order' }))
      await expect(await canvas.findByText('Ordered: banana')).toBeVisible()
    })
  },
}
