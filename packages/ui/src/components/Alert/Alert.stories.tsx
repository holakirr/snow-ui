import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { expect, fn, waitFor } from 'storybook/test'
import { Button } from '../Button'
import { Alert, AlertDescription, type AlertStatus, AlertTitle } from './Alert'

const STATUSES: AlertStatus[] = [
  'default',
  'info',
  'success',
  'warning',
  'error',
]

const EXAMPLES: { [K in AlertStatus]: { title: string; text: string } } = {
  default: {
    title: 'Scheduled maintenance',
    text: 'The dashboard is read-only on Sunday from 02:00 to 04:00 UTC.',
  },
  info: {
    title: 'New report available',
    text: 'The March traffic report is ready to download.',
  },
  success: {
    title: 'Payment received',
    text: 'Your invoice #1042 has been paid. A receipt is on its way.',
  },
  warning: {
    title: 'Storage almost full',
    text: 'You have used 90% of your storage. Delete files or upgrade.',
  },
  error: {
    title: 'Payment failed',
    text: 'Your card was declined. Check the details or use another card.',
  },
}

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A library extension built from the kit\'s tokens: a Figma "Card" shape (radius 16, padding 12/16) tinted with a status\'s Secondary colour at 16%, a 20px status icon, a 14 Semibold title and a `text-secondary` description. `warning` and `error` are `role="alert"`, the others `role="status"`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: { options: STATUSES, control: { type: 'radio' } },
    statusLabel: { control: 'text' },
    dismissLabel: { control: 'text' },
  },
  args: {
    status: 'info',
    className: 'w-[28rem]',
    children: (
      <>
        <AlertTitle>{EXAMPLES.info.title}</AlertTitle>
        <AlertDescription>{EXAMPLES.info.text}</AlertDescription>
      </>
    ),
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('status')
    await expect(alert).toHaveAttribute('data-status', 'info')
    // The status is read before the title.
    await expect(alert).toHaveTextContent(
      'InformationNew report availableThe March traffic report',
    )
  },
}

