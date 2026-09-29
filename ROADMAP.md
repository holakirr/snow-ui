# Roadmap

Where SnowUI is going, as of September 2026. Plans change: the [issues](https://github.com/holakirr/snow-ui/issues) and [Discussions](https://github.com/holakirr/snow-ui/discussions/categories/ideas) are where to propose or discuss an item. Releases follow the [Versioning and support policy](VERSIONING.md): features and deprecations in 5.x minors, every breaking change in one planned major, 6.0.

## Now: 5.x

Minor releases, nothing breaks.

- **New components**, in the order product teams usually need them: AlertDialog, Combobox (Autocomplete, MultiSelect), DatePicker and DateRangePicker inputs, Alert (Callout, Banner), Progress and Spinner.
- **Registry**: the components as source you copy into your project and own, installable with the shadcn CLI (`npx shadcn add`), next to the npm packages.
- **Accessibility**: reduced motion (`prefers-reduced-motion`) for every animation; 24×24 target sizes; the APG grid pattern for Scheduler and the Calendar year view; a high-contrast mode that meets WCAG AA contrast (`prefers-contrast: more`, or `data-contrast="more"` on a scope), while the default keeps the Figma kit's look.
- **Forms**: `ref` typed on every component; invalid-state (`aria-invalid`) styles for every field.
- **Layout and feedback**: the Sidebar's collapsed state out of the tab order; several toasts at once, stacked, with a configurable limit.
- **Documentation**: complete props tables, a keyboard table on every interactive component, and guides for Next.js (App Router), Vite and React Router.
- **Deprecations** of everything 6.0 renames or removes, each with its replacement and a development warning.

## Next: 6.0

One planned major that collects the breaking changes. It is developed on the `next` branch and published as `6.0.0-next.N` pre-releases (`npm install @holakirr/snow-ui@next`) for at least four weeks before 6.0.0; everything it removes is deprecated in 5.x first.

- **Token namespacing.** The design tokens and the Tailwind theme keys get a library namespace, so `theme.css` no longer redefines Tailwind's own tokens in your project (today it overrides `--color-black` and `--color-white`, for example) and the names can't collide with yours. The exact prefix is settled on `next`; the old names keep working as deprecated aliases through 5.x.
- **API normalisation.** One size scale with the same names and defaults on every component; one vocabulary for variants; one name for the selected or active state (today `selected`, `active` and `isActive`); the deprecated props removed (`as` in favour of `asChild`, `leftContent` / `rightContent` in favour of `startContent` / `endContent`); explicit export lists instead of `export *`, which removes the internals the package root leaks today (the toast `reducer`, the `*InputClasses` helpers, legacy types), with a snapshot of the public API checked in CI.
- **Environments.** `engines` raised to Node.js `>=20.19`.
- **Upgrade path.** A migration guide covering every breaking change, and codemods for the mechanical ones (renamed props, components, exports and tokens).
- **Charts.** A charts release that supports ui 5 and 6 at once, as proposed in [VERSIONING.md](VERSIONING.md#the-charts-peer-range-on-the-ui-package-proposal).
- **Release engineering before 6.0.0 ships.** A `v5` maintenance branch in the release workflow that publishes 5.x LTS patches under the `v5-lts` dist-tag instead of `latest`.

## Later

Not scheduled yet.

- Theming: portalled content (Dialog, Popover, Select…) that follows the nearest scoped theme; a runtime accent colour; the Figma kit's density modes (Expanded, Condensed).
- More components: Tree, NumberField, ColorPicker, virtualized lists and tables.
- A scripted sync of the design tokens from Figma.
- Tooling for AI assistants: `llms.txt` and an MCP server for the components and their docs.
- Versioned documentation for each supported major.

## Done recently

The [changelogs](packages/ui/CHANGELOG.md) list every release. Highlights of 5.0: the design tokens and every component aligned with the SnowUI Figma kit, axe on every story in both themes as a hard gate, localization and RTL, the charts package.
