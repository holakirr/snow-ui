# Contributing

Setup, scripts and the monorepo layout are described in the [README](README.md#development). Before opening a PR, run `bun run lint`, `bun run typecheck`, `bun run test`, `bun run test:storybook` (or `bun run test:coverage`, which also checks coverage), `bun run build` and `bun run size`; if you changed how anything looks, also `bun run visual` (Docker).

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat(ui): …`, `fix(icons): …`, `docs: …`).

## Quality gates

The [Build Check](.github/workflows/build-check.yml) workflow runs every gate below on each PR and push to `main` (overview in the [README](README.md#quality-gates)).

### Unit tests

`bun run test` runs each package's Vitest suite (jsdom, Testing Library): `*.test.ts(x)` files next to the code under test, configured in `packages/*/vitest.config.ts`. `bun run --filter @holakirr/snow-ui test:watch` / `test:coverage` are the watch and coverage variants.

### Storybook tests and accessibility

`bun run test:storybook` turns every story into a test with [`@storybook/addon-vitest`](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon): each story is rendered in headless Chromium (Vitest browser mode with the Playwright provider, at Storybook's 1200×900 default viewport) and fails if it throws or its `play` function fails. Every story runs twice: in the light theme (the `storybook` project of the root `vitest.config.ts`) and in the dark theme (`storybook-dark`, the theme global set to `dark`; stories that pin a theme with `globals: { theme: … }` keep it). The first run needs the browser: `bunx playwright install chromium`. You can also run the tests from Storybook's sidebar (the testing widget at the bottom) while `bun run storybook` is running.

**Interaction tests.** Give a story a `play` function (`expect`, `waitFor`, `within`, `fn` from `storybook/test`; `canvas` and `userEvent` come from the play context) for behaviour that matters to users: keyboard support, focus management, what a control announces. Overlays render in a portal, so query them with `within(canvasElement.ownerDocument.body)`. End a play function in a stable state and close modal overlays, because axe checks the page after it.

**Accessibility is a hard gate.** [axe](https://github.com/dequelabs/axe-core) (`@storybook/addon-a11y`) runs on every story, in both themes, after its `play` function, and `parameters.a11y.test` is `'error'` globally (`.storybook/preview.tsx`): any violation fails the test, locally and in CI.

- Fix violations in the component when the component is at fault (roles, names, contrast), in the story when the demo is (an unlabelled control, an image without `alt`).
- Text needs 4.5:1 (3:1 at 18px or 14px bold and up): use `text-black`, `text-black-80` or `text-secondary` for text, never `text-black-40` / `text-black-20` (placeholders and disabled controls excepted), and `indigo-text` / `red-text` for coloured text.
- Only when axe is wrong (a false positive) or for a deviation documented in the ui README, turn off one rule for one story, with the reason next to it:

  ```ts
  parameters: {
    a11y: {
      config: {
        rules: [
          // Why this is a false positive or an accepted exception.
          { id: 'aria-hidden-focus', enabled: false },
        ],
      },
    },
  },
  ```

  Never set `a11y.test` to `'todo'` or `'off'` to get a PR through. Current exceptions: `aria-hidden-focus` on Select "Open" (Radix hides the page with `aria-hidden` while the listbox is open and traps focus in it, so the trigger can't be focused; axe doesn't see the focus trap).

### Coverage

`bun run test:coverage` runs the ui unit tests and both Storybook projects with [V8 coverage](https://vitest.dev/guide/coverage) and merges them into one report of `packages/ui/src` (stories, tests, the Foundations pages and the recipes are excluded) in `coverage/` (`coverage/index.html`). It fails when statements, branches, functions or lines drop below the thresholds in the root `vitest.config.ts`, which sit about 2 points under the measured coverage. CI runs it in the `storybook-tests` job, writes the totals to the job summary and uploads the report. When your PR raises coverage, raise the thresholds with it; don't lower them to make a PR pass: add tests (a unit test, or a `play` function) instead.

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
