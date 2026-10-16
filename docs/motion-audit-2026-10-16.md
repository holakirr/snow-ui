# Component motion audit, 2026-10-16–17

Goal: remove visible animation jumps without changing resting layout or approved contrast colours.

## Findings and fixes

- Accordion: reproduced a 20px jump at animation start/end. Moved padding/className to an inner wrapper and removed transition-all from the animated region.
- Dialog/AlertDialog: replaced scale-zero starting styles with fade/95% scale CSS animations. Radix Presence now retains closing content until animationend. Masks fade in place with constant blur.
- Popover, Tooltip, DropdownMenu, ContextMenu, Select, Combobox and DatePicker: shared slides now travel 6px instead of 100% of the surface. Slide/zoom keyframes include opacity, and directional entry rules require the open state so they cannot override exit animation. The measured real Popover entry travels 6px.
- Sheet: keeps 100% travel, removes competing transition-all and misleading transition durations. Browser measurements verify full-width travel and retained exit presence.
- Toast/Toaster: individual translate/scale animation properties preserve the stack's own transform. Existing stack, swipe and close tests pass.
- Sidebar, Tabs, Switch, Checkbox, RadioGroup, Slider, Progress, Spinner, Skeleton: inspected their transitions/keyframes and ran their light/dark/preferences stories. They do not share the padded-height bug. No unrelated animation changes made.

## Verification

- Storybook full suite: 1695 passed / 204 files, light, dark and contrast/reduced-motion preferences; keyboard, focus and a11y gates included.
- Added endpoint geometry checks for a real Dialog, Popover and Sheet: opacity, anchored/centred positions, 6px popup vs full-width Sheet travel, exit presence and modal mask cleanup.
- Accordion regression measures zero height at both collapsed endpoints, preserves expanded geometry and exercises rapid toggling.
- Package units and script tests passed: UI 1445, icons 120, charts 87, registry 274, scripts 114, Python suites 18 + 31.
- Final package builds (including attw/publint), Storybook/registry build, typecheck and lint passed.
- Final clean motion regressions: 21 passed in Chromium's three preference projects.
- Firefox/WebKit: 48 passed / 12 files for the affected animation families and geometry regressions.
- Linux/arm64 Docker visual comparison: 212 passed, 10 theme-specific skips. Existing baselines unchanged.
- No temporary freeze-style workarounds are retained in the regression tests.

## Delivery

Prepared on codex/component-motion in an isolated worktree. A parallel maintenance-doc commit and other chats' untracked files are excluded. Merge and npm publishing have not been requested explicitly; the repository releases through its version PR after Build Check succeeds.
