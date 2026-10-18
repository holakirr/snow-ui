# Актуальность стека SnowUI

Свежая сверка прямых зависимостей и обновление: **17 октября 2026 года (МСК)**. Все 88 прямых пакетов соответствуют официальным latest stable; совместимые транзитивные зависимости обновлены. Peer-диапазоны опубликованных библиотек сохранены. Полный набор локальных проверок прошёл. Для merge обязательны независимое ревью окончательного HEAD и зелёный CI.

| Компонент | До | После |
|---|---|---|
| Next.js | 16.4.1 | 16.4.2 |
| React / React DOM / React Is | 19.3.0 | 19.3.1 |
| Playwright / test | 1.64.0 | 1.64.1 |
| Vitest / browser-playwright / coverage-v8 / ui | 5.0.4 | 5.0.5 |
| shadcn | 4.21.4 | 4.22.0 |
| Terrazzo CLI / parser | 2.8.0 | 2.9.0 |
| Figma Code Connect | 2.0.1 | 2.0.2 |
| jsdom | 30.1.2 | 30.1.3 |
| axe-core/playwright | 4.13.0 | 4.14.0 |
| CodeQL action | 4.38.3 | 4.39.0 |
| create-next-app (registry smoke) | 16.4.0 | 16.4.2 |
| Локальный Node.js | 26.11.1 | 26.12.0 |

TypeScript 7.0.2, Tailwind 4.3.3, Vite 8.3.4, Storybook 10.6.2, Recharts 3.10.1 и Bun 1.4.3 остаются текущими стабильными версиями. Playwright image согласован во всех потребителях и закреплён официальным MCR digest. Default npm после Homebrew Node: 11.20.0; актуальный npm 12.2.0 установлен отдельно в пользовательском prefix.

Аудит нового lockfile показывает только прежнюю High-находку braces 3.0.3. Официального патча нет; запись braces не менялась. Четыре Scorecard-находки сохранены. Защита/rulesets/approvals/CODEOWNERS/права не менялись, alerts не закрывались. Регрессию доступности ChoiceRow, обнаруженную axe-core 4.14, исправили удалением лишнего aria-label; все 33 demo E2E прошли без выключения правил.

Локальные результаты: 1926 unit, 114 JS scripts и 49 Python тестов, 35 CSS/exports, 899 SSR, 3215 Chromium/coverage, 1122 Firefox/WebKit, 75 docs, 33 demo E2E; три registry-приложения прошли. Визуальный compare: 1030 passed и 56 прежних skips, эталоны не менялись. Lint, типы, сборки, Code Connect и size budgets прошли.

