import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import { Alert, AlertDescription, type AlertStatus, AlertTitle } from './Alert'

const renderAlert = (props: Parameters<typeof Alert>[0] = {}) =>
  render(
    <Alert {...props}>
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Text</AlertDescription>
    </Alert>,
  )

describe('Alert', () => {
  it.each<[AlertStatus, string, string | undefined]>([
    ['default', 'status', undefined],
    ['info', 'status', 'Information'],
    ['success', 'status', 'Success'],
    ['warning', 'alert', 'Warning'],
    ['error', 'alert', 'Error'],
  ])('is a %s alert: role %s, read as %s', (status, role, label) => {
    renderAlert({ status })
    const alert = screen.getByRole(role)

    expect(alert).toHaveAttribute('data-status', status)
    expect(alert).toHaveTextContent(`${label ?? ''}TitleText`)
    expect(alert.querySelector(`[data-status-icon="${status}"]`)).toBeTruthy()
  })

  it('is a neutral Figma Card by default', () => {
    renderAlert()
    const alert = screen.getByRole('status')

    expect(alert).toHaveClass(
      'rounded-16',
      'px-4',
      'py-3',
      'bg-(--alert-fill)',
      '[--alert-fill:var(--color-black-4)]',
    )
    expect(screen.getByText('Title')).toHaveClass(
      'text-14',
      'font-semibold',
      'text-black',
    )
    expect(screen.getByText('Text')).toHaveClass('text-14', 'text-secondary')
  })

  it('tints with the status colour and darkens the icon for contrast', () => {
    renderAlert({ status: 'success' })
    const alert = screen.getByRole('status')

    expect(alert).toHaveClass(
      '[--alert-fill:color-mix(in_srgb,var(--color-green)_16%,transparent)]',
      '[--alert-icon:color-mix(in_srgb,var(--color-green),var(--color-black)_40%)]',
    )
    const icon = alert.querySelector('[data-status-icon]')
      ?.parentElement as HTMLElement
    expect(icon).toHaveClass('text-(--alert-icon)')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('takes a role, a status label and an icon', () => {
    renderAlert({
      status: 'error',
      role: 'note',
      statusLabel: 'Problem',
      icon: <svg data-testid="custom" />,
    })
    const note = screen.getByRole('note')

    expect(note).toHaveTextContent('ProblemTitleText')
    expect(screen.getByTestId('custom')).toBeInTheDocument()
    expect(note.querySelector('[data-status-icon]')).toBeNull()
  })

  it('hides the icon with icon={null} and the label with ""', () => {
    renderAlert({ status: 'error', icon: null, statusLabel: '' })
    const alert = screen.getByRole('alert')

    expect(alert.querySelector('svg')).toBeNull()
    expect(alert).toHaveTextContent(/^TitleText$/)
  })

  it('renders actions and a dismiss button that calls onDismiss', () => {
    const onDismiss = vi.fn()
    renderAlert({
      onDismiss,
      action: <button type="button">Retry</button>,
    })

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('has no dismiss button without onDismiss', () => {
    renderAlert()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('reads its strings from the provider, and the props over them', () => {
    const messages = { alert: { dismiss: 'Закрыть', error: 'Ошибка' } }
    const { rerender } = render(
      <SnowUIProvider messages={messages}>
        <Alert status="error" onDismiss={() => {}}>
          <AlertTitle>Title</AlertTitle>
        </Alert>
      </SnowUIProvider>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/^ОшибкаTitle/)
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument()

    rerender(
      <SnowUIProvider messages={messages}>
        <Alert status="error" onDismiss={() => {}} dismissLabel="Hide">
          <AlertTitle>Title</AlertTitle>
        </Alert>
      </SnowUIProvider>,
    )
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument()
  })

  it('renders its child with asChild, with the content around its children', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Alert asChild status="warning" ref={ref} className="w-96">
        <section className="px-6" aria-label="Quota">
          <AlertTitle>Title</AlertTitle>
        </section>
      </Alert>,
    )
    const alert = screen.getByRole('alert')

    expect(alert.tagName).toBe('SECTION')
    expect(alert).toBe(ref.current)
    expect(alert).toHaveClass('w-96', 'px-6', 'rounded-16')
    expect(alert).not.toHaveClass('px-4')
    expect(alert).toHaveAttribute('aria-label', 'Quota')
    expect(alert).toHaveTextContent(/^WarningTitle$/)
    expect(alert.querySelector('[data-status-icon="warning"]')).toBeTruthy()
  })

  it('lets a child role win with asChild', () => {
    render(
      <Alert asChild status="error">
        <div role="log" aria-label="Errors">
          <AlertTitle>Title</AlertTitle>
        </div>
      </Alert>,
    )
    expect(screen.getByRole('log', { name: 'Errors' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

describe('AlertTitle and AlertDescription', () => {
  it('render their child with asChild', () => {
    render(
      <>
        <AlertTitle asChild className="text-16">
          <h2>Title</h2>
        </AlertTitle>
        <AlertDescription asChild>
          <p className="text-black">Text</p>
        </AlertDescription>
      </>,
    )

    const heading = screen.getByRole('heading', { level: 2, name: 'Title' })
    expect(heading).toHaveClass('text-16', 'font-semibold')
    expect(heading).not.toHaveClass('text-14')
    const text = screen.getByText('Text')
    expect(text.tagName).toBe('P')
    expect(text).toHaveClass('text-black')
    expect(text).not.toHaveClass('text-secondary')
  })
})
