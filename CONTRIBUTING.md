# Contributing

Setup, scripts and the monorepo layout are described in the [README](README.md#development). Before opening a PR, run `bun run lint`, `bun run typecheck`, `bun run test`, `bun run test:storybook`, `bun run build`, `bun run test:dist` and `bun run size`; if you changed how anything looks, also `bun run visual` (Docker).

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

Requirements: Docker (on Apple Silicon the amd64 image runs through Rosetta, a few minutes for the whole suite) and `bun install` done on the host (the container only uses the pure-JS `@playwright/test` from `node_modules`; Storybook is built on the host). No network is needed: Storybook bundles the self-hosted Inter (`packages/ui/src/fonts.css`). Failures leave the actual/expected/diff images in `test-results/visual/` and an HTML report in `playwright-report/` (`bunx playwright show-report`).

When a change is intended, run `bun run visual:update`, review the changed PNGs in the diff and commit them with the change. A story added without a baseline fails the comparison; opt a story or a whole component out with the `skip-visual` tag. `visual:update` only writes new and changed images: after removing or renaming stories, delete their PNGs (or empty the folder and regenerate everything).

In CI, the `visual` job runs the same image as a job container against the Storybook built by the `build` job and uploads the diffs as the `visual-diffs` artifact when it fails. It is skipped (with a notice) while `visual/__screenshots__/` has no baselines. **Baselines haven't been generated yet**: the components are being reworked to match the SnowUI Figma kit, so they'll be generated with `bun run visual:update` and committed once those design PRs have landed.

### Bundle size

`bun run size` checks the budgets in `.size-limit.json` with [size-limit](https://github.com/ai/size-limit) (esbuild preset: minified and brotli-compressed, React and other peer dependencies excluded) against the built packages, so run `bun run build` first. It covers the full `@holakirr/snow-ui` import, single-component imports (tree-shaking), the `react-hook-form` entry, `dist/index.css`, and a full and a single-icon import of `@holakirr/snow-ui-icons`. When a change legitimately needs more, raise the limit in the same PR and say why in its description; keep limits about 10% above the measured size so regressions stay visible.

### Package checks

`bun run build` runs [publint](https://publint.dev) and [are-the-types-wrong](https://arethetypeswrong.github.io) on both packages after tsdown builds them (configured in `packages/*/tsdown.config.ts`), so broken `exports`, missing files or types that resolve differently in ESM and CommonJS fail the build.

`bun run test:dist` (after `bun run build`) checks the published stylesheets of `@holakirr/snow-ui` (`packages/ui/test/dist.test.ts`): it compiles a Tailwind v4 project stylesheet that imports `@holakirr/snow-ui/theme.css` with `@source` on `dist` (`packages/ui/test/fixtures/app.css`, resolved through the package's `exports`) and fails if it misses any class the built components use; it also checks that every rule of `index.css` is in a cascade layer and that `fonts.css` points at existing files.

### Generated token files

`bun run tokens` regenerates the files built from the design tokens (see [Design tokens](#design-tokens)); `bun run build` runs it too. CI runs it first and fails when that changes anything, so commit the generated files with the token change.

## Design tokens

The design tokens live in `packages/ui/tokens/` as [W3C Design Tokens (DTCG 2025.10)](https://www.designtokens.org/) files, the single source of truth for everything the library derives from them:

| File | Contents |
| --- | --- |
| `snow-ui.resolver.json` | The [resolver](https://www.designtokens.org/tr/2025.10/resolver/): the token files, and the `theme` modifier with the `light` and `dark` contexts |
| `color.light.tokens.json` / `color.dark.tokens.json` | The Figma "Colors" collection in the SnowUI-Light / SnowUI-Dark mode, plus the library's additions (`primary-hover*`, `indigo-text`). Both files declare the same tokens |
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

`@holakirr/snow-ui/fonts.css` self-hosts Inter from `packages/ui/src/fonts/`: subsets of the rsms Inter 4.1 variable fonts (the Google Fonts build lacks the `ss01` / `cv01` features), split by unicode-range, with the OFL license in `src/fonts/LICENSE.txt`. They are committed; `packages/ui/scripts/subset-inter.py` (Python, fontTools) regenerates them and `fonts.css` when upgrading Inter, as described at the top of the script.

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
