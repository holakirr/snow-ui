<!-- Thanks for contributing! A few lines on what and why, then the checklist. -->

## What and why

<!-- What changes for the library's users, and why. Link the issue: "Closes #123". -->

## How it was tested

<!-- Stories, unit or play tests you added, and what you checked by hand (keyboard, screen reader, both themes, RTL). -->

## Checklist

- [ ] **Changeset:** `bun changeset` for a change to a published package (code, styles, types, dependencies), with the right bump and a summary written for its users; `bun changeset --empty` if nothing is released. Hex colours and other `#`s in code spans (`` `#333` ``).
- [ ] **Stories:** new or changed behaviour has a story, including its states, the dark theme and right-to-left when they differ.
- [ ] **Tests:** a unit test or a `play` function for the behaviour (keyboard, focus, what is announced); `bun run test`, `bun run test:storybook` and `bun run test:ssr` pass.
- [ ] **Accessibility:** no axe violations in either theme, keyboard support per the ARIA Authoring Practices, visible focus, text at 4.5:1 (see CONTRIBUTING.md, Storybook tests and accessibility).
- [ ] **Visual:** `bun run visual` passes, or the changed baselines are committed and reviewed (`bun run visual:update`).
- [ ] **Docs:** the component's `.mdx` page, the README and the guides describe the change; breaking changes and deprecations say how to migrate.
- [ ] **Checks:** `bun run lint`, `bun run typecheck`, `bun run build`, `bun run test:dist` and `bun run size` pass.
