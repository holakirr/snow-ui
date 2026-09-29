---
"@holakirr/snow-ui": minor
---

Sidebar:

- **Collapsed off-canvas, the sidebar leaves the tab order and the accessibility tree.** Once it has slid out it is `visibility: hidden`, so Tab no longer walks through links you can't see (WCAG 2.4.3, 2.4.11). A `SidebarRail` inside it stays visible at the screen edge to reopen it.
- **Server rendering without a hydration mismatch.** `SidebarProvider` no longer reads the saved state while hydrating: the server and the first client render use `defaultOpen`, then the browser applies the saved state. To server-render the saved state, read it with the new `readSidebarState(cookieHeader)` (a plain function, callable from Server Components) and pass it as `defaultOpen`.
- **The cookie is now `sidebar_state`** (exported as `SIDEBAR_COOKIE_NAME`): `sidebar:state` isn't a valid cookie name (`:`), and some servers drop it. The old cookie is still read, so users keep their saved state.
- `SidebarTrigger` sets `aria-expanded` and `aria-controls` (the sidebar's id).
- On small screens, `Sidebar`'s `className`, `style` and other props go on the sheet (they were dropped).
- `SidebarGroupAction` and `SidebarMenuAction` keep a 24px hit area from `md` up (it was removed there, leaving a 20px target; WCAG 2.5.8). Below `md` it is still 36px.
- ⌘B / Ctrl+B no longer toggles the sidebar in text fields and rich-text editors (where it means bold), or when a handler has called `preventDefault()`.
