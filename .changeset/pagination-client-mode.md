---
"@holakirr/snow-ui": minor
---

Pagination has a client-side mode. Give `Pagination` an `onPageChange(page)` and each item the `page` it goes to: `PaginationLink`, `PaginationPrevious` and `PaginationNext` without `href` render as `<button type="button">`s, so paging through state no longer needs `event.preventDefault()` on fake links. Items with both `href` and `page` stay links (new tab, no JavaScript) and a plain click calls `onPageChange` instead of navigating; modified and middle clicks, and links with a `target` or `download`, navigate as before. A disabled client-side button uses `aria-disabled`, and a disabled link stays focusable when `onPageChange` is set, so "next" disabled on the last page keeps the keyboard's focus. `ref` and the event handlers are typed for the `<a>` (`PaginationLinkProps`, as in 5.0) or, for a `page` without `href`, the `<button>` (`PaginationButtonProps`, new).

Fixed: a disabled `asChild` link (a router link) could still be activated by a click or Enter. It now gets `tabIndex={-1}`, and its clicks stop before its own handlers, as `BreadcrumbLink` does. Link mode without `onPageChange` is unchanged.