Подробный текущий протокол: [обновление 17 октября](stack-update-2026-10-17.md). История и находки сохранены в JSON. Источники версий: [npm registry](https://registry.npmjs.org/), [Node.js releases](https://nodejs.org/dist/index.json), [CodeQL action](https://github.com/github/codeql-action/releases/tag/v4.39.0). [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

## Исторический протокол 13–16 октября

Ниже сохранены предыдущие результаты и детали находок. Версии в исторических таблицах относятся к указанным датам; текущие версии приведены выше.

Полная проверка стека: 13 октября 2026 года (МСК). Целевая security-проверка Next.js: 15.10.2026 00:04 МСК; остальные пакеты заново не проверялись. Целевая сверка Scorecard и правил веток: 16.10.2026 12:55 МСК; это не повторный полный аудит стека.

На полной проверке 13 октября все 88 прямых пакетов (включая Bun для CI и внутренний icons) соответствовали выбранным последним стабильным версиям. Для Next.js с тех пор опубликован security-патч 16.4.1; он установлен локально и опубликован в демо по отдельному поручению 15 октября. Production-прогон на merge-коммите прошёл; три security-находки закрыты. Обновлены 90 записей зависимостей; совместимые транзитивные обновления установлены через Bun. В итоговом bun.lock 983 уникальных имени npm-пакетов. Исходный снимок первой проверки сохранён в previous_baseline JSON-файла.

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

На момент целевой проверки Next.js 16.4.0 был установлен локально и совпадал с манифестом/lockfile. Проверка выполнена 15.10.2026 00:04 МСК: опубликован security-релиз **16.4.1**, backport **15.5.28**. High DoS с Server Actions применима к демо; исправление опубликовано в обновлении до 16.4.1 и подтверждено успешным production-прогоном. Две Critical оценены отдельно ниже. Одноразовая автоматизация `snowui-security-next-js-14` завершена и удалена после сохранения отчёта. [Релиз](https://github.com/vercel/next.js/releases/tag/v16.4.1).

## Целевая проверка security-релиза Next.js — 15.10.2026 00:04 МСК

Релиз опубликован **14.10.2026 в 20:43:55 МСК**: npm `latest` = `16.4.1`; backport `15.5.28` опубликован в 20:36:08 МСК. Это подтверждено npm metadata, тегом GitHub и тремя публичными advisory. Блог по исходной ссылке пока содержит анонс, поэтому не использован как доказательство отсутствия релиза. [npm](https://registry.npmjs.org/next), [GitHub release](https://github.com/vercel/next.js/releases/tag/v16.4.1), [анонс](https://nextjs.org/blog/upcoming-nextjs-security-update-october-2026).

На момент проверки в 00:04 МСК манифест `apps/demo/package.json`, `bun.lock` и установленный `node_modules/next` совпадали: **16.4.0**. `sharp` в lockfile и node_modules — **0.35.5**; Next разрешает именно этот локальный модуль. Ни зависимости, ни установка не менялись.

| Advisory | Диапазоны upstream → исправления | Применимость к SnowUI |
|---|---|---|
| [GHSA-2464-fhr4-w9xw / CVE-2026-96889](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), Critical, RCE Image Optimization/SVG | `>=10.0.0 <=15.5.27` → `15.5.28`; `>16.0.0 <=16.4.0` → `16.4.1` | Версия Next затронута. Upstream указывает glibc/Linux и workaround `sharp >=0.35.5`; наш lockfile и локальная установка ему соответствуют. SVG-логотипы имеют `unoptimized`, `dangerouslyAllowSVG=false`, remote patterns пусты. Текущая локальная платформа — Darwin arm64. Условия RCE не выявлены; фактический image runtime Vercel не исследован. |
| [GHSA-673q-mjm6-r5xr](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr), Critical, RCE Cache Components | `>=16.0.0 <=16.4.0` → `16.4.1` | Версия затронута, но `cacheComponents=false` в defaults установленного Next и существующем build manifest. В production-коде демо нет `use cache` и таких функций с несколькими typed arrays. Условия не выявлены; upstream рекомендует обновление даже без них. CVE в advisory пока не указан. |
| [GHSA-p3m5-59mp-jv5r](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r), High, DoS Server Actions | `>=13.0.0 <=15.5.27` → `15.5.28`; `>=16.0.0 <=16.4.0` → `16.4.1` | **Применима по версии и коду**: App Router, `app/actions.ts` с `setLanguage`/`setDirection`, оба вызываются из `app/providers.tsx`. Специальные запросы могут перегружать CPU и блокировать запросы процесса. Upstream не предлагает workaround кроме обновления. CVE пока не указан. |

**Рекомендация аудита в 00:04 МСК: срочно обновить демо до Next.js 16.4.1** с проверками. Выполнение отдельного поручения описано ниже. Требование patched-пакета Node `>=20.9.0` совместимо с нашей локальной веткой 26 и CI 24. Библиотечные npm-пакеты SnowUI и статический Storybook не являются сервером Next.js; выявленная применимость относится к демо.

Проверка выполнена по состоянию файлов и официальных источников, без эксплуатации, сканирования production, установки, изменений исходников или деплоя. Факты эксплуатации или компрометации не установлены. Сохранены исходные статусы остальных находок и прежняя полная проверка стека.

## Обновление Next.js — 15.10.2026

По отдельному поручению Next.js обновлён до **16.4.1** в `apps/demo/package.json`, `bun.lock` и локальной установке. Версия содержит исправления всех трёх advisory из целевой проверки выше. Исторические результаты аудита сохранены; текущее состояние исправления выделено отдельно в машинном снимке. Локально прошли frozen install, lint, типы библиотек и демо, сборки библиотек и демо, 1926 unit-тестов пакетов, 114 тестов скриптов, 1683 Storybook-теста, 35 dist-тестов, size budgets и 33 E2E-сценария демо. [PR #238](https://github.com/holakirr/snow-ui/pull/238) смержен после независимого ревью точного HEAD `69bc47b4fbbe3e50dad93cf34c82fadb5a5c2f0b` и всех 24 зелёных проверок CI. Защита Vercel и доступ автотестов сохранены.

[Production Check #38718849274](https://github.com/holakirr/snow-ui/actions/runs/38718849274) завершился успешно 15.10.2026 в 13:16:46 МСК. Подтверждён SHA демо `cecd2d43e04323c2e655660566b49dcf5d6a11b3`, совпадающий с merge-коммитом PR #238; SHA сайта — `b9deb0aae14a78e3e8b5762624ec0042b7a72379`. По JSON-отчётам прошли **33 сценария демо и 75 страниц документации**; ошибок, неожиданных результатов, пропусков и flaky-тестов нет. Все три находки — `GHSA-2464-fhr4-w9xw`, `GHSA-673q-mjm6-r5xr`, `GHSA-p3m5-59mp-jv5r` — и сводная рекомендация `next-security-20261014` имеют статус **resolved**. Основание закрытия: установка исправленной версии и проверка опубликованного merge-коммита. Production E2E не является проверкой эксплуатации уязвимостей или сканированием ОС.

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

## Открытые находки Scorecard — 16.10.2026

В GitHub Code scanning открыты пять предупреждений Scorecard на анализе коммита
`0ebf9985a5b720c1b4739306e12d605c63a4471d`. Четыре находки по практикам безопасности
добавлены в реестр ниже со статусом open и отдельными условиями закрытия.
Пятое, [Vulnerabilities #7](https://github.com/holakirr/snow-ui/security/code-scanning/7),
указывает на ту же `GHSA-vfj7-8cjw-p6xm` в braces и уже представлено записью
`braces-GHSA-vfj7-8cjw-p6xm`; новая уязвимость или дубликат записи не создаются.
Это предупреждения Scorecard, а не четыре дополнительные CVE в коде SnowUI.
Настройки защиты, workflow и состояния автоматизаций в этой работе не менялись;
alerts не закрывались и не подавлялись.

| Находка и статус реестра | Подтверждённая причина | Блокер и условие закрытия |
|---|---|---|
| [Branch Protection #3](https://github.com/holakirr/snow-ui/security/code-scanning/3), High; `open_requires_policy_decision` | Score 3. На main число обязательных одобрений равно 0, review от CODEOWNERS и одобрение последнего push не обязательны. Ruleset release содержит запрет удаления и force push, но не обязательные PR или status checks. | Нужна согласованная политика одобрений и продвижения release. Настройки пока менять запрещено. После отдельного согласования нужны подходящие правила и повторный анализ Scorecard. |
| [Code Review #5](https://github.com/holakirr/snow-ui/security/code-scanning/5), High; `open_requires_human_review` | Score 0: Scorecard нашёл 0/13 approved changesets. Независимое ревью агентом проводится, но не является человеческим GitHub approval; main требует 0 одобряющих ревью. | Нужен доступный независимый человек-ревьюер и реальные одобрения. Для закрытия повторная проверка должна подтвердить, что новые изменения проходят распознаваемое ревью. |
| [Fuzzing #4](https://github.com/holakirr/snow-ui/security/code-scanning/4), Medium; `open_requires_fuzzing_integration` | Score 0: интеграция fuzz-тестирования не обнаружена. | Требуется выбрать цели и входные данные, внедрить и выполнить fuzz-тесты, подтвердить их обнаружение Scorecard. Unit-, E2E- и визуальные тесты это условие не заменяют. |
| [CII Best Practices #6](https://github.com/holakirr/snow-ui/security/code-scanning/6), Low; `open_requires_best_practices_badge` | Score 0: OpenSSF Best Practices Badge не обнаружен. | Сопровождающему нужно пройти критерии программы и подтвердить практики. Для закрытия badge должен быть получен и распознан повторным анализом; правки README недостаточно. |

Подтверждение защиты получено чтением branch protection и действующих rulesets:
[PR control, 509327](https://github.com/holakirr/snow-ui/rules/509327) и
[Release promotion safety, 24719637](https://github.com/holakirr/snow-ui/rules/24719637).
На main уже обязательны PR, успешный CI и CodeQL, запрещены force push и удаление;
предупреждение не означает отсутствия всей защиты. Для release штатный workflow
отдельно выполняет проверку и продвижение: оценка правил ветки не доказывает
отсутствие всех проверок релиза. Его процесс в рамках этой сверки не переаудировался.

### Текущий мониторинг

Все четыре находки повторно оценивает `.github/workflows/scorecard.yml`: при push
в main, событии `branch_protection_rule` и еженедельно по понедельникам в
**05:27 UTC / 08:27 МСК**. Результаты загружаются в GitHub Security / Code scanning.
Плановый старт GitHub Actions может задерживаться. Это мониторинг; отдельной
автоматизации устранения этих четырёх причин нет.

Недельная автоматизация `snowui` по понедельникам в 10:00 МСК выполняет сверку
стека и security-источников без изменений проекта, сохраняет статусы и сообщает
о существенных изменениях. Даты `first_seen` новых записей отражают включение в
этот реестр 16 октября; сами GitHub alerts появились раньше.
Ежедневная `snowui-braces` отдельно отслеживает исправление braces и имеет разрешение
на цикл обновления после подтверждённого патча. `snowui-production` каждые 15 минут
проверяет production-прогоны после релиза; эта проверка не закрывает Scorecard-находки.

## Ограничения

- braces 3.0.3 остаётся в уязвимом диапазоне; исправленная версия не опубликована. Находка относится к инструментам, удалённая эксплуатация в демо не подтверждена.
- react-docgen-typescript 2.4.0 остаётся latest. Его Vite plugin 0.7.0 с локальным патчем соответствует ^0.7.0, который требует последний Storybook 10.6.2; принудительная подмена на несовместимую 0.9.0 не выполнялась. Другие транзитивные версии тоже сохраняют ограничения родителей.
- Production-прогон Next.js 16.4.1 прошёл на Vercel. ОС и внутренний image runtime не сканировались на уязвимости; эксплуатация advisory не проверялась.
- Полный аудит остальных зависимостей относится к 13 октября. Обновление Next.js отдельно прошло локальные проверки, hosted CI и production-прогон 15 октября.
- 56 визуальных историй имеют прежние явные skips; новые skips, отключения axe, снижение coverage или size budgets не добавлялись.

## Следующие проверки

Недельная проверка остаётся по понедельникам в 10:00 МСК. Сравнивать с этим снимком: закрытые рекомендации не повторять, braces отслеживать до изменения фактов; для Next.js проверять новые advisory, три закрытые находки повторно не поднимать. Четыре открытые Scorecard-находки сохранять в реестре до подтверждения условий закрытия; без отдельного согласования настройки защиты не менять. Публикация пакетов и deploy в эту работу не входят.
