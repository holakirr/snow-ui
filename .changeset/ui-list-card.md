---
"@holakirr/snow-ui": minor
---

New `ListCard`, `NotificationsCard`, `ActivitiesCard` and `ContactsCard`, the Figma Notifications, Activities and Contacts cards: a titled list of `ListItem` rows on the popup surface (Background/3 with "Glass 2", radius 24, padding 16), 248px wide. The title is 18 Semibold 18/28 with padding 4/8 (44 high) and the rows are 4px apart, so with the kit's rows the Notifications card is 300 high, Activities 356 and Contacts 316. The card is a `<section>` named by its heading (`headingLevel`, `<h2>` by default) with the rows in a `<ul>`; a row with `href` is a link, with `onSelect` a button, both with the Figma hover. `NotificationsCard` puts a 16px icon on a 24px tile above the time, `ActivitiesCard` takes an avatar and a time, `ContactsCard` one-line rows of a 28px avatar and a name, 44 high. Their default titles come from the new optional `listCards` messages (`notifications`, `activities`, `contacts`), and a `title` prop wins over them.
