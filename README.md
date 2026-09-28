# SnowUI

Monorepo for the React implementation of the [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/), implemented and improved by [holakirr](https://github.com/holakirr).

## Packages

| Package | Path | npm |
| --- | --- | --- |
| [`@holakirr/snow-ui`](packages/ui) | `packages/ui` | [![npm](https://img.shields.io/npm/v/@holakirr/snow-ui)](https://www.npmjs.com/package/@holakirr/snow-ui) |
| [`@holakirr/snow-ui-icons`](packages/icons) | `packages/icons` | [![npm](https://img.shields.io/npm/v/@holakirr/snow-ui-icons)](https://www.npmjs.com/package/@holakirr/snow-ui-icons) |

`@holakirr/snow-ui` is the component library (React 19, Tailwind CSS v4, Radix UI). `@holakirr/snow-ui-icons` is the icon set it uses; it is also published on its own.

Both packages are documented in one Storybook — [snow-ui.holakirr.com](https://snow-ui.holakirr.com) — with components under "Components" and icons under "Icons". Its config lives in the root `.storybook/`.

## Development

Requirements: [Bun](https://bun.sh) 1.3.11 (see `packageManager`). The repo uses Bun workspaces with a single `bun.lock` at the root.

```bash
bun install            # install all workspaces
bun run lint           # biome check (one shared biome.json)
bun run typecheck      # tsc for every package
bun run test           # vitest for every package
bun run tokens         # regenerate the ui token files from packages/ui/tokens (DTCG)
bun run build          # tsdown build of icons, then ui (+ publint and attw checks)
bun run test:dist      # checks of the built ui stylesheets (needs `bun run build`)
bun run storybook      # shared Storybook (ui + icons) on :53741
bun run build:storybook # static Storybook in ./storybook-static
bun run test:storybook # every story in headless Chromium, light and dark theme (+ play functions, axe)
bun run test:coverage  # ui unit tests + Storybook tests with V8 coverage and thresholds
bun run size           # bundle-size budgets (needs `bun run build`)
bun run visual         # visual regression tests in Docker (`visual:update` writes baselines)
```

Run a script in a single package with `bun run --filter <package-name> <script>`, e.g. `bun run --filter @holakirr/snow-ui-icons test`.

### How ui consumes icons

`packages/ui` depends on `"@holakirr/snow-ui-icons": "^<version>"` (a regular semver range, not `workspace:`, so the published package.json stays valid). Bun links it to `packages/icons` as long as the local version satisfies the range.

- Storybook, Vitest and `typecheck` resolve the icons package from **source** (`packages/icons/src`) via a Vite alias (`packages/ui/workspace-aliases.ts`, used by `.storybook/main.ts` and `packages/ui/vitest.config.ts`) and tsconfig `paths`, so they work from a clean clone without building icons.
- The ui **library build** emits type declarations that import the icons package, so it needs `packages/icons/dist`. The root `bun run build` builds icons first; when building ui on its own, run `bun run build:icons` beforehand.

### Library builds

Both packages are built with [tsdown](https://tsdown.dev) (`packages/*/tsdown.config.ts`): ESM (`.js`) and CommonJS (`.cjs`) with matching `.d.ts` / `.d.cts`, one output file per source module (`unbundle`), so `'use client'` directives stay on their modules and single-icon imports stay small. tsdown writes the `exports` / `main` / `module` / `types` fields of each `package.json` and runs publint and are-the-types-wrong after every build. Before tsdown runs, `@holakirr/snow-ui` regenerates its token files (`bun run tokens`, see [Design tokens](CONTRIBUTING.md#design-tokens)) and builds its stylesheets: `dist/index.css` with the Tailwind CLI, then `dist/theme.css` (for projects on Tailwind v4, imports inlined), `dist/fonts.css` and `dist/fonts/` with `packages/ui/scripts/build-css.ts`.

The handful of [Phosphor](https://phosphoricons.com) icons both packages use are inlined under `dist/vendor/` (see `tsdown.vendor.ts`) rather than depended on: `@phosphor-icons/react` ships its CommonJS build as `dist/index.cjs.js` inside a `"type": "module"` package, so Node can't `require()` it.

## Quality gates

Every PR and every push to `main` runs [Build Check](.github/workflows/build-check.yml). Each gate also runs locally; [CONTRIBUTING.md](CONTRIBUTING.md#quality-gates) has the details.

| Gate | Local command | CI job | Fails the build when |
| --- | --- | --- | --- |
| Generated tokens | `bun run tokens` | `build` | the files generated from `packages/ui/tokens` differ from the committed ones |
| Lint and format ([Biome](https://biomejs.dev)) | `bun run lint` | `build` | a lint rule or the formatter reports a problem |
| Types | `bun run typecheck` | `build` | `tsc` reports an error in a package or the root tooling |
| Unit tests (Vitest, jsdom) | `bun run test` | `build` (icons), `storybook-tests` (ui, with coverage) | a `*.test.ts(x)` test fails |
| Package checks ([publint](https://publint.dev), [are-the-types-wrong](https://arethetypeswrong.github.io)) | `bun run build` | `build` | a package's `exports`/types would break for some consumers |
| Built stylesheets | `bun run test:dist` | `build` | a Tailwind v4 project using `theme.css` doesn't get every component class, `index.css` has an unlayered rule, or `fonts.css` points at a missing file |
| Storybook tests ([`@storybook/addon-vitest`](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)) | `bun run test:storybook` | `storybook-tests` | a story throws while rendering or its `play` function (interaction test) fails, in the light or the dark theme |
| Accessibility ([axe](https://github.com/dequelabs/axe-core) via `@storybook/addon-a11y`) | `bun run test:storybook` / Storybook's a11y panel | `storybook-tests` | axe finds a violation in any story, in either theme, after its `play` function (`a11y.test: 'error'`) |
| Coverage ([V8](https://vitest.dev/guide/coverage)) | `bun run test:coverage` | `storybook-tests` | coverage of `packages/ui/src` by the ui unit tests and the Storybook tests drops below the thresholds in `vitest.config.ts` |
| Visual regression (Playwright, in Docker) | `bun run visual` | `visual` | a story's screenshot (light or dark theme) differs from its baseline; skipped until baselines are committed |
| Bundle size ([size-limit](https://github.com/ai/size-limit)) | `bun run size` | `size` | an entry point grows past its budget in `.size-limit.json` |
| Changesets | `bun changeset status` | `changeset` | never: warns when a package changed without a changeset |

## Releasing

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets); see [CONTRIBUTING.md](CONTRIBUTING.md) for the contributor side.

1. Every PR that changes a published package adds a changeset (`bun changeset`): which packages, which semver bump, and a user-facing summary.
2. On each push to `main`, `.github/workflows/release.yml` runs [changesets/action](https://github.com/changesets/action). While changesets are pending it opens or updates the **"chore(release): version packages"** PR, which runs `bun run version-packages` (`changeset version` — bumps versions, bumps `@holakirr/snow-ui`'s `@holakirr/snow-ui-icons` range when icons is released, prepends to each `CHANGELOG.md`, deletes the consumed changesets — then `bun install --lockfile-only` to sync `bun.lock`).
3. Merging that PR runs the workflow again with no pending changesets, so it runs `bun run release`: `bun run build`, then `changeset publish`, which runs `npm publish` in every package whose version isn't on npm yet. The action then pushes the `@holakirr/snow-ui@X.Y.Z` / `@holakirr/snow-ui-icons@X.Y.Z` tags and creates a GitHub release for each.

The version PR is opened with the workflow's `GITHUB_TOKEN`, so other workflows (Build Check) don't run on it automatically; close and reopen it to run them before merging.

Publishing uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC, no `NPM_TOKEN`) with provenance (`publishConfig.provenance`). On npmjs.com, the Trusted Publisher of **both** packages must be the GitHub repository `holakirr/snow-ui` with workflow filename `release.yml` (the icons package still points at its old repository, `holakirr/snow-ui-icons`, until the owner re-points it).

## License

[MIT](LICENSE)
