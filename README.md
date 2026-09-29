# SnowUI

[![Build Check](https://github.com/holakirr/snow-ui/actions/workflows/build-check.yml/badge.svg?branch=main)](https://github.com/holakirr/snow-ui/actions/workflows/build-check.yml) [![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/holakirr/snow-ui/badge)](https://scorecard.dev/viewer/?uri=github.com/holakirr/snow-ui)

Monorepo for the React implementation of the [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/), implemented and improved by [holakirr](https://github.com/holakirr).

## Packages

| Package | Path | npm |
| --- | --- | --- |
| [`@holakirr/snow-ui`](packages/ui) | `packages/ui` | [![npm](https://img.shields.io/npm/v/@holakirr/snow-ui)](https://www.npmjs.com/package/@holakirr/snow-ui) |
| [`@holakirr/snow-ui-icons`](packages/icons) | `packages/icons` | [![npm](https://img.shields.io/npm/v/@holakirr/snow-ui-icons)](https://www.npmjs.com/package/@holakirr/snow-ui-icons) |
| [`@holakirr/snow-ui-charts`](packages/charts) | `packages/charts` | [![npm](https://img.shields.io/npm/v/@holakirr/snow-ui-charts)](https://www.npmjs.com/package/@holakirr/snow-ui-charts) |

`@holakirr/snow-ui` is the component library (React 19, Tailwind CSS v4, Radix UI). `@holakirr/snow-ui-icons` is the icon set it uses; it is also published on its own. `@holakirr/snow-ui-charts` is an optional companion: line, area, bar, donut and sparkline charts in the SnowUI design, built on [Recharts](https://recharts.github.io) 3 and the ui package's tokens (a peer dependency).

All packages are documented in one Storybook — [snow-ui.holakirr.com](https://snow-ui.holakirr.com) — with guides (Getting started, Theming, Localization and RTL) under "Guides", a usage page for every component under "Components" (when to use it, anatomy, variants, states, accessibility, a link to its Figma component), the charts under "Charts" and icons under "Icons". Its config lives in the root `.storybook/`, the guides in `docs/`; see [Documentation](CONTRIBUTING.md#documentation).

## Demo

[demo.snow-ui.holakirr.com](https://demo.snow-ui.holakirr.com) — the SnowUI kit's dashboard, sign-in and settings pages built with the three packages in a Next.js (App Router) app, [`apps/demo`](apps/demo): light / dark / system theme, English / Russian, left-to-right / right-to-left, Server Components by default. It consumes the packages like an installed dependency (their built `dist`, the `theme.css` + `@source` Tailwind v4 setup), so it doubles as an integration test of the published entry points. Private, not published; see its [README](apps/demo/README.md).

```bash
bun run build          # the packages first: the demo imports their dist
bun run demo           # next dev on http://localhost:3000
bun run build:demo     # production build
bun run test:demo      # Playwright smoke tests against `next start`
```

## Development

Requirements: [Bun](https://bun.sh) 1.3.11 (see `packageManager`). The repo uses Bun workspaces (`packages/*` and `apps/*`) with a single `bun.lock` at the root.

```bash
bun install            # install all workspaces
bun run lint           # biome check (one shared biome.json)
bun run typecheck      # tsc for every package (the demo: `bun run typecheck:demo`, after `bun run build`)
bun run test           # vitest for every package and the release scripts
bun run tokens         # regenerate the ui token files from packages/ui/tokens (DTCG)
bun run build          # tsdown build of icons, then ui, then charts (+ publint and attw checks)
bun run build:all      # the packages, then the demo app (apps/demo)
bun run test:dist      # checks of the built ui stylesheets and charts package (needs `bun run build`)
bun run storybook      # shared Storybook (ui + icons + charts) on :53741
bun run build:storybook # static Storybook in ./storybook-static
bun run test:storybook # every story in headless Chromium, light and dark theme (+ play functions, axe)
bun run test:storybook:browsers # every story in headless Firefox and WebKit (+ play functions)
bun run test:ssr       # every ui story rendered on the server (Node) and hydrated in Chromium
bun run test:coverage  # ui and charts unit tests + Storybook tests with V8 coverage and thresholds
bun run size           # bundle-size budgets (needs `bun run build`)
bun run visual         # visual regression tests in Docker (`visual:update` writes baselines)
bun run code-connect   # check the Figma Code Connect templates offline (no token)
```

Run a script in a single package with `bun run --filter <package-name> <script>`, e.g. `bun run --filter @holakirr/snow-ui-icons test`.

### How ui consumes icons

`packages/ui` depends on `"@holakirr/snow-ui-icons": "^<version>"` (a regular semver range, not `workspace:`, so the published package.json stays valid). Bun links it to `packages/icons` as long as the local version satisfies the range.

- Storybook, Vitest and `typecheck` resolve the icons package from **source** (`packages/icons/src`) via a Vite alias (`packages/ui/workspace-aliases.ts`, used by `.storybook/main.ts` and `packages/ui/vitest.config.ts`) and tsconfig `paths`, so they work from a clean clone without building icons.
- The ui **library build** emits type declarations that import the icons package, so it needs `packages/icons/dist`. The root `bun run build` builds icons first; when building ui on its own, run `bun run build:icons` beforehand.

### How charts consume ui

`packages/charts` has `"@holakirr/snow-ui": "^5.0.0"` as a **peer** dependency: apps load its stylesheet (the tokens the charts read as `var(--color-*)`) and the charts read `useSnowUI()` (locale, direction) from it. Storybook, Vitest and `typecheck` resolve it (and icons) from source (`packages/charts/workspace-aliases.ts`, tsconfig `paths`), so the stories' `SnowUIProvider` and the charts share one context. The library build resolves it as the installed package (its `dist` types, `tsconfig.build.json`), so `bun run build` builds ui before the charts.

### Library builds

All packages are built with [tsdown](https://tsdown.dev) (`packages/*/tsdown.config.ts`): ESM (`.js`) and CommonJS (`.cjs`) with matching `.d.ts` / `.d.cts`, one output file per source module (`unbundle`), so `'use client'` directives stay on their modules and single-icon imports stay small. tsdown writes the `exports` / `main` / `module` / `types` fields of each `package.json` and runs publint and are-the-types-wrong after every build. Before tsdown runs, `@holakirr/snow-ui` regenerates its token files (`bun run tokens`, see [Design tokens](CONTRIBUTING.md#design-tokens)) and builds its stylesheets: `dist/index.css` with the Tailwind CLI, then `dist/theme.css` (for projects on Tailwind v4, imports inlined), `dist/fonts.css`, `dist/fonts-italic.css` and `dist/fonts/` with `packages/ui/scripts/build-css.ts`.

The handful of [Phosphor](https://phosphoricons.com) icons both packages use are inlined under `dist/vendor/` (see `tsdown.vendor.ts`) rather than depended on: `@phosphor-icons/react` ships its CommonJS build as `dist/index.cjs.js` inside a `"type": "module"` package, so Node can't `require()` it.

## Quality gates

Every PR and every push to `main` runs [Build Check](.github/workflows/build-check.yml). Each gate also runs locally; [CONTRIBUTING.md](CONTRIBUTING.md#quality-gates) has the details.

| Gate | Local command | CI job | Fails the build when |
| --- | --- | --- | --- |
| Generated tokens | `bun run tokens` | `build` | the files generated from `packages/ui/tokens` differ from the committed ones |
| Lint and format ([Biome](https://biomejs.dev)) | `bun run lint` | `build` | a lint rule or the formatter reports a problem |
| Types | `bun run typecheck` | `build` | `tsc` reports an error in a package or the root tooling |
| Code Connect templates | `bun run code-connect` | `build` | a Figma Code Connect template (`*.figma.ts`) doesn't bundle; `typecheck` checks its prop mappings and the ui unit tests run it |
| Unit tests (Vitest, jsdom) | `bun run test` | `build` (icons), `storybook-tests` (ui and charts, with coverage) | a `*.test.ts(x)` test fails |
| Package checks ([publint](https://publint.dev), [are-the-types-wrong](https://arethetypeswrong.github.io)) | `bun run build` | `build` | a package's `exports`/types would break for some consumers |
| Built packages | `bun run test:dist` | `build` | a Tailwind v4 project using `theme.css` doesn't get every component class, `index.css` has an unlayered rule, `fonts.css` points at a missing file, or the charts' exports, `'use client'` modules or `styles.css` (layer, ui tokens) break |
| Storybook tests ([`@storybook/addon-vitest`](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)) | `bun run test:storybook` | `storybook-tests` | a story throws while rendering or its `play` function (interaction test) fails, in the light or the dark theme |
| Firefox and WebKit | `bun run test:storybook:browsers` | `storybook-browsers (firefox)`, `storybook-browsers (webkit)` | a story throws or its `play` function fails in Firefox or WebKit (Safari's engine), light theme |
| Server rendering and hydration | `bun run test:ssr` | `ssr` | a ui story throws when rendered with `react-dom/server` in Node, or React reports a hydration mismatch or an error when it is hydrated in Chromium |
| Accessibility ([axe](https://github.com/dequelabs/axe-core) via `@storybook/addon-a11y`) | `bun run test:storybook` / Storybook's a11y panel | `storybook-tests` | axe finds a violation in any story, in either theme, after its `play` function (`a11y.test: 'error'`) |
| Coverage ([V8](https://vitest.dev/guide/coverage)) | `bun run test:coverage` | `storybook-tests` | coverage of `packages/ui/src` and `packages/charts/src` by the unit tests and the Storybook tests drops below the thresholds in `vitest.config.ts` |
| Visual regression (Playwright, in Docker) | `bun run visual` | `visual` | a story's screenshot (light or dark theme) differs from its baseline in `visual/__screenshots__` (update them with `bun run visual:update`) |
| Bundle size ([size-limit](https://github.com/ai/size-limit)) | `bun run size` | `size` | an entry point grows past its budget in `.size-limit.json` |
| Demo app | `bun run build:all && bun run test:demo` | `demo` | the demo's types or Next.js build fail against the built packages, or its Playwright smoke tests fail: a page logs a console error or has an axe violation, a toggle, the command palette or a form breaks, or a route's First Load JS exceeds its budget |
| Changesets | `bun changeset status` | `changeset` | never: warns when a package changed without a changeset |

## Releasing

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets); see [CONTRIBUTING.md](CONTRIBUTING.md#changesets) for the contributor side and the [Versioning and support policy](VERSIONING.md) for what gets released when. `.github/workflows/release.yml` publishes only commits whose full Build Check passed.

1. Every PR that changes a published package adds a changeset (`bun changeset`): which packages, which semver bump, and a user-facing summary.
2. Each push to `main` runs Build Check. When it passes, the release workflow's `trigger` job dispatches the release on `main` for that commit (if it is still `main`'s head), and the `gate` job checks through the GitHub API that Build Check succeeded for exactly that commit. A manual run (Actions → Release → Run workflow) goes through the same gate.
3. The `release` job runs [changesets/action](https://github.com/changesets/action). While changesets are pending it opens or updates the **"chore(release): version packages"** PR, which runs `bun run version-packages` (`changeset version` — bumps versions, bumps `@holakirr/snow-ui`'s `@holakirr/snow-ui-icons` range when icons is released, prepends to each `CHANGELOG.md`, deletes the consumed changesets — then `bun install --lockfile-only` to sync `bun.lock`).
4. The version PR is opened with the workflow's `GITHUB_TOKEN`, which triggers no workflows, so the release job then dispatches Build Check on the PR's branch (`changeset-release/main`); its jobs report on the PR's head commit, where the ruleset's required checks look for them. Merge the PR when they are green.
5. Merging the PR pushes to `main` again: after its Build Check passes, the release job finds no pending changesets and runs `bun run release`: `bun run build`, then `scripts/publish.ts`, which runs `changeset publish` (`npm publish` in every package whose version isn't on npm yet). The action pushes the `<package>@X.Y.Z` tags and creates a GitHub release for each package, and the job attaches each package's CycloneDX SBOM (`scripts/sbom.ts`) to its release.

**Pre-releases** of the next major come from the `next` branch in Changesets pre-release mode, the same way: `X.Y.Z-next.N` versions under the `next` npm dist-tag. **Canaries** (`0.0.0-canary-<short sha>` under the `canary` dist-tag) are published by hand from any branch with a green Build Check: Actions → Release → Run workflow → mode `canary`. See [Pre-releases and canaries](CONTRIBUTING.md#pre-releases-and-canaries).

Publishing uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC, no `NPM_TOKEN`) with provenance (`publishConfig.provenance`). On npmjs.com, the Trusted Publisher of **every** package must be the GitHub repository `holakirr/snow-ui` with workflow filename `release.yml`; the release, pre-release and canary jobs all run in that file.

**New packages** (`@holakirr/snow-ui-charts`): npm only lets you configure a Trusted Publisher for a package that exists, so a new package's first version is published by hand. Until then `scripts/publish.ts` skips it (it marks the package `private` for that run, so `changeset publish` leaves it out) and warns in the job summary, and the other packages are released as usual. The steps are in [CONTRIBUTING.md](CONTRIBUTING.md#publishing-a-new-package).

## Supported environments

| | Supported | Tested in CI |
| --- | --- | --- |
| React | 19.x (peer `^19.0.0`) | React 19 |
| Browsers | Chrome and Edge 111+, Safari 16.4+ (macOS, iOS), Firefox 128+: the baseline of Tailwind CSS v4, which the styles need | Chromium (every story, both themes, axe, screenshots); Firefox and WebKit (every story, play functions) |
| Tailwind CSS | v4 (`theme.css`), or none (the precompiled `index.css`) | both |
| Server rendering | React 19 SSR and hydration (Next.js App Router, React Router…) | every ui story, rendered in Node.js and hydrated in Chromium |
| Node.js | 20.19+, 22 and 24 (Active and Maintenance LTS) | the GitHub runner's default Node.js (tests), 24 (release builds); no version matrix yet |

**Contrast.** The default theme reproduces the SnowUI Figma kit. Where the kit's colours fall short of WCAG AA contrast, the high-contrast mode meets it: it follows the user's `prefers-contrast: more` setting, or turn it on for a page or a scope with `data-contrast="more"`.

Which releases get fixes, and how deprecations and breaking changes are handled, is in the [Versioning and support policy](VERSIONING.md).

## Community

- [Roadmap](ROADMAP.md): what the next releases bring, including the 6.0 major.
- [Getting help](SUPPORT.md): Discussions for questions and ideas, issue forms for bugs, accessibility problems and feature requests.
- [Contributing](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).
- [Security policy](SECURITY.md): report vulnerabilities privately.

## License

[MIT](LICENSE)
