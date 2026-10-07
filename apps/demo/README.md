# SnowUI demo

A Next.js (App Router) app built with the SnowUI packages the way an app installs them: the SnowUI Figma kit's dashboard, an authentication page and a settings page. Private — it is not published.

Live: [demo.snow-ui.holakirr.com](https://demo.snow-ui.holakirr.com) (deployment is configured separately).

| Route | What it shows |
| --- | --- |
| `/` | Redirects to `/dashboard`. |
| `/dashboard` | The kit's Dashboard: collapsible sidebar, breadcrumb/search, theme and history tools, notifications panel, 108px KPI cards, metric tabs and period selection, charts and segmented website traffic. Language and direction controls are in the history panel. |
| `/orders` | Sortable, selectable, filterable and paginated order table. |
| `/sign-in` | The kit's Sign In composition: a 680px card, 384px form, Apple and Google buttons, validation and a submit toast. There is no authentication. |
| `/settings` | Account → Settings: profile details, sign-in method, connected accounts, email preferences, notifications and deactivation. |
| `/preferences` | Settings → Profile standalone panel with seven sections: Profile, Theme, Time and language, Notifications, Privacy, Payment and Plugins. `?tab=` selects a section. |

The data is mock data (`lib/data.ts`); avatars are initials, with no images from the Figma kit. The two settings views share demo profile and notification data persisted in localStorage. Account security, payment, integrations and session actions are demonstrations; they do not call a backend. Font size and accent choices are stored preferences, while theme, language and direction apply to the interface.

## Run it

From the repository root (Bun, see the root README):

```bash
bun install
bun run build          # the packages: the demo imports their dist, like an installed dependency
bun run demo           # next dev on http://localhost:3000
```

Production build and the smoke tests:

```bash
bun run build:demo     # next build (types included)
bun run typecheck:demo # next typegen + tsc
bunx playwright install chromium   # once
bun run test:demo      # Playwright against `next start` (port 3100)
```

`bun run build:all` builds the packages, then the demo. The demo's scripts stop with a message when the packages aren't built.

## How it uses the packages

- **Dependencies:** `@holakirr/snow-ui`, `@holakirr/snow-ui-icons` and `@holakirr/snow-ui-charts` are `workspace:*` dependencies, resolved through their `exports` to `dist/` — no source aliases, no `transpilePackages`.
- **Styles:** the app's Tailwind CSS v4 stylesheet (`app/globals.css`) imports Tailwind, `@holakirr/snow-ui/theme.css` and `@holakirr/snow-ui-charts/styles.css`, and `@source`s the ui package's `dist` so Tailwind generates the components' classes. `@holakirr/snow-ui/fonts.css` (self-hosted Inter) is imported from `app/layout.tsx`, so the bundler resolves the font URLs.
- **Server and client components:** pages, layouts and most of the markup are Server Components (`Card`, `Typography`, `ListItem`, `Table` parts, `Strip` and `Sparkline` render on the server). Client components are the leaves that need state or functions: the `Providers`, the header controls, the charts (formatters), the order table and the forms.
- **Providers:** `app/providers.tsx` (`'use client'`) wraps `SnowUIProvider` with the app's Russian `Messages` and the date-fns locale, `TooltipProvider` and `Toaster`. The root layout passes it only strings (language, direction).
- **Preferences:** the language and the direction are cookies set by Server Actions (`app/actions.ts`); the root layout reads them to render `<html lang dir>` and the translated Server Components, so a reload never flashes the other language or direction. The theme is in `localStorage` and applied by an inline script in `<head>` before the first paint (`data-theme` on `<html>`; none for "system", where the tokens follow the OS). The sidebar's open state is the library's `sidebar:state` cookie, also read on the server.
- **Icons:** `@holakirr/snow-ui-icons` for the kit's own icons, and `@phosphor-icons/react` (the icon set of the Figma kit) for the rest, imported one per icon from its SSR build.

Right-to-left mode shows English or Russian text right to left, so punctuation and numbers at the ends of sentences move (the Unicode bidi algorithm); an RTL language wouldn't have this.

## Tests

`e2e/` (Playwright, Chromium, on `next start`):

- every page renders in the light and dark theme with no console errors (each test fails on any console error or page error) and no axe violations (WCAG 2.2 A/AA);
- the theme menu, the direction toggle and the language menu apply and survive a reload; the SnowUI messages follow the language;
- ⌘K / Ctrl+K opens the command palette, which navigates;
- the sign-in validation messages (and their `aria-invalid` / description wiring), a valid sign-in, the settings forms, the order table (sort, select, page, filter), the collapsible sidebar;
- First Load JS per route (`e2e/first-load-js.spec.ts`): the scripts a cold load downloads, compressed and uncompressed, with a budget per route. Next.js 16 no longer prints this in `next build`; the numbers are written to `test-results/first-load-js.json` and to the CI job summary.

CI runs them in the `demo` job of [Build Check](../../.github/workflows/build-check.yml) against the packages built by the `build` job.

## Deploying

`vercel.json` is for a Vercel project whose root directory is `apps/demo`: it installs at the repository root with Bun and runs `bun run build:all` (packages, then the demo).
