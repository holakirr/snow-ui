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
bun run build          # tsdown build of icons, then ui (+ publint and attw checks)
bun run storybook      # shared Storybook (ui + icons) on :53741
bun run build:storybook # static Storybook in ./storybook-static
bun run e2e            # ui Playwright visual tests (macOS baselines)
```

Run a script in a single package with `bun run --filter <package-name> <script>`, e.g. `bun run --filter @holakirr/snow-ui-icons test`.

### How ui consumes icons

`packages/ui` depends on `"@holakirr/snow-ui-icons": "^<version>"` (a regular semver range, not `workspace:`, so the published package.json stays valid). Bun links it to `packages/icons` as long as the local version satisfies the range.

- Storybook, Vitest and `typecheck` resolve the icons package from **source** (`packages/icons/src`) via a Vite alias (`packages/ui/workspace-aliases.ts`, used by `.storybook/main.ts` and `packages/ui/vitest.config.ts`) and tsconfig `paths`, so they work from a clean clone without building icons.
- The ui **library build** emits type declarations that import the icons package, so it needs `packages/icons/dist`. The root `bun run build` builds icons first; when building ui on its own, run `bun run build:icons` beforehand.

### Library builds

Both packages are built with [tsdown](https://tsdown.dev) (`packages/*/tsdown.config.ts`): ESM (`.js`) and CommonJS (`.cjs`) with matching `.d.ts` / `.d.cts`, one output file per source module (`unbundle`), so `'use client'` directives stay on their modules and single-icon imports stay small. tsdown writes the `exports` / `main` / `module` / `types` fields of each `package.json` and runs publint and are-the-types-wrong after every build. `@holakirr/snow-ui` additionally builds `dist/index.css` with the Tailwind CLI before tsdown runs.

The handful of [Phosphor](https://phosphoricons.com) icons both packages use are inlined under `dist/vendor/` (see `tsdown.vendor.ts`) rather than depended on: `@phosphor-icons/react` ships its CommonJS build as `dist/index.cjs.js` inside a `"type": "module"` package, so Node can't `require()` it.

## Releasing

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets); see [CONTRIBUTING.md](CONTRIBUTING.md) for the contributor side.

1. Every PR that changes a published package adds a changeset (`bun changeset`): which packages, which semver bump, and a user-facing summary.
2. On each push to `main`, `.github/workflows/release.yml` runs [changesets/action](https://github.com/changesets/action). While changesets are pending it opens or updates the **"chore(release): version packages"** PR, which runs `bun run version-packages` (`changeset version` — bumps versions, bumps `@holakirr/snow-ui`'s `@holakirr/snow-ui-icons` range when icons is released, prepends to each `CHANGELOG.md`, deletes the consumed changesets — then `bun install --lockfile-only` to sync `bun.lock`).
3. Merging that PR runs the workflow again with no pending changesets, so it runs `bun run release`: `bun run build`, then `changeset publish`, which runs `npm publish` in every package whose version isn't on npm yet. The action then pushes the `@holakirr/snow-ui@X.Y.Z` / `@holakirr/snow-ui-icons@X.Y.Z` tags and creates a GitHub release for each.

The version PR is opened with the workflow's `GITHUB_TOKEN`, so other workflows (Build Check) don't run on it automatically; close and reopen it to run them before merging.

Publishing uses [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC, no `NPM_TOKEN`) with provenance (`publishConfig.provenance`). On npmjs.com, the Trusted Publisher of **both** packages must be the GitHub repository `holakirr/snow-ui` with workflow filename `release.yml` (the icons package still points at its old repository, `holakirr/snow-ui-icons`, until the owner re-points it).

## License

[MIT](LICENSE)
