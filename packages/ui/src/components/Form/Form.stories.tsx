import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { expect, waitFor } from 'storybook/test'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '../../react-hook-form'
import { colorOf } from '../../test/colors'
import { Button } from '../Button'
import {
  Checkbox,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Textarea,
} from '../Input'
import { Label } from '../Label'
import * as Plain from './Form'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

const FormExample = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: 'Username',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="snow-ui" title="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="filled" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

const meta: Meta = {
  title: 'Components/Form',
  component: FormExample,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25559-12043',
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const field = canvas.getByLabelText('Username')
    const message = 'Username must be at least 2 characters.'

    await step('an invalid value shows the message on submit', async () => {
      await userEvent.clear(field)
      await userEvent.type(field, 'a')
      await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
      await expect(await canvas.findByText(message)).toBeVisible()
      await expect(field).toHaveAttribute('aria-invalid', 'true')
      await expect(field).toHaveAccessibleDescription(
        expect.stringContaining(message),
      )
      await expect(field).toHaveFocus()
    })

    await step('a valid value clears it', async () => {
      await userEvent.type(field, 'b')
      await waitFor(() =>
        expect(canvas.queryByText(message)).not.toBeInTheDocument(),
      )
      await expect(field).toHaveAttribute('aria-invalid', 'false')
      await expect(field).toHaveAccessibleDescription(
        'This is your public display name.',
      )
    })
  },
}

const PlainFormExample = () => {
  const [error, setError] = useState<string>()

  return (
    <Plain.Form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault()
        const value = new FormData(event.currentTarget).get('email')
        setError(
          String(value).includes('@') ? undefined : 'Enter a valid email.',
        )
      }}
    >
      <Plain.FormItem error={error}>
        <Plain.FormControl>
          <Input name="email" title="Email" />
        </Plain.FormControl>
        <Plain.FormDescription>No form library needed.</Plain.FormDescription>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Button variant="filled" type="submit">
        Submit
      </Button>
    </Plain.Form>
  )
}

export const WithoutFormLibrary: Story = {
  render: () => <PlainFormExample />,
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByLabelText('Email')

    await userEvent.type(field, 'nope')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(await canvas.findByText('Enter a valid email.')).toBeVisible()
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    await expect(field).toHaveAccessibleDescription(
      expect.stringContaining('Enter a valid email.'),
    )

    await userEvent.type(field, '@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(
        canvas.queryByText('Enter a valid email.'),
      ).not.toBeInTheDocument(),
    )
  },
}