/** `default` (neutral), `info`, `success`, `warning` and `error`. */
export const Statuses: Story = {
  render: () => (
    <div className="flex w-[28rem] flex-col gap-3">
      {STATUSES.map((status) => (
        <Alert key={status} status={status}>
          <AlertTitle>{EXAMPLES[status].title}</AlertTitle>
          <AlertDescription>{EXAMPLES[status].text}</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    // Warnings and errors interrupt; the rest wait for the screen reader.
    const alerts = canvas.getAllByRole('alert')
    await expect(alerts).toHaveLength(2)
    await expect(canvas.getAllByRole('status')).toHaveLength(3)
    await expect(alerts[1]).toHaveTextContent(/^ErrorPayment failed/)
  },
}

/** Title only, or text only. */
export const Compact: Story = {
  render: () => (
    <div className="flex w-[28rem] flex-col gap-3">
      <Alert status="success">
        <AlertTitle>Changes saved</AlertTitle>
      </Alert>
      <Alert>
        <AlertDescription>
          Tip: press <strong className="font-semibold text-black">/</strong> to
          search from anywhere.
        </AlertDescription>
      </Alert>
      <Alert status="warning" icon={null}>
        <AlertTitle>Without an icon</AlertTitle>
      </Alert>
    </div>
  ),
}

/**
 * `action` sits after the text, or under it when the alert is narrow;
 * `onDismiss` adds a dismiss button at the end.
 */
export const WithActions: Story = {
  args: {
    status: 'warning',
    onDismiss: fn(),
    action: <Button variant="outline" size="sm" label="Upgrade" />,
    children: (
      <>
        <AlertTitle>{EXAMPLES.warning.title}</AlertTitle>
        <AlertDescription>{EXAMPLES.warning.text}</AlertDescription>
      </>
    ),
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args} />
      <Alert {...args} className="w-72" />
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const [wide, narrow] = canvas.getAllByRole('alert')
    const [wideUpgrade, narrowUpgrade] = canvas.getAllByRole('button', {
      name: 'Upgrade',
    })
    const title = (alert: HTMLElement) =>
      (
        alert.querySelector('.font-semibold') as HTMLElement
      ).getBoundingClientRect()

    // Next to the text when there is room, under it when there isn't.
    await expect(wideUpgrade.getBoundingClientRect().left).toBeGreaterThan(
      title(wide).right,
    )
    await expect(narrowUpgrade.getBoundingClientRect().top).toBeGreaterThan(
      title(narrow).bottom,
    )

    const [dismiss] = canvas.getAllByRole('button', { name: 'Dismiss' })
    await userEvent.click(dismiss)
    await expect(args.onDismiss).toHaveBeenCalledTimes(1)
  },
}

const DismissibleDemo = () => {
  const [open, setOpen] = useState(true)
  const heading = useRef<HTMLHeadingElement>(null)
  return (
    <div className="flex w-[28rem] flex-col gap-3">
      {/* Focusable from script only (not a control): no focus outline. */}
      <h2
        ref={heading}
        tabIndex={-1}
        className="text-14 font-semibold text-black outline-none"
      >
        Billing
      </h2>
      {open && (
        <Alert
          status="success"
          onDismiss={() => {
            setOpen(false)
            // The focused dismiss button is gone: move the focus on.
            heading.current?.focus()
          }}
        >
          <AlertTitle>{EXAMPLES.success.title}</AlertTitle>
          <AlertDescription>{EXAMPLES.success.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

/** Dismissed with the keyboard: the app removes it and moves the focus. */
export const Dismissible: Story = {
  render: () => <DismissibleDemo />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab()
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' })
    await expect(dismiss).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(canvas.queryByRole('status')).not.toBeInTheDocument(),
    )
    await expect(canvas.getByRole('heading', { name: 'Billing' })).toHaveFocus()
  },
}

const LiveDemo = () => {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex w-[28rem] flex-col items-start gap-3">
      <Button
        variant="filled"
        size="md"
        label="Pay now"
        onClick={() => setFailed(true)}
      />
      {failed && (
        <Alert status="error" className="w-full">
          <AlertTitle>{EXAMPLES.error.title}</AlertTitle>
          <AlertDescription>{EXAMPLES.error.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

/**
 * An error that appears after an action: `role="alert"` is announced as soon
 * as it is added to the page.
 */
export const Live: Story = {
  render: () => <LiveDemo />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Pay now' }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      /^ErrorPayment failed/,
    )
  },
}

/**
 * `asChild` renders a `<section>` (here a named region, a static note);
 * `AlertTitle asChild` makes the title a heading.
 */
export const AsChild: Story = {
  render: () => (
    <Alert asChild status="info" role="region" className="w-[28rem]">
      <section aria-labelledby="release-notes">
        <AlertTitle asChild>
          <h2 id="release-notes">Release notes</h2>
        </AlertTitle>
        <AlertDescription asChild>
          <p>Version 5.1 adds Alert, AlertDialog, Progress and Spinner.</p>
        </AlertDescription>
      </section>
    </Alert>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Release notes' })
    await expect(region.tagName).toBe('SECTION')
    await expect(region).toHaveClass('rounded-16', 'w-[28rem]')
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Release notes' }),
    ).toHaveClass('font-semibold')
  },
}

/** Right-to-left text: the icon on the right, the dismiss button on the left. */
export const RTL: Story = {
  tags: ['!autodocs'],
  globals: { dir: 'rtl' },
  args: {
    status: 'error',
    onDismiss: () => {},
    children: (
      <>
        <AlertTitle>فشل الدفع</AlertTitle>
        <AlertDescription>تم رفض بطاقتك. تحقق من التفاصيل.</AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert')
    const icon = alert.querySelector('[data-status-icon]') as SVGElement
    const title = canvas.getByText('فشل الدفع')
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' })
    await expect(icon.getBoundingClientRect().left).toBeGreaterThan(
      title.getBoundingClientRect().right,
    )
    await expect(dismiss.getBoundingClientRect().right).toBeLessThan(
      title.getBoundingClientRect().left,
    )
  },
}

/** Built-in strings from `SnowUIProvider` messages (Russian example). */
export const Localized: Story = {
  tags: ['!autodocs'],
  globals: { locale: 'ru' },
  args: {
    status: 'error',
    onDismiss: () => {},
    children: (
      <>
        <AlertTitle>Платёж не прошёл</AlertTitle>
        <AlertDescription>Банк отклонил карту.</AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      /^ОшибкаПлатёж не прошёл/,
    )
    await expect(
      canvas.getByRole('button', { name: 'Закрыть' }),
    ).toBeInTheDocument()
  },
}

export const StatusesDark: Story = {
  ...Statuses,
  globals: { theme: 'dark' },
}
