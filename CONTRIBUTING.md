# Contributing

Setup, scripts and the monorepo layout are described in the [README](README.md#development). Before opening a PR, run `bun run lint`, `bun run typecheck`, `bun run test`, `bun run test:storybook` (or `bun run test:coverage`, which also checks coverage), `bun run build`, `bun run test:dist`, `bun run size` and, if you touched a Code Connect template, `bun run code-connect`; if you touched a docs page or a story, `bun run build:storybook` and `bun run test:docs`; if you changed how anything looks, also `bun run visual` (Docker). The demo app (`apps/demo`, see its [README](apps/demo/README.md)) consumes the built packages: after `bun run build`, `bun run typecheck:demo`, `bun run build:demo` and `bun run test:demo` check that a Next.js app still builds and works with your change.

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat(ui): …`, `fix(icons): …`, `docs: …`).

## Quality gates

The [Build Check](.github/workflows/build-check.yml) workflow runs every gate below on each PR and push to `main` (overview in the [README](README.md#quality-gates)).

### Unit tests

`bun run test` runs each package's Vitest suite (jsdom, Testing Library): `*.test.ts(x)` files next to the code under test, configured in `packages/*/vitest.config.ts`. `bun run --filter @holakirr/snow-ui test:watch` / `test:coverage` are the watch and coverage variants.

The charts' tests (`packages/charts`) render Recharts in jsdom, which has no layout: `src/test/setup.ts` stubs `ResizeObserver` and `getBoundingClientRect` (a 600×240 container, about 7px per character for tick labels) and reports `prefers-reduced-motion: reduce`, so Recharts draws the final state without animating. Tooltips on hover and keyboard focus are tested in the stories' `play` functions (real layout, in Chromium).

### Storybook tests and accessibility

`bun run test:storybook` turns every story into a test with [`@storybook/addon-vitest`](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon): each story is rendered in headless Chromium (Vitest browser mode with the Playwright provider, at Storybook's 1200×900 default viewport) and fails if it throws or its `play` function fails. Every story runs three times: in the light theme (the `storybook` project of the root `vitest.config.ts`), in the dark theme (`storybook-dark`, the theme global set to `dark`; stories that pin a theme with `globals: { theme: … }` keep it), and in the light theme with the OS asking for more contrast and less motion (`storybook-prefs`: Playwright emulates `prefers-contrast: more` and `prefers-reduced-motion: reduce`), so axe checks the high-contrast colours and play functions can test reduced motion by reading `matchMedia` (Foundations › Motion does). The first run needs the browser: `bunx playwright install chromium`. You can also run the tests from Storybook's sidebar (the testing widget at the bottom) while `bun run storybook` is running.

**Locale and direction.** Every story is wrapped in `SnowUIProvider` (`.storybook/withLocale.tsx`), driven by the "Locale" (English, or the example Russian messages of `.storybook/locales.ts`) and "Direction" toolbars. A story pins them like the theme: `globals: { dir: 'rtl' }` (the `RTL` stories) or `globals: { locale: 'ru' }`; both run in the light and the dark theme. New built-in strings go into `Messages` (`packages/ui/src/components/SnowUIProvider/messages.ts`) and the Russian example, and new layout uses logical utilities (`ps-`, `ms-`, `start-`, `text-start`…) so it mirrors in right-to-left text.

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

  Never set `a11y.test` to `'todo'` or `'off'` to get a PR through. Current exceptions: `aria-hidden-focus` on Select "Open" and the open DatePicker and DateRangePicker stories (Radix hides the page with `aria-hidden` while the listbox or the modal calendar is open and traps focus in it, so the trigger can't be focused; axe doesn't see the focus trap).

**Target size is a gate too.** After axe, every story is checked for WCAG 2.5.8 (`.storybook/targetSize.ts`, the `afterEach` of `.storybook/preview.tsx`): each visible, enabled link, native control and ARIA widget needs room for a 24px disk in its pointer hit area, hit-tested in the page, so an invisible `hit-area` (`relative hit-area`, see `theme.css`), a label and the Input shell count. Inline links in a sentence are exempt. Give a small control a `hit-area` rather than an exception; when a WCAG exception really applies (spacing, equivalent, essential), list the element with the reason in the story's `parameters.targetSize.exceptions` (`[{ selector, reason }]`), or in `TARGET_SIZE_EXCEPTIONS` for every story. Current exceptions: `Link` (`data-slot="link"`, a text link as tall as its text: the inline or the spacing exception) and the Scheduler slots under events. It runs in the Chromium Storybook tests only (from the CLI or the Storybook UI's test widget; the Firefox and WebKit runs set the `targetSize: 'off'` global, and a story that is just shown isn't checked), and it puts back the scroll positions it changes.

**Contrast levels.** The form-control colours (`control-border`, `control-border-strong`, `placeholder`) are the Figma values by default and WCAG AA with more contrast (`prefers-contrast: more`, `data-contrast="more"`; see `docs/Contrast.mdx`). Use those tokens, not `black-20` / `black-40`, for the boundaries and placeholders of new controls, and `contrast-more:` for other high-contrast changes (a 1px stroke instead of 0.5px). `src/foundations/contrast.test.ts` computes the pairs in `src/test/contrast-pairs.ts` from the tokens in both themes and fails if one is under AA with more contrast: add the pairs of a new control there.

### Firefox and WebKit

`bun run test:storybook:browsers` runs every story again in headless Firefox and WebKit (Safari's engine), in the light theme (`vitest.browsers.config.ts`, which reuses the root config's Storybook project): a story fails when it throws or its `play` function fails, so keyboard, focus and pointer behaviour is checked in all three engines. axe, the dark theme and coverage stay in Chromium, the gate above. The browsers need a one-time `bunx playwright install firefox webkit`; run one with `bunx vitest run -c vitest.browsers.config.ts --project storybook-webkit`. These projects live outside the root config so that `bun run test:storybook` and Storybook's test widget don't need them. In CI (the `storybook-browsers` job, one job per browser) a failing story is retried once, because Firefox and WebKit are slower on the runners and the charts' play functions wait for their font with a fixed timeout; a story that only passes on the retry shows up as flaky in the log. WebKit runs at most two story files at a time and, in CI, in two shards one after the other, each in a fresh browser: the page's memory grows with every story file, and a full run once crashed it (out of memory). Vitest's retry doesn't cover a crashed page, which fails the whole run, so the job runs a shard whose page crashed once more, with a warning. Locally, WebKit runs after Firefox rather than alongside it: Vitest runs projects with different `maxWorkers` only in separate groups (`sequence.groupOrder`), one after the other.

Write play functions that hold in every engine: query by role and name, await what appears (`findBy…`, `waitFor`), and don't depend on a browser's default focus behaviour (Safari doesn't focus buttons on click, for example); assert where focus goes explicitly after `userEvent.tab()` or `.keyboard()`. Before measuring an element that animates in (a dialog, a sheet, a popover), call `settleLayout(element)` (`packages/ui/src/test/layout.ts`): it waits for the fonts and finishes the element's transitions, so `getBoundingClientRect()` measures the final layout. Don't wait for the transition with `waitFor`: a busy runner may not render a frame before the timeout (Dialog's `RTL` failed that way, with every edge still at the centre of a dialog scaled to 0).

### Server rendering and hydration

`bun run test:ssr` checks that every ui story works in a server-rendered app (`ssr/`). It runs two Vitest projects of `ssr/vitest.config.ts`, one after the other:

1. `ssr-render` renders each story (with its decorators, like `composeStories` in the unit tests) with `renderToString` in Node, where there is no `window` or `document`, and writes the HTML to `.tmp/ssr/stories.json`. The story fails if it throws or React logs an error.
2. `ssr-hydrate` puts each story's HTML in a page in headless Chromium and hydrates it with `hydrateRoot`. The story fails on any hydration mismatch (text, elements or attributes that differ between the server and the first client render; React then throws the server HTML away) or any other error React logs.

Both phases pin the clock to the visual tests' date, so date-dependent stories match. The usual causes of a failure: reading `window`, `document`, `localStorage` or `matchMedia` during render (do it in an effect, or with `useSyncExternalStore` and a server snapshot), and values that differ between two renders (`Math.random()`, `Date.now()`, locale-dependent formatting without a fixed locale; use `useId` for ids). A story that can't be server-rendered by design (a demo of a browser-only API) opts out with the `skip-ssr` tag and the reason in a comment, like `skip-visual`.

### Coverage

`bun run test:coverage` runs the ui and charts unit tests and the three Storybook projects with [V8 coverage](https://vitest.dev/guide/coverage) and merges them into one report of `packages/ui/src` and `packages/charts/src` (stories, tests, the Foundations pages and the recipes are excluded) in `coverage/` (`coverage/index.html`). It fails when statements, branches, functions or lines drop below the thresholds in the root `vitest.config.ts`, which sit about 2 points under the measured coverage. CI runs it in the `storybook-tests` job, writes the totals to the job summary and uploads the report. When your PR raises coverage, raise the thresholds with it; don't lower them to make a PR pass: add tests (a unit test, or a `play` function) instead.

### Visual regression tests

`visual/stories.spec.ts` screenshots every story of the built Storybook (from `storybook-static/index.json`) in the light and the dark theme at a fixed 1280×720 viewport and compares the shots with the baselines committed in `visual/__screenshots__/` (`<story id>--<theme>.png`). Each story opens in canvas mode with the `theme` global set (`withTheme` puts it on `<html data-theme>`, so portals get it too) and the toolbar defaults `locale: en` and `dir: ltr`; a story's own `globals` win, as in Storybook, so the `RTL` stories stay right-to-left and a story that pins its theme (the "Dark" twins) only gets a baseline in that theme (its run in the other theme is skipped). Screenshots are taken with CSS and SVG animations stopped and the caret hidden, after the story's `play` function has finished and every face of the self-hosted Inter has loaded, with the clock pinned (date-dependent stories render the same days) and no network: remote images are replaced by a placeholder and any other remote request fails. The comparison tolerates anti-aliasing noise only (per-pixel `threshold: 0.1`, at most 20 differing pixels; see `visual/playwright.config.ts`).

Shots are full-page rather than clipped to `#storybook-root`, because dialogs, menus, popovers and toasts render in portals outside it. At 1280×720 the PNGs stay small (mostly flat backgrounds): about 850 baselines take about 15 MB. `.gitattributes` marks them `binary`.

Baselines are Linux screenshots taken in the official Playwright Docker image (`mcr.microsoft.com/playwright:v<@playwright/test version>-noble`, `linux/arm64` like CI), because font rendering differs between operating systems (and, by a few pixels, between CPU architectures). The image is pinned by the digest of its multi-platform index in `visual/Dockerfile`, which `visual/docker.sh` and the CI job both read (nothing builds it), so a re-pushed tag can't change the browser under the baselines; each of them runs the index's `linux/arm64` variant. So the suite always runs in Docker; the Playwright config refuses to run on macOS/Windows.

```bash
bun run visual                   # build Storybook, compare with the baselines
bun run visual:update            # build Storybook, write new/changed baselines
bun run visual -g "Button"       # extra arguments go to `playwright test`
VISUAL_SKIP_BUILD=1 bun run visual  # reuse the current storybook-static/
```

One visual run at a time per user: a second run (another terminal, worktree or agent; on a development machine they all run as the same user and share one Docker) waits for the first. The lock is `visual.lock` in `$XDG_RUNTIME_DIR/snow-ui` (else `~/.cache/snow-ui`), a directory only you can write: a symlink to the owner's pid, created atomically, and taken over when that process is gone (a run killed with `kill -9`). A run also stops the containers that killed runs left behind: each container is labelled with the pid of the script that started it, and only those whose script is gone are stopped. The container gets half the host's CPUs (at most 6; `VISUAL_DOCKER_CPUS`) and 4 GB (`VISUAL_DOCKER_MEMORY`), and Playwright as many workers as CPUs unless you pass `--workers`.

Requirements: Docker (the arm64 image runs natively on Apple Silicon and arm64 Linux, 3 to 4 minutes for the whole suite, Storybook build included; an x86-64 host runs it emulated through QEMU, several times slower: Docker Desktop ships the emulator, Docker Engine on Linux needs it registered once with `docker run --privileged --rm tonistiigi/binfmt --install arm64`. `VISUAL_DOCKER_PLATFORM=linux/amd64` runs the amd64 variant instead, natively there, but its shots can differ from the baselines by a few pixels: compare with it if you must, never update baselines with it) and `bun install` done on the host (the container only uses the pure-JS `@playwright/test` from `node_modules`; Storybook is built on the host). No network is needed: Storybook bundles the self-hosted Inter (`packages/ui/src/fonts.css`). Failures leave the actual/expected/diff images in `test-results/visual/` and an HTML report in `playwright-report/` (`bunx playwright show-report`).

**Updating baselines.** When a change to how something looks is intended, run `bun run visual:update` (always through Docker, never with `VISUAL_ALLOW_HOST`), review the changed PNGs in the diff and commit them with the change. A story added without a baseline fails the comparison; opt a story or a whole component out with the `skip-visual` tag. `visual:update` only writes new and changed images: after removing or renaming stories, delete their PNGs (or empty the folder and regenerate everything). Bumping `@playwright/test` changes the image (and Chromium): in the same PR, pin the new image in `visual/Dockerfile` (tag and digest, from `docker buildx imagetools inspect mcr.microsoft.com/playwright:v<version>-noble`; Build Check's `build` job fails while the two versions disagree) and regenerate the baselines.

**In CI** the `visual` job blocks the PR on any difference. It runs in the Playwright image of the `@playwright/test` version from the lockfile (the same image as `bun run visual`, its `linux/arm64` variant on an arm64 runner, `ubuntu-24.04-arm`) against the Storybook built by the `build` job, with one retry. When it fails, download the `visual-diffs` artifact from the workflow run: `test-results/visual/` has the expected, actual and diff PNG of each failing story, and `playwright-report/` the HTML report (`bunx playwright show-report playwright-report`). If the change is intended, update the baselines as above; otherwise fix the regression. The job is skipped (with a notice) if `visual/__screenshots__/` has no baselines.

### Bundle size

`bun run size` checks the budgets in `.size-limit.json` with [size-limit](https://github.com/ai/size-limit) (esbuild preset: minified and brotli-compressed, React and other peer dependencies excluded) against the built packages, so run `bun run build` first. It covers the full `@holakirr/snow-ui` import, single-component imports (tree-shaking), the `react-hook-form` entry, `dist/index.css`, a full and a single-icon import of `@holakirr/snow-ui-icons`, and a full import, `{ BarChart }`, `{ Sparkline }` (plain SVG, no Recharts) and `styles.css` of `@holakirr/snow-ui-charts` (Recharts, a dependency, included; `@holakirr/snow-ui`, a peer, excluded). When a change legitimately needs more, raise the limit in the same PR and say why in its description; keep limits about 10% above the measured size so regressions stay visible.

**The per-component floor is tailwind-merge.** Every component merges its classes with the consumer's `className` through `twMerge` (`packages/ui/src/utils/tw-merge.ts`: tailwind-merge's default configuration, extended with the SnowUI token scales). That is about 7.5 kB of any single-component import, brotli-compressed (measured with esbuild: tailwind-merge's `twMerge` 7.47 kB, 7.79 kB with the token scales; `{ Button }` is 10.8 kB in all, by `bun run size`), and it is paid once: every other component reuses it, so a full import doesn't grow with it. The size is the class-group configuration tailwind-merge needs to resolve conflicts such as `px-3` against a consumer's `p-2`, so it can't be dropped or loaded lazily without giving up correct overrides (tailwind-merge already builds its lookup tables lazily, on the first call). Merging only when a `className` is passed would save run time, not bytes, and would need a change in every component. shadcn/ui makes the same trade.

### Package checks

`bun run build` runs [publint](https://publint.dev) and [are-the-types-wrong](https://arethetypeswrong.github.io) on every package after tsdown builds them (configured in `packages/*/tsdown.config.ts`), so broken `exports`, missing files or types that resolve differently in ESM and CommonJS fail the build.

`bun run test:dist` (after `bun run build`) checks the published stylesheets of `@holakirr/snow-ui` (`packages/ui/test/dist.test.ts`): it compiles a Tailwind v4 project stylesheet that imports `@holakirr/snow-ui/theme.css` with `@source` on `dist` (`packages/ui/test/fixtures/app.css`, resolved through the package's `exports`) and fails if it misses any class the built components use (also without an `@source` of its own, `fixtures/app-no-source.css`), and that a project importing `theme-core.css` (`fixtures/app-core.css`) gets the whole theme but only its own classes; it also checks that every rule of `index.css` is in a cascade layer and that `fonts.css` points at existing files. It also compiles the type tests in `packages/ui/test/types` with `tsc` against `dist/*.d.ts`, resolved through the package's `exports`: every exported component is listed in `refs.tsx` with the element its `ref` points at (or `null` when it takes none), so a new component that drops `ref` from its props type, or isn't listed, fails with its name. `packages/charts/test/dist.test.ts` checks the charts package: its exports resolve and load with `require()` and `import()`, every module that renders starts with `'use client'`, no stories or fixtures are shipped, and `styles.css` is one `components` layer that only reads tokens `@holakirr/snow-ui/index.css` defines.

### Code Connect templates

`bun run code-connect` runs `figma connect parse` on the Figma Code Connect templates (see [Figma Code Connect](#figma-code-connect)): it bundles each `*.figma.ts` the way `figma connect publish` would and fails on an unsupported import or a missing `// url=`. It needs no Figma token and no network, so CI runs it on every PR. `bun run typecheck` checks the templates' prop names and values against the components, and `packages/ui/src/code-connect/templates.test.ts` (part of `bun run test`) runs them against a stand-in for Figma's runtime and checks the snippets they render.

### Docs pages

`scripts/docs-pages.test.ts` (part of `bun run test:scripts`, so of `bun run test` and CI's `build` job) checks the usage pages against the docgen Storybook builds their props tables from (the same options, `.storybook/docgen.ts`): every component exported by `@holakirr/snow-ui`, `@holakirr/snow-ui/react-hook-form`, `@holakirr/snow-ui-charts` and `IconBase` has a props table on a page (`<ArgTypes of={X} />`, or `<Controls />` / `<ArgTypes />` of the stories' `component`), no table is empty, and every page has the [outline](#documentation) (Figma links, an import example, an example, Accessibility with a keyboard table unless the page is in its `STATIC_PAGES`, Props).

### Docs pages in the browser

`bun run test:docs` (after `bun run build:storybook`) opens every docs page of the built Storybook in headless Chromium (`docs-render/pages.spec.ts`: the `docs` entries of `storybook-static/index.json`, i.e. the guides, the usage pages and the automatic docs pages), in docs mode as the site shows them, and fails a page on an uncaught exception, a console error, Storybook's error display (an MDX page that throws, such as a code span evaluated as an expression) or a story on it whose render or `play` function fails. Every story iframe on a page is loaded, not only those in view. Nothing leaves the machine: remote images get a placeholder and any other remote request fails, and its console error fails the page. Stories use local images: `packages/ui/src/test/photos.ts` has stand-in user photos (SVG data URIs). It needs no Docker (no screenshots); the first run needs `bunx playwright install chromium`. CI runs it in the `docs` job, on the Storybook the `build` job built. In CI a failing page is retried once, so a runner hiccup doesn't hold up a release; a page that only passes on the retry is flaky, and the job lists it (a warning and the job summary). An error that shows up on some loads only is one readers get too: fix the race.

A story in an iframe on a docs page (`story={{ inline: false }}` on a `<Canvas>`, or `parameters.docs.story.inline: false`) runs its `play` function there, at the same time as the other stories of the page; an inline story doesn't (Storybook only plays it with `parameters.docs.story.autoplay`). So a play function shown in an iframe must not depend on what the other stories on the page share or change: which frame has the focus (a dialog open on load takes it) or a cookie (`sidebar_state`). Show the story inline when it can be (CommandPalette's `Default`), or give it its own starting state (Sidebar's `RTL` and `Offcanvas`).

### Generated token files

`bun run tokens` regenerates the files built from the design tokens (see [Design tokens](#design-tokens)); `bun run build` runs it too. CI runs it first and fails when that changes anything, so commit the generated files with the token change.

### Registry

The `registry` job checks the [shadcn registry](#registry-shadcn-cli): `bun run registry` must leave `packages/registry/manifest.json` unchanged, the registry package's tests must pass (`bun run test` runs them) and the pinned shadcn CLI must validate and build it. The `registry-smoke` job installs every item into fresh apps and builds them (see below), with the packages of the commit (local tarballs); after a publish, the release workflow's `verify` job does it against npm.

## Design tokens

The design tokens live in `packages/ui/tokens/` as [W3C Design Tokens (DTCG 2025.10)](https://www.designtokens.org/) files, the single source of truth for everything the library derives from them:

| File | Contents |
| --- | --- |
| `snow-ui.resolver.json` | The [resolver](https://www.designtokens.org/tr/2025.10/resolver/): the token files, and the `theme` modifier with the `light` and `dark` contexts |
| `color.light.tokens.json` / `color.dark.tokens.json` | The Figma "Colors" collection in the SnowUI-Light / SnowUI-Dark mode, plus the library's additions (`primary-hover*`, `indigo-text`, `text-secondary`, `red-text`, and `control-border`, `control-border-strong`, `placeholder` with their high-contrast values). Both files declare the same tokens |
| `color.contrast-standard.tokens.json` | The `contrast` modifier's default context, "standard": the Figma values of the contrast tokens, as aliases that are the same in both themes. The "more" context adds nothing, so the theme files' values apply |
| `typography.tokens.json` | `font.sans` (with its `font-feature-settings`) and the Figma text styles, `text.<size>.regular` / `.semibold` |
| `radius.tokens.json`, `effects.tokens.json` | Corner radius; shadows, the inner shadow, the focus ring colour and the background blurs |
| `deprecated.tokens.json` | Old names: colour aliases (`$deprecated`) and the channels of the old token system |

`bun run tokens` runs the [Terrazzo](https://terrazzo.app) CLI (`packages/ui/terrazzo.config.ts`): Terrazzo parses and validates the DTCG files, applies the resolver and resolves aliases, and the repository's plugin (`packages/ui/scripts/terrazzo-plugin-snow-ui.ts`) writes

- `src/styles/tokens.generated.css`: the Tailwind v4 `@theme static` block (light values) and the theme scopes in `@layer base` (`:root, [data-theme="light"], .light`, `[data-theme="dark"], .dark`, the `prefers-color-scheme: dark` block for `<html>` without a mode and the `[data-theme], .light, .dark` re-declarations). `theme.css` imports it;
- `src/foundations/tokens.generated.ts`: the data of Storybook's Foundations pages;
- `src/utils/token-scales.generated.ts`: the scales tailwind-merge needs.

Don't edit these files: change the tokens and run `bun run tokens`. Terrazzo was picked over Style Dictionary because it is DTCG-first (strict validation, the 2025.10 resolver for modes, aliases, `$deprecated`); the output is a custom plugin because neither tool's stock CSS/Tailwind formats produce Tailwind `@theme` variables plus scoped `[data-theme]` blocks with the var()-based tokens re-declared per scope.

Conventions the plugin relies on (it fails with a message when a token breaks them):

- A token `<group>.<name>` becomes `--<group>-<name>`; the groups are Tailwind theme namespaces (`color`, `radius`, `shadow`, `inset-shadow`, `ring-color`, `blur`, `font`, `text`). A new group needs a line in the plugin.
- Colours are sRGB objects (`{ "colorSpace": "srgb", "components": [0, 0, 0], "alpha": 0.8, "hex": "#000000" }`) and are written as `#rgb` / `rgb(r g b / a)`; dimensions are in px (`radius` and `text` become rem).
- An alias that is the same in both modes (`{color.primary}`) is written as `var(--color-primary)`, so it follows the theme scopes; an alias that differs per mode (Figma's Primary: `{color.black}` / `{color.indigo}`) is written as each mode's colour.
- A colour that differs between the `contrast` contexts gets contrast scopes: its "standard" value must be the same in both themes (an alias); its "more" values per theme become `--color-<name>--more` in the theme scopes, and every scope element (`:root`, `[data-theme]`, the `light` / `dark` classes, `[data-contrast]`) picks one with the `--contrast-more` switch (see `renderContrast` in the plugin). Only `color.*` tokens may change with the contrast.
- `$extensions["com.holakirr.snow-ui"]`: `figma` (the Figma variable or style name, shown in the docs), `css` (a formula such as `color-mix(in srgb, {color.primary}, {color.white} 20%)`, whose `$value` in each mode must be its result) and `fontFeatureSettings`.

To add a colour, add it to both `color.*.tokens.json` files (with the dark value, or the same one), run `bun run tokens`, and list it in a group in `src/foundations/tokens.ts` (`tokens.test.ts` fails otherwise); then `bg-<name>`, `text-<name>`… work. Add a changeset: new tokens are a minor change, renamed or removed ones a major.

### Syncing from Figma

The token names follow Tailwind (`color.black-80`), not Figma (`Black/80%`); each token records its Figma name in `$extensions`. To bring changes over from the [SnowUI Figma kit](https://www.figma.com/community/file/1301134685302006646):

1. Export the variables as DTCG JSON, one file per mode. Figma's native variables export (announced at Schema 2025 and rolling out: right-click the "Colors" collection → Export) writes DTCG JSON; so do plugins such as [Design Tokens (W3C) Export](https://www.figma.com/community/plugin/1377982390646186215/design-tokens-w3c-export) or Tokens Studio (with the W3C DTCG token format), which also cover text and effect styles. `bunx tz import <figma file url>` (Terrazzo) writes a resolver with the tokens directly, but reading Variables through the Figma REST API requires an Enterprise plan (Styles work on every plan), as does any CI automation built on that API.
2. Copy the changed values into the matching tokens here (by Figma name), keeping the token names, the library additions (no Figma name) and the deprecated aliases. The export's colour objects can be pasted as they are.
3. Run `bun run tokens`, review the diff of `src/styles/tokens.generated.css` and the Foundations pages in Storybook, and run `bun run test` and `bun run visual`.

### Fonts

`@holakirr/snow-ui/fonts.css` self-hosts Inter from `packages/ui/src/fonts/`: subsets of the rsms Inter 4.1 variable fonts (the Google Fonts build lacks the `ss01` / `cv01` features), split by unicode-range, with the OFL license in `src/fonts/LICENSE.txt` (hence the package's `MIT AND OFL-1.1` license). Besides Google Fonts' script ranges there is `ui-symbols` (≈8 kB: the arrows and keyboard symbols components and shortcut hints render, such as CommandPalette's ↩ and the shortcut hints' ⌘) and `symbols` (≈100 kB: everything else), so a single arrow doesn't pull in the big file; when a component starts rendering a new symbol, add its code point to `UI_SYMBOLS`. The design only uses upright Regular and Semibold, so the italic faces are opt-in (`fonts-italic.css`). The base layer sets `font-optical-sizing: none`: the Figma kit uses the "Inter" family (text optical size) at every size, not "Inter Display". So the script pins the variable fonts' optical-size axis at 14 (fontTools `instancer`; the weight axis stays variable): the glyphs the browser draws are the same and the files are about 36% smaller (Latin: 105 kB → 69 kB). The files are committed; `packages/ui/scripts/subset-inter.py` (Python, fontTools) regenerates them and both stylesheets, as described at the top of the script. Size budgets cover the Latin (upright and italic), Latin Extended, `symbols` and `ui-symbols` files.

## Documentation

The Storybook ([snow-ui.holakirr.com](https://snow-ui.holakirr.com)) is the reference: guides in `docs/*.mdx` (Getting started, Registry, API conventions, Theming, Localization and RTL, and the Next.js App Router, Vite and React Router 7 setups) and one usage page per component, `<Component>.mdx` next to its stories. A page that starts with `<Meta of={XStories} />` replaces the component's automatic docs page and follows the same outline: purpose and import (with `<InstallTabs />` under the Figma links), when to use and when not to (with the alternatives), anatomy, variants and sizes, states, accessibility (roles and labelling, a `### Keyboard` table, deviations from the Figma kit), localization and RTL, composition (`asChild`), do and don't, related components and the props tables. `Button.mdx` is the model; `Tabs.mdx` shows a compound component. `scripts/docs-pages.test.ts` checks the outline (see [Docs pages](#docs-pages)).

- **Props tables** come from [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript), configured in `.storybook/docgen.ts`: it follows the Radix, cva and shared prop types, and its `propFilter` keeps the component's own props, the Radix / cva / react-hook-form / Recharts component props and `className`, and leaves out the DOM attributes (say on the page which element gets them). Under `## Props`, give every exported part a `### PartName` heading, a sentence and `<ArgTypes of={PartName} />`; use `<Controls />` for the root only when its primary story is driven by `args`. Descriptions and defaults come from the props' JSDoc (`@default`); generic (polymorphic) props need `argTypes` in the stories (see `ListItem.stories.tsx`). The docgen must not change how a story runs: `bun run test:storybook` runs the stories without it (addon-vitest leaves it out), the built Storybook and the visual tests with it, so the preview has no implicit actions (`argTypesRegex`); pass `fn()` to the handlers a story checks. TypeScript 7 has no JavaScript API, so `patches/` points react-docgen-typescript and its Vite plugin at TypeScript 6's (`@typescript/typescript6`) and fixes react-docgen-typescript bugs that mixed up the props, defaults and names of the components of one file; when either package is updated, re-create its patch with `bun patch`.
- **Keyboard tables** list every key the component handles, `| Key | Action |`, checked against the Radix primitive (or react-day-picker, Recharts) and the `play` tests, including what changes in right-to-left text.

- Show existing stories with `<Canvas of={XStories.Story} />`; don't write demos in MDX, so every example is also a tested story. Link to other pages with `?path=/docs/<story id>--docs`.
- Check every claim against the code: sizes from the classes, keyboard behaviour from the Radix primitive and the `play` tests, accessibility deviations from the [ui README](packages/ui/README.md#accessibility-deviations-from-the-figma-kit).
- `.storybook/blocks.tsx` has the page blocks: `FigmaLinks` (links to the component in Figma, from the stories' `parameters.design`) and `DoDont` / `Do` / `Dont`. `InstallTabs` (`.storybook/InstallTabs.tsx`, available on every page without an import) shows how to install a component: see [Registry](#registry-shadcn-cli).
- **Figma links:** every stories file sets `parameters.design = { type: 'figma', url }` with the component set's node in the owner's licensed copy of the kit (`https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=<id>`, the node id with `-` for `:`), or the Figma page when there is no component set. [`@storybook/addon-designs`](https://github.com/storybookjs/addon-designs) shows it in the "Design" panel. The file is private, so the links and the embed only open for people with access to it; don't add screenshots of the design.
- MDX in `packages/ui/src` is excluded from the package's Tailwind scan (`src/index.css`), so class names in the docs don't end up in `index.css`.

## Registry (shadcn CLI)

Every component is also served as copy-paste source for the [shadcn CLI](https://ui.shadcn.com/docs/registry) (`@snow-ui`, https://snow-ui.holakirr.com/r/), generated from `packages/ui/src` by `packages/registry` (its [README](packages/registry/README.md) has the design and the decisions). There is no second copy of the components: the registry is another output of the same sources.

- **When the import graph changes** — a new component, file, export or npm import, a moved file — run `bun run registry` and commit `packages/registry/manifest.json`. A new component directory becomes an item by itself; a new top-level module (outside `components/`, `hooks/`, `utils/`, `constants/`, `types/`) fails until `packages/registry/registry.config.ts` puts it in an item.
- **Runtime code** may only import runtime modules (not stories, tests, `code-connect/` or `test/` helpers), with static imports; a comment must not precede `'use client'`. The generator fails otherwise.
- **Usage pages** show the installation block right under the Figma links: `<InstallTabs item="<item name>" />` (the item names are in the manifest: `button`, `checkbox`, `snow-ui-provider`…). A registry test fails when a page lacks it. A component added in a minor release gets an entry in `.storybook/added-in.ts` (item name → version): the block then says "Added in @holakirr/snow-ui X.Y".
- `bun run registry:build` builds `/r/*.json`, `/r/registry.json` and `llms.txt` into `storybook-static/` (`bun run build:storybook` runs it; Vercel serves them). `bun packages/registry/smoke/smoke.ts --app next|vite|next-shadcn` (after `bun run build`) installs every item into a fresh app from a local copy and builds it, as the `registry-smoke` job does. Each app also checks that every colour token and custom utility (`@utility`) of this commit's theme that the installed items use is in the built CSS: Tailwind skips an unknown class silently. With `--published` the packages come from npm, at the ranges the registry declares (the release workflow's `verify` job, after publishing): between releases that fails, because `main` uses tokens npm's theme doesn't have yet.
- **The registry's npm ranges** are `^<version>` of the workspace packages at the commit it is built from. Production serves the registry of the `release` branch, which the release workflow moves to each published commit, so every range resolves on npm and the published theme matches the items. `next.snow-ui.holakirr.com` serves `main`, ahead of npm by design.
- The shadcn CLI is pinned (`packages/registry/package.json`), like the app scaffolders of the smoke test (`smoke/smoke.ts`): bump them together in one PR and run the smoke test.

## Figma Code Connect

[Code Connect](https://github.com/figma/code-connect) shows the library's code for a component in Figma's Dev Mode. The templates are ready but **not published**: publishing needs a Figma plan with Code Connect (Organization or Enterprise), which the owner's plan doesn't include.

- `figma.config.json` (repository root) points the CLI at `packages/ui/src/components/**/*.figma.ts`: one template per connected component (Button, Input, Checkbox, RadioGroup, Switch, Tabs, Tag, Badge, KBD, Tooltip, Card, Table, Toaster, IconBox, IconText, Search, Link, Select, Toggle).
- They are Code Connect 2 templates (`@figma/code-connect` 2 dropped the parser-based `figma.connect()` `.figma.tsx` files): the first comment lines are directives (`// url=` the Figma component, `// source=` the component's source, `// component=`), and the default export renders the snippet from the selected instance's variants (`figma.selectedInstance.getEnum('Size', …)`). `packages/ui/src/code-connect/helpers.ts` has the shared helpers; the CLI bundles it into each template.
- Map every Figma value to a prop value with `satisfies` against the component's props (`satisfies Record<string, ButtonProps['size']>`, `satisfies AttrsOf<ButtonProps>`), so `bun run typecheck` catches a renamed prop or value. A template may only import `figma`, relative helpers and types (`import type`).
- Checks: `bun run code-connect`, `bun run typecheck` and the template tests (see [Code Connect templates](#code-connect-templates)).

The Figma property names come from an audit of the kit. Before the first publish, check these in Figma:

- **Where the components live.** The URLs point to the component sets in the licensed copy (`ZiRnYjr5N29yTkcIXihZUx`). If they are library components there (the Button set's documentation link points to the SnowUI library file), publish against the file that defines them: map the file key with `documentUrlSubstitutions` in `figma.config.json` instead of editing every URL.
- **Table** has no component set: its template points to the Table page, which Code Connect rejects. Point it to the table component you use (e.g. the "Table title" header cell).
- **Switch:** the name of its on/off variant wasn't recorded; the template reads `Select` (as on Checkbox and Radio), then `Checked`, `On` or `Active`.
- **Tab sizes** were recorded as both Small / Medium / Large and S / M / L; the Tabs and Toggle templates accept both.
- **Shared sets:** Select is connected to the Popover set (its options menu), Toggle to the Tab set (a segmented item, next to Tabs).

To publish, with a personal access token that has the **Code Connect: Write** and **File content: Read** scopes:

```bash
export FIGMA_ACCESS_TOKEN=…            # never commit it
bunx figma connect publish --dry-run   # validates against Figma, uploads nothing
bunx figma connect publish
bunx figma connect unpublish           # removes the published mappings
```

In CI, store the token as a secret and run `figma connect publish --exit-on-unreadable-files` on pushes to `main`.

## Charts

`packages/charts` (`@holakirr/snow-ui-charts`) wraps [Recharts](https://recharts.github.io) 3 (a dependency) in the SnowUI design. Its stories live next to the components (`packages/charts/src/*.stories.tsx`, "Charts/…" in Storybook) with a usage page each (`*.mdx`), like the ui components.

- **Styles** are plain CSS in `src/styles.css` (copied to `dist/styles.css` by the build), not Tailwind classes: the package can't count on the consumer's Tailwind scanning it, and `@holakirr/snow-ui/index.css` only has the classes the ui components use. Every rule is in `@layer components` and reads ui tokens only (`test:dist` checks both); Storybook imports it from `.storybook/index.css`. Stories may use Tailwind classes (Storybook scans `packages/charts/src`).
- **Colours** come from the `ChartConfig` as `--chart-<key>` custom properties; use `seriesColor(key)` for Recharts fills and strokes, never hex values, so dark mode and scoped themes work.
- **Recharts** is a dependency, re-exported as `@holakirr/snow-ui-charts/recharts` (`src/recharts.ts`) so apps build composable charts with the package's own copy; docs and examples import the primitives from there. Stacking and projections are computed in `src/series-data.ts`, not with Recharts' `stackId`.
- **Sparkline** is plain SVG (no Recharts) to stay small and server-rendered; keep it that way (its size budget is 2.6 kB).
- **`@holakirr/snow-ui` is a peer dependency** (`^5.0.0`) for its tokens and `useSnowUI()`. Changesets is set to update a peer range only when a release leaves it (`onlyUpdatePeerDependentsWhenOutOfRange`); when ui gets a new major, add a changeset for the charts that widens or moves the range (a major for the charts if it drops the old ui major).
- **Accessibility**: every chart is a named `<figure>` with a visually hidden data table (see the ChartContainer page). The cartesian charts (line, area, bar, and composable charts on `ChartContainer`) also have keyboard navigation (← / →) and a live region that announces it; the donut (its legend lists every value) and the sparkline (an illustration next to a number) are not tab stops. New charts keep the figure and the table, add the keyboard and the live region when they have a tooltip, and their stories need `play` tests for hover and, where supported, the keyboard.
- **Screenshots**: charts draw once their font has loaded and set `data-chart-ready`, which `visual/stories.spec.ts` waits for. Chart stories end their `play` functions with `endInteraction()` (`src/test/play.ts`: blur, pointer out, tooltips hidden), so no screenshot depends on when a hover or focus state is torn down; the tooltips are shot open with Recharts' `defaultIndex` (ChartContainer › Tooltips).
- **Figma**: the SnowUI kit's Chart page (`25596:130956`) is a drawing kit of fixed bar counts, gridlines and labels, not data-driven components, so the charts have no Code Connect templates; the stories link their Figma nodes in `parameters.design`.

## Changesets

Releases are driven by [Changesets](https://github.com/changesets/changesets). If your PR changes what users of `@holakirr/snow-ui`, `@holakirr/snow-ui-icons` or `@holakirr/snow-ui-charts` get from npm — code, styles, types, dependencies or the build output — add a changeset:

```bash
bun changeset
```

Pick the packages, the bump for each and write a summary. It is committed as a Markdown file in `.changeset/` and becomes the package's `CHANGELOG.md` entry, so write it for the library's users: what changed and, for breaking changes, how to migrate.

- **major**: something that worked stops working — a removed or renamed export, prop or CSS token; a narrower prop type; a peer dependency major; an upgrade of a dependency whose types are part of our public props (e.g. `CalendarProps` extends react-day-picker's `DayPickerProps`).
- **minor**: new components, props, exports or options; deprecations.
- **patch**: bug fixes, and internal or build changes that users don't need to act on.

**Write hex colours in code spans** (`` `#333` ``), and any other `#` that isn't an issue or PR reference. The changelog generator (`.changeset/changelog.mjs`, which wraps `@changesets/changelog-github`) links every bare `#` followed by digits to that issue (`#12` → issue 12, as intended for references); inside a code span or a code block it leaves the text alone, and so does GitHub in the release notes.

PRs that don't touch a published package (docs, Storybook stories, CI, tests) don't need one. The "changeset" job of Build Check warns on PRs that change packages without a changeset; if no release is needed, add an empty one with `bun changeset --empty`. You can edit or delete changeset files in your PR like any other file, and check what would be released with `bun changeset status`.

## Releases

Maintainers don't bump versions or write changelogs by hand. After a PR with changesets is merged into `main` and its Build Check passes, the release workflow opens (or updates) the **"chore(release): version packages"** PR with the version bumps and changelog entries, and approves its Build Check run (a PR opened by a workflow waits for approval to run its checks). Merging it publishes the packages to npm, tags them and creates GitHub releases with their SBOMs. Nothing is published from a commit whose Build Check hasn't passed. See [Releasing](README.md#releasing) for the details, and the [Versioning and support policy](VERSIONING.md) for which bump a change needs and how deprecations work.

If a release didn't happen (Build Check failed and was fixed by a re-run, or a run was cancelled), re-running Build Check on `main` triggers it again, or run it by hand: Actions → Release → Run workflow on `main`, mode `release`. A failed job after the publish (`verify`, `promote`, `sbom`) is retried with "Re-run failed jobs": publishing is never repeated.

**The site and the `release` branch.** Vercel's production deployment (snow-ui.holakirr.com) is the `release` branch, which the release workflow fast-forwards to each release commit (the commit its release tags point at) after `verify` passed; when the branch doesn't exist, `promote` creates it. A later commit that publishes nothing never moves it. If `verify` or `promote` failed, "Re-run failed jobs" on that run retries them (or run the workflow again while the release commit is still `main`'s head). To show an earlier release (a bad deploy), point `release` at that release's commit by hand, `git push --force origin <commit>:refs/heads/release`; the next release fast-forwards from wherever it stands, as long as it leads to the new commit. The workflow never force-pushes it: when `release` doesn't lead to the release commit, `promote` fails and says so.

**Why build and publish are separate jobs.** The build toolchain (tsdown, Tailwind, Terrazzo, the font scripts and their dependencies) runs in `pack`, with a read-only token. `publish` only runs changesets, npm and `scripts/publish.ts`, installed without install scripts, with Bun downloaded rather than restored from the Actions cache. Nothing `pack` hands over is trusted as is: `scripts/publish.ts` recomputes the publish plan from the commit and npm (`changeset publish-plan`) and publishes only if the packed plan is exactly that plan (package names, versions, access, dist-tags), every package is a public workspace package at its version in the commit, and every tarball has the sha256 the plan records and its own `package.json` names the same package and version. So a compromised build dependency can't mint the npm OIDC token, publish other packages, versions or dist-tags, or write to the repository; it can still change the contents of the tarballs of the release it builds. The canary job still builds and publishes in one job: a dispatch runs the dispatched branch's own `release.yml`, so whoever can push a branch controls that job anyway, and the gate is not a security boundary there. Enforcing who can publish takes GitHub settings: an environment with required reviewers for the publishing jobs, bound to the npm Trusted Publisher.

### Pre-releases and canaries

**`next`: pre-releases of the next major.** Breaking changes don't go to `main`: they are collected on the `next` branch and published as pre-releases (`6.0.0-next.0`, `6.0.0-next.1`…) under the `next` npm dist-tag, while `main` keeps releasing 5.x minors and patches, including the deprecations.

1. Start the channel once: create `next` from `main`, run `bun changeset pre enter next`, commit the new `.changeset/pre.json` and push. Build Check and the release workflow run on `next` as on `main`.
2. Breaking PRs target `next`, with a `major` changeset. When one is merged, the release workflow opens the "chore(release): version packages (next)" PR (branch `changeset-release/next`); merging it publishes the pre-releases. Install one with `npm install @holakirr/snow-ui@next`.
3. Merge `main` into `next` regularly (after each 5.x release), so fixes reach the major and the two don't drift apart. In the `version` fields of the `package.json` files keep `next`'s pre-release versions; keep both sides' changelog entries.
4. To release the major: on a branch from `next`, run `bun changeset pre exit`, commit, and open a PR into `main`. After it is merged, the version PR on `main` has the final versions (`6.0.0`) and the full changelog; merging it publishes them as `latest`.

**Canaries: one unreleased change, in your app.** Actions → Release → Run workflow, on the branch you want (it needs a green Build Check: a PR's counts, or run Build Check on the branch first), mode `canary`. It publishes `0.0.0-canary-<short sha>` versions of the packages that have pending changesets on that branch, and of the packages that depend on them, under the `canary` dist-tag, with provenance. The job summary lists the exact versions to install. Nothing is committed, tagged or released on GitHub, and `latest` doesn't move. Snapshots aren't possible in pre-release mode, so there are no canaries from `next`. Locally, `bun changeset version --snapshot canary` shows what a canary would publish (revert the changes afterwards).

### Publishing a new package

CI publishes with npm Trusted Publishing, and npm only lets you add a Trusted Publisher to a package that already exists. So the **first** version of a new package (now: `@holakirr/snow-ui-charts` 0.1.0) is published by the owner, by hand; `scripts/publish.ts` skips packages that aren't on npm yet (with a warning in the release job's summary), so the automated release doesn't fail meanwhile and the other packages publish as usual.

1. Merge the version PR ("chore(release): version packages") that bumps the new package (here to 0.1.0). The release job runs, publishes the other packages and warns "First publish of @holakirr/snow-ui-charts".
2. On an up-to-date `main`, with npm logged in as the owner of the `@holakirr` scope (`npm whoami`; 2FA as usual):

   ```bash
   git switch main && git pull
   bun install --frozen-lockfile
   bun run build          # builds icons, ui and the charts (publint + attw)
   bun run test:dist
   cd packages/charts
   npm publish --dry-run --access public --provenance=false   # check the file list
   npm publish --access public --provenance=false
   ```

   `--provenance=false` is needed because `publishConfig.provenance` is on and provenance can only be generated in CI; this one version has none.
3. Tag it as CI would, and create its GitHub release with the `0.1.0` entry of `packages/charts/CHANGELOG.md` as the notes (in the web UI, or `gh release create @holakirr/snow-ui-charts@0.1.0 --title @holakirr/snow-ui-charts@0.1.0 --notes "…"`):

   ```bash
   git tag @holakirr/snow-ui-charts@0.1.0
   git push origin @holakirr/snow-ui-charts@0.1.0
   ```

4. On npmjs.com → the package → Settings → Trusted Publisher: GitHub Actions, repository `holakirr/snow-ui`, workflow `release.yml` (and the publishing-access settings you use for the other packages).

From the next version on, the release workflow publishes it with provenance like the others. If the owner merges the version PR and forgets step 2, nothing breaks: every release run skips the package and warns again.
