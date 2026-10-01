import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import {
  Tabs,
  TabsList,
  type TabsListProps,
  TabsTrigger,
  type TabsVariant,
} from './Tabs'

const renderTabs = (listProps: TabsListProps = {}, withIcons = false) =>
  render(
    <Tabs defaultValue="one">
      <TabsList aria-label="tabs" {...listProps}>
        <TabsTrigger
          value="one"
          icon={withIcons ? <svg data-testid="icon-one" /> : undefined}
        >
          One
        </TabsTrigger>
        <TabsTrigger
          value="two"
          icon={withIcons ? <svg data-testid="icon-two" /> : undefined}
        >
          Two
        </TabsTrigger>
      </TabsList>
    </Tabs>,
  )

// Radix Tabs activate on mousedown.
const select = (tab: HTMLElement) =>
  fireEvent.mouseDown(tab, { button: 0, ctrlKey: false })

describe('Tabs', () => {
  it('renders the line variant with a 2px underline by default', () => {
    renderTabs()

    const list = screen.getByRole('tablist')
    const tab = screen.getByRole('tab', { name: 'One' })
    const line = tab.querySelector('[aria-hidden]')

    expect(list).toHaveAttribute('data-variant', 'line')
    expect(tab).toHaveClass(
      'text-14',
      'text-(--tab-fg)',
      '[--tab-fg:var(--color-text-secondary)]',
      'data-[state=active]:[--tab-fg:var(--color-primary)]',
    )
    expect(line).toHaveClass('h-0.5', 'group-data-[state=active]:bg-primary')
  })

  it('sizes the line tabs with the Figma text styles', () => {
    renderTabs({ size: 'sm' })

    expect(screen.getByRole('tab', { name: 'One' })).toHaveClass('text-12')
  })

  it('renders the pill variant as a segmented control', () => {
    renderTabs({ variant: 'pill', size: 'md' })

    const list = screen.getByRole('tablist')
    const active = screen.getByRole('tab', { name: 'One' })

    expect(list).toHaveAttribute('data-variant', 'pill')
    expect(list).toHaveClass('bg-black-4', 'rounded-20', 'p-1', 'gap-1')
    expect(active).toHaveAttribute('data-state', 'active')
    expect(active).toHaveClass(
      'data-[state=active]:bg-white-80',
      'data-[state=active]:shadow-2',
      'text-(--segment-fg)',
      'data-[state=active]:[--segment-fg:var(--color-black)]',
      'rounded-16',
    )
    // No underline in the segmented variants.
    expect(active.querySelector('[aria-hidden]')).toBeNull()
  })

  it('renders the solid variant without a track', () => {
    renderTabs({ variant: 'solid', size: 'sm' })

    const list = screen.getByRole('tablist')

    expect(list).toHaveAttribute('data-variant', 'solid')
    expect(list).not.toHaveClass('bg-black-4')
    expect(list).toHaveClass('gap-0.5')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveClass(
      'data-[state=active]:bg-black-4',
      'rounded-12',
      'text-12',
    )
  })

  it('shows only the active label in the icon-toggle variant', () => {
    renderTabs({ variant: 'icon-toggle' }, true)

    const one = screen.getByRole('tab', { name: 'One' })
    const two = screen.getByRole('tab', { name: 'Two' })

    expect(screen.getByTestId('icon-one')).toBeInTheDocument()
    // Inactive labels are visually hidden but keep the accessible name.
    expect(screen.getByText('Two')).toHaveClass(
      'group-data-[state=inactive]:sr-only',
    )
    expect(two).toHaveClass('data-[state=inactive]:size-9')

    select(two)

    expect(two).toHaveAttribute('data-state', 'active')
    expect(one).toHaveAttribute('data-state', 'inactive')
  })

  it('renders icon-only triggers as square buttons', () => {
    render(
      <Tabs defaultValue="one">
        <TabsList variant="pill" size="lg">
          <TabsTrigger value="one" icon={<svg />} aria-label="One" />
        </TabsList>
      </Tabs>,
    )

    const tab = screen.getByRole('tab', { name: 'One' })

    expect(tab).toHaveClass('p-3', '[&_svg:not([class*=size-])]:size-6')
    expect(tab.querySelector('span')).toBeNull()
  })

  it('warns about an icon-only trigger without an accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Tabs defaultValue="one">
        <TabsList variant="pill">
          <TabsTrigger value="one" icon={<svg />} />
          <TabsTrigger value="two" icon={<svg />} aria-label="Two" />
        </TabsList>
      </Tabs>,
    )

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/aria-label/)
    warn.mockRestore()
  })

  it('moves focus with the arrow keys and shows the focus ring', async () => {
    renderTabs({ variant: 'pill' })

    const one = screen.getByRole('tab', { name: 'One' })
    const two = screen.getByRole('tab', { name: 'Two' })

    one.focus()
    fireEvent.keyDown(one, { key: 'ArrowRight' })

    await waitFor(() => expect(two).toHaveFocus())
    // Inactive items are text-secondary; keyboard focus turns them black.
    expect(two).toHaveClass(
      'focus-ring',
      'focus-visible:[--segment-fg:var(--color-black)]',
    )
  })

  it.each([
    ['line', '--tab-fg:var(--color-primary)'],
    ['pill', '--segment-fg:var(--color-black)'],
  ] as const)(
    'renders asChild links as tabs, the active one coloured (%s)',
    (variant, activeColour) => {
      render(
        <Tabs defaultValue="one">
          <TabsList aria-label="tabs" variant={variant}>
            <TabsTrigger value="one" asChild icon={<svg data-testid="icon" />}>
              <a href="#one">One</a>
            </TabsTrigger>
            <TabsTrigger value="two" asChild>
              <a href="#two">Two</a>
            </TabsTrigger>
          </TabsList>
        </Tabs>,
      )

      const one = screen.getByRole('tab', { name: 'One' })

      // The link is the tab: no wrapping <button>, the icon and label inside.
      expect(one.tagName).toBe('A')
      expect(one).toHaveAttribute('href', '#one')
      expect(one).toHaveAttribute('data-state', 'active')
      expect(one).toContainElement(screen.getByTestId('icon'))
      expect(document.querySelector('button')).toBeNull()
      // `:enabled` never matches a link, so the active colour doesn't use it.
      expect(one.matches(':enabled')).toBe(false)
      expect(one).toHaveClass(`data-[state=active]:[${activeColour}]`)
      expect(one.className).not.toMatch(/enabled:/)
      if (variant === 'line') {
        expect(one.lastElementChild).toHaveClass(
          'group-data-[state=active]:bg-primary',
        )
      }

      fireEvent.mouseDown(screen.getByRole('tab', { name: 'Two' }), {
        button: 0,
        ctrlKey: false,
      })
      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute(
        'data-state',
        'active',
      )
    },
  )

  describe('filled (5.2)', () => {
    it('is a TabsVariant', () => {
      expectTypeOf<'filled'>().toExtend<TabsVariant>()
    })

    it('puts a Filled active item on the pill track', () => {
      renderTabs({ variant: 'filled', size: 'md' })

      const list = screen.getByRole('tablist')
      const active = screen.getByRole('tab', { name: 'One' })
      const idle = screen.getByRole('tab', { name: 'Two' })

      expect(list).toHaveAttribute('data-variant', 'filled')
      // The kit's Pill track: Black/4%, p4, gap 4, r20 at md.
      expect(list).toHaveClass('bg-black-4', 'rounded-20', 'p-1', 'gap-1')
      // The Filled Button: Primary, the per-mode white label, unless disabled.
      expect(active).toHaveClass(
        'data-[state=active]:not-disabled:bg-primary',
        'data-[state=active]:not-disabled:text-white',
        'rounded-16',
        'text-14',
      )
      expect(active).not.toHaveClass('data-[state=active]:bg-white-80')
      // The others are Borderless, text-secondary.
      expect(idle).toHaveAttribute('data-state', 'inactive')
      expect(idle).toHaveClass('[--segment-fg:var(--color-text-secondary)]')
      expect(active.querySelector('[aria-hidden]')).toBeNull()
    })

    it('keeps the arrow keys, Home and End, and skips disabled tabs', async () => {
      render(
        <Tabs defaultValue="daily">
          <TabsList variant="filled" aria-label="Period">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" disabled>
              Monthly
            </TabsTrigger>
          </TabsList>
        </Tabs>,
      )
      const daily = screen.getByRole('tab', { name: 'Daily' })
      const weekly = screen.getByRole('tab', { name: 'Weekly' })
      const monthly = screen.getByRole('tab', { name: 'Monthly' })

      daily.focus()
      fireEvent.keyDown(daily, { key: 'ArrowRight' })
      await waitFor(() => expect(weekly).toHaveFocus())
      expect(weekly).toHaveAttribute('aria-selected', 'true')
      fireEvent.keyDown(weekly, { key: 'ArrowRight' })
      await waitFor(() => expect(daily).toHaveFocus())
      fireEvent.keyDown(daily, { key: 'End' })
      await waitFor(() => expect(weekly).toHaveFocus())
      expect(monthly).toBeDisabled()
      // A disabled item keeps the disabled look, never the fill.
      expect(monthly).toHaveClass(
        'disabled:bg-black-4',
        'disabled:text-black-20',
      )
    })

    it('follows a controlled value', () => {
      const Controlled = () => {
        const [value, setValue] = useState('two')
        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList variant="filled" aria-label="tabs">
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
          </Tabs>
        )
      }
      render(<Controlled />)

      expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute(
        'data-state',
        'active',
      )
      select(screen.getByRole('tab', { name: 'One' }))
      expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute(
        'data-state',
        'active',
      )
    })

    it('follows the reading direction in right-to-left text', async () => {
      render(
        <Tabs defaultValue="one" dir="rtl">
          <TabsList variant="filled" aria-label="tabs">
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
        </Tabs>,
      )
      const one = screen.getByRole('tab', { name: 'One' })
      one.focus()
      fireEvent.keyDown(one, { key: 'ArrowLeft' })
      await waitFor(() =>
        expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus(),
      )
    })

    it('renders on the server and forwards refs', () => {
      const html = renderToString(
        <Tabs defaultValue="one">
          <TabsList variant="filled" aria-label="tabs">
            <TabsTrigger value="one">One</TabsTrigger>
          </TabsList>
        </Tabs>,
      )
      expect(html).toContain('data-variant="filled"')
      expect(html).toContain('data-[state=active]:not-disabled:bg-primary')

      const ref = createRef<HTMLButtonElement>()
      render(
        <Tabs defaultValue="one">
          <TabsList variant="filled" aria-label="tabs">
            <TabsTrigger ref={ref} value="one">
              One
            </TabsTrigger>
          </TabsList>
        </Tabs>,
      )
      expect(ref.current).toBe(screen.getByRole('tab', { name: 'One' }))
    })
  })
})
