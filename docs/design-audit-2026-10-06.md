# Сверка SnowUI с дизайном — 6 октября 2026

Исходный код: `main`, `a671b9a5` (UI 5.3.0, icons 2.2.2, charts 0.2.0).
Эталон: [лицензированная копия SnowUI в Figma](https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/).

## Вывод

Библиотека и демо имеют разный уровень соответствия. Измеренные базовые компоненты воспроизводят основные размеры и токены кита, с документированными отличиями для доступности и совместимости 5.x. Dashboard в демо — адаптация: есть конкретное расхождение правой панели, изменённые KPI и неполное покрытие элементов исходного экрана. Полный набор приложений дизайн-кита пока не реализован.

Этот отчёт охватывает инвентаризацию проекта, доступные разделы Figma, измерения выбранных экземпляров и проверки всех историй. **Это не сертификат попиксельного совпадения каждого варианта.** Прямые измерения выполнены для перечисленных ниже экземпляров; остальные строки матрицы подтверждают наличие и прохождение тестов, а не визуальное совпадение с Figma. Ни процент соответствия, ни отсутствие других расхождений из выборки не выводятся.

## Подтверждённые расхождения и неполное воспроизведение Dashboard

| ID | Приоритет | Эталон → реализация | Где | Действие |
| --- | --- | --- | --- | --- |
| D01 | P2 | RightSidebar: padding 16 px и gap 16 px → padding 20 px и gap 24 px. Ширина 280 px совпадает. | [right-panel.tsx](../apps/demo/components/shell/right-panel.tsx#L78) | Поставить `p-4 gap-4`, проверить обе темы. Storybook-рецепт уже использует эти значения. |
| D02 | P2 для точного воспроизведения | KPI: высота 108 px → 148 px. Добавлен Sparkline 32 px с промежутком 8 px; контент ниже смещается на 40 px. В демо названия KPI также имеют weight 600, в рецепте — 400; макет визуально соответствует regular. | [kpi-cards.tsx](../apps/demo/components/dashboard/kpi-cards.tsx#L22) | Для режима соответствия макету убрать Sparkline из этих карточек и вернуть regular. Если расширение требуется, обозначить его как отдельный вариант демо. Значение weight в оригинальной текстовой ноде требует отдельного измерения. |
| D03 | P2, покрытие экрана | В Figma у графика есть Total Users / Total Projects / Operating Status и легенда в верхнем ряду. В демо есть только заголовок Total Users; легенда находится отдельной строкой ниже. | [dashboard/page.tsx](../apps/demo/app/(app)/dashboard/page.tsx#L42), [charts.tsx](../apps/demo/components/dashboard/charts.tsx#L44) | Добавить композицию вкладок и легенды либо явно определить экран как упрощённый. Данные и поведение других вкладок не реализованы. |
| D04 | P2, покрытие экрана | Today с раскрывающей стрелкой в Figma → статический текст без стрелки и выбора периода. | [dashboard/page.tsx](../apps/demo/app/(app)/dashboard/page.tsx#L35) | Вернуть управляющий элемент выбора периода, если нужен полноценный экран. Наличие стрелки в рецепте не означает, что там реализован выбор периода. |
| D05 | P3, расчёт геометрии | В Figma Popover имеет inside stroke 1 px и padding 12 px. Общая CSS-поверхность использует настоящий `border: 1px` плюс padding 12 px: начало контента находится в 13 px от внешней границы. | [surface.ts](../packages/ui/src/components/Popover/surface.ts#L8) | Проверить внутреннюю геометрию на совпадающей ширине; для точного соответствия заменить рамку на inset ring, сохранив обводку в forced-colors. Это вывод из модели CSS и измерений панели, не результат попиксельного diff. |

Приоритеты описывают влияние на соответствие макету, а не тяжесть функциональной ошибки. D02–D04 могут быть намеренными адаптациями демо; найденные отличия не подтверждают, что их нужно удалить из продукта без выбора целевого варианта.

### Измерения браузера

Демо собрано из текущего кода через webpack и открыто при 1440×1024:

- четыре KPI-карточки: height 148 px, padding 24 px, radius 20 px; заголовки font-weight 600;
- правая панель: width 280 px, padding 20 px, gap 24 px;
- меню темы: border 1 px, padding 12 px, `box-sizing: border-box`;
- Dashboard, Sign in и Settings при 390×844: ширина документа 390 px, горизонтального переполнения страницы не обнаружено; Settings использует прокрутку списка вкладок.

Первоначальный снимок графика был сделан во время анимации. После завершения анимации линии доходят до последних точек; это не внесено в дефекты.

## Проверенные экземпляры Figma

Измерения сняты из панели свойств, без изменения размеров, вариантов и значений макета. Они относятся к выбранным экземплярам, не ко всем вариантам компонента. Размеры контейнеров контента часто зависят от текста и не являются фиксированными требованиями API.

| Экземпляр | Наблюдение в Figma | Сопоставление |
| --- | --- | --- |
| Button Medium, Filled/Outline, Default/Hover | min height 36, gap 6, padding 16/8, radius 16; outline 0.5 px | Основная геометрия соответствует `Button`; inspected экземпляры были Medium. |
| Input, 2 row vertical, Static | height 68, gap 8, padding 16/12, radius 16, Surface/1, stroke Black/20% 0.5 px | Соответствует структуре Input с title и readOnly. |
| Textarea, Static | height 44, padding 16/12, radius 16, stroke 0.5 px | Соответствует базовому однострочному Textarea. |
| Card, Count 4, Default | gap 4, padding 16/12, radius 16, Surface/1 | Поверхность соответствует default Card; контент и его gap задаёт композиция. |
| Popover, Count 8 | padding 12, radius 16, Background/3, Surface/1 inside stroke 1 px | Цвет, padding и radius представлены общей поверхностью; см. D05. |
| DatePicker, Date range | экземпляр 360×360, radius 16, Background/3, Surface/1 inside stroke | Библиотечный Calendar/DateRangePicker соответствует той же основе, но размер календаря и цели взаимодействия адаптированы. Не подтверждено равенство 360×360. |
| Toast, Failure | height 24, gap 4, padding 8/4, radius 16, White/10% поверх Black/80% | Соответствует геометрии small Toast; поведения таймера и закрытия отличаются намеренно. |
| Search, Typing, Focus | height 28, gap 8, padding 8/4, radius 16, stroke Black/40% 0.5 px | Соответствует компактному полю; контраст shortcut и clear адаптирован. |
| Icon, Size 12 | glyph 12×12, без padding | IconBox поддерживает 12; иконки принимают произвольный числовой size. Отсутствие 12 в пресетах icons не означает отсутствие поддержки. |
| Text, Count 1 | height 20, без padding, radius 12 | Соответствует основе Text; конкретную типографику нужно проверять на дочерней текстовой ноде. |
| IconText, Size 16, Static | height 20, gap 8, radius 12 | Совпадает с основой IconText. |
| Frame, Default | заменяемое содержимое IconText, gap 8, radius 12 | Реализуется через interactive/active на IconText, отдельный экспорт Frame не требуется. |
| Group, Count 8 | height 24, gap 8, radius 12 | Совпадает с основой Group. |
| Tag, Right arrow, Hover | height 20, horizontal gap −8 | В библиотеке есть стрелочные варианты; все положения стрелок отдельно не измерены. |
| Badge, Number | height 18, padding 6/1, radius 80, Secondary/Indigo | Геометрия соответствует BadgeComponent; цвет числа изменён ради контраста. |
| Strip, Count 1 | thickness 2, gap 8 | Представлено в Strip; длина зависит от композиции. |
| Line, Vertical, Count 1 | thickness 1, height экземпляра 80 | Представлено в Separator; hairline — отдельный вариант для dashboard. |
| Tooltip Dark, Count 2 | height 24, radius 12 | Есть в Tooltip; padding вложенного контента по этому измерению не подтверждён. |
| Tab, Large, Solid, Active | height 48, gap 4 | Соответствует большому segmented варианту; дочерние состояния не измерены отдельно. |
| Dashboard Header | padding 28/20, Black/10% inside stroke 0.5 px | Отступы совпадают с AppHeader на desktop. |
| Dashboard Sidebar | padding 16, вертикальный gap 8, stroke 0.5 px | Части AppSidebar переорганизованы; полное равенство всех внутренних промежутков не подтверждено. |
| Dashboard RightSidebar | padding 16, gap 16, stroke 0.5 px | Подтверждён D01. |

Просмотрены страницы компонентов: Icon, Text, IconText, Frame, Group, Button, Tag/Badge, Strip/Line, Input/Form, Card, Popover, Chart, DatePicker, Toast, Search, Table, Tooltip, Tab/Segmented. Основы: палитра, размеры/радиусы и коллекции переменных. Локальная коллекция переменных в копии пуста: значения экземпляров ссылаются на внешнюю библиотеку. Полного независимого экспорта палитры для сравнения каждого токена в этой сессии не получено.

## Отличия, которые нельзя автоматически считать ошибками

Эталон правил проекта — [Accessibility deviations](../packages/ui/README.md#accessibility-deviations-from-the-figma-kit) и документация конкретных компонентов. В частности:

- secondary text темнее, focus-ring заметнее, минимальная область нажатия 24×24;
- контрастные indigo/red labels, номера Badge, отметки Checkbox и цвета выбранных элементов;
- дополнительные признаки today и selected, отличия Calendar в dark mode;
- invalid-state, reduced motion, forced-colors и high-contrast;
- Toast с действием может оставаться бессрочно и имеет закрытие; scrollbar остаётся видимым для клавиатуры и touch;
- disabled-состояния 5.x отличаются от opacity 20% и arrow cursor кита; смена уже запланирована на 6.0;
- Alert, AlertDialog, Combobox/MultiSelect и некоторые другие компоненты — расширения библиотеки, а не отдельные исходные компоненты кита;
- initials вместо фотографий, mock data, элементы переключения языка/направления — адаптации демо;
- Settings в приложении — страница с четырьмя вкладками; исходный Settings содержит более широкий набор сценариев и popup-композиций;
- мобильные макеты кита включают платформенные элементы и нижнюю навигацию. Responsive web demo не является их точной реализацией.

Режимы плотности Expanded/Condensed пока остаются в roadmap. Это известный пробел возможностей, а не новое расхождение одного компонента. Перед повторным использованием roadmap как статуса его нужно актуализировать: некоторые перечисленные там пункты уже реализованы.

## Покрытие полного дизайн-кита

В демо имеются `/dashboard`, `/sign-in`, `/settings`. Следующие группы найдены в слоях Figma, но не представлены полноценными маршрутами:

| Группа | Примеры отсутствующих экранов/сценариев |
| --- | --- |
| Dashboards | Projects, eCommerce |
| Project | Targets, Users, Activity, Overview, Budget, Files, Settings |
| Account | Overview, Billing, API Keys, Referrals, Logs, Security, Statements |
| Authentication | Sign Up, Forgot Password, Setup New Password, Verification, Authenticator app, Backup code, Choose Account Type, Account Info, Billing Details |
| Settings | Change password/email/name, Log out of all devices, Delete account, 2-step verification, Privacy, Payment, Plugins |
| Другие страницы | User List, User information, Mail/Compose, Chat, Contacts, Pricing, Invoice, Coming Soon, Maintenance, No data, Add data, Error Page |
| Отдельные продукты | Email template, ChatGPT, AI Chat, Copilot, Social media app; iOS/macOS и мобильные варианты |

Это список обнаруженных групп, не полный поштучный каталог всех фреймов и их состояний. Листы Figma виртуализированы; наличие группы подтверждено просмотром, число всех фреймов не вычислялось. Отсутствующие страницы нужно оценивать как отдельный backlog, не включать в процент соответствия библиотеки.

## Матрица и проверки

[Матрица покрытия](design-audit-2026-10-06-coverage.csv) содержит все группы историй свежей сборки: количество stories, ссылки Figma из исходников, наличие скриншотов и уровень прямой проверки. Пустая ссылка не доказывает отсутствие дизайна: она может быть задана через другой источник или компонент является расширением.

| Проверка | Результат |
| --- | --- |
| `bun run build:storybook` | Успешно; 561 story, 75 docs entries; registry: 76 items. |
| Инвентарь UI | 58 групп историй, 53 stories-файла, 58 MDX-страниц. |
| Icons | 49 собственных definition-файлов; 50 stories, включая общую галерею. |
| `bun run test:storybook` | 201 test file, **1683 passed**; проекты light, dark и preferences. Это проверки render/play/a11y, не сравнение с Figma. |
| Visual baselines | 1030 PNG в репозитории. 543 истории допускают visual-тесты; ещё 18 имеют skip-visual. Для историй с закреплённой темой тест пропускает другую тему. PNG не являются изображениями исходного дизайна. |
| Pixel regression suite | Не запускалась; Linux/Docker-сравнение с baselines не заменяет сравнение с Figma. |
| Пакеты в `build:all` | Сборка пакетов завершилась; demo Turbopack затем не смог привязать локальный порт. |
| Демо, стандартный Turbopack | Не подтверждено: локальная среда дважды вернула `Operation not permitted` на binding port. |
| Демо, `bun run build --webpack` | Успешно; использовано для визуального просмотра. |
| Демо E2E | **19 поведенческих/page/a11y проверок passed**. Три проверки first-load JS failed на webpack; пропущенные serial-тесты запущены отдельно. |
| Dashboard JS | 461.6 KiB compressed, бюджет <420. |
| Settings JS | 327.3 KiB compressed, бюджет <290. |
| Sign in JS | 339.1 KiB compressed, бюджет <275. |

Бюджеты JS измерены для **webpack**, поэтому они не подтверждают регрессию штатной Turbopack-сборки. Для окончательного вывода о release build нужны сборка и повторный замер штатным bundler. Пороговые значения в ходе сверки не менялись.

## Следующие шаги к строгой визуальной приёмке

1. Исправить D01; решить, нужен ли исходный или расширенный вариант KPI (D02).
2. Определить полноту Dashboard и реализовать вкладки/период (D03–D04), если они входят в целевой экран.
3. Уточнить inside-stroke геометрию D05 на одинаковой ширине с дочерними нодами Figma.
4. Зафиксировать сопоставление каждого варианта Figma ↔ story, включая light/dark, hover/focus/selected/disabled и responsive. Наличие 561 истории не гарантирует покрытие всех вариантов Figma.
5. Отдельно снять исходные значения всех цветовых, типографических и effect tokens из внешней библиотеки; проверить дочерние текстовые стили и геометрию иконок. Лицензированные скриншоты не добавлять в репозиторий.
6. Провести попиксельную приёмку по этому сопоставлению и прогнать существующие regression-тесты после правок.

## Реализация после сверки

Ниже — обновление результата; таблицы выше фиксируют исходное состояние до правок.

- Dashboard: восстановлены 108px KPI без sparklines, три переключаемые метрики, выбор периода, колонка Traffic by Website шириной 200px и сегменты полос, отступы правой панели 16px. Таблица заказов перенесена на `/orders`.
- Sign In: восстановлены композиция и размеры макета (карточка 680px, форма 384px, поля и social buttons 40px), порядок Apple/Google, header/footer. Дополнительные поля убраны.
- Реализованы оба Settings: Account → Settings на `/settings`, отдельная панель на `/preferences` со всеми семью разделами. Имя, email и уведомления разделяют состояние и сохраняются локально.
- Библиотека: inside-stroke у Popover, одиночный focus-ring 4px, default cursor при disabled, hover Link без добавочного подчёркивания, today без добавочной точки в обычных темах, Scheduler today без добавочного semibold. `aria-current` и forced-colours остаются.
- Цветовые поправки для контраста сохранены. Найденные axe проблемы новых композиций устранены без изменения геометрии.

### Границы подтверждения

Это инвентаризация всей существующей Storybook-библиотеки и визуальная сверка перечисленных экранов/образцов, **не сертификат попиксельного равенства каждого варианта всего Figma kit**. CSV явно отмечает варианты, для которых есть только инвентаризация.

Фотоаватары остаются инициалами; некоторые логотипы представлены векторными иконками. Для Account-пунктов Statements, Referrals, API Keys, Logs восстановлены подписи, но соответствующие страницы отсутствуют в приложении, источник задаёт их внешний вид, но не маршруты. Платёжные, security, logout и plugin actions демонстрационные; нет реального backend. Font size и accent сохраняют выбранное значение, но не меняют глобальные типографические/цветовые токены.

Стандартная Turbopack-сборка по-прежнему не подтверждена из-за локального `Operation not permitted`; production demo проверяется через webpack. Прежние замеры first-load JS выше относятся к исходной webpack-сборке, бюджеты не ослаблялись.

### Проверки после изменений

- Package/unit suites: 2016 passed (UI 1440, icons 120, charts 87, registry 267, scripts 102).
- Storybook: 1683 сценария проверены в light/dark/preferences. Первоначально 10 проверок ожидали старый outline/today-dot/border offset; после обновления контрактов все соответствующие повторные прогоны прошли.
- Demo E2E: 24 passed. Дополнительная axe-проверка всех семи Settings разделов в обеих темах passed. После последней правки размеров Sign In его четыре form/page/a11y сценария дополнительно passed.
- Lint, typecheck пакетов и demo, сборка пакетов и Storybook — passed. Demo webpack — passed.
- Visual update в Linux/arm64: 1030 passed, 56 intentional skips; изменены 183 baseline изображения. Повторный независимый compare: 1030 passed, 56 intentional skips, без неожиданных отличий.
- Проверенные реальные размеры в браузере: KPI 108px, Traffic by Website width 200px, Settings panel 1176×664, Sign In fields 384×40, social buttons height 40.
- Responsive: при viewport 390×844 отдельная панель не расширяет страницу, список разделов прокручивается горизонтально.
- Current webpack first-load JS: Dashboard 460.3 KiB (budget 420), Settings 339.8 KiB (290), Sign In 336.3 KiB (275) — budget tests failed. Эти данные не подтверждают штатный Turbopack build; пороги не менялись.



## Проверка ветки 6.0

Проверены локальные branches/worktrees, актуальный `git ls-remote --heads origin` и версии package manifest во всех существующих branch refs. Ветки `next` и версии 6.x сейчас не обнаружены. `main` и `release` содержат UI 5.3.0; `develop` — старую 0.1.9. ROADMAP предусматривает 6.0 на `next`, но текущие refs этого не подтверждают. Тег 0.6.0 относится к прежнему пакету. Текущие правки выполнены поверх `main`; commit/push не выполнялись.
