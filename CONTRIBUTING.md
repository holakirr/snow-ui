# Contributing

Setup, scripts and the monorepo layout are described in the [README](README.md#development). Before opening a PR, run `bun run lint`, `bun run typecheck`, `bun run test`, `bun run test:storybook`, `bun run build` and `bun run size`; if you changed how anything looks, also `bun run visual` (Docker).

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat(ui): …`, `fix(icons): …`, `docs: …`).

## Quality gates

The [Build Check](.github/workflows/build-check.yml) workflow runs every gate below on each PR and push to `main` (overview in the [README](README.md#quality-gates)).

### Unit tests

`bun run test` runs each package's Vitest suite (jsdom, Testing Library): `*.test.ts(x)` files next to the code under test, configured in `packages/*/vitest.config.ts`. `bun run --filter @holakirr/snow-ui test:watch` / `test:coverage` are the watch and coverage variants.

### Storybook tests and accessibility

`bun run test:storybook` turns every story into a test with [`@storybook/addon-vitest`](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon): each story is rendered in headless Chromium (Vitest browser mode with the Playwright provider) and fails if it throws or its `play` function fails. It is the `storybook` project of the root `vitest.config.ts`, next to the packages' unit-test projects. The first run needs the browser: `bunx playwright install chromium`. You can also run the tests from Storybook's sidebar (the testing widget at the bottom) while `bun run storybook` is running.

[axe](https://github.com/dequelabs/axe-core) runs on every story as part of these tests (`@storybook/addon-a11y`). How violations count is set by `parameters.a11y.test`, globally in `.storybook/preview.tsx` and overridable per component or story:

- `'todo'` (the current global value): violations show up as warnings in Storybook's accessibility panel and test widget, and never fail the run;
- `'error'`: violations fail the test, locally and in CI;
- `'off'`: axe doesn't run (only for stories that demonstrate misuse on purpose).

The goal is `'error'` everywhere. When you fix a component's violations, set `parameters: { a11y: { test: 'error' } }` in its stories' meta so it can't regress; once the remaining ones are fixed, the global value flips to `'error'`.

### Visual regression tests

`visual/stories.spec.ts` screenshots every story of the built Storybook (from `storybook-static/index.json`) in the light and the dark theme at a fixed 1280×720 viewport and compares the shots with the baselines committed in `visual/__screenshots__/`. Screenshots are full-page, taken with CSS and SVG animations stopped and the caret hidden, after the story's `play` function and web fonts have finished, with the clock pinned (date-dependent stories render the same days) and remote images replaced by a placeholder. The comparison tolerates anti-aliasing noise only (per-pixel `threshold: 0.1`, at most 20 differing pixels; see `visual/playwright.config.ts`).

Baselines are Linux screenshots taken in the official Playwright Docker image (`mcr.microsoft.com/playwright:v<@playwright/test version>-noble`, `linux/amd64` like CI), because font rendering differs between operating systems. So the suite always runs in Docker; the Playwright config refuses to run on macOS/Windows.

```bash
bun run visual                   # build Storybook, compare with the baselines
bun run visual:update            # build Storybook, write new/changed baselines
bun run visual -g "Button"       # extra arguments go to `playwright test`
VISUAL_SKIP_BUILD=1 bun run visual  # reuse the current storybook-static/
```

Requirements: Docker (on Apple Silicon the amd64 image runs through Rosetta, a few minutes for the whole suite) and `bun install` done on the host (the container only uses the pure-JS `@playwright/test` from `node_modules`; Storybook is built on the host), plus network access for the Inter web font. Failures leave the actual/expected/diff images in `test-results/visual/` and an HTML report in `playwright-report/` (`bunx playwright show-report`).

When a change is intended, run `bun run visual:update`, review the changed PNGs in the diff and commit them with the change. A story added without a baseline fails the comparison; opt a story or a whole component out with the `skip-visual` tag. `visual:update` only writes new and changed images: after removing or renaming stories, delete their PNGs (or empty the folder and regenerate everything).

In CI, the `visual` job runs the same image as a job container against the Storybook built by the `build` job and uploads the diffs as the `visual-diffs` artifact when it fails. It is skipped (with a notice) while `visual/__screenshots__/` has no baselines. **Baselines haven't been generated yet**: the components are being reworked to match the SnowUI Figma kit, so they'll be generated with `bun run visual:update` and committed once those design PRs have landed.

### Bundle size

`bun run size` checks the budgets in `.size-limit.json` with [size-limit](https://github.com/ai/size-limit) (esbuild preset: minified and brotli-compressed, React and other peer dependencies excluded) against the built packages, so run `bun run build` first. It covers the full `@holakirr/snow-ui` import, single-component imports (tree-shaking), the `react-hook-form` entry, `dist/index.css`, and a full and a single-icon import of `@holakirr/snow-ui-icons`. When a change legitimately needs more, raise the limit in the same PR and say why in its description; keep limits about 10% above the measured size so regressions stay visible.

### Package checks

`bun run build` runs [publint](https://publint.dev) and [are-the-types-wrong](https://arethetypeswrong.github.io) on both packages after tsdown builds them (configured in `packages/*/tsdown.config.ts`), so broken `exports`, missing files or types that resolve differently in ESM and CommonJS fail the build.

## Changesets

Releases are driven by [Changesets](https://github.com/changesets/changesets). If your PR changes what users of `@holakirr/snow-ui` or `@holakirr/snow-ui-icons` get from npm — code, styles, types, dependencies or the build output — add a changeset:

```bash
bun changeset
```

Pick the packages, the bump for each and write a summary. It is committed as a Markdown file in `.changeset/` and becomes the package's `CHANGELOG.md` entry, so write it for the library's users: what changed and, for breaking changes, how to migrate.

- **major**: something that worked stops working — a removed or renamed export, prop or CSS token; a narrower prop type; a peer dependency major; an upgrade of a dependency whose types are part of our public props (e.g. `CalendarProps` extends react-day-picker's `DayPickerProps`).
- **minor**: new components, props, exports or options; deprecations.
- **patch**: bug fixes, and internal or build changes that users don't need to act on.

PRs that don't touch a published package (docs, Storybook stories, CI, tests) don't need one. The "changeset" job of Build Check warns on PRs that change packages without a changeset; if no release is needed, add an empty one with `bun changeset --empty`. You can edit or delete changeset files in your PR like any other file, and check what would be released with `bun changeset status`.

## Releases

Maintainers don't bump versions or write changelogs by hand. After a PR with changesets is merged into `main`, a bot opens (or updates) the **"chore(release): version packages"** PR with the version bumps and changelog entries. Merging it publishes the packages to npm, tags them and creates GitHub releases. See [Releasing](README.md#releasing) for details.