const InvalidFieldsExample = () => {
  const id = useId()

  return (
    <Plain.Form className="grid w-80 gap-6">
      <Plain.FormItem error="Enter a valid email.">
        <Plain.FormLabel>Email</Plain.FormLabel>
        <Plain.FormControl>
          <Input defaultValue="name@" />
        </Plain.FormControl>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Write at least 20 characters.">
        <Plain.FormLabel>Bio</Plain.FormLabel>
        <Plain.FormControl>
          <Textarea defaultValue="Hi" />
        </Plain.FormControl>
        <Plain.FormDescription>Shown on your profile.</Plain.FormDescription>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Pick a plan.">
        <Plain.FormLabel>Plan</Plain.FormLabel>
        <Select>
          <Plain.FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
          </Plain.FormControl>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Choose a size.">
        <Plain.FormLabel id={`${id}-size`}>Size</Plain.FormLabel>
        <Plain.FormControl>
          <RadioGroup aria-labelledby={`${id}-size`} className="flex gap-4">
            {['S', 'M', 'L'].map((size) => (
              <div key={size} className="flex items-center gap-2">
                <RadioGroupItem value={size} id={`${id}-${size}`} />
                <Label className="text-black" htmlFor={`${id}-${size}`}>
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Plain.FormControl>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Keep the volume under 80.">
        <Plain.FormLabel id={`${id}-volume`}>Volume</Plain.FormLabel>
        <Plain.FormControl>
          <Slider aria-labelledby={`${id}-volume`} defaultValue={[90]} />
        </Plain.FormControl>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Accept the terms to continue.">
        <div className="flex items-center gap-2">
          <Plain.FormControl>
            <Checkbox />
          </Plain.FormControl>
          <Plain.FormLabel>Accept the terms</Plain.FormLabel>
        </div>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Turn on email alerts to continue.">
        <div className="flex items-center gap-2">
          <Plain.FormControl>
            <Switch />
          </Plain.FormControl>
          <Plain.FormLabel>Email alerts</Plain.FormLabel>
        </div>
        <Plain.FormMessage />
      </Plain.FormItem>
    </Plain.Form>
  )
}

/**
 * Every form control in an invalid `FormItem`: `FormControl` gives it
 * `aria-invalid` (the red stroke or ring), and `aria-describedby` with the
 * rendered description and error. The RadioGroup and the Slider are named
 * with `aria-labelledby`; the Slider passes the description and
 * `aria-invalid` on to its thumb.
 */
export const InvalidFields: Story = {
  render: () => <InvalidFieldsExample />,
  play: async ({ canvas }) => {
    const fields = [
      ['textbox', 'Email', 'Enter a valid email.'],
      [
        'textbox',
        'Bio',
        'Shown on your profile. Write at least 20 characters.',
      ],
      ['combobox', 'Plan', 'Pick a plan.'],
      ['radiogroup', 'Size', 'Choose a size.'],
      ['slider', 'Volume', 'Keep the volume under 80.'],
      ['checkbox', 'Accept the terms', 'Accept the terms to continue.'],
      ['switch', 'Email alerts', 'Turn on email alerts to continue.'],
    ] as const

    for (const [role, name, description] of fields) {
      const control = canvas.getByRole(role, { name })
      await expect(control).toBeInvalid()
      await expect(control).toHaveAccessibleDescription(description)
    }
    // The errors are alerts, announced when they appear.
    await expect(canvas.getAllByRole('alert')).toHaveLength(fields.length)
  },
}

/**
 * The kit's Error look on text fields (`showErrorIcon` on Input and
 * Textarea, added in 5.2): the red stroke and a 16px `Warning` at the end of
 * the field, and the label stays grey, as the kit's title does. The error is
 * still the `FormMessage`, linked to the field.
 */
export const InvalidWithErrorIcon: Story = {
  render: () => (
    <Plain.Form className="grid w-80 gap-6">
      <Plain.FormItem error="Enter a valid email.">
        <Plain.FormLabel>Email</Plain.FormLabel>
        <Plain.FormControl>
          <Input defaultValue="name@" showErrorIcon />
        </Plain.FormControl>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Write at least 20 characters.">
        <Plain.FormLabel>Bio</Plain.FormLabel>
        <Plain.FormControl>
          <Textarea defaultValue="Hi" showErrorIcon />
        </Plain.FormControl>
        <Plain.FormMessage />
      </Plain.FormItem>
      <Plain.FormItem error="Enter your city.">
        <Plain.FormLabel>City</Plain.FormLabel>
        <Plain.FormControl>
          <Input />
        </Plain.FormControl>
        <Plain.FormMessage />
      </Plain.FormItem>
    </Plain.Form>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const [name, error] of [
      ['Email', 'Enter a valid email.'],
      ['Bio', 'Write at least 20 characters.'],
    ] as const) {
      const control = canvas.getByRole('textbox', { name })
      await expect(control).toBeInvalid()
      await expect(control).toHaveAccessibleDescription(error)
      const label = canvas.getByText(name)
      await expect(getComputedStyle(label).color).toBe(
        colorOf('text-secondary', canvasElement),
      )
    }
    const icons = canvasElement.querySelectorAll('[data-error-icon]')
    await expect(icons).toHaveLength(2)
    for (const icon of icons) {
      await expect(getComputedStyle(icon).display).not.toBe('none')
    }
    // Without the icon, an invalid label is still red-text.
    await expect(getComputedStyle(canvas.getByText('City')).color).toBe(
      colorOf('text-red-text', canvasElement),
    )
  },
}
