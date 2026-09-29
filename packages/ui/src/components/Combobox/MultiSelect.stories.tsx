import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, useState } from 'react'
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
import type { ComboboxOption } from './listbox'
import { MultiSelect } from './MultiSelect'

const skills: ComboboxOption[] = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript', keywords: ['ts'] },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'figma', label: 'Figma' },
  { value: 'node', label: 'Node.js' },
  { value: 'rust', label: 'Rust' },
  { value: 'cobol', label: 'COBOL', disabled: true },
]

/** A MultiSelect with a visible `Label`, as in a form. */
const Labelled = ({
  label = 'Skills',
  ...props
}: Parameters<typeof MultiSelect>[0] & { label?: string }) => {
  const id = useId()
  return (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <MultiSelect id={id} {...props} />
    </div>
  )
}

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs', 'a11y'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25559-12043',
    },
    docs: {
      description: {
        component:
          'A Combobox that picks several options, shown as removable Tags in the field. The list stays open while the user picks: Enter or a click toggles the highlighted option (`aria-multiselectable`), Backspace in the empty field removes the last tag, and each tag has a remove button.',
      },
    },
  },
  args: {
    options: skills,
    placeholder: 'Add skills',
    onValueChange: fn(),
  },
  render: (args) => <Labelled {...args} />,
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Skills' })

    await step('Enter toggles options and keeps the list open', async () => {
      await userEvent.click(field)
      const listbox = await page.findByRole('listbox', { name: 'Skills' })
      await expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
      await userEvent.keyboard('{ArrowDown}{Enter}')
      await userEvent.keyboard('type')
      await userEvent.keyboard('{Enter}')
      await expect(args.onValueChange).toHaveBeenLastCalledWith([
        'react',
        'typescript',
      ])
      await expect(field).toHaveValue('')
      await expect(page.getByRole('listbox')).toBeVisible()
      await expect(page.getByRole('option', { name: 'React' })).toHaveAttribute(
        'aria-selected',
        'true',
      )
      await expect(page.getByRole('option', { name: 'Figma' })).toHaveAttribute(
        'aria-selected',
        'false',
      )
    })

    await step('the tags describe the field', async () => {
      await expect(canvas.getByText('React')).toBeVisible()
      await expect(field).toHaveAccessibleDescription(
        'Selected: React, TypeScript',
      )
    })

    await step('Enter on a picked option removes it', async () => {
      await userEvent.keyboard('{Enter}')
      await expect(args.onValueChange).toHaveBeenLastCalledWith(['react'])
    })

    await step(
      'Backspace in the empty field removes the last tag',
      async () => {
        await userEvent.keyboard('{Escape}')
        await waitFor(() =>
          expect(page.queryByRole('listbox')).not.toBeInTheDocument(),
        )
        await userEvent.keyboard('{Backspace}')
        await expect(args.onValueChange).toHaveBeenLastCalledWith([])
        await expect(canvas.getByRole('status')).toHaveTextContent(
          'React removed',
        )
      },
    )

    await step('a tag’s remove button removes it', async () => {
      await userEvent.click(field)
      await userEvent.click(await page.findByRole('option', { name: 'Figma' }))
      await userEvent.click(await page.findByRole('option', { name: 'Rust' }))
      await userEvent.click(
        canvas.getByRole('button', { name: 'Remove tag Figma' }),
      )
      await expect(args.onValueChange).toHaveBeenLastCalledWith(['rust'])
      await expect(field).toHaveFocus()
      await userEvent.tab()
    })
  },
}

/** Picked tags and the list, open. */
export const Open: Story = {
  args: { defaultOpen: true, defaultValue: ['react', 'figma'] },
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="h-[26rem]">
      <Labelled {...args} />
    </div>
  ),
}

export const OpenDark: Story = {
  ...Open,
  globals: { theme: 'dark' },
}

/** Many tags wrap onto more lines; the field grows. */
export const ManyValues: Story = {
  args: {
    defaultValue: ['react', 'typescript', 'tailwind', 'figma', 'node', 'rust'],
  },
}

/** `creatable`: the query becomes a new tag ("Create"). */
export const Creatable: Story = {
  args: { placeholder: 'Add labels' },
  render: (args) => {
    const [options, setOptions] = useState<ComboboxOption[]>([
      { value: 'bug', label: 'bug' },
      { value: 'feature', label: 'feature' },
    ])
    return (
      <Labelled
        {...args}
        label="Labels"
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
    const field = canvas.getByRole('combobox', { name: 'Labels' })
    await userEvent.click(field)
    await userEvent.keyboard('urgent')
    await page.findByRole('option', { name: 'Create "urgent"' })
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['urgent'])
    await expect(
      await page.findByRole('option', { name: 'urgent' }),
    ).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Escape}')
  },
}

/** Default, read-only (the Figma "Static"), invalid and disabled fields. */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Labelled {...args} label="Default" />
      <Labelled
        {...args}
        label="Static"
        defaultValue={['react', 'figma']}
        readOnly
      />
      <Labelled {...args} label="Invalid" aria-invalid />
      <Labelled {...args} label="Disabled" defaultValue={['react']} disabled />
    </div>
  ),
}

/** Right-to-left text: the tags flow from the right. */
export const RTL: Story = {
  globals: { dir: 'rtl' },
  args: {
    options: [
      { value: 'apple', label: 'تفاح' },
      { value: 'banana', label: 'موز' },
      { value: 'grapes', label: 'عنب' },
    ],
    placeholder: 'اختر',
    defaultValue: ['apple', 'banana'],
  },
  render: (args) => <Labelled label="فواكه" {...args} />,
  play: async ({ canvas }) => {
    const first = canvas.getByText('تفاح')
    const second = canvas.getByText('موز')
    await expect(first.getBoundingClientRect().left).toBeGreaterThan(
      second.getBoundingClientRect().left,
    )
  },
}

const formSchema = z.object({
  skills: z.array(z.string()).min(2, 'Pick at least two skills.'),
})

const FormExample = () => {
  const [submitted, setSubmitted] = useState<string[]>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { skills: [] },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => setSubmitted(values.skills))}
        className="flex w-80 flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <MultiSelect
                  options={skills}
                  placeholder="Add skills"
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>
                Pick the ones you use every week.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="filled" type="submit" label="Save" />
        {submitted && (
          <Typography size={12} className="text-secondary">
            Saved: {submitted.join(', ')}
          </Typography>
        )}
      </form>
    </Form>
  )
}

/** With react-hook-form: `value` / `onValueChange`, and `ref` for focus on errors. */
export const InForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    const page = within(canvasElement.ownerDocument.body)
    const field = canvas.getByRole('combobox', { name: 'Skills' })

    await step('too few shows the error and focuses the field', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
      await expect(
        await canvas.findByText('Pick at least two skills.'),
      ).toBeVisible()
      await expect(field).toHaveAttribute('aria-invalid', 'true')
      await expect(field).toHaveFocus()
    })

    await step('picking two fixes it', async () => {
      await userEvent.keyboard('{ArrowDown}')
      await page.findByRole('listbox')
      await userEvent.keyboard('{Enter}{ArrowDown}{Enter}{Escape}')
      await waitFor(() =>
        expect(field).toHaveAttribute('aria-invalid', 'false'),
      )
      await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
      await expect(
        await canvas.findByText('Saved: react, typescript'),
      ).toBeVisible()
    })
  },
}
