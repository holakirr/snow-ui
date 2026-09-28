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

## Releasing

Bump the package's `version` via PR, then publish a GitHub release tagged `@holakirr/snow-ui@X.Y.Z` or `@holakirr/snow-ui-icons@X.Y.Z` (legacy `vX.Y.Z` tags publish `@holakirr/snow-ui`). `.github/workflows/release.yml` checks, builds and publishes the matching package to npm with provenance.

## License

[MIT](LICENSE)
