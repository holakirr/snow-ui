import { StarIcon } from '@holakirr/snow-ui-icons'
import { composeStories } from '@storybook/react'
import { render, screen, within } from '@testing-library/react'
import { createRef, forwardRef, memo } from 'react'
import { renderToString } from 'react-dom/server'
import { userEvent } from 'storybook/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ROLES } from '../../constants'
import { resetUnnamedIconOnlyWarnings } from '../../utils/accessible-name'
import { Button } from './Button'
import * as stories from './Button.stories'

const {
  Borderless,
  Gray,
  Filled,
  Outline,
  Bare,
  Disabled,
  Sm,
  Md,
  Lg,
  WithChildren,
  AsLink,
  WithStartContent,
  WithEndContent,
  WithStartAndEndContent,
  IconButton,
} = composeStories(stories)

describe('Button', () => {
  it('renders with default props', async () => {
    await Borderless.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-transparent') // primary variant
  })

  it('renders with secondary variant', async () => {
    await Gray.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-black-4')
    expect(button).toHaveClass('hover:bg-black-10')
  })

  it('renders with filled variant', async () => {
    await Filled.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
    // `white` flips: a white label on black, a black label on the dark-mode
    // indigo Primary (white on indigo is 2.07:1).
    expect(button).toHaveClass('text-white')
    expect(button).toHaveClass('hover:bg-primary-hover')
  })

  it('renders with outline variant', async () => {
    await Outline.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    // 0.5px inside stroke, like the Figma "Outline" variant.
    expect(button).toHaveClass('inset-ring-[0.5px]')
    expect(button).toHaveClass('inset-ring-black-10')
  })

  it('renders with bare variant', async () => {
    await Bare.run()

    const button = screen.getByRole(ROLES.button)

    // Figma's 40% opacity is 2.85:1; the label is text-secondary instead,
    // through --button-fg, which hover and keyboard focus switch to black.
    expect(button).toHaveClass(
      'text-(--button-fg)',
      '[--button-fg:var(--color-text-secondary)]',
      'hover:[--button-fg:var(--color-black)]',
    )
    expect(button).not.toHaveClass('text-black')
    expect(button.className).not.toMatch(/opacity-40/)
    expect(button).toHaveClass('p-0')
    expect(button).not.toHaveClass('px-3')
    expect(button).not.toHaveClass('min-h-6')
  })

  it('renders disabled buttons with the token styles', async () => {
    await Disabled.run()

    const buttons = screen.getAllByRole(ROLES.button)

    expect(buttons).toHaveLength(5)
    for (const button of buttons) {
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:text-black-20')
    }
  })

  it('renders with sm size', async () => {
    await Sm.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-12')
    expect(button).toHaveClass('min-h-6')
    expect(button).toHaveClass('py-1')
    expect(button).toHaveClass('px-3')
    expect(button).toHaveClass('gap-1')
    expect(button).toHaveClass('rounded-12')
    expect(screen.getByText('Button')).toHaveClass('text-12')
  })

  it('renders with md size', async () => {
    await Md.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-14')
    expect(button).toHaveClass('min-h-9')
    expect(button).toHaveClass('py-2')
    expect(button).toHaveClass('px-4')
    expect(button).toHaveClass('gap-1.5')
    expect(button).toHaveClass('rounded-16')
    expect(screen.getByText('Button')).toHaveClass('text-14')
  })

  it('renders with lg size', async () => {
    await Lg.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('text-16')
    expect(button).toHaveClass('min-h-12')
    expect(button).toHaveClass('py-3')
    expect(button).toHaveClass('px-5')
    expect(button).toHaveClass('gap-2')
    expect(button).toHaveClass('rounded-20')
    expect(screen.getByText('Button')).toHaveClass('text-16')
  })

  it('lets textSize override the label size', async () => {
    const { container } = render(<Lg textSize={12} />)

    expect(within(container).getByText('Button')).toHaveClass('text-12')
  })

  it('renders with children', async () => {
    await WithChildren.run()

    const button = screen.getByRole(ROLES.button)
    const text = screen.getByText('with-children')

    expect(button).toBeInTheDocument()
    expect(text).toBeInTheDocument()
    expect(button).toContainElement(text)
    expect(button).toHaveTextContent('with-children')
    expect(text.tagName).toBe('P')
  })

  it('renders as link', async () => {
    await AsLink.run()

    const button = screen.getByRole(ROLES.link)

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href')
    expect(button.tagName).toBe('A')
    expect(button).not.toHaveAttribute('type')
    expect(button).not.toHaveAttribute('role')
  })

  it('sets native button type and no default title', async () => {
    await Filled.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toHaveAttribute('type', 'button')
    expect(button).not.toHaveAttribute('title')
    expect(button).not.toHaveAttribute('tabindex')
    expect(button).not.toHaveAttribute('aria-label', 'Button aria label')
  })

  it('renders with start content', async () => {
    await WithStartContent.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img, { name: 'Left Icon' })

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders with end content', async () => {
    await WithEndContent.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img, { name: 'Right Icon' })

    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders with start and end content', async () => {
    await WithStartAndEndContent.run()

    const button = screen.getByRole(ROLES.button)
    const leftIcon = screen.getByRole(ROLES.img, { name: 'Left Icon' })
    const rightIcon = screen.getByRole(ROLES.img, { name: 'Right Icon' })

    expect(button).toBeInTheDocument()
    expect(leftIcon).toBeInTheDocument()
    expect(rightIcon).toBeInTheDocument()
    expect(button).toContainElement(leftIcon)
    expect(button).toContainElement(rightIcon)
  })

  it('renders as icon button', async () => {
    await IconButton.run()

    const button = screen.getByRole(ROLES.button)
    const icon = screen.getByRole(ROLES.img)

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('p-1')
    expect(button).toHaveClass(
      '[&>svg:not([width]):not([class*=size-])]:size-4',
    )
    expect(button).toContainElement(icon)
  })

  it('shows the focus-ring on keyboard focus, even for bare buttons', async () => {
    await Bare.run()

    const button = screen.getByRole(ROLES.button)

    expect(button).toHaveClass(
      'focus-ring',
      'focus-visible:[--button-fg:var(--color-black)]',
    )
  })

  it('keeps a custom colour on a bare button in every state', () => {
    render(<Button variant="bare" className="text-red-text" label="Delete" />)

    const button = screen.getByRole(ROLES.button, { name: 'Delete' })

    // The consumer's colour replaces `text-(--button-fg)`; the hover and
    // focus classes only change --button-fg, which nothing reads any more.
    expect(button).toHaveClass('text-red-text')
    expect(button).not.toHaveClass('text-(--button-fg)')
    expect(button.className).not.toMatch(/(hover|focus-visible):text-/)
  })

  it('leaves icons that size themselves alone', () => {
    const { container } = render(
      <>
        <Button
          label="Sized by class"
          startContent={<svg className="size-6" />}
        />
        <Button label="Sized by attribute" startContent={<svg width="24" />} />
        <Button label="Unsized" startContent={<svg />} />
      </>,
    )
    const [byClass, byAttribute, unsized] = Array.from(
      container.querySelectorAll('svg'),
    )

    // The Figma size applies only to an <svg> with no width and no size-* class.
    const matches = (svg: Element) =>
      svg.matches(':not([width]):not([class*=size-])')

    expect(matches(byClass)).toBe(false)
    expect(matches(byAttribute)).toBe(false)
    expect(matches(unsized)).toBe(true)
    expect(unsized.parentElement).toHaveClass(
      '[&>svg:not([width]):not([class*=size-])]:size-3',
    )
  })

  it('keeps an explicit icon size prop (e.g. Dialog close, 24px)', () => {
    render(
      <Button
        size="md"
        startContent={<StarIcon size={24} data-testid="star" />}
        label=""
        title="Star"
      />,
    )

    expect(screen.getByTestId('star')).toHaveAttribute('width', '24')
  })
})

