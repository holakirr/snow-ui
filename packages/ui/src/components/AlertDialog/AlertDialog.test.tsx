import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SnowUIProvider } from '../SnowUIProvider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from './AlertDialog'

type Parts = {
  action?: Parameters<typeof AlertDialogAction>[0]
  cancel?: Parameters<typeof AlertDialogCancel>[0]
}

const renderOpen = ({ action, cancel }: Parts = {}, onOpenChange = vi.fn()) =>
  render(
    <AlertDialog defaultOpen onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel {...cancel} />
          <AlertDialogAction {...action}>
            {action?.children ?? 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  )

describe('AlertDialog', () => {
  it('is a named, described alertdialog on the Dialog popup', () => {
    renderOpen()
    const dialog = screen.getByRole('alertdialog', {
      name: 'Delete this project?',
    })

    expect(dialog).toHaveAccessibleDescription("This can't be undone.")
    expect(dialog).toHaveClass(
      'rounded-32',
      'bg-background-3',
      'backdrop-blur-bg-40',
      'max-w-md',
      'p-8',
      'gap-7',
    )
    expect(screen.getByText('Delete this project?')).toHaveClass(
      'text-24',
      'font-semibold',
    )
    expect(screen.getByText("This can't be undone.")).toHaveClass(
      'text-14',
      'text-secondary',
    )
  })

  it('focuses Cancel when it opens', () => {
    renderOpen()
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('keeps the focus in the dialog on a press on the mask', () => {
    const onMouseDown = vi.fn()
    render(
      <AlertDialog defaultOpen>
        <AlertDialogOverlay data-testid="mask" onMouseDown={onMouseDown} />
      </AlertDialog>,
    )
    const mask = screen.getByTestId('mask')

    // fireEvent returns false when the default (moving focus) is prevented.
    expect(fireEvent.mouseDown(mask)).toBe(false)
    expect(onMouseDown).toHaveBeenCalledTimes(1)
    expect(mask).toHaveClass('fixed', 'inset-0', 'bg-linear-to-t')
  })

  it('renders lg Gray and Filled buttons', () => {
    renderOpen()
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    const action = screen.getByRole('button', { name: 'Delete' })

    expect(cancel).toHaveClass('bg-black-4', 'min-h-12', 'rounded-20')
    expect(action).toHaveClass('bg-primary', 'text-white', 'min-h-12')
    expect(action).toHaveAttribute('data-variant', 'filled')
  })

  it('has a destructive action variant', () => {
    renderOpen({ action: { variant: 'destructive' } })
    const action = screen.getByRole('button', { name: 'Delete' })

    expect(action).toHaveAttribute('data-variant', 'destructive')
    expect(action).toHaveClass('bg-red-text', 'text-white')
    expect(action).not.toHaveClass('bg-primary')
  })

  it('takes any Button variant and size on its buttons', () => {
    renderOpen({
      action: { variant: 'outline', size: 'md' },
      cancel: { variant: 'borderless', children: 'Keep it' },
    })

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'inset-ring-black-10',
      'min-h-9',
    )
    expect(screen.getByRole('button', { name: 'Keep it' })).not.toHaveClass(
      'bg-black-4',
    )
  })

  it('closes from the action', () => {
    const onOpenChange = vi.fn()
    renderOpen({}, onOpenChange)

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('stays open when the action prevents the default', () => {
    const onOpenChange = vi.fn()
    renderOpen(
      { action: { onClick: (event) => event.preventDefault() } },
      onOpenChange,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('reads "Cancel" from the provider, and a label or children over it', () => {
    const { unmount } = render(
      <SnowUIProvider messages={{ alertDialog: { cancel: 'Отмена' } }}>
        <AlertDialog defaultOpen>
          <AlertDialogContent aria-describedby={undefined}>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogCancel />
          </AlertDialogContent>
        </AlertDialog>
      </SnowUIProvider>,
    )
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument()
    unmount()

    renderOpen({ cancel: { label: 'Not now' } })
    const cancel = screen.getByRole('button', { name: 'Not now' })
    expect(cancel).toHaveTextContent(/^Not now$/)
  })

  it('takes the dir of the provider', () => {
    render(
      <SnowUIProvider dir="rtl">
        <AlertDialog defaultOpen>
          <AlertDialogContent aria-describedby={undefined}>
            <AlertDialogTitle>Title</AlertDialogTitle>
            <AlertDialogCancel />
          </AlertDialogContent>
        </AlertDialog>
      </SnowUIProvider>,
    )
    expect(screen.getByRole('alertdialog')).toHaveAttribute('dir', 'rtl')
  })

  it('stacks the actions when they do not fit, the action on top', () => {
    renderOpen()
    const footer = screen.getByRole('button', { name: 'Delete' })
      .parentElement as HTMLElement

    expect(footer).toHaveClass(
      'flex',
      'flex-wrap-reverse',
      'gap-4',
      '*:flex-[1_1_10rem]',
    )
  })
})
