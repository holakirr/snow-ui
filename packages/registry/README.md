# @holakirr/snow-ui-registry (private)

Generates the **`@snow-ui` shadcn registry** — every component of `@holakirr/snow-ui` as copy-paste source for the [shadcn CLI](https://ui.shadcn.com/docs/registry) — from `packages/ui/src`. npm stays the only semver channel; the registry is another output of the same sources, served next to Storybook at `https://snow-ui.holakirr.com/r/`.

```bash
bun run registry          # regenerate packages/registry/manifest.json (commit it; CI fails when it is stale)
bun run registry:build    # build /r/*.json + /r/registry.json (shadcn build) and llms.txt into storybook-static/
bun packages/registry/smoke/smoke.ts --app next --app vite   # install every item into fresh apps (needs `bun run build`)
```

## How it works

1. **Plan** (`src/plan.ts`, ts-morph): loads the runtime modules of `packages/ui/src` (stories, tests, MDX, Figma templates, test helpers and the package entry points excluded) and their import graph, and groups them into items by the rules in `registry.config.ts`:
   - each directory of `components/` is a `registry:ui` item with all its files (`components/Button/{Button.tsx,index.ts}` → `button`); a directory whose `index.ts` re-exports several components (`Input`, `Text`, `Avatar`, `Toaster`) gives one item per component module (`checkbox`, `select`, `kbd`, …) with the private files it imports;
   - `hooks/*.ts` → one `registry:hook` each; `react-hook-form.tsx` → `react-hook-form`; `utils/`, `constants/`, `types/` → the `registry:lib` items `snow-core` (tw-merge with the token scales, slot helpers, constants, types), `snow-date`, `snow-slot-host`;
   - config items: `snow-ui` (`registry:base`, the theme), `all` (every generated item), `snow-ui-charts` (the npm charts package).

   A new component directory is picked up automatically; a new top-level module fails the generation until a rule covers it. `registryDependencies` come from the relative imports, npm `dependencies` from the bare ones (version ranges from `packages/ui/package.json` at build time).
2. **Manifest** (`manifest.json`, committed): the items, files, dependencies, import paths and docs ids — no versions and no descriptions, so only a change of the import graph makes it stale. Storybook's `InstallTabs` reads it.
3. **Build** (`src/build.ts`): stages the files with the licence header and the barrel rewrites (below) in `.build/`, writes `registry.json`, validates it (zod schemas from `shadcn/schema`, `shadcn registry validate`) and runs `shadcn build` (pinned `shadcn@4.21.0`) into `/r/`, plus `llms.txt`.

Files keep their place below `packages/ui/src` in the user's project (`target: "@components/snow-ui/<path>"`): `import { Button } from '@/components/snow-ui/components/Button'`. Those paths are public API from the first release: renaming them later is a breaking change for everyone who copied the code.

## Spike findings (shadcn 4.21.0, Next 16.3.7, Vite 8.3 + TypeScript 6.0, Tailwind 4.3.3)

The research report (`reports/Реестр компонентов в стиле shadcn.md`) left these open; each was checked by installing hand-built items into fresh apps.

| Question | Verified answer | Decision |
| --- | --- | --- |
| Mirror layout or a `@/registry/…` codemod? | `target: "@components/snow-ui/<path>"` puts files under the `components` alias with their relative layout; `transformImport` leaves relative and bare imports alone. Files already present with the same content are skipped. | Mirror layout. The only rewrite: imports through a barrel that re-exports several items (`'../Text'`, `'../Input'`, `'../../hooks'`) point at the declaring module (`'../Text/Text'`), so each component is its own item. |
| `'use client'` | `rsc: true` (Next): kept as is. `rsc: false` (Vite): removed — but only from about every other file, since the CLI's regex has the `g` flag and `test()` keeps `lastIndex` between files (a CLI bug; the leftover directives are harmless outside RSC). The CLI never adds it. Not every module has it (Button, Card… are server-safe; the report's "all 38" was wrong). | Ship as in the source; the generator fails when a comment precedes the directive. |
| Do comments / the licence header survive? | The CLI writes `sourceFile.getText()`, which drops everything before the first statement: a header at the top — or right after `'use client'` once `rsc: false` removes it — is lost, and so is the first declaration's JSDoc in files without imports. Comments after the imports survive (#9206 not reproduced). | Header after the import block (end of file without imports), a `/* */` block (not JSDoc), with stable text (no version or commit, so `shadcn add --diff` only shows real changes). The full MIT text ships as `components/snow-ui/LICENSE`; version and commit are in each item's `meta`. |
| Does `init` need ui.shadcn.com? | Yes, even with `extends: "none"`: it reads `styles/index.json` and `colors/<baseColor>.json` from shadcn's registry (`REGISTRY_URL`), and exits when they fail. ui.shadcn.com answered this machine with a Vercel bot checkpoint (HTTP 403) for part of the session. `add` of our items needs only our registry. The CLI appends `?base=…` to the base item's URL (static JSON ignores it). | The smoke test serves those two files locally (`REGISTRY_URL`); users' `init` depends on ui.shadcn.com being reachable. |
| Order of the imported theme CSS | `css` `@import`s are inserted after the existing `@import "tailwindcss"`. No `@layer base` and no `@custom-variant dark` are injected when an item has no `cssVars` (#8669 not triggered). Template CSS stays: create-next-app's `body { font-family: Arial }` and `--background`/`--foreground` in `@theme inline` override the SnowUI tokens. | Base item imports `@holakirr/snow-ui/theme.css` and `fonts.css`; its `docs` (printed by `init`) tell users to remove the starter styles. |
| Two `@custom-variant dark` | In an existing shadcn project, the variant declared later (globals.css, after the imports) wins, so `dark:` follows `.dark` only. | Harmless: SnowUI components use tokens, not `dark:`. The theme now also accepts the `.dark` class (below). |
| `registry:base` + `extends: "none"` + Radix | `init <url>/snow-ui.json` merges `config` into `components.json` (`style: "radix-nova"`, the `@snow-ui` namespace), installs no shadcn base files (no `lib/utils.ts`, no button) and prints `docs`. | Base item as proposed. |
| `transformAsChild` in a Base UI project | Runs only when `components.json` style starts with `base-` (the default of `shadcn init --defaults` since July 2026) and rewrites **every** JSX element with `asChild` — Radix primitives and SnowUI's own components — into `render={…}`: Dialog, KBD… stop compiling. | The base pins `radix-nova`; item `docs` state that SnowUI needs a `radix-*` style. Not done (owner decision): emitting `{...{ asChild: true }}` would dodge the transform at the cost of odd-looking code. |
| Other transforms | `rtl: true` rewrites physical classes (Text's `align="left"` → `text-start`); `cssVariables: false` would map `bg-primary`… to base colours; a Tailwind `prefix` isn't applied inside `twMerge(…)`. | Documented as unsupported settings. |
| The user's tsconfig | Vite's template (`verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnused*`, `types: ["vite/client"]`) failed on `utils/env.ts` (`process` without Node types). | Fixed in the source (a local `declare const process`); the smoke test builds a Vite app. |
| `@source` from a package stylesheet | Tailwind resolves an `@source` inside an imported file relative to that file; `@import "…" source(none)` on a non-Tailwind import doesn't disable it. | `dist/theme.css` registers `@source "./**/*.js"` itself: no hoisting-dependent path for npm users. Registry users also get the npm components' classes generated: +0.8 kB (+0.2 kB gzip) in the smoke test's Next app with every item copied, more with few items. |
| Namespace, MCP, `include` | `shadcn search @snow-ui` and the MCP server read `/r/registry.json`; `add @snow-ui/x` resolves through `components.json`. `include` resolves an included registry's paths relative to that file; `registry validate` must run from the registry root. | Item dependencies are absolute URLs (they work before any namespace setup); `/r/registry.json` is the catalog. |
| npm-only dependencies | `@phosphor-icons/react` is a devDependency inlined into the npm build; its `./dist/csr/*` exports work in apps. | A regular `dependency` of the items that use it. |

## Pro registry (paid, private)

The planned Pro tier (Next.js page templates, Pro blocks) is a second registry built by the same generator from another config — the generator has no public-only assumptions: sources, namespace, target folder, base URL, output directory, extra items and the dependency style are all in the config (`src/config.ts`).

- **Config**: a `registry.config.ts` in the private repository with `namespace: '@snow-ui-pro'`, `package`/`srcDir` pointing at its sources, `target: '@components/snow-ui-pro'` (or `@/app/…` via `target` for pages, `type: 'registry:page'`/`'registry:block'` groups), and `dependencyStyle: 'namespace'`: the CLI only sends the auth headers for URLs of a configured namespace, so Pro items must reference each other as `@snow-ui-pro/<name>`.
- **Free items as dependencies**: Pro items import the copied free components (`@/components/snow-ui/components/Button`). List them in `registryDependencies` as `@snow-ui/<name>` (or absolute URLs `https://snow-ui.holakirr.com/r/<name>.json`), which the build passes through unchanged. A small addition would map such imports automatically by reading the free `manifest.json` (target path → item).
- **Users** add both namespaces to `components.json`:

  ```json
  "registries": {
    "@snow-ui": "https://snow-ui.holakirr.com/r/{name}.json",
    "@snow-ui-pro": {
      "url": "https://pro.snow-ui.holakirr.com/r/{name}.json",
      "headers": { "Authorization": "Bearer ${SNOW_UI_PRO_TOKEN}" }
    }
  }
  ```
- **Hosting with auth**, two options:
  - *Vercel project + Edge Middleware* that checks the bearer token (against a store of issued licence keys, e.g. Edge Config or a small KV, with revocation and per-customer tokens) before serving the static `/r/*.json`. Pros: per-customer keys, revocation, usage logs, custom domain, works with the MCP server and `shadcn add` exactly like the public registry. Cons: a paid-plan feature set to maintain (key issuing, rate limits), the middleware must not be cached publicly (`Cache-Control: private`), and Vercel's bot protection must allow the CLI's requests.
  - *Private GitHub registry* (`shadcn add owner/repo/item#ref` with `gh` auth or `GH_TOKEN`, supported since August 2026). Pros: no hosting, access = repository collaborators, pinning by git ref. Cons: every customer needs a GitHub account added to the repo (licensing = GitHub access management), no per-key revocation or analytics, the repo needs a committed buildable `registry.json` with the transformed files (the generator would commit its staged output), refs aren't inherited by dependencies, and tags fail in CI with HTTP 422 (#11986).
  
  For a paid product, the middleware option fits better (licence keys, revocation); the GitHub option is fine for a closed beta.
- **Licence**: the ByeWind terms allow the free library and registry; paid sales owe ByeWind a commission, so Pro pricing has to account for it.