// A self-closing i18n element, like react-intl's <FormattedMessage id /> or
// react-i18next's <Trans i18nKey />: it renders text without children.
const FormattedMessage = ({ id }: { id: string }) => <>{id}</>

// Icons wrapped in forwardRef or memo, named like icons.
const ArrowIcon = forwardRef<SVGSVGElement>((props, ref) => (
  <svg ref={ref} {...props} />
))
ArrowIcon.displayName = 'ArrowIcon'
const MemoStarIcon = memo(function StarGlyphIcon() {
  return <svg />
})

describe('Button without an accessible name', () => {
  beforeEach(resetUnnamedIconOnlyWarnings)
  afterEach(() => vi.restoreAllMocks())

  it.each([
    [
      'as the only child',
      <Button key="b">{<FormattedMessage id="Save" />}</Button>,
    ],
    [
      'as the start content',
      <Button key="b" startContent={<FormattedMessage id="Save" />} />,
    ],
  ])('takes a text component %s for text, not an icon', (_, button) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(button)

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(warn).not.toHaveBeenCalled()
  })

  it.each([
    ['forwardRef', <ArrowIcon key="b" />],
    ['memo', <MemoStarIcon key="b" />],
  ])('recognises a %s icon component', (_, icon) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<Button>{icon}</Button>)

    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('warns once in development about an unnamed icon-only button', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <>
        <Button startContent={<StarIcon />} />
        <Button>
          <StarIcon />
        </Button>
      </>,
    )

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toBe(
      'Button: an icon-only button needs an `aria-label` or `aria-labelledby`.',
    )
  })

  it.each([
    ['at the end', <Button key="b" endContent={<StarIcon />} />],
    [
      'at both ends',
      <Button key="b" startContent={<StarIcon />} endContent={<StarIcon />} />,
    ],
    [
      'labelled but aria-hidden',
      <Button key="b">
        <svg aria-hidden="true" aria-label="Star" />
      </Button>,
    ],
    [
      'labelled but aria-hidden, at the start',
      <Button key="b" startContent={<svg aria-hidden aria-label="Star" />} />,
    ],
  ])('warns about an unnamed icon %s', (_, button) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(button)

    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('warns about an unnamed icon-only asChild element', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Button asChild>
        <a href="/">
          <StarIcon />
        </a>
      </Button>,
    )

    expect(warn).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['a label', <Button key="b" startContent={<StarIcon />} label="Star" />],
    [
      'an aria-label',
      <Button key="b" startContent={<StarIcon />} aria-label="Star" />,
    ],
    ['a title', <Button key="b" startContent={<StarIcon />} title="Star" />],
    [
      'a labelled icon',
      <Button key="b" startContent={<StarIcon alt="Star" />} />,
    ],
    [
      'screen-reader text',
      <Button key="b" startContent={<StarIcon />}>
        <span className="sr-only">Star</span>
      </Button>,
    ],
    [
      'a named asChild element',
      <Button key="b" asChild>
        <a href="/" aria-label="Home">
          <StarIcon />
        </a>
      </Button>,
    ],
    ['text', <Button key="b">Star</Button>],
    [
      'an end icon and a label',
      <Button key="b" endContent={<StarIcon />} label="Next" />,
    ],
    ['a text end content', <Button key="b" endContent="Next" />],
  ])('does not warn with %s', (_, button) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(button)

    expect(warn).not.toHaveBeenCalled()
  })
})

