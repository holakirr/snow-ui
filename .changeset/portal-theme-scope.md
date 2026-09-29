---
"@holakirr/snow-ui": minor
---

Portalled content can follow a scoped theme. The new `ThemeScope` (`<ThemeScope theme="dark">`, or `asChild` to put `data-theme` on your own element) scopes the tokens like a `data-theme` attribute and also passes the theme to the overlays opened inside it: `DialogContent`, `SheetContent`, `PopoverContent`, `DropdownMenuContent` / `SubContent`, `ContextMenuContent` / `SubContent`, `TooltipContent`, `SelectContent` and `CommandPalette` get it as their `data-theme`, although they render at the end of `<body>`. `SnowUIProvider` takes the same `theme` prop (inherited by nested providers, like `dir`), and `useSnowUI()` returns it. Without either, nothing changes: portals take the theme of `<html>`, and a `data-theme` on a `*Content` component still wins.
