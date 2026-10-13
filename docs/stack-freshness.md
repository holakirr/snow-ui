# Актуальность стека SnowUI

Обновлено и проверено 13 октября 2026 года (МСК).

Все 88 прямых пакетов (включая Bun для CI и внутренний icons) соответствуют выбранным последним стабильным версиям. Обновлены 90 записей зависимостей; совместимые транзитивные обновления установлены через Bun. В итоговом bun.lock 983 уникальных имени npm-пакетов. Исходный снимок первой проверки сохранён в previous_baseline JSON-файла.

## Основные версии

| Компонент | До | После |
|---|---|---|
| [bun](https://registry.npmjs.org/bun) | 1.3.11 | 1.4.3 |
| [next](https://registry.npmjs.org/next) | 16.3.8 | 16.4.0 |
| [@biomejs/biome](https://registry.npmjs.org/%40biomejs%2Fbiome) | 2.5.14 | 2.5.15 |
| [storybook](https://registry.npmjs.org/storybook) | 10.6.0 | 10.6.2 |
| [vite](https://registry.npmjs.org/vite) | 8.3.1 | 8.3.4 |
| [vitest](https://registry.npmjs.org/vitest) | 5.0.2 | 5.0.4 |
| [playwright](https://registry.npmjs.org/playwright) | 1.63.0 | 1.64.0 |
| [tsdown](https://registry.npmjs.org/tsdown) | 0.23.0 | 0.23.1 |
| [@tanstack/react-table](https://registry.npmjs.org/%40tanstack%2Freact-table) | 9.2.4 | 9.3.1 |
| [react-hook-form](https://registry.npmjs.org/react-hook-form) | 7.89.0 | 7.90.0 |
| [react-day-picker](https://registry.npmjs.org/react-day-picker) | 10.0.1 | 10.0.2 |
| [zod](https://registry.npmjs.org/zod) | 4.6.5, 3.25.58 | 4.6.7 |
| [@terrazzo/cli](https://registry.npmjs.org/%40terrazzo%2Fcli) | 2.7.1 | 2.8.0 |
| Node.js локально | 26.8.1 | 26.11.1 |
| npm локально | 11.12.1 | 12.2.0 |

React 19.3.0, TypeScript 7.0.2, Tailwind CSS 4.3.3 и Recharts 3.10.1 уже были latest и сохранены. Radix primitives обновлены согласованно; полный список ниже.

Корень и registry требуют поддерживаемую среду: `^22.22.2 || ^24.15.0 || >=26.0.0`. Peer-диапазоны и engines опубликованных библиотек сохранены отдельно от требований к разработке. [Поддержка Node.js](https://github.com/nodejs/Release).

## Проверки

| Проверка | Результат |
|---|---|
| Frozen install | 956 установок, 1106 пакетов, lockfile без изменений |
| Lint; typecheck библиотек и demo | прошли |
| Unit пакетов | 1925 прошли (ui 1444, charts 87, icons 120, registry 274) |
| Скрипты и согласованность CI | 101 прошёл |
| Build packages; exports / типы | прошли, publint и attw без ошибок |
| Storybook / registry / demo production build | прошли; 76 registry items |
| Dist / CSS / type fixtures | 35 прошли |
| Size budgets | все прошли |
| Chromium + unit с coverage | 3214 прошли в 273 файлах |
| Coverage | statements 96.96%; branches 93.06%; functions 96.5%; lines 97.78% |
| Firefox / WebKit | 1122 прошли в 134 файлах, без retries |
| SSR render / hydrate | 450 / 449 прошли |
| Документация | все 75 страниц прошли |
| Demo E2E | все 33 прошли |
| Registry smoke | Next, Vite и Next + shadcn прошли; 57 / 9 / 12 секунд |
| Визуальный compare | 1030 прошли; 56 прежних skips |
| CI installer Bun | npm ci и бинарник 1.4.3 проверены |
| Engines / peerDependencies / локальная установка | расхождений нет |

После последних изменений play-функций Search дополнительно прошли его 33 Chromium-проверки, 11 Firefox-проверок, 19 visual и страница документации.

## Исправления, необходимые для обновления

- axe-core 4.14 проверяет видимое слово в доступном имени. Calendar включает видимый номер отдельно от порядкового числительного; DatePicker включает сокращение месяца; Pagination с видимым текстом использует aria-labelledby. Локализация и явные overrides сохранены. Добавлены четыре unit-проверки этих контрактов. [Правило axe](https://dequeuniversity.com/rules/axe/4.14/label-content-name-mismatch).
- Подписи иконок в Storybook используют тематический text-secondary: прежний постоянный тёмный цвет давал 1.41:1 в тёмной теме. Все 100 изменённых PNG просмотрены; размеры и границы содержимого совпадают. Другие эталоны не менялись.
- Browser-only setup возвращает фокус в документ текущей истории до монтажа, устраняя меняющиеся сбои Firefox при переиспользовании iframe. Пользовательские компоненты от этой настройки не зависят.
- Проверка вращающегося индикатора Search измеряет layout CSS, а не меняющиеся границы после rotation. Проверки клавиатуры используют контекст истории и определённый начальный фокус.
- Проверка геометрии DropdownMenu учитывает округление дробной координаты WebKit до CSS-пикселя при scrollIntoView; ограничение меньше одного пикселя, остальные assertions сохранены.
- RTL toast в документации ожидает портальный монтаж. E2E RTL demo подтверждает сохранённую cookie перед reload, вместо перезагрузки на оптимистичном состоянии.
- Bun 1.4 не выпускает отдельный linux-x64-baseline пакет; CI-тест проверяет реальные x64 и arm64 бинарники с integrity.

Правила axe, coverage thresholds и size limits сохранены. Новые skips не добавлены.

## Безопасность и ближайшая проверка

После обновления Bun audit содержит только braces 3.0.3 (High), который приходит через инструменты сборки и registry. Исправленной версии пока нет; непроверенные внешние glob-шаблоны не передавать инструментам. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Bun обновлён до 1.4.3, включая опубликованные исправления проверки TLS. [Release notes](https://bun.sh/blog/release-notes/bun-v1.4.3).

Next.js 16.4.0 установлен локально и совпадает с манифестом/lockfile. На 14 октября анонсированы две Critical и одна High уязвимости в upstream; подробности ещё не раскрыты. Отдельная проверка назначена на **14.10.2026, 21:00 МСК**, automation id `snowui-security-next-js-14`. [Анонс](https://nextjs.org/blog/upcoming-nextjs-security-update-october-2026).

## Полный список прямых пакетов

Версии сравнивались с официальным npm dist-tag latest; prerelease из других тегов не устанавливались. Сверены манифесты, lockfile и фактический node_modules.

| Пакет | Установлено | latest на проверке |
|---|---|---|
| [@arethetypeswrong/core](https://registry.npmjs.org/%40arethetypeswrong%2Fcore) | 0.18.5 | 0.18.5 |
| [@axe-core/playwright](https://registry.npmjs.org/%40axe-core%2Fplaywright) | 4.13.0 | 4.13.0 |
| [@biomejs/biome](https://registry.npmjs.org/%40biomejs%2Fbiome) | 2.5.15 | 2.5.15 |
| [@changesets/changelog-github](https://registry.npmjs.org/%40changesets%2Fchangelog-github) | 1.0.1 | 1.0.1 |
| [@changesets/cli](https://registry.npmjs.org/%40changesets%2Fcli) | 3.0.3 | 3.0.3 |
| [@changesets/pre](https://registry.npmjs.org/%40changesets%2Fpre) | 3.0.0 | 3.0.0 |
| [@changesets/read](https://registry.npmjs.org/%40changesets%2Fread) | 1.0.1 | 1.0.1 |
| [@figma/code-connect](https://registry.npmjs.org/%40figma%2Fcode-connect) | 2.0.1 | 2.0.1 |
| [@holakirr/snow-ui-icons](https://registry.npmjs.org/@holakirr%2fsnow-ui-icons/latest) | 2.2.2 | 2.2.2 |
| [@hookform/resolvers](https://registry.npmjs.org/%40hookform%2Fresolvers) | 5.9.1 | 5.9.1 |
| [@phosphor-icons/react](https://registry.npmjs.org/%40phosphor-icons%2Freact) | 2.1.10 | 2.1.10 |
| [@playwright/test](https://registry.npmjs.org/%40playwright%2Ftest) | 1.64.0 | 1.64.0 |
| [@radix-ui/react-accordion](https://registry.npmjs.org/%40radix-ui%2Freact-accordion) | 1.3.1 | 1.3.1 |
| [@radix-ui/react-alert-dialog](https://registry.npmjs.org/%40radix-ui%2Freact-alert-dialog) | 1.2.1 | 1.2.1 |
| [@radix-ui/react-avatar](https://registry.npmjs.org/%40radix-ui%2Freact-avatar) | 1.3.1 | 1.3.1 |
| [@radix-ui/react-checkbox](https://registry.npmjs.org/%40radix-ui%2Freact-checkbox) | 1.4.1 | 1.4.1 |
| [@radix-ui/react-compose-refs](https://registry.npmjs.org/%40radix-ui%2Freact-compose-refs) | 1.1.5 | 1.1.5 |
| [@radix-ui/react-context-menu](https://registry.npmjs.org/%40radix-ui%2Freact-context-menu) | 2.4.1 | 2.4.1 |
| [@radix-ui/react-dialog](https://registry.npmjs.org/%40radix-ui%2Freact-dialog) | 1.3.1 | 1.3.1 |
| [@radix-ui/react-direction](https://registry.npmjs.org/%40radix-ui%2Freact-direction) | 1.2.0 | 1.2.0 |
| [@radix-ui/react-dropdown-menu](https://registry.npmjs.org/%40radix-ui%2Freact-dropdown-menu) | 2.2.1 | 2.2.1 |
| [@radix-ui/react-label](https://registry.npmjs.org/%40radix-ui%2Freact-label) | 2.1.17 | 2.1.17 |
| [@radix-ui/react-popover](https://registry.npmjs.org/%40radix-ui%2Freact-popover) | 1.3.1 | 1.3.1 |
| [@radix-ui/react-progress](https://registry.npmjs.org/%40radix-ui%2Freact-progress) | 1.2.1 | 1.2.1 |
| [@radix-ui/react-radio-group](https://registry.npmjs.org/%40radix-ui%2Freact-radio-group) | 1.5.1 | 1.5.1 |
| [@radix-ui/react-select](https://registry.npmjs.org/%40radix-ui%2Freact-select) | 2.4.1 | 2.4.1 |
| [@radix-ui/react-separator](https://registry.npmjs.org/%40radix-ui%2Freact-separator) | 1.2.0 | 1.2.0 |
| [@radix-ui/react-slider](https://registry.npmjs.org/%40radix-ui%2Freact-slider) | 1.6.1 | 1.6.1 |
| [@radix-ui/react-slot](https://registry.npmjs.org/%40radix-ui%2Freact-slot) | 1.5.0 | 1.5.0 |
| [@radix-ui/react-switch](https://registry.npmjs.org/%40radix-ui%2Freact-switch) | 1.4.1 | 1.4.1 |
| [@radix-ui/react-tabs](https://registry.npmjs.org/%40radix-ui%2Freact-tabs) | 1.2.1 | 1.2.1 |
| [@radix-ui/react-toast](https://registry.npmjs.org/%40radix-ui%2Freact-toast) | 1.3.1 | 1.3.1 |
| [@radix-ui/react-toggle](https://registry.npmjs.org/%40radix-ui%2Freact-toggle) | 1.2.1 | 1.2.1 |
| [@radix-ui/react-toggle-group](https://registry.npmjs.org/%40radix-ui%2Freact-toggle-group) | 1.2.1 | 1.2.1 |
| [@radix-ui/react-tooltip](https://registry.npmjs.org/%40radix-ui%2Freact-tooltip) | 1.4.1 | 1.4.1 |
| [@size-limit/esbuild](https://registry.npmjs.org/%40size-limit%2Fesbuild) | 14.2.0 | 14.2.0 |
| [@size-limit/file](https://registry.npmjs.org/%40size-limit%2Ffile) | 14.2.0 | 14.2.0 |
| [@storybook/addon-a11y](https://registry.npmjs.org/%40storybook%2Faddon-a11y) | 10.6.2 | 10.6.2 |
| [@storybook/addon-designs](https://registry.npmjs.org/%40storybook%2Faddon-designs) | 11.1.4 | 11.1.4 |
| [@storybook/addon-docs](https://registry.npmjs.org/%40storybook%2Faddon-docs) | 10.6.2 | 10.6.2 |
| [@storybook/addon-links](https://registry.npmjs.org/%40storybook%2Faddon-links) | 10.6.2 | 10.6.2 |
| [@storybook/addon-themes](https://registry.npmjs.org/%40storybook%2Faddon-themes) | 10.6.2 | 10.6.2 |
| [@storybook/addon-vitest](https://registry.npmjs.org/%40storybook%2Faddon-vitest) | 10.6.2 | 10.6.2 |
| [@storybook/react-vite](https://registry.npmjs.org/%40storybook%2Freact-vite) | 10.6.2 | 10.6.2 |
| [@tailwindcss/cli](https://registry.npmjs.org/%40tailwindcss%2Fcli) | 4.3.3 | 4.3.3 |
| [@tailwindcss/postcss](https://registry.npmjs.org/%40tailwindcss%2Fpostcss) | 4.3.3 | 4.3.3 |
| [@tailwindcss/vite](https://registry.npmjs.org/%40tailwindcss%2Fvite) | 4.3.3 | 4.3.3 |
| [@tanstack/react-table](https://registry.npmjs.org/%40tanstack%2Freact-table) | 9.3.1 | 9.3.1 |
| [@terrazzo/cli](https://registry.npmjs.org/%40terrazzo%2Fcli) | 2.8.0 | 2.8.0 |
| [@terrazzo/parser](https://registry.npmjs.org/%40terrazzo%2Fparser) | 2.8.0 | 2.8.0 |
| [@testing-library/jest-dom](https://registry.npmjs.org/%40testing-library%2Fjest-dom) | 7.0.1 | 7.0.1 |
| [@testing-library/react](https://registry.npmjs.org/%40testing-library%2Freact) | 16.3.3 | 16.3.3 |
| [@testing-library/user-event](https://registry.npmjs.org/%40testing-library%2Fuser-event) | 14.6.8 | 14.6.8 |
| [@types/bun](https://registry.npmjs.org/%40types%2Fbun) | 1.4.3 | 1.4.3 |
| [@types/node](https://registry.npmjs.org/%40types%2Fnode) | 26.6.5 | 26.6.5 |
| [@types/react](https://registry.npmjs.org/%40types%2Freact) | 19.3.0 | 19.3.0 |
| [@types/react-dom](https://registry.npmjs.org/%40types%2Freact-dom) | 19.3.0 | 19.3.0 |
| [@typescript/typescript6](https://registry.npmjs.org/%40typescript%2Ftypescript6) | 6.0.2 | 6.0.2 |
| [@vitejs/plugin-react](https://registry.npmjs.org/%40vitejs%2Fplugin-react) | 6.1.2 | 6.1.2 |
| [@vitest/browser-playwright](https://registry.npmjs.org/%40vitest%2Fbrowser-playwright) | 5.0.4 | 5.0.4 |
| [@vitest/coverage-v8](https://registry.npmjs.org/%40vitest%2Fcoverage-v8) | 5.0.4 | 5.0.4 |
| [@vitest/ui](https://registry.npmjs.org/%40vitest%2Fui) | 5.0.4 | 5.0.4 |
| [better-commits](https://registry.npmjs.org/better-commits) | 1.26.1 | 1.26.1 |
| [bun](https://registry.npmjs.org/bun) | 1.4.3 | 1.4.3 |
| [class-variance-authority](https://registry.npmjs.org/class-variance-authority) | 0.7.1 | 0.7.1 |
| [date-fns](https://registry.npmjs.org/date-fns) | 4.4.0 | 4.4.0 |
| [jsdom](https://registry.npmjs.org/jsdom) | 30.1.2 | 30.1.2 |
| [next](https://registry.npmjs.org/next) | 16.4.0 | 16.4.0 |
| [playwright](https://registry.npmjs.org/playwright) | 1.64.0 | 1.64.0 |
| [publint](https://registry.npmjs.org/publint) | 0.3.25 | 0.3.25 |
| [react](https://registry.npmjs.org/react) | 19.3.0 | 19.3.0 |
| [react-day-picker](https://registry.npmjs.org/react-day-picker) | 10.0.2 | 10.0.2 |
| [react-dom](https://registry.npmjs.org/react-dom) | 19.3.0 | 19.3.0 |
| [react-hook-form](https://registry.npmjs.org/react-hook-form) | 7.90.0 | 7.90.0 |
| [react-is](https://registry.npmjs.org/react-is) | 19.3.0 | 19.3.0 |
| [recharts](https://registry.npmjs.org/recharts) | 3.10.1 | 3.10.1 |
| [remark-gfm](https://registry.npmjs.org/remark-gfm) | 4.0.1 | 4.0.1 |
| [shadcn](https://registry.npmjs.org/shadcn) | 4.21.4 | 4.21.4 |
| [size-limit](https://registry.npmjs.org/size-limit) | 14.2.0 | 14.2.0 |
| [storybook](https://registry.npmjs.org/storybook) | 10.6.2 | 10.6.2 |
| [tailwind-merge](https://registry.npmjs.org/tailwind-merge) | 3.7.0 | 3.7.0 |
| [tailwindcss](https://registry.npmjs.org/tailwindcss) | 4.3.3 | 4.3.3 |
| [ts-morph](https://registry.npmjs.org/ts-morph) | 28.0.0 | 28.0.0 |
| [tsdown](https://registry.npmjs.org/tsdown) | 0.23.1 | 0.23.1 |
| [typescript](https://registry.npmjs.org/typescript) | 7.0.2 | 7.0.2 |
| [vite](https://registry.npmjs.org/vite) | 8.3.4 | 8.3.4 |
| [vitest](https://registry.npmjs.org/vitest) | 5.0.4 | 5.0.4 |
| [zod](https://registry.npmjs.org/zod) | 4.6.7 | 4.6.7 |

## GitHub Actions и контейнер

| Action | До | После |
|---|---|---|
| [actions/checkout](https://github.com/actions/checkout/releases/tag/v7.0.1) | v7.0.1 | v7.0.1 |
| [oven-sh/setup-bun](https://github.com/oven-sh/setup-bun/releases/tag/v2.2.0) | v2 | v2.2.0 |
| [actions/setup-node](https://github.com/actions/setup-node/releases/tag/v7.1.0) | v7.0.0 | v7.1.0 |
| [changesets/action](https://github.com/changesets/action/releases/tag/v2.1.2) | v2.1.2 | v2.1.2 |
| [actions/upload-artifact](https://github.com/actions/upload-artifact/releases/tag/v7.0.2) | v7.0.1 | v7.0.2 |
| [actions/download-artifact](https://github.com/actions/download-artifact/releases/tag/v8.0.2) | v8.0.1 | v8.0.2 |
| [actions/cache](https://github.com/actions/cache/releases/tag/v6.1.0) | v6.1.0 | v6.1.0 |
| [ossf/scorecard-action](https://github.com/ossf/scorecard-action/releases/tag/v2.5.0) | v2.4.4 | v2.5.0 |
| [github/codeql-action](https://github.com/github/codeql-action/releases/tag/v4.38.3) | v4.38.2 | v4.38.3 |

Все actions закреплены по SHA официальных тегов, аннотированные теги развёрнуты до commit. Playwright 1.64.0 согласован с образом в Dockerfile и CI: `mcr.microsoft.com/playwright:v1.64.0-noble@sha256:06a9939e57531807f8d5fd76ce44b53165ffb7d7501d87ab10e285c20b1e971f`. Из официального реестра проверены digest и обе платформы Linux.

## Ограничения

- braces 3.0.3 остаётся в уязвимом диапазоне; исправленная версия не опубликована. Находка относится к инструментам, удалённая эксплуатация в демо не подтверждена.
- Security-релиз Next.js 14 октября ещё не раскрыт. Отдельная проверка назначена на 21:00 МСК; обновления или deploy этой автоматизации не поручены.
- react-docgen-typescript 2.4.0 остаётся latest. Его Vite plugin 0.7.0 с локальным патчем соответствует ^0.7.0, который требует последний Storybook 10.6.2; принудительная подмена на несовместимую 0.9.0 не выполнялась. Другие транзитивные версии тоже сохраняют ограничения родителей.
- Фактическая среда Vercel не проверялась; публикация пакетов и deploy не выполнялись. ОС внутри контейнера не сканировалась на уязвимости.
- Проверки проведены локально. Новые hosted CI runs не запускались.
- 56 визуальных историй имеют прежние явные skips; новые skips, отключения axe, снижение coverage или size budgets не добавлялись.

## Следующие проверки

Недельная проверка остаётся по понедельникам в 10:00 МСК. Сравнивать с этим снимком: закрытые рекомендации не повторять, braces и security-анонс Next.js отслеживать до изменения фактов. Публикация пакетов и deploy в эту работу не входят.
