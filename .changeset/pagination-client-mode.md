---
"@holakirr/snow-ui": minor
---

Pagination has a client-side mode. Give `Pagination` an `onPageChange(page)` and each item the `page` it goes to: `PaginationLink`, `PaginationPrevious` and `PaginationNext` without `href` render as `<button type="button">`s, so paging through state no longer needs `event.preventDefault()` on fake links. Items with both `href` and `page` stay links (new tab, no JavaScript) and a plain click calls `onPageChange` instead of navigating; modified and middle clicks, and links with a `target` or `download`, navigate as before. A disabled client-side button uses `aria-disabled`, so "next" disabled on the last page keeps the keyboard's focus. `ref` and `onClick` are typed for the `<a>` or the `<button>`. Link mode without `onPageChange` is unchanged. The new `PaginationProps` type is exported.