describe('Button loading', () => {
  // Composed stories run earlier in this file can leave their own buttons in
  // the document: query inside each test's container.
  const view = (ui: Parameters<typeof render>[0]) => {
    const result = render(ui)
    return { ...result, screen: within(result.container) }
  }

  it('keeps the name and size, adds aria-busy and a hidden spinner', () => {
    const { screen } = view(
      <Button variant="filled" size="md" label="Save Changes" loading />,
    )

    const button = screen.getByRole('button', { name: 'Save Changes' })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('data-loading')
    expect(button).not.toBeDisabled()
    // The content stays in the box (no layout shift), unpainted.
    expect(button).toHaveTextContent('Save Changes')
    expect(button).toHaveClass(
      'relative',
      '[-webkit-text-fill-color:transparent]',
      '[&>:not([data-button-spinner])]:opacity-0',
    )
    // Filled turns Gray, as in the kit.
    expect(button).toHaveClass('bg-black-4', 'text-black', 'hover:bg-black-4')
    expect(button).not.toHaveClass('bg-primary', 'text-white')
    expect(button).toHaveClass('active:scale-100')

    // The spinner is Spinner's ring, hidden from assistive technology.
    const spinner = button.querySelector('[data-button-spinner]')
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
    expect(spinner).toHaveClass('absolute', 'size-4')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('sizes the spinner like the icon: 12/16/20, 16/20/24 alone', () => {
    const { rerender, screen } = view(<Button size="sm" label="Save" loading />)
    const spinner = () =>
      screen.getByRole('button').querySelector('[data-button-spinner]')
    expect(spinner()).toHaveClass('size-3')
    rerender(<Button size="lg" label="Save" loading />)
    expect(spinner()).toHaveClass('size-5')
    rerender(
      <Button size="md" aria-label="Star" startContent={<svg />} loading />,
    )
    expect(spinner()).toHaveClass('size-5')
  })

  it('is not activated by a click, Enter or Space and keeps focus', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onParentClick = vi.fn()
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault())
    const { rerender, screen } = view(
      // biome-ignore lint/a11y/noStaticElementInteractions: a click listener to check propagation
      // biome-ignore lint/a11y/useKeyWithClickEvents: a click listener to check propagation
      <div onClick={onParentClick}>
        <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
          <input aria-label="Name" />
          <Button type="submit" label="Save" loading onClick={onClick} />
        </form>
      </div>,
    )
    const button = screen.getByRole('button', { name: 'Save' })

    await user.click(button)
    button.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    // Implicit submission (Enter in a field) clicks the default button.
    screen.getByRole('textbox').focus()
    await user.keyboard('a{Enter}')
    expect(onClick).not.toHaveBeenCalled()
    expect(onParentClick).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()

    // Focusable while loading, and active again when done.
    button.focus()
    expect(button).toHaveFocus()
    rerender(
      // biome-ignore lint/a11y/noStaticElementInteractions: a click listener to check propagation
      // biome-ignore lint/a11y/useKeyWithClickEvents: a click listener to check propagation
      <div onClick={onParentClick}>
        <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
          <input aria-label="Name" />
          <Button type="submit" label="Save" onClick={onClick} />
        </form>
      </div>,
    )
    expect(button).toHaveFocus()
    expect(button).not.toHaveAttribute('aria-busy')
    expect(button).not.toHaveAttribute('aria-disabled')
    expect(button.querySelector('[data-button-spinner]')).toBeNull()
    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('does not follow an asChild link while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onLinkClick = vi.fn()
    const { screen } = view(
      <Button asChild label="Docs" loading onClick={onClick}>
        {/* biome-ignore lint/a11y/useValidAnchor: a router link's own handler */}
        {/* biome-ignore lint/a11y/useAnchorContent: the Button renders its label inside */}
        <a href="#docs" onClick={onLinkClick} />
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveAttribute('aria-busy', 'true')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link.querySelector('[data-button-spinner]')).not.toBeNull()

    await user.click(link)
    link.focus()
    await user.keyboard('{Enter}')
    expect(onClick).not.toHaveBeenCalled()
    expect(onLinkClick).not.toHaveBeenCalled()
    expect(window.location.hash).toBe('')
  })

  it('keeps the other variants’ fills, without hover', () => {
    const { rerender, screen } = view(
      <Button variant="gray" label="A" loading />,
    )
    expect(screen.getByRole('button')).toHaveClass('bg-black-4')
    rerender(<Button variant="outline" label="A" loading />)
    expect(screen.getByRole('button')).toHaveClass(
      'inset-ring-black-10',
      'hover:bg-transparent',
    )
    expect(screen.getByRole('button')).not.toHaveClass('hover:bg-black-4')
  })

  it('leaves `disabled` to win and does nothing when not loading', () => {
    const { rerender, screen } = view(<Button label="A" loading disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
    rerender(<Button label="A" loading={false} />)
    const button = screen.getByRole('button')
    expect(button).not.toHaveAttribute('aria-busy')
    expect(button).not.toHaveAttribute('data-loading')
    expect(button.className).not.toContain('opacity-0')
  })

  it('forwards the ref while loading', () => {
    const ref = createRef<HTMLElement>()
    const { screen } = view(<Button ref={ref} label="A" loading />)
    expect(ref.current).toBe(screen.getByRole('button'))
  })

  it('renders on the server with the busy state and the spinner', () => {
    const html = renderToString(<Button label="Save" loading />)
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('aria-disabled="true"')
    expect(html).toContain('data-button-spinner=""')
    expect(html).toContain('Save')
  })

  it('places the spinner in the middle in right-to-left text too', () => {
    const { screen } = view(
      <div dir="rtl">
        <Button label="حفظ" startContent={<svg />} loading />
      </div>,
    )
    const spinner = screen
      .getByRole('button')
      .querySelector('[data-button-spinner]')
    expect(spinner).toHaveClass('absolute', 'inset-0', 'm-auto')
  })

  it('puts text right in the button in an element, for forced colors', () => {
    // Firefox's forced-colors mode repaints a transparent
    // -webkit-text-fill-color, so text right in the button (or in an asChild
    // link) would show under the spinner; an element's opacity stays.
    const bareText = (element: Element) =>
      [...element.childNodes].filter(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      )
    const { rerender, screen } = view(
      <Button loading>
        <svg /> Save {2}
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Save 2' })
    expect(bareText(button)).toEqual([])
    expect(button.firstElementChild?.tagName).toBe('svg')
    // One span for the run of text, the box the flex layout gave it.
    expect(
      [...button.children].map((child) => child.textContent?.trim()),
    ).toEqual(['', 'Save 2', ''])

    rerender(
      <Button asChild loading>
        <a href="#docs">Docs</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(bareText(link)).toEqual([])

    // Not loading, the content is as before: no wrapper.
    rerender(<Button>Save</Button>)
    expect(screen.getByRole('button').firstChild?.nodeType).toBe(Node.TEXT_NODE)
  })
})
