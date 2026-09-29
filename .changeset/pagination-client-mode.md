---
"@holakirr/snow-ui": minor
---

Pagination has a client-side mode. Give `Pagination` an `onPageChange(page)` and each item the `page` it goes to: `PaginationLink`, `PaginationPrevious` and `PaginationNext` without `href` render as `<button type="button">`s (natively `disabled`), so paging through state no longer needs `event.preventDefault()` on fake links. Items with both `href` and `page` stay links (new tab, no JavaScript) and a plain click calls `onPageChange` instead of navigating; modified and middle clicks navigate as before. Link mode without `onPageChange` is unchanged. The new `PaginationProps` type is exported.
