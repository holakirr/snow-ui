import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from 'vitest'
import { resetDeprecationWarnings } from '../utils/deprecation'
import { BreadcrumbLink } from './Breadcrumb'
import { Button } from './Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog'
import { IconText } from './IconText'
import { Link } from './Link'
import { ListItem } from './ListItem'
import {
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'
import { SidebarMenuButton, SidebarProvider } from './Sidebar'
import { Tag } from './Tag'
import { Typography } from './Text'

const icon = <svg data-testid="icon" />

beforeAll(() => {
  // The Sidebar reads a media query, which jsdom lacks.
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList
})

describe('asChild', () => {
  it('Button renders its child with merged classes, props and content', () => {
    const ref = createRef<HTMLAnchorElement>()
    const onClick = vi.fn()
    const onChildClick = vi.fn()

    render(
      <Button
        asChild
        ref={ref}
        variant="outline"
        label="Docs"
        startContent={icon}
        endContent={<svg data-testid="end" />}
        onClick={onClick}
        data-state="on"
      >
        {/* biome-ignore lint/a11y/useValidAnchor: tests that the handlers compose */}
        <a href="#docs" className="px-8" onClick={onChildClick}>
          <span>child</span>
        </a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: /Docs/ })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '#docs')
    expect(link).toHaveAttribute('data-state', 'on')
    expect(link).not.toHaveAttribute('type')
    // twMerge: the child's `px-8` replaces the size's `px-3`.
    expect(link).toHaveClass('px-8', 'inset-ring-black-10')
    expect(link).not.toHaveClass('px-3')
    expect(link.className.match(/px-8/g)).toHaveLength(1)
    // The label and the start / end content go inside, around its children.
    expect(link.firstElementChild).toBe(screen.getByTestId('icon'))
    expect(link.lastElementChild).toBe(screen.getByTestId('end'))
    expect(link).toHaveTextContent('Docschild')
    expect(ref.current).toBe(link)

    fireEvent.click(link)
    expect(onChildClick).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('Button keeps the child ref too', () => {
    const buttonRef = createRef<HTMLAnchorElement>()
    const childRef = createRef<HTMLAnchorElement>()

    render(
      <Button asChild ref={buttonRef}>
        <a href="#x" ref={childRef}>
          Profile
        </a>
      </Button>,
    )

    expect(buttonRef.current).toBe(childRef.current)
    expect(childRef.current?.tagName).toBe('A')
  })

  it('Typography styles its child', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <Typography asChild size={24} semibold ref={ref} className="mb-2">
        <h1 className="text-center">Title</h1>
      </Typography>,
    )

    const heading = screen.getByRole('heading', { level: 1, name: 'Title' })
    expect(heading).toHaveClass('text-24', 'font-semibold', 'mb-2')
    // The child's alignment wins over the default `text-start`.
    expect(heading).toHaveClass('text-center')
    expect(heading).not.toHaveClass('text-start')
    expect(ref.current).toBe(heading)
  })

  it('IconText puts the icon and the text inside its child', () => {
    render(
      <IconText asChild interactive active icon={icon}>
        <a href="#home">Home</a>
      </IconText>,
    )

    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toHaveAttribute('data-active', 'true')
    expect(link).toHaveClass('p-2', 'bg-black-4')
    expect(link.firstElementChild).toBe(screen.getByTestId('icon'))
    // A string child is still rendered as 14 Regular text.
    expect(screen.getByText('Home')).toHaveClass('text-14')
  })

  it('ListItem renders the title and description inside its child', () => {
    render(
      <ul>
        <ListItem asChild title="Drew Cano" description="Online" icon={icon}>
          <li data-testid="row">
            <span>Badge</span>
          </li>
        </ListItem>
      </ul>,
    )

    const row = screen.getByTestId('row')
    expect(row.tagName).toBe('LI')
    expect(row).toHaveClass('text-start')
    expect(row).toHaveTextContent('Drew CanoOnlineBadge')
    expect(row.lastElementChild).toHaveTextContent('Badge')
  })

  it('Link renders a router link with the link styles and the external text', () => {
    render(
      <Link asChild variant="external">
        <a href="https://example.com">Example</a>
      </Link>,
    )

    const link = screen.getByRole('link', {
      name: 'Example (opens in a new tab)',
    })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveClass('inline-flex', 'text-black')
  })

  it('BreadcrumbLink and PaginationLink render their child', () => {
    render(
      <>
        <BreadcrumbLink asChild>
          <a href="#home">Home</a>
        </BreadcrumbLink>
        <PaginationLink asChild isActive size="md">
          <a href="#2">2</a>
        </PaginationLink>
        <PaginationPrevious asChild>
          <a href="#1">Prev</a>
        </PaginationPrevious>
        <PaginationNext asChild>
          <a href="#3" className="px-6">
            Next
          </a>
        </PaginationNext>
      </>,
    )

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass(
      'rounded-12',
      'px-3',
    )
    const current = screen.getByRole('link', { name: '2' })
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current).toHaveClass('h-8', 'bg-black-4')
    const previous = screen.getByRole('link', { name: 'Go to previous page' })
    expect(previous).toHaveAttribute('href', '#1')
    expect(previous).toHaveClass('ps-2')
    expect(previous.querySelector('svg')).toHaveClass('rtl:-scale-x-100')
    const next = screen.getByRole('link', { name: 'Go to next page' })
    expect(next).toHaveTextContent('Next')
    expect(next).toHaveClass('px-6')
  })

  it('Sidebar parts merge their child classes with twMerge', () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton asChild>
          <a href="#x" className="p-4">
            Item
          </a>
        </SidebarMenuButton>
      </SidebarProvider>,
    )

    const link = screen.getByRole('link', { name: 'Item' })
    expect(link).toHaveClass('p-4', 'rounded-12')
    expect(link).not.toHaveClass('p-2')
  })
})

