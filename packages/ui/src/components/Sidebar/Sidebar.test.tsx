import { act, fireEvent, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  Sidebar,
  SidebarGroupAction,
  SidebarMenuAction,
  SidebarProvider,
  SidebarTrigger,
} from './Sidebar'
import { readSidebarState, SIDEBAR_COOKIE_NAME } from './sidebar-cookie'

const clearCookies = () => {
  for (const name of ['sidebar_state', 'sidebar:state']) {
    // biome-ignore lint/suspicious/noDocumentCookie: resetting the test cookies
    document.cookie = `${name}=; path=/; max-age=0`
  }
}

const setCookie = (cookie: string) => {
  // biome-ignore lint/suspicious/noDocumentCookie: the saved sidebar state
  document.cookie = `${cookie}; path=/`
}

const panel = () => {
  const node = document.querySelector('[data-state]')
  if (!node) throw new Error('sidebar not rendered')
  return node
}

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

beforeEach(clearCookies)
afterEach(clearCookies)

describe('readSidebarState', () => {
  it('reads the sidebar_state cookie of a Cookie header', () => {
    expect(SIDEBAR_COOKIE_NAME).toBe('sidebar_state')
    expect(readSidebarState('theme=dark; sidebar_state=false')).toBe(false)
    expect(readSidebarState('sidebar_state=true;theme=dark')).toBe(true)
  })

  it('falls back to the pre-5.1 sidebar:state cookie', () => {
    expect(readSidebarState('sidebar:state=false')).toBe(false)
    // The new cookie wins.
    expect(readSidebarState('sidebar:state=false; sidebar_state=true')).toBe(
      true,
    )
  })

  it('returns undefined without a saved state', () => {
    expect(readSidebarState('')).toBeUndefined()
    expect(readSidebarState(null)).toBeUndefined()
    expect(readSidebarState('sidebar_state=maybe')).toBeUndefined()
    expect(readSidebarState('my_sidebar_state=false')).toBeUndefined()
  })

  it('reads document.cookie without an argument', () => {
    setCookie('sidebar_state=false')
    expect(readSidebarState()).toBe(false)
  })
})

describe('SidebarProvider', () => {
  const app = (
    <SidebarProvider>
      <Sidebar>
        <a href="#home">Home</a>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  )

  it('saves the state in the sidebar_state cookie', () => {
    render(app)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))

    expect(panel()).toHaveAttribute('data-state', 'collapsed')
    expect(document.cookie).toContain('sidebar_state=false')
  })

  it('restores the saved state in the browser, over defaultOpen', () => {
    setCookie('sidebar:state=false')
    render(app)

    expect(panel()).toHaveAttribute('data-state', 'collapsed')
  })

  it('hydrates the server markup without a mismatch, then applies the saved state', async () => {
    setCookie('sidebar_state=false')
    // The server has no cookie to read: it renders `defaultOpen`.
    const html = renderToString(app)
    expect(html).toContain('data-state="expanded"')

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const onRecoverableError = vi.fn()

    const root = await act(async () =>
      hydrateRoot(container, app, { onRecoverableError }),
    )

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(
      container.querySelector('[data-state]')?.getAttribute('data-state'),
    ).toBe('collapsed')

    act(() => root.unmount())
    container.remove()
  })

  it('server-renders the state read from the request cookie', () => {
    const defaultOpen = readSidebarState('sidebar_state=false') ?? true
    const html = renderToString(
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar />
      </SidebarProvider>,
    )

    expect(html).toContain('data-state="collapsed"')
  })

  it('toggles with ⌘B / Ctrl+B, except in text fields and editors', () => {
    render(
      <>
        {app}
        <textarea aria-label="Notes" />
      </>,
    )

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Notes' }), {
      key: 'b',
      ctrlKey: true,
    })
    expect(panel()).toHaveAttribute('data-state', 'expanded')

    fireEvent.keyDown(document.body, { key: 'b', metaKey: true })
    expect(panel()).toHaveAttribute('data-state', 'collapsed')
  })
})

describe('Sidebar', () => {
  it('hides a collapsed off-canvas sidebar once it has slid out', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar data-testid="sidebar" />
      </SidebarProvider>,
    )

    // `invisible` (visibility: hidden) takes the links out of the tab order
    // and the accessibility tree; the transition delays it until the panel
    // is off-screen (the Offcanvas story tests it in a browser).
    expect(panel()).toHaveAttribute('data-collapsible', 'offcanvas')
    expect(screen.getByTestId('sidebar')).toHaveClass(
      'group-data-[collapsible=offcanvas]:invisible',
      'transition-[left,right,width,visibility]',
    )
  })

  it('connects the trigger to the sidebar it controls', () => {
    render(
      <SidebarProvider>
        <Sidebar data-testid="sidebar" />
        <SidebarTrigger />
      </SidebarProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'Toggle Sidebar' })

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute(
      'aria-controls',
      screen.getByTestId('sidebar').id,
    )

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('gives the actions a 24px hit area on every screen size', () => {
    render(
      <SidebarProvider>
        <SidebarGroupAction aria-label="Add project" />
        <SidebarMenuAction aria-label="More" />
      </SidebarProvider>,
    )

    for (const name of ['Add project', 'More']) {
      const action = screen.getByRole('button', { name })
      // A 20px button: 36px on touch screens, 24px (WCAG 2.5.8) from `md` up.
      expect(action).toHaveClass(
        'w-5',
        'after:absolute',
        'after:-inset-2',
        'md:after:-inset-0.5',
      )
      expect(action.className).not.toContain('after:md:hidden')
    }
  })

  describe('on small screens', () => {
    const innerWidth = window.innerWidth

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 500,
      })
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: innerWidth,
      })
    })

    it('puts className, style and props on the sheet', () => {
      render(
        <SidebarProvider>
          <Sidebar
            className="custom-sidebar"
            style={{ color: 'red' }}
            data-testid="sidebar"
          >
            <a href="#home">Home</a>
          </Sidebar>
          <SidebarTrigger />
        </SidebarProvider>,
      )
      const trigger = screen.getByRole('button', { name: 'Toggle Sidebar' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(trigger)

      const sheet = screen.getByRole('dialog')
      expect(sheet).toHaveAttribute('data-testid', 'sidebar')
      expect(sheet).toHaveClass('custom-sidebar', 'bg-background-1')
      expect(sheet.style.color).toBe('red')
      expect(sheet.style.getPropertyValue('--sidebar-width')).toBe('18rem')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(trigger).toHaveAttribute('aria-controls', sheet.id)
    })
  })
})
