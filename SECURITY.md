# Security policy

## Supported versions

| Package | Version | Security fixes |
| --- | --- | --- |
| `@holakirr/snow-ui` | 5.x | ✅ |
| `@holakirr/snow-ui` | 4.x and older | ❌ |
| `@holakirr/snow-ui-icons` | 2.x | ✅ |
| `@holakirr/snow-ui-charts` | 0.x, the latest minor | ✅ |

When a new major is released, the previous one gets security fixes for six more months ([Versioning and support policy](VERSIONING.md#supported-versions)). Pre-releases (`next`) and canaries (`canary`) get no fixes of their own: the fix goes into the next release.

## Reporting a vulnerability

**Please don't report security problems in public issues, pull requests or Discussions.** Report them privately through GitHub's private vulnerability reporting:

1. Open [**Report a vulnerability**](https://github.com/holakirr/snow-ui/security/advisories/new) (the repository's Security tab → "Report a vulnerability").
2. Describe the problem: the package and version, the component or file, what an attacker can do, and how to reproduce it (a minimal snippet, a story or a repository). Say whether you want to be credited, and how.

The report is visible only to you and the maintainer. What happens next:

- **Within 5 working days:** an acknowledgement, and questions if something is unclear.
- **Within 15 working days:** an assessment (accepted or not, and why) and a plan for the fix.
- **The fix:** a patch release of every supported version that is affected, as soon as it is ready. A GitHub security advisory with a CVE is published with the release, credits you if you wish, and alerts Dependabot users.

This is a project maintained by one person, so these are commitments of effort, not a contract. Please give us up to 90 days to release a fix before you disclose the problem publicly; we will agree on a date with you.

## Scope

In scope:

- the published packages: for example markup injection through a prop, a component that leaks data into the DOM or the URL, unsafe handling of user content;
- how the packages are built and published: the GitHub Actions workflows, the release scripts, the npm publishing setup.

Out of scope (report these elsewhere or as ordinary issues):

- vulnerabilities in a dependency: report them to its maintainers. Tell us if a published version of ours ships an affected version and is exploitable through it;
- development-only tooling that doesn't reach the published packages;
- the documentation site ([snow-ui.holakirr.com](https://snow-ui.holakirr.com)) unless it exposes something beyond the public Storybook.

## Verifying what you install

- **npm provenance.** Every version published from CI carries a provenance attestation that links it to the commit and the workflow run that built it (`publishConfig.provenance`, npm Trusted Publishing without long-lived tokens). Check the packages you installed with `npm audit signatures`. The one exception is `@holakirr/snow-ui-charts` 0.1.0, which was published by hand (a new package can only get a Trusted Publisher after its first version).
- **SBOM.** Each package's GitHub release has its CycloneDX software bill of materials (`*.cdx.json`) attached: its production dependencies at the versions it was built and tested with.
- **Only tested commits are released.** The release workflow publishes a commit only after its full Build Check (tests, accessibility, visual regression, size budgets) has passed ([Releasing](README.md#releasing)).
- **Repository practices** are scored by [OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/holakirr/snow-ui).
