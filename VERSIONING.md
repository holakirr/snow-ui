# Versioning and support policy

This policy covers the three published packages: `@holakirr/snow-ui` (ui), `@holakirr/snow-ui-icons` (icons) and `@holakirr/snow-ui-charts` (charts). The [Roadmap](ROADMAP.md) lists what the next major will change. How contributors choose a bump is in [CONTRIBUTING.md](CONTRIBUTING.md#changesets).

## Semantic versioning

Every package follows [Semantic Versioning 2.0.0](https://semver.org). The public API is:

- everything exported from the package entry points (`@holakirr/snow-ui`, `@holakirr/snow-ui/react-hook-form`, `@holakirr/snow-ui-icons`, `@holakirr/snow-ui-charts`, `@holakirr/snow-ui-charts/recharts`), with its TypeScript types;
- component props, their values and defaults, and the documented `data-*` attributes;
- the stylesheets and what they define: `index.css`, `theme.css`, `fonts.css`, `fonts-italic.css`, `fonts/*` and the charts' `styles.css`, the design tokens (CSS custom properties) and the utility classes that `theme.css` gives your Tailwind project;
- the peer dependency ranges and the supported environments below.

The DOM structure, the internal class names and anything not exported from an entry point are not public API. Changes to the look of a component that bring it closer to the Figma kit or to WCAG are minor or patch releases, described in the changelog.

| Bump | When |
| --- | --- |
| **major** | Something that worked stops working: a removed or renamed export, prop, value or token; a narrower type; a changed default; a new required peer dependency or a higher minimum version of one; dropping a supported browser, React or Node.js version. |
| **minor** | New components, props, exports, tokens or options; deprecations. |
| **patch** | Bug fixes, and internal or build changes that users don't need to act on. |

**0.x packages** (the charts): while a package is below 1.0.0, a breaking change bumps the minor (0.1 → 0.2) and anything else the patch, as SemVer allows for 0.x. The charts reach 1.0.0 when their API has settled.

## Release channels

| npm dist-tag | Versions | Published from | For |
| --- | --- | --- | --- |
| `latest` | `5.1.0` | `main`, when the version PR is merged | everyone |
| `next` | `6.0.0-next.3` | the `next` branch, when its version PR is merged | trying the next major before it is released |
| `canary` | `0.0.0-canary-1a2b3c4` | any branch, by hand | trying one unreleased change in an app; never in production |

Every channel publishes from CI with npm provenance, and only commits whose [Build Check](.github/workflows/build-check.yml) passed (see [Releasing](README.md#releasing)). `next` and `canary` versions carry no support: report problems with them as issues, and they are fixed in the next pre-release or release.

## Breaking changes and deprecations

Breaking changes are rare and batched: they wait for one planned major, which is developed on the `next` branch and published there as pre-releases before it reaches `latest`. The next one is **6.0** ([Roadmap](ROADMAP.md#next-60)); there is at most one major every six months.

A breaking change follows these steps:

1. **Deprecate in the current major (N.x), in a minor release.** The old API keeps working. It is marked `@deprecated` in its JSDoc (editors strike it through), it logs a warning once in development builds (`warnDeprecated` in `packages/ui/src/utils/deprecation.ts`; never in production), and the changelog entry shows the replacement. A deprecation ships at least one minor release before the major that removes it.
2. **Pre-release the major on `next`** (`N+1.0.0-next.*`) for at least four weeks, so apps can try the upgrade with `npm install @holakirr/snow-ui@next`.
3. **Remove it in the next major (N+1.0.0)**, never within a major. The major comes with a migration guide (every breaking change, before and after), and with a codemod when the change is mechanical, such as a renamed prop, component, export or token.

A changed default follows the same path: the new behaviour ships first as an opt-in in a minor, and becomes the default in the major. For example, `SnowUIProvider`'s `weekStartsOn="locale"` makes the date components start the week on the locale's first day in 5.x; 6.0 makes it the default instead of Monday.

Security fixes are the exception: if a vulnerability can only be fixed by a breaking change, the fix may ship in a minor or patch release, with the reason and the migration in the release notes and the advisory.

## Supported versions

| Package | Version | Status | Gets |
| --- | --- | --- | --- |
| `@holakirr/snow-ui` | 5.x | current | new features, bug fixes, security fixes |
| `@holakirr/snow-ui` | 4.x and older | end of life | nothing: upgrade to 5.x |
| `@holakirr/snow-ui-icons` | 2.x | current | new icons, bug fixes, security fixes |
| `@holakirr/snow-ui-charts` | 0.x (the latest minor) | current | new features, bug fixes, security fixes |

Only the latest minor of the current major is fixed: a fix for 5.2 ships as 5.2.x or in 5.3, not as a patch of 5.1.

**Long-term support for the previous major.** When 6.0.0 is released, 5.x becomes the LTS line for **six months**: security fixes and fixes for critical bugs (a crash, data loss, a regression that blocks an accessibility task) are published as 5.x patch releases from a `v5` branch, under the npm dist-tag `v5-lts`. After that, 5.x reaches end of life. The same applies to every later major.

## Supported environments

| | Supported | Tested in CI |
| --- | --- | --- |
| **React** | 19.x (`react` and `react-dom` peer range `^19.0.0`). React 18 is not supported. | React 19, on every story |
| **Browsers** | The baseline of Tailwind CSS v4, which the styles need (`@layer`, `color-mix()`, `@property`): Chrome and Edge 111+, Safari 16.4+ (macOS and iOS), Firefox 128+. | Chromium (every story in both themes, axe, visual regression), Firefox and WebKit (every story, play functions) |
| **Tailwind CSS** | v4 for `theme.css`, or no Tailwind at all with the precompiled `index.css`. | Both, in `test:dist` |
| **Server rendering** | React 19 server rendering and hydration (Next.js App Router, React Router, any `react-dom/server` setup). | Every ui story rendered in Node.js and hydrated in Chromium (`test:ssr`) |
| **Node.js** (server rendering, builds, tests) | The Node.js versions in Active or Maintenance LTS: today 20.19+, 22 and 24. The packages' `engines` field still says `>=18`; 6.0 raises it to `>=20.19`. | The GitHub runner's default Node.js for the tests and 24 for the release builds; there is no matrix of Node.js versions yet. |

Supporting a new version of React, Node.js or a browser is a minor release. Dropping one is a major release, except for a Node.js version that has reached its end of life upstream, which may be dropped in a minor release.

## The charts' peer range on the ui package (proposal)

The charts declare `@holakirr/snow-ui` as a peer dependency (`^5.0.0`) for its design tokens and `useSnowUI()`. Today every ui major forces a charts release that moves the range. Proposed policy, **not applied yet**:

- The charts support the current ui major and, while it is in LTS, the previous one: when ui 6.0.0 ships, a charts minor widens the range to `^5.0.0 || ^6.0.0` (the same as `>=5.0.0 <7.0.0`). Dropping a ui major from the range is a breaking change of the charts.
- A range is only widened once CI proves it: a job that installs the previous ui major from npm and runs the charts' unit tests and `test:dist` against it, next to the current one.
- The charts read ui's tokens as CSS custom properties (`var(--color-…)` in `styles.css`). The 6.0 token namespacing renames them, so a range that spans 5 and 6 needs the charts' stylesheet to read both names (the new one with the old one as its fallback) until 5.x reaches end of life.
- Until then the range stays `^5.0.0`, and Changesets moves it only when a ui release leaves it (`onlyUpdatePeerDependentsWhenOutOfRange` in `.changeset/config.json`).

## Security

Report vulnerabilities privately, as described in the [Security policy](SECURITY.md). Supported versions get security fixes as described above.
