---
"@holakirr/snow-ui": minor
---

Badge and Avatar fixes:

- **`Badge`'s `className` now goes on its wrapper**, like its other props and every other component's `className`; it went on the dot or number. Style the badge itself with the new `badgeClassName`: replace `<Badge className="bg-red">` with `<Badge badgeClassName="bg-red">`.
- `AvatarGroup` merges `className` into its row classes (`twMerge`) instead of replacing them, so `className="justify-center"` no longer drops the flex layout and the overlap.
- `AvatarGroup`'s "+N" avatar is read as "N more" by screen readers (`messages.avatarGroup.more(count)`, a new message; the visible "+N" is hidden from them).
- `AvatarFallback`'s initials grow with the avatar: 37.5% of its width, at least 12px (12px at `sm` and `md`, 24px at `lg`). They were 12px at every size. The avatar is a size container (`@container`), so an avatar resized by its parent (an `IconBox` slot) gets initials that fit.
- New message namespaces: `avatarGroup` and `charts` (the built-in strings of `@holakirr/snow-ui-charts`).
