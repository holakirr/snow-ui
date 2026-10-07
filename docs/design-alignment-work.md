# Продолжение сверки с дизайном — 7 октября 2026

## Требования и готовность

- Продолжить существующую задачу: привести существующие UI-компоненты и демо к лицензированному SnowUI Figma kit.
- Единственное согласованное отступление — цвета для контрастной доступности.
- Демо: Dashboard, Sign In, Account Settings и отдельная панель Settings со всеми разделами. Новые приложения кита не были согласованы.
- Сверить композицию, размеры, отступы, типографику, исходные изображения, иконки, темы и состояния каждого существующего компонента. Регрессионные baseline не заменяют эталон.
- Не считать готовым то, что осталось непроверенным. После изменений выполнить относящиеся к ним проверки.

## Исходное состояние

- В рабочей директории сохранены незакоммиченные изменения предыдущей задачи. Не сбрасывать их.
- Отчёт 6 октября подтверждает исправление D01–D05, Dashboard, Sign In и обоих Settings; это исторические результаты.
- Невыполнено: фотоаватары, часть логотипов, полная сверка вариантов и состояний с Figma. В отчёте также остались адаптации геометрии и настроек, требующие проверки в исходнике.
- Figma открыт в Chrome и нативном приложении; проверить доступность исходных материалов перед правками.

## Выполнено в этом продолжении

- Восстановлены исходное поручение и согласованные исключения из предыдущего чата.
- Обнаружены исходный Figma файл и существующие изменения.
- Экспортированы Avatars и Logos; исходные SVG находятся в /private/tmp, в демо добавлены только используемые портреты и логотипы.
- Подключены восемь оригинальных аватаров и десять логотипов, сохранён fallback для изменённого имени.
- Проверка типов демо прошла, webpack-сборка прошла; текущие проверки E2E запущены на порту 3102.
- Пользователь разрешил полную локальную копию .fig после отклонения auto-review; полная копия сохранена в /private/tmp/SnowUI.fig (293 MB). Прочитано 120610 исходных узлов; индекс — /private/tmp/snow-fig-parser/nodes.db. Это разрешение сохраняется.

## Текущая работа

1. Получить исходные изображения и точные варианты Figma.
2. Сверить и исправить демо.
3. Сверить и исправить каждый существующий компонент и его состояния, вести проверяемую матрицу.
4. Выполнить проверки и итоговую сверку всех требований.

- Сверка Profile: исходник 30919:278108, мастер 33509:79305. Панель 1176×664, gap заголовка 28, content padding 24/28, внутренний gap 8; исправлены 36px строки без описания, 64px шапка профиля, 16px зоны разделителей, 28px заголовки.
- Payment: источник 33509:187442 — карточки 264×140, radius16, padding24/16; исправлены padding/radius и badge. Размер логотипов ещё сверяется.
- У Button убран добавочный active scale; исходник не задаёт уменьшение геометрии при нажатии.
- Ошибка contrast после переключения темы воспроизводилась в переходе цветов: конечные цвета белые. Проверка теперь ждёт завершения анимаций. Повторная проверка обязательна.
- Стандартная Turbopack-сборка снова остановилась на Operation not permitted (bind port), даже после escalation; webpack budget больше штатного порога. Бюджет не менялся.

- Полная копия позволила сверить производные геометрии, не только размеры базовых мастеров. Settings: исправлены все семь layout gap/padding, исходные theme previews 80×48, font size control 320×56, размеры payment logos 40 и plugin logos 40, оригинальный градиент.
- Tabs Underline: исходник inactive16/20/24, active20/24/28; убрана постоянная высота скрытого underline. ShortUnderline inactive тоже не занимает место. TextareaCount: удалён добавочный нижний padding, основа44px. Button: удалён active scale.
- Последние проверки: unit83 passed (Button/Tabs/Textarea), Storybook54 passed (Tabs/Textarea, 3 темы), demo E2E27 passed. JS бюджеты после optimizePackageImports: Dashboard379KB, Account Settings275.4KB, SignIn218.8KB. После новых изменений эти проверки требуют относящегося к изменениям повтора.
- Dashboard источник 32546:96098 (master33534:50040): исходные KPI202×108, TotalUsers662×330, website202×330, нижние blocks432×280. Исправлены пропорции колонок, website strips и 246px content.
- При прямой визуальной сверке обнаружена сокращённая навигация и приблизительная линия TotalUsers. Навигация восстановлена с исходными пунктами; существующие маршруты доступны через раскрываемый Account. Несогласованные новые страницы не создаются. Исходные пять activity avatars добавлены, contacts возвращены в исходном порядке.
- DashboardSVG экспортирован /private/tmp/SnowUI-Overview.svg; исходная кривая перенесена в SourceOverviewChart, оси — живой переводимый текст, доступная таблица содержит демонстрационный ряд. Проверить сборку, типы, a11y, браузер и source alignment после этих правок.
- Временно добавленные Figma export settings: OverviewSVG, ProfilePNG, LogosSVG advanced ID. Удалить временные настройки в UI до завершения.

