# Changelog

## 3.0.0

### Breaking changes

- The library no longer depends on `react-hook-form`. `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription` and `FormMessage` from the main entry are library-agnostic: pass `error` / `invalid` to `FormItem`, or provide them with the new `FormFieldState`. `Form` is now a plain `<form>` wrapper.
- `FormField` and the react-hook-form `Form` (`FormProvider`) moved to `@holakirr/snow-ui/react-hook-form`. Migrate by changing the import path; the API is unchanged. `react-hook-form` is now an optional peer dependency.

  ```diff
  - import { Form, FormField, FormItem } from '@holakirr/snow-ui'
  + import { Form, FormField, FormItem } from '@holakirr/snow-ui/react-hook-form'
  ```

### Dependencies

- `vite` 8, `@radix-ui/react-select` 2.3.7, `@radix-ui/react-slot` 1.3.3; GitHub Actions `checkout`/`setup-node` v7.

## 2.1.0

### Breaking-ish changes (check before upgrading)

- `react-hook-form` is now a **peer dependency** (`^7.60.0`), so `Form` and your `useForm` share one instance. npm, pnpm and bun install peers automatically; otherwise add it yourself.
- `tailwindcss` is no longer a peer dependency; `dist/index.css` is precompiled.
- **Button** no longer sets a default `aria-label="Button aria label"`, `role="button"`, `tabIndex` or `title`. `aria-label` comes from `label` only for icon-only buttons. `type="button"` is set only on a native `<button>`, so `as="a"` is a real link.
- The theme font token `--font-normal` was renamed to `--font-sans`, so `font-normal` is a font-weight utility again.
- `@holakirr/snow-ui-icons` upgraded to v2.

### Features

- New `BreadcrumbPage` and `DialogDescription` components.
- ContextMenu items accept `inset`, like DropdownMenu.
- Prop types are exported for all components (Accordion, Card, Toggle, Scheduler, Tabs, Toast, Form, …).
- Semantic color tokens (`background`, `foreground`, `muted`, `muted-foreground`, `accent`, `destructive`, `input`, `ring`, `sidebar-border`) are defined on top of the palette, including dark mode.
- Sidebar restores its open state from the cookie.

### Fixes

- **Packaging**: `dist` loads in plain Node. `require()` of the CJS build and `import` of the ESM build both used to fail. react-day-picker CSS is included in `index.css` instead of being imported from JS. `date-fns` is declared as a dependency, and `sideEffects` is set.
- **Input** forwards `ref` (react-hook-form can focus fields with errors), and controlled/uncontrolled handling is fixed.
- **Calendar** no longer crashes when switching the year in range/multiple mode. The nav buttons are keyboard reachable, the custom parts no longer remount on every render, and `className` can override the root styles.
- **Scheduler** shows events in the last hour and computes its hour range from the events. EventItem and the cells work with the keyboard.
- **Sidebar** widths work with Tailwind v4.
- **Typography** merges `className`, so e.g. `text-center` works.
- **Tag** `onClose` no longer fires twice on Enter. **Slider** renders a thumb per value.
- **Accessibility**: removed misleading hard-coded labels and roles (Breadcrumb, Card, KBD, Accordion, Table, Skeleton). The mobile Sidebar sheet has a title, and ToastClose has a label.
- Fixed animation class names, the Form field guard, the `useToast` subscription and several class typos. Form error text is red again.
