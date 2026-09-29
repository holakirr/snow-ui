# Contributing

Setup, scripts and the monorepo layout are described in the [README](README.md#development). Before opening a PR, run `bun run lint`, `bun run typecheck`, `bun run test`, `bun run test:storybook` (or `bun run test:coverage`, which also checks coverage), `bun run build`, `bun run test:dist`, `bun run size` and, if you touched a Code Connect template, `bun run code-connect`; if you changed how anything looks, also `bun run visual` (Docker).

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat(ui): …`, `fix(icons): …`, `docs: …`).

## Quality gates

The [Build Check](.github/workflows/build-check.yml) workflow runs every gate below on each PR and push to `main` (overview in the [README](README.md#quality-gates)).

### Unit tests

`bun run test` runs each package's Vitest suite (jsdom, Testing Library): `*.test.ts(x)` files next to the code under test, configured in `packages/*/vitest.config.ts`. `bun run --filter @holakirr/snow-ui test:watch` / `test:coverage` are the watch and coverage variants.

### Storybook tests and accessibility

`bun run test:storybook` turns every story into a test with [`@storybook/addon-vitest`](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon): each story is rendered in headless Chromium (Vitest browser mode with the Playwright provider, at Storybook's 1200×900 default viewport) and fails if it throws or its `play` function fails. Every story runs twice: in the light theme (the `storybook` project of the root `vitest.config.ts`) and in the dark theme (`storybook-dark`, the theme global set to `dark`; stories that pin a theme with `globals: { theme: … }` keep it). The first run needs the browser: `bunx playwright install chromium`. You can also run the tests from Storybook's sidebar (the testing widget at the bottom) while `bun run storybook` is running.

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

  Never set `a11y.test` to `'todo'` or `'off'` to get a PR through. Current exceptions: `aria-hidden-focus` on Select "Open" (Radix hides the page with `aria-hidden` while the listbox is open and traps focus in it, so the trigger can't be focused; axe doesn't see the focus trap).

### Coverage

`bun run test:coverage` runs the ui unit tests and both Storybook projects with [V8 coverage](https://vitest.dev/guide/coverage) and merges them into one report of `packages/ui/src` (stories, tests, the Foundations pages and the recipes are excluded) in `coverage/` (`coverage/index.html`). It fails when statements, branches, functions or lines drop below the thresholds in the root `vitest.config.ts`, which sit about 2 points under the measured coverage. CI runs it in the `storybook-tests` job, writes the totals to the job summary and uploads the report. When your PR raises coverage, raise the thresholds with it; don't lower them to make a PR pass: add tests (a unit test, or a `play` function) instead.

### Visual regression tests

`visual/stories.spec.ts` screenshots every story of the built Storybook (from `storybook-static/index.json`) in the light and the dark theme at a fixed 1280×720 viewport and compares the shots with the baselines committed in `visual/__screenshots__/` (`<story id>--<theme>.png`). Each story opens in canvas mode with the `theme` global set (`withTheme` puts it on `<html data-theme>`, so portals get it too) and the toolbar defaults `locale: en` and `dir: ltr`; a story's own `globals` win, as in Storybook, so the `RTL` stories stay right-to-left and a story that pins its theme (the "Dark" twins) only gets a baseline in that theme (its run in the other theme is skipped). Screenshots are taken with CSS and SVG animations stopped and the caret hidden, after the story's `play` function has finished and every face of the self-hosted Inter has loaded, with the clock pinned (date-dependent stories render the same days) and no network: remote images are replaced by a placeholder and any other remote request fails. The comparison tolerates anti-aliasing noise only (per-pixel `threshold: 0.1`, at most 20 differing pixels; see `visual/playwright.config.ts`).

Shots are full-page rather than clipped to `#storybook-root`, because dialogs, menus, popovers and toasts render in portals outside it. At 1280×720 the PNGs stay small (mostly flat backgrounds): about 600 baselines take about 10 MB. `.gitattributes` marks them `binary`.

Baselines are Linux screenshots taken in the official Playwright Docker image (`mcr.microsoft.com/playwright:v<@playwright/test version>-noble`, `linux/amd64` like CI), because font rendering differs between operating systems. So the suite always runs in Docker; the Playwright config refuses to run on macOS/Windows.

```bash
bun run visual                   # build Storybook, compare with the baselines
bun run visual:update            # build Storybook, write new/changed baselines
bun run visual -g "Button"       # extra arguments go to `playwright test`
VISUAL_SKIP_BUILD=1 bun run visual  # reuse the current storybook-static/
```

Requirements: Docker (on Apple Silicon the amd64 image runs through Rosetta, a few minutes for the whole suite) and `bun install` done on the host (the container only uses the pure-JS `@playwright/test` from `node_modules`; Storybook is built on the host). No network is needed: Storybook bundles the self-hosted Inter (`packages/ui/src/fonts.css`). Failures leave the actual/expected/diff images in `test-results/visual/` and an HTML report in `playwright-report/` (`bunx playwright show-report`).

**Updating baselines.** When a change to how something looks is intended, run `bun run visual:update` (always through Docker, never with `VISUAL_ALLOW_HOST`), review the changed PNGs in the diff and commit them with the change. A story added without a baseline fails the comparison; opt a story or a whole component out with the `skip-visual` tag. `visual:update` only writes new and changed images: after removing or renaming stories, delete their PNGs (or empty the folder and regenerate everything). Bumping `@playwright/test` changes the image (and Chromium), so regenerate the baselines in the same PR.

**In CI** the `visual` job blocks the PR on any difference. It runs in the Playwright image of the `@playwright/test` version from the lockfile (the same image as `bun run visual`, native amd64) against the Storybook built by the `build` job, with one retry. When it fails, download the `visual-diffs` artifact from the workflow run: `test-results/visual/` has the expected, actual and diff PNG of each failing story, and `playwright-report/` the HTML report (`bunx playwright show-report playwright-report`). If the change is intended, update the baselines as above; otherwise fix the regression. The job is skipped (with a notice) if `visual/__screenshots__/` has no baselines.

### Bundle size

`bun run size` checks the budgets in `.size-limit.json` with [size-limit](https://github.com/ai/size-limit) (esbuild preset: minified and brotli-compressed, React and other peer dependencies excluded) against the built packages, so run `bun run build` first. It covers the full `@holakirr/snow-ui` import, single-component imports (tree-shaking), the `react-hook-form` entry, `dist/index.css`, and a full and a single-icon import of `@holakirr/snow-ui-icons`. When a change legitimately needs more, raise the limit in the same PR and say why in its description; keep limits about 10% above the measured size so regressions stay visible.

### Package checks

`bun run build` runs [publint](https://publint.dev) and [are-the-types-wrong](https://arethetypeswrong.github.io) on both packages after tsdown builds them (configured in `packages/*/tsdown.config.ts`), so broken `exports`, missing files or types that resolve differently in ESM and CommonJS fail the build.

`bun run test:dist` (after `bun run build`) checks the published stylesheets of `@holakirr/snow-ui` (`packages/ui/test/dist.test.ts`): it compiles a Tailwind v4 project stylesheet that imports `@holakirr/snow-ui/theme.css` with `@source` on `dist` (`packages/ui/test/fixtures/app.css`, resolved through the package's `exports`) and fails if it misses any class the built components use; it also checks that every rule of `index.css` is in a cascade layer and that `fonts.css` points at existing files.

### Code Connect templates

`bun run code-connect` runs `figma connect parse` on the Figma Code Connect templates (see [Figma Code Connect](#figma-code-connect)): it bundles each `*.figma.ts` the way `figma connect publish` would and fails on an unsupported import or a missing `// url=`. It needs no Figma token and no network, so CI runs it on every PR. `bun run typecheck` checks the templates' prop names and values against the components, and `packages/ui/src/code-connect/templates.test.ts` (part of `bun run test`) runs them against a stand-in for Figma's runtime and checks the snippets they render.

### Generated token files

`bun run tokens` regenerates the files built from the design tokens (see [Design tokens](#design-tokens)); `bun run build` runs it too. CI runs it first and fails when that changes anything, so commit the generated files with the token change.

## Design tokens

The design tokens live in `packages/ui/tokens/` as [W3C Design Tokens (DTCG 2025.10)](https://www.designtokens.org/) files, the single source of truth for everything the library derives from them:

| File | Contents |
| --- | --- |
| `snow-ui.resolver.json` | The [resolver](https://www.designtokens.org/tr/2025.10/resolver/): the token files, and the `theme` modifier with the `light` and `dark` contexts |
| `color.light.tokens.json` / `color.dark.tokens.json` | The Figma "Colors" collection in the SnowUI-Light / SnowUI-Dark mode, plus the library's additions (`primary-hover*`, `indigo-text`, `text-secondary`, `red-text`). Both files declare the same tokens |
| `typography.tokens.json` | `font.sans` (with its `font-feature-settings`) and the Figma text styles, `text.<size>.regular` / `.semibold` |
| `radius.tokens.json`, `effects.tokens.json` | Corner radius; shadows, the inner shadow, the focus ring colour and the background blurs |
| `deprecated.tokens.json` | Old names: colour aliases (`$deprecated`) and the channels of the old token system |

`bun run tokens` runs the [Terrazzo](https://terrazzo.app) CLI (`packages/ui/terrazzo.config.ts`): Terrazzo parses and validates the DTCG files, applies the resolver and resolves aliases, and the repository's plugin (`packages/ui/scripts/terrazzo-plugin-snow-ui.ts`) writes

- `src/styles/tokens.generated.css`: the Tailwind v4 `@theme static` block (light values) and the theme scopes in `@layer base` (`:root, [data-theme="light"]`, `[data-theme="dark"]`, the `prefers-color-scheme: dark` block and the `[data-theme]` re-declarations). `theme.css` imports it;
- `src/foundations/tokens.generated.ts`: the data of Storybook's Foundations pages;
- `src/utils/token-scales.generated.ts`: the scales tailwind-merge needs.

Don't edit these files: change the tokens and run `bun run tokens`. Terrazzo was picked over Style Dictionary because it is DTCG-first (strict validation, the 2025.10 resolver for modes, aliases, `$deprecated`); the output is a custom plugin because neither tool's stock CSS/Tailwind formats produce Tailwind `@theme` variables plus scoped `[data-theme]` blocks with the var()-based tokens re-declared per scope.

Conventions the plugin relies on (it fails with a message when a token breaks them):

- A token `<group>.<name>` becomes `--<group>-<name>`; the groups are Tailwind theme namespaces (`color`, `radius`, `shadow`, `inset-shadow`, `ring-color`, `blur`, `font`, `text`). A new group needs a line in the plugin.
- Colours are sRGB objects (`{ "colorSpace": "srgb", "components": [0, 0, 0], "alpha": 0.8, "hex": "#000000" }`) and are written as `#rgb` / `rgb(r g b / a)`; dimensions are in px (`radius` and `text` become rem).
- An alias that is the same in both modes (`{color.primary}`) is written as `var(--color-primary)`, so it follows the theme scopes; an alias that differs per mode (Figma's Primary: `{color.black}` / `{color.indigo}`) is written as each mode's colour.
- `$extensions["com.holakirr.snow-ui"]`: `figma` (the Figma variable or style name, shown in the docs), `css` (a formula such as `color-mix(in srgb, {color.primary}, {color.white} 20%)`, whose `$value` in each mode must be its result) and `fontFeatureSettings`.

To add a colour, add it to both `color.*.tokens.json` files (with the dark value, or the same one), run `bun run tokens`, and list it in a group in `src/foundations/tokens.ts` (`tokens.test.ts` fails otherwise); then `bg-<name>`, `text-<name>`… work. Add a changeset: new tokens are a minor change, renamed or removed ones a major.

### Syncing from Figma

The token names follow Tailwind (`color.black-80`), not Figma (`Black/80%`); each token records its Figma name in `$extensions`. To bring changes over from the [SnowUI Figma kit](https://www.figma.com/community/file/1301134685302006646):

1. Export the variables as DTCG JSON, one file per mode. Figma's native variables export (announced at Schema 2025 and rolling out: right-click the "Colors" collection → Export) writes DTCG JSON; so do plugins such as [Design Tokens (W3C) Export](https://www.figma.com/community/plugin/1377982390646186215/design-tokens-w3c-export) or Tokens Studio (with the W3C DTCG token format), which also cover text and effect styles. `bunx tz import <figma file url>` (Terrazzo) writes a resolver with the tokens directly, but reading Variables through the Figma REST API requires an Enterprise plan (Styles work on every plan), as does any CI automation built on that API.
2. Copy the changed values into the matching tokens here (by Figma name), keeping the token names, the library additions (no Figma name) and the deprecated aliases. The export's colour objects can be pasted as they are.
3. Run `bun run tokens`, review the diff of `src/styles/tokens.generated.css` and the Foundations pages in Storybook, and run `bun run test` and `bun run visual`.

### Fonts

`@holakirr/snow-ui/fonts.css` self-hosts Inter from `packages/ui/src/fonts/`: subsets of the rsms Inter 4.1 variable fonts (the Google Fonts build lacks the `ss01` / `cv01` features), split by unicode-range, with the OFL license in `src/fonts/LICENSE.txt` (hence the package's `MIT AND OFL-1.1` license). Besides Google Fonts' script ranges there is `ui-symbols` (≈10 kB: the arrows and keyboard symbols components and shortcut hints render, such as Link's ↗ and CommandPalette's ↩) and `symbols` (≈150 kB: everything else), so a single arrow doesn't pull in the big file; when a component starts rendering a new symbol, add its code point to `UI_SYMBOLS`. The design only uses upright Regular and Semibold, so the italic faces are opt-in (`fonts-italic.css`). The base layer sets `font-optical-sizing: none`: the Figma kit uses the "Inter" family (text optical size) at every size, not "Inter Display". The files are committed; `packages/ui/scripts/subset-inter.py` (Python, fontTools) regenerates them and both stylesheets, as described at the top of the script. Size budgets cover the Latin (upright and italic), Latin Extended, `symbols` and `ui-symbols` files.

## Documentation

The Storybook ([snow-ui.holakirr.com](https://snow-ui.holakirr.com)) is the reference: guides in `docs/*.mdx` (Getting started, Theming, Localization and RTL) and one usage page per component, `<Component>.mdx` next to its stories. A page that starts with `<Meta of={XStories} />` replaces the component's automatic docs page and follows the same outline: purpose and import, when to use and when not to (with the alternatives), anatomy, variants and sizes, states, accessibility (keyboard, ARIA, deviations from the Figma kit), localization and RTL, composition (`asChild`), do and don't, related components and the props table. `Button.mdx` is the model.

- Show existing stories with `<Canvas of={XStories.Story} />`; don't write demos in MDX, so every example is also a tested story. Link to other pages with `?path=/docs/<story id>--docs`.
- Check every claim against the code: sizes from the classes, keyboard behaviour from the Radix primitive and the `play` tests, accessibility deviations from the [ui README](packages/ui/README.md#accessibility-deviations-from-the-figma-kit).
- `.storybook/blocks.tsx` has the page blocks: `FigmaLinks` (links to the component in Figma, from the stories' `parameters.design`) and `DoDont` / `Do` / `Dont`.
- **Figma links:** every stories file sets `parameters.design = { type: 'figma', url }` with the component set's node in the owner's licensed copy of the kit (`https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=<id>`, the node id with `-` for `:`), or the Figma page when there is no component set. [`@storybook/addon-designs`](https://github.com/storybookjs/addon-designs) shows it in the "Design" panel. The file is private, so the links and the embed only open for people with access to it; don't add screenshots of the design.
- MDX in `packages/ui/src` is excluded from the package's Tailwind scan (`src/index.css`), so class names in the docs don't end up in `index.css`.

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
