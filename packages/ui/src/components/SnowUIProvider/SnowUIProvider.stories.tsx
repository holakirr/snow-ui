import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../Breadcrumb'
import { Button } from '../Button'
import { Calendar } from '../Calendar'
import { Slider } from '../Input'
import { Link } from '../Link'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../Pagination'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Search } from '../Search'
import { Tag } from '../Tag'
import { Typography } from '../Text'
import type { MessagesOverrides } from './messages'
import { SnowUIProvider } from './SnowUIProvider'
import { ThemeScope } from './ThemeScope'

const meta: Meta<typeof SnowUIProvider> = {
  title: 'Components/SnowUIProvider',
  component: SnowUIProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Localizes the components and sets their text direction: `messages` (the built-in strings, typed as `Messages`, English `defaultMessages` by default), `locale` (a date-fns / react-day-picker locale for dates) and `dir`. Storybook wraps every story in one, driven by the "Locale" and "Direction" toolbars. A component\'s own label props win over the provider. It is a client component: in a React Server Components app (Next.js App Router), render it from a `\'use client\'` module that imports the locale and the messages (see the README).',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SnowUIProvider>

/** Components with built-in strings: names, placeholders, screen-reader text. */
const Showcase = () => (
  <div className="flex w-[40rem] flex-col items-start gap-6 text-black">
    <Search />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Pagination className="mx-0 justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    <div className="flex items-center gap-4">
      <Tag label="React" onRemove={() => {}} />
      <Link variant="external" href="https://snowui.byewind.com">
        SnowUI
      </Link>
    </div>
    <Slider aria-label="Price" defaultValue={[20, 80]} className="w-60" />
    <Calendar
      mode="single"
      defaultMonth={new Date(2025, 0, 1)}
      showTodayButton
      lastSelection={new Date(2024, 11, 3)}
    />
  </div>
)

/** The toolbar's locale and direction (English and left-to-right by default). */
export const Default: Story = {
  render: () => <Showcase />,
}

/**
 * The example Russian `messages` (see `.storybook/locales.ts`) and
 * react-day-picker's `ru` locale, pinned with `globals: { locale: 'ru' }`.
 */
export const Russian: Story = {
  globals: { locale: 'ru' },
  render: () => <Showcase />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('searchbox')).toHaveAttribute(
      'placeholder',
      'Поиск',
    )
    await expect(
      canvas.getByRole('navigation', { name: 'Навигационная цепочка' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('navigation', { name: 'Навигация по страницам' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('link', { name: 'Предыдущая страница' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Удалить тег React' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('link', { name: 'SnowUI (откроется в новой вкладке)' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('slider', { name: 'Price, минимум' }),
    ).toBeInTheDocument()
    await expect(canvas.getByRole('grid')).toHaveAccessibleName(/январь 2025/i)
    await expect(
      canvas.getByRole('button', { name: 'Сегодня' }),
    ).toBeInTheDocument()
  },
}

/** Module scope, so the provider gets the same object on every render. */
const deleteTagMessages: MessagesOverrides = {
  tag: { remove: (label) => `Delete ${label}` },
}

/**
 * Providers nest and merge: the inner one changes one string and keeps the
 * rest. A component's own label prop (`removeLabel`) wins over both.
 */
export const NestedOverrides: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SnowUIProvider messages={deleteTagMessages}>
        <div className="flex gap-2" data-testid="nested">
          <Tag label="Design" onRemove={() => {}} />
          <Tag
            label="Code"
            onRemove={() => {}}
            removeLabel="Unassign the code tag"
          />
          <Search />
        </div>
      </SnowUIProvider>
    </div>
  ),
  play: async ({ canvas }) => {
    const nested = within(canvas.getByTestId('nested'))
    await expect(
      nested.getByRole('button', { name: 'Delete Design' }),
    ).toBeInTheDocument()
    await expect(
      nested.getByRole('button', { name: 'Unassign the code tag' }),
    ).toBeInTheDocument()
    // Untouched namespaces keep the outer provider's (default) messages.
    await expect(nested.getByRole('searchbox')).toHaveAttribute(
      'placeholder',
      'Search',
    )
  },
}

/**
 * `dir="rtl"`, pinned with `globals: { dir: 'rtl' }`: the layout mirrors, and
 * the arrows and chevrons of the components point the other way.
 */
export const RightToLeft: Story = {
  globals: { dir: 'rtl' },
  render: () => <Showcase />,
  play: async ({ canvas }) => {
    const previous = canvas.getByRole('link', { name: 'Go to previous page' })
    const next = canvas.getByRole('link', { name: 'Go to next page' })
    await expect(previous.getBoundingClientRect().left).toBeGreaterThan(
      next.getBoundingClientRect().left,
    )
    await expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  },
}

/**
 * `ThemeScope` themes a subtree and the overlays opened from it: the
 * popover renders at the end of `<body>`, outside the dark card, and is
 * dark too. A plain `data-theme` attribute on the card would leave it light.
 */
export const ScopedTheme: Story = {
  globals: { theme: 'light' },
  render: () => (
    <ThemeScope
      theme="dark"
      className="flex w-80 flex-col items-start gap-3 rounded-16 bg-background-1 p-6 text-black"
    >
      <Typography size={14} semibold>
        Dark scope
      </Typography>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" aria-label="Preview">
          <Typography size={14}>Rendered in the scope's theme</Typography>
        </PopoverContent>
      </Popover>
    </ThemeScope>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body)
    const scope = canvas
      .getByText('Dark scope')
      .closest('[data-theme]') as HTMLElement
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }))
    const popover = await body.findByRole('dialog', { name: 'Preview' })

    // Outside the scope in the DOM, but in its theme: the dark tokens.
    await expect(scope).not.toContainElement(popover)
    await expect(popover).toHaveAttribute('data-theme', 'dark')
    await expect(getComputedStyle(popover).color).toBe(
      getComputedStyle(scope).color,
    )
    await expect(getComputedStyle(popover).color).not.toBe(
      getComputedStyle(canvasElement).color,
    )
  },
}
