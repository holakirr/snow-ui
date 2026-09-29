import { useDirection } from '@radix-ui/react-direction'
import { act, render, screen, within } from '@testing-library/react'
import { ru } from 'date-fns/locale'
import { ru as dayPickerRu } from 'react-day-picker/locale'
import { beforeAll, describe, expect, it } from 'vitest'
import { Badge } from '../Badge'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
} from '../Breadcrumb'
import { Calendar } from '../Calendar'
import { CommandPalette } from '../CommandPalette'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../Dialog'
import { Slider } from '../Input'
import { Link } from '../Link'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '../Pagination'
import { Popover, PopoverContent } from '../Popover'
import { Scheduler } from '../Scheduler'
import { Search } from '../Search'
import { Sheet, SheetContent, SheetTitle } from '../Sheet'
import {
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '../Sidebar'
import { Tag } from '../Tag'
import { ToastClose, ToastProvider, ToastViewport } from '../Toaster'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../Tooltip'
import {
  defaultMessages,
  type Messages,
  type MessagesOverrides,
  mergeMessages,
  sameOverrides,
} from './messages'
import { SnowUIProvider, useMessages, useSnowUI } from './SnowUIProvider'

const german: MessagesOverrides = {
  badge: { label: 'Benachrichtigung' },
  breadcrumb: { label: 'Brotkrumen', more: 'Weitere Seiten' },
  commandPalette: {
    label: 'Suche',
    placeholder: 'Suchen…',
    empty: 'Keine Treffer',
    loading: 'Lädt',
  },
  dialog: { close: 'Schließen' },
  link: { external: '(öffnet in neuem Tab)' },
  pagination: {
    label: 'Seiten',
    previous: 'Vorherige Seite',
    next: 'Nächste Seite',
    more: 'Weitere',
  },
  search: { placeholder: 'Suchen', clear: 'Leeren' },
  sheet: { close: 'Zu' },
  sidebar: { toggle: 'Seitenleiste umschalten', title: 'Leiste' },
  slider: {
    minimum: (label) => `${label} (min)`,
    maximum: (label) => `${label} (max)`,
    thumb: (label, position, count) => `${label} ${position}/${count}`,
  },
  tag: { remove: (label) => `${label} entfernen` },
  toast: { close: 'Toast schließen', region: 'Meldungen ({hotkey})' },
}

beforeAll(() => {
  // Radix measures popovers and slider thumbs with ResizeObserver, and the
  // Sidebar reads a media query; jsdom has neither.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList
})

describe('SnowUIProvider', () => {
  it('provides the English defaults without a provider', () => {
    const Probe = () => {
      const { messages, locale, dir } = useSnowUI()
      return (
        <output>
          {messages === defaultMessages ? 'defaults' : 'custom'}{' '}
          {String(locale)} {String(dir)}
        </output>
      )
    }
    render(<Probe />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'defaults undefined undefined',
    )
  })

  it('merges partial messages over the defaults, namespace by namespace', () => {
    const Probe = () => {
      const messages = useMessages()
      return (
        <output>
          {messages.pagination.previous} | {messages.pagination.next} |{' '}
          {messages.dialog.close}
        </output>
      )
    }
    render(
      <SnowUIProvider messages={{ pagination: { previous: 'Zurück' } }}>
        <Probe />
      </SnowUIProvider>,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Zurück | Go to next page | Close',
    )
  })

  it('nests: an inner provider overrides the outer one for its subtree', () => {
    const Probe = () => {
      const { messages, locale, dir } = useSnowUI()
      return (
        <output>
          {messages.tag.remove('A')} | {messages.dialog.close} | {locale?.code}{' '}
          | {dir}
        </output>
      )
    }
    render(
      <SnowUIProvider
        messages={{ dialog: { close: 'Schließen' } }}
        locale={ru}
        dir="rtl"
      >
        <SnowUIProvider messages={{ tag: { remove: (l) => `x ${l}` } }}>
          <Probe />
        </SnowUIProvider>
      </SnowUIProvider>,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'x A | Schließen | ru | rtl',
    )
  })

  it('sets the Radix direction, and keeps an outer one without `dir`', () => {
    const Probe = () => <output>{useDirection()}</output>
    const { rerender } = render(
      <SnowUIProvider dir="rtl">
        <Probe />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('rtl')

    rerender(
      <SnowUIProvider>
        <Probe />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('ltr')
  })

  it('translates the built-in strings of the components', () => {
    render(
      <SnowUIProvider messages={german}>
        <Search defaultValue="x" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#1" />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#2" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Tag label="React" onRemove={() => {}} />
        <Link variant="external" href="#x">
          Docs
        </Link>
        <Badge />
        <Slider aria-label="Preis" defaultValue={[1, 2, 3]} />
        <Slider aria-label="Spanne" defaultValue={[1, 2]} />
      </SnowUIProvider>,
    )

    expect(screen.getByPlaceholderText('Suchen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leeren' })).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Brotkrumen' }),
    ).toHaveTextContent('Weitere Seiten')
    const pagination = screen.getByRole('navigation', { name: 'Seiten' })
    expect(
      within(pagination).getByRole('link', { name: 'Vorherige Seite' }),
    ).toBeInTheDocument()
    expect(
      within(pagination).getByRole('link', { name: 'Nächste Seite' }),
    ).toBeInTheDocument()
    expect(pagination).toHaveTextContent('Weitere')
    expect(
      screen.getByRole('button', { name: 'React entfernen' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Docs (öffnet in neuem Tab)' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('status', { name: 'Benachrichtigung' }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('slider').map((slider) => slider.ariaLabel),
    ).toEqual([
      'Preis 1/3',
      'Preis 2/3',
      'Preis 3/3',
      'Spanne (min)',
      'Spanne (max)',
    ])
  })

  it('lets component label props win over the provider', () => {
    render(
      <SnowUIProvider messages={german}>
        <Search clearLabel="Weg damit" defaultValue="x" placeholder="Wo?" />
        <Breadcrumb aria-label="Pfad">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis label="Mehr" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination aria-label="Blättern">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#1" aria-label="Zurück" />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis label="…mehr" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Tag label="React" onRemove={() => {}} removeLabel="Weg" />
        <Link variant="external" href="#x" externalLabel="(neu)">
          Docs
        </Link>
        <Slider thumbLabels={['Von', 'Bis']} defaultValue={[1, 2]} />
      </SnowUIProvider>,
    )

    expect(screen.getByPlaceholderText('Wo?')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Weg damit' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Pfad' })).toHaveTextContent(
      'Mehr',
    )
    expect(
      screen.getByRole('navigation', { name: 'Blättern' }),
    ).toHaveTextContent('…mehr')
    expect(screen.getByRole('link', { name: 'Zurück' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Weg' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Docs (neu)' })).toBeInTheDocument()
    expect(
      screen.getAllByRole('slider').map((slider) => slider.ariaLabel),
    ).toEqual(['Von', 'Bis'])
  })

  it('translates the dialog, sheet, sidebar and toast strings', () => {
    const { rerender } = render(
      <SnowUIProvider messages={german}>
        <Dialog open>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Titel</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </SnowUIProvider>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Titel' })
    expect(
      within(dialog).getByRole('button', { name: 'Schließen' }),
    ).toBeInTheDocument()

    rerender(
      <SnowUIProvider messages={german}>
        <Sheet open>
          <SheetContent aria-describedby={undefined}>
            <SheetTitle>Blatt</SheetTitle>
          </SheetContent>
        </Sheet>
      </SnowUIProvider>,
    )
    const sheet = screen.getByRole('dialog', { name: 'Blatt' })
    expect(
      within(sheet).getByRole('button', { name: 'Zu' }),
    ).toBeInTheDocument()

    rerender(
      <SnowUIProvider messages={german}>
        <SidebarProvider>
          <Sidebar collapsible="none" />
          <SidebarTrigger />
          <SidebarRail />
        </SidebarProvider>
        <ToastProvider>
          <ToastClose />
          <ToastViewport />
        </ToastProvider>
      </SnowUIProvider>,
    )
    expect(
      screen.getAllByRole('button', { name: 'Seitenleiste umschalten' }),
    ).toHaveLength(2)
    expect(
      screen.getByRole('button', { name: 'Toast schließen' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: /^Meldungen/ }),
    ).toBeInTheDocument()
  })

  it('translates the CommandPalette and lets its props win', () => {
    const { rerender } = render(
      <SnowUIProvider messages={german}>
        <CommandPalette open groups={[]} loading />
      </SnowUIProvider>,
    )

    expect(screen.getByRole('dialog', { name: 'Suche' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Suchen…')).toBeInTheDocument()
    expect(screen.getByText('Lädt')).toHaveClass('sr-only')

    rerender(
      <SnowUIProvider messages={german}>
        <CommandPalette open groups={[]} />
      </SnowUIProvider>,
    )
    expect(screen.getByText('Keine Treffer')).toBeInTheDocument()

    rerender(
      <SnowUIProvider messages={german}>
        <CommandPalette
          open
          groups={[]}
          label="Befehle"
          placeholder="Befehl"
          emptyMessage="Nichts"
        />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('dialog', { name: 'Befehle' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Befehl')).toBeInTheDocument()
    expect(screen.getByText('Nichts')).toBeInTheDocument()
  })

  it('passes the locale, messages and dir to Calendar; its props win', () => {
    const { rerender } = render(
      <SnowUIProvider
        locale={ru}
        dir="rtl"
        messages={{
          calendar: { today: 'Heute', navigation: 'Monate' },
        }}
      >
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 0, 1)}
          showTodayButton
        />
      </SnowUIProvider>,
    )

    expect(screen.getByRole('grid')).toHaveAccessibleName(/январь 2025/i)
    expect(screen.getByRole('button', { name: 'Heute' })).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Monate' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('grid').closest('[dir]')).toHaveAttribute(
      'dir',
      'rtl',
    )

    rerender(
      <SnowUIProvider locale={ru} dir="rtl">
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 0, 1)}
          locale={undefined}
          dir="ltr"
          showTodayButton
          todayLabel="Now"
          labels={{ labelNav: () => 'Months' }}
        />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('button', { name: 'Now' })).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Months' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('grid').closest('[dir]')).toHaveAttribute(
      'dir',
      'ltr',
    )
  })

  it('translates the Calendar year navigation', async () => {
    render(
      <SnowUIProvider
        messages={{
          calendar: {
            previousYears: (count) => `${count} Jahre zurück`,
            nextYears: (count) => `${count} Jahre vor`,
          },
        }}
      >
        <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
      </SnowUIProvider>,
    )

    await act(async () => {
      screen.getByRole('button', { name: /January 2025/ }).click()
    })
    expect(
      screen.getByRole('button', { name: '12 Jahre zurück' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '12 Jahre vor' }),
    ).toBeInTheDocument()
  })

  it('gives portalled content the provider direction, and none without it', () => {
    const { rerender } = render(
      <SnowUIProvider dir="rtl">
        <Popover open>
          <PopoverContent>Popover</PopoverContent>
        </Popover>
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Trigger</TooltipTrigger>
            <TooltipContent>Tip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      </SnowUIProvider>,
    )

    expect(screen.getByText('Popover').closest('[dir]')).toHaveAttribute(
      'dir',
      'rtl',
    )
    expect(
      screen.getAllByText('Tip')[0].closest('[data-side]'),
    ).toHaveAttribute('dir', 'rtl')
    expect(screen.getByRole('dialog')).toHaveAttribute('dir', 'rtl')

    rerender(
      <>
        <Popover open>
          <PopoverContent>Popover</PopoverContent>
        </Popover>
        <Dialog open>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      </>,
    )
    expect(screen.getByRole('dialog')).not.toHaveAttribute('dir')
  })

  it('resolves Sheet and Sidebar start / end sides by direction', () => {
    const { rerender } = render(
      <SnowUIProvider dir="rtl">
        <Sheet open>
          <SheetContent side="start" aria-describedby={undefined}>
            <SheetTitle>Start</SheetTitle>
          </SheetContent>
        </Sheet>
      </SnowUIProvider>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'right')
    expect(screen.getByRole('dialog')).toHaveClass('right-0')

    rerender(
      <SnowUIProvider dir="rtl">
        <Sheet open>
          <SheetContent aria-describedby={undefined}>
            <SheetTitle>End</SheetTitle>
          </SheetContent>
        </Sheet>
      </SnowUIProvider>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left')

    rerender(
      <Sheet open>
        <SheetContent side="top" aria-describedby={undefined}>
          <SheetTitle>Top</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'top')

    rerender(
      <SnowUIProvider dir="rtl">
        <SidebarProvider>
          <Sidebar collapsible="none" data-testid="sidebar" />
        </SidebarProvider>
      </SnowUIProvider>,
    )
    // `start` in right-to-left text: the right edge, a left border.
    expect(screen.getByTestId('sidebar')).toHaveClass('border-l-[0.5px]')
  })

  it('accepts a full translation without the namespaces added in 5.1', () => {
    // A `Messages` object written for 5.0 still type-checks: the new
    // namespaces are optional and the defaults fill them in.
    const {
      alert: _alert,
      alertDialog: _alertDialog,
      avatarGroup: _avatarGroup,
      charts: _charts,
      progress: _progress,
      spinner: _spinner,
      ...v50
    } = defaultMessages
    const translation: Messages = { ...v50, dialog: { close: 'Schließen' } }
    let seen: Required<Messages> | undefined
    const Probe = () => {
      seen = useMessages()
      return null
    }
    render(
      <SnowUIProvider messages={translation}>
        <Probe />
      </SnowUIProvider>,
    )

    expect(seen?.dialog.close).toBe('Schließen')
    expect(seen?.alert.dismiss).toBe('Dismiss')
    expect(seen?.alertDialog.cancel).toBe('Cancel')
    expect(seen?.avatarGroup.more(2)).toBe('2 more')
    expect(seen?.charts.navigation).toBe('Data points')
    expect(seen?.progress.value(1, 4)).toBe('25%')
    expect(seen?.spinner.label).toBe('Loading')
  })

  it('keeps the base message for an override set to undefined', () => {
    const merged = mergeMessages(defaultMessages, {
      dialog: { close: undefined },
      sheet: { close: 'Zu' },
    })

    expect(merged.dialog.close).toBe('Close')
    expect(merged.sheet.close).toBe('Zu')
    expect(mergeMessages(defaultMessages)).toBe(defaultMessages)
  })

  it('keeps the context value for an equal inline messages object', () => {
    const remove = (label: string) => `x ${label}`
    const seen: Messages[] = []
    const Probe = () => {
      seen.push(useMessages())
      return null
    }
    const { rerender } = render(
      <SnowUIProvider messages={{ tag: { remove }, dialog: { close: 'Zu' } }}>
        <Probe />
      </SnowUIProvider>,
    )
    rerender(
      <SnowUIProvider messages={{ tag: { remove }, dialog: { close: 'Zu' } }}>
        <Probe />
      </SnowUIProvider>,
    )
    rerender(
      <SnowUIProvider messages={{ tag: { remove }, dialog: { close: 'Auf' } }}>
        <Probe />
      </SnowUIProvider>,
    )

    expect(seen.at(1)).toBe(seen.at(0))
    expect(seen.at(-1)).not.toBe(seen.at(0))
    expect(seen.at(-1)?.dialog.close).toBe('Auf')
    expect(sameOverrides({ tag: { remove } }, { tag: { remove } })).toBe(true)
    expect(sameOverrides({ tag: { remove } }, { tag: {} })).toBe(false)
    expect(sameOverrides({ tag: { remove } }, { dialog: {} })).toBe(false)
    expect(sameOverrides({ tag: {} }, { tag: {}, dialog: {} })).toBe(false)
    expect(sameOverrides(undefined, {})).toBe(false)
  })

  it('names the Calendar month buttons from the messages', () => {
    const { rerender } = render(
      <SnowUIProvider
        locale={ru}
        messages={{
          calendar: { previousMonth: 'Назад', nextMonth: 'Вперёд' },
        }}
      >
        <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
      </SnowUIProvider>,
    )
    // A date-fns locale has no labels of its own: the messages name them.
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeInTheDocument()

    // The English defaults give way to a react-day-picker locale's labels…
    rerender(
      <SnowUIProvider locale={dayPickerRu}>
        <Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />
      </SnowUIProvider>,
    )
    expect(
      screen.getByRole('button', { name: 'Перейти к предыдущему месяцу' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Панель навигации' }),
    ).toBeInTheDocument()

    // …a translation wins over them, and the `labels` prop over both.
    rerender(
      <SnowUIProvider
        locale={dayPickerRu}
        messages={{ calendar: { previousMonth: 'Назад' } }}
      >
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 0, 1)}
          labels={{ labelNext: () => 'Next!' }}
        />
      </SnowUIProvider>,
    )
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next!' })).toBeInTheDocument()

    // Without a provider: the English defaults.
    rerender(<Calendar mode="single" defaultMonth={new Date(2025, 0, 1)} />)
    expect(
      screen.getByRole('button', { name: 'Go to the previous month' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Month navigation' }),
    ).toBeInTheDocument()
  })

  it('formats the Scheduler labels in the provider language', () => {
    const scheduler = (
      <Scheduler
        currentDate={new Date(2025, 0, 8)}
        onEventClick={() => {}}
        onDateClick={() => {}}
      />
    )
    const { rerender } = render(
      <SnowUIProvider locale={ru}>{scheduler}</SnowUIProvider>,
    )
    const cellLabel = () =>
      screen
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label') ?? '')
        .find((label) => label.includes('2025'))
    // Russian: "06.01.2025, 9:00:00".
    expect(cellLabel()).toMatch(/^\d{2}\.\d{2}\.2025/)

    rerender(scheduler)
    // en-US without a locale: the same text on the server and in the browser.
    expect(cellLabel()).toMatch(/^1\/\d+\/2025/)
  })
})