## Уточнение после прямой сверки 7 октября

- Временные export settings Overview/Profile/Logos удалены через Figma UI; исходный файл оставлен без этих настроек.
- Dashboard: исходные кривые и четыре сектора Donut перенесены из SVG; живые оси и доступная таблица сохранены. Добавлены plotMargin/xAxisHeight/yAxisWidth, overlay и plotWidth для точного размещения без изменения defaults библиотеки. Проверки charts87 и относящихся к ним Storybook прошли.
- Tooltip: исходный rich255×108, description169×40, radius12; исправлены размеры/типографика. Storybook15 и unit2 passed.
- DatePicker: исходник360×360, header56 без добавочной толщины border; части даты по пропорциональному тексту без tabular-nums/min-width. Невидимые hit-area сохранены. 81 Storybook проверки passed после правки расстояния к AM/PM; требуется финальная сборка UI.
- Scrollbar: исходное состояние скрыто, появляется на hover/focus; восстановлено. Нативный gutter и детали движка требуют проверки и не считаются автоматически совпавшими.
- Settings panel: все семь вкладок проверены в браузере в light/dark; Profile1176×664, остальные676. Исправлены inline line-box, Theme320×56, Payment264×140 и logos40.
- Sign In уточнён по правильному фрейму32546:96142/master33534:111740 (вариантA680×656, y184 при1440×1024). Header60/footerbottom24; исправлено центрирование карточки относительно полного viewport. Не путать с вариантомB и Sign Up overrides.
- Восстановлен оригинальный wordmark SnowUI (SVG) в header и sidebar footer. Требуется финальная визуальная проверка новой сборки.
- Account Settings: исходные шесть карточек556/272/268/276/316/192. Восстановлены pb16-разделители вместо p12, gridgap16, checkbox20, Skill76, notice84/64/68. Эти последние изменения ещё не проверены в новой сборке.
- Последние проверки27 E2E и SSR450+449 выполнены до последних правок; не представлять их финальным доказательством. Обязательны новая сборка, проверка desktop/mobile и E2E с размерами исходных карточек и Sign In.

## Итоговые проверки и сверка

- Все шесть Account Settings карточек совпали по измеренным размерам. Sign In680×656/x380/y184/header60 проверен в браузере и E2E.
- В полной матрице исходника573 variants. Сверка выявила Chip padding8 и Image icon insets; исправлены документация и проверки (27 unit/48 Storybook), затем полный Storybook1683 passed и UI/charts1527 passed.
- Обнаружено двойное наложение кривых из-за actual recharts-line-curve вместо recharts-area-curve: исправлено, добавлена проверка transparent native stroke. Marketing восстановлен по исходным компонентным override (28px, повторяющиеся высоты168/84/147/105/63/126, ticks0/10K/20K/30K).
- Последние SSR450+449, types и lint passed. Полный visual1014 passed/56 skip/16 expected inherited diffs; diff просмотрены, обновлены, проводится focused compare.
- Новый отчёт docs/design-audit-2026-10-07.md заменяет исторические выводы об аватарах, бюджетах и приблизительной геометрии. Практические ограничения движков/демо явно описаны.

- Финальная композиция Account Settings измерена: cardY144, footer948×56/y2164, page2220. В проверку добавлены эти значения. Последняя сборка29 E2E passed; дополненная композиционная проверка passed.
- Все1030 применимых visual снимков подтверждены:1014 в полном compare и16 исправленных в повторном compare зависимых групп(26 passed/2 skip). Неожиданных отличий после исправлений нет.
- Финальные first-load JS: Dashboard388.3KiB (<420), Settings280.1KiB (<290), SignIn218.7KiB (<275); все бюджеты passed без изменения порогов.
- Итоговые E2E screenshots сохранены в каталоге визуализаций: snowui-dashboard-final.png, snowui-account-settings-final.png, snowui-sign-in-final.png. Финальные две геометрические проверки passed после сохранения скриншотов. Viewport override сброшен, demo оставлено открытым на3102, временная Storybook-вкладка/сервер закрыты.

## Publication and live verification, 7 October

- Commits b9d0725b and 6a91290e pushed to codex/design-alignment, PR #225. Main rejected a direct push because 15 required checks and CodeQL must pass; protections remain enabled.
- Live HTTP: Storybook, next preview, demo Dashboard/Sign In/Settings and /r/button.json return 200. /preferences still returns 404 on the previous production demo.
- Pro HTTPS fails; HTTP returns Vercel DEPLOYMENT_NOT_FOUND. CI for Pro commit72e059e passed; a working public deployment is not confirmed.
- CI found an outdated resting scrollbar expectation in dist.test.ts. It now verifies hidden, hover and focus-within states; local published-package tests passed (UI26, charts9). Repeat CI pending.
