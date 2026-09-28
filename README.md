# SnowUI

Monorepo for the React implementation of the [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/), implemented and improved by [holakirr](https://github.com/holakirr).

## Packages

| Package | Path | npm | Storybook |
| --- | --- | --- | --- |
| [`@holakirr/snow-ui`](packages/ui) | `packages/ui` | [![npm](https://img.shields.io/npm/v/@holakirr/snow-ui)](https://www.npmjs.com/package/@holakirr/snow-ui) | [snow-ui.holakirr.com](https://snow-ui.holakirr.com) |
| [`@holakirr/snow-ui-icons`](packages/icons) | `packages/icons` | [![npm](https://img.shields.io/npm/v/@holakirr/snow-ui-icons)](https://www.npmjs.com/package/@holakirr/snow-ui-icons) | [snow-ui-icons.holakirr.com](https://snow-ui-icons.holakirr.com) |

`@holakirr/snow-ui` is the component library (React 19, Tailwind CSS v4, Radix UI). `@holakirr/snow-ui-icons` is the icon set it uses; it is also published on its own.

## Development

Requirements: [Bun](https://bun.sh) 1.3.11 (see `packageManager`). The repo uses Bun workspaces with a single `bun.lock` at the root.

```bash
bun install            # install all workspaces
bun run lint           # biome check (one shared biome.json)
bun run typecheck      # tsc for every package
bun run test           # vitest for every package
bun run build          # build icons, then ui
bun run storybook      # ui Storybook on :53741 (storybook:icons for icons on :6006)
bun run build:storybook
bun run e2e            # ui Playwright visual tests (macOS baselines)
```

Run a script in a single package with `bun run --filter <package-name> <script>`, e.g. `bun run --filter @holakirr/snow-ui-icons test`.

### How ui consumes icons

`packages/ui` depends on `"@holakirr/snow-ui-icons": "^<version>"` (a regular semver range, not `workspace:`, so the published package.json stays valid). Bun links it to `packages/icons` as long as the local version satisfies the range.

- Storybook, Vitest and `typecheck` in `packages/ui` resolve the icons package from **source** (`packages/icons/src`) via a Vite alias (`packages/ui/workspace-aliases.ts`) and tsconfig `paths`, so they work from a clean clone without building icons.
- The ui **library build** emits type declarations that import the icons package, so it needs `packages/icons/dist`. The root `bun run build` builds icons first; when building ui on its own, run `bun run build:icons` beforehand.

## Releasing

Bump the package's `version` via PR, then publish a GitHub release tagged `@holakirr/snow-ui@X.Y.Z` or `@holakirr/snow-ui-icons@X.Y.Z` (legacy `vX.Y.Z` tags publish `@holakirr/snow-ui`). `.github/workflows/release.yml` checks, builds and publishes the matching package to npm with provenance.

## License

[MIT](LICENSE)
