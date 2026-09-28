import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tabs, TabsList, type TabsListProps, TabsTrigger } from './Tabs'

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
    expect(tab).toHaveClass('text-14', 'data-[state=active]:text-primary')
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
      'opacity-40',
      'data-[state=active]:opacity-100',
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

    expect(tab).toHaveClass('p-3', '[&_svg]:size-6')
    expect(tab.querySelector('span')).toBeNull()
  })
})