describe('deprecations', () => {
  let warn: MockInstance<typeof console.warn>

  beforeEach(() => {
    resetDeprecationWarnings()
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
    vi.unstubAllEnvs()
  })

  const warnings = () => warn.mock.calls.map(([message]) => String(message))

  it('keeps `as` working and warns once per component', () => {
    const { rerender } = render(
      <>
        <Button as="a" href="#a" label="A" />
        <Button as="a" href="#b" label="B" />
        <Typography as="h2">Heading</Typography>
        <IconText as="button" icon={icon}>
          Row
        </IconText>
        <ListItem as="button" title="Item" />
      </>,
    )

    expect(screen.getByRole('link', { name: 'A' })).toHaveAttribute('href')
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-14')
    expect(screen.getByRole('button', { name: 'Row' })).toHaveAttribute(
      'type',
      'button',
    )
    expect(screen.getByRole('button', { name: 'Item' })).toHaveAttribute(
      'type',
      'button',
    )

    rerender(<Button as="a" href="#c" label="C" />)

    const messages = warnings()
    expect(messages).toHaveLength(4)
    for (const component of ['Button', 'Typography', 'IconText', 'ListItem']) {
      const matching = messages.filter((message) =>
        message.includes(`${component}: the \`as\` prop is deprecated`),
      )
      expect(matching).toHaveLength(1)
      expect(matching[0]).toContain('asChild')
    }
  })

  it('keeps the left / right and onClose props working and warns once', () => {
    const onClose = vi.fn()
    render(
      <>
        <Button
          label="Button"
          leftContent={<svg data-testid="left" />}
          rightContent={<svg data-testid="right" />}
        />
        <Tag label="React" leftContent={icon} onClose={onClose} />
        <Tag label="Vue" leftContent={icon} onClose={onClose} />
        <Dialog open>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader leftContent={<svg data-testid="dialog-left" />}>
              <DialogTitle>Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>,
    )

    expect(screen.getByTestId('left')).toBeInTheDocument()
    expect(screen.getByTestId('right')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-left')).toBeInTheDocument()
    // The open dialog hides the rest of the page from the accessibility tree.
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove tag React', hidden: true }),
    )
    expect(onClose).toHaveBeenCalledOnce()

    const messages = warnings()
    expect(messages).toHaveLength(4)
    expect(messages.join('\n')).toMatch(/Button: `leftContent`.*startContent/)
    expect(messages.join('\n')).toMatch(/Tag: `leftContent`.*startContent/)
    expect(messages.join('\n')).toMatch(/Tag: `onClose`.*onRemove/)
    expect(messages.join('\n')).toMatch(/DialogHeader: `leftContent`/)
  })

  it('prefers the new props when both are passed', () => {
    render(
      <Button
        label="Button"
        startContent={<svg data-testid="start" />}
        leftContent={<svg data-testid="left" />}
      />,
    )

    expect(screen.getByTestId('start')).toBeInTheDocument()
    expect(screen.queryByTestId('left')).not.toBeInTheDocument()
  })

  it('stays silent in production builds', () => {
    vi.stubEnv('NODE_ENV', 'production')
    render(<Button as="a" href="#a" label="A" />)

    expect(warn).not.toHaveBeenCalled()
  })
})
