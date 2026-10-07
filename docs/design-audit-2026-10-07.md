# Сверка SnowUI с исходным дизайном — 7 октября 2026

Эталон: лицензированная копия SnowUI в Figma, полная локальная копия `/private/tmp/SnowUI.fig`, экспорт Overview SVG. Цвета для контраста сохранены по согласованию. Изменения находятся в рабочей директории; commit/push не выполнялись.

## Реализованный объём

Существующая библиотека и демо: Dashboard, Sign In A, Account Settings, отдельный Settings с семью разделами. Страницы остальных приложений дизайн-кита в согласованный объём не входят. Расширения библиотеки без собственного аналога в Figma используют те же исходные поверхности и типографику.

| Область | Проверенный источник и результат |
| --- | --- |
| Dashboard | 32546:96098/master33534:50040: KPI202×108, TotalUsers662×330, Website202×330, нижние блоки432×280, Marketing892×280. Header68, sidebar212, right280/p16/gap16. Восстановлены меню, порядок контактов и исходные activity avatars. |
| Графики | Исходные кривые614×246 и четыре Donut-сектора перенесены из SVG; native data plot не дублирует artwork. Сохранены keyboard navigation, tooltip и доступная таблица. Device28px и высоты84/147/105/168/63/126; Marketing28px, исходный повторяющийся ряд168/84/147/105/63/126. |
| Sign In A | 32546:96142/master33534:111740: карточка680×656, x380/y184 при1440×1024, форма384, social184×40/gap16, header60, footerbottom24. Исходные Apple/Google, flower и wordmark. |
| Account Settings | 32546:96111/master33534:158525: ширина892, шесть карточек556/272/268/276/316/192; началоy144, footer948×56/y2164, полная высота2220. Восстановлены вложенные отступы, разделители, checkbox20, Skill76, notice84/64/68. |
| Settings popup | Profile30919:278108/master33509:79305 —1176×664; другие разделы676. Все семь вкладок просмотрены в light/dark. Theme previews80×48, font control320×56, payment cards264×140, payment/plugin logos40, исходный градиент. |
| Ресурсы | Восемь оригинальных портретов, пять activity avatars, десять брендовых логотипов и wordmark. Пути SVG и пиксели портретов сохранены; добавлены SVG title для lint/accessibility. Происхождение описано в public/ASSETS.md. |
| Компоненты | Убраны active-scale Button, лишняя постоянная высота underline Tabs, добавочный padding counted Textarea. Rich Tooltip255×108/description169×40/radius12. DatePicker header56, пропорциональная ширина частей даты. Chip padding8/2. Image icon inset по каждому исходному размеру. Popover inside stroke, focus-ring, Link, Calendar и Scheduler проверены ранее и сохранены. |

## Варианты и состояния

[Матрица исходных вариантов](design-source-variants-2026-10-07.csv) содержит 573 прямых SYMBOL-узла с их размерами, padding, gap, radius и дочерней типографикой. Она получена из полной копии, а не из списка Storybook. Для instance-композиций применялись derivedSymbolData и отдельная визуальная сверка: значения базового мастера без overrides не использовались как доказательство размеров экземпляра.

Сопоставление семейств: Button — Size/Variant/State/Icons; Input — три расположения title и Static/Default/Hover/Focus; Search/InputSmall — fill/stroke/focus; Tag — четыре состояния, обе стрелки и комбинации иконок; Chip — семь цветов, два размера, с/без фона; Image — размеры12–80/free, Icon/Option/Default/Hover/Selected; Card — Count/State; Popover — Count; Toast — размер/status; Tabs — size/underline/solid/active; Group — count/orientation/reverse; Checkbox/Radio/Switch — выбор и hover; Slider — bar/range/active; Tooltip — светлый/тёмный и plain/description/rich; DatePicker — date/range/time. Табличные, popup и search-композиции используют эти исходные примитивы.

CSV фиксирует исходные параметры. Он не является попиксельным diff каждого Storybook-сценария: размеры произвольного текста, пользовательских изображений и контента API зависят от композиции. Регрессионные PNG проверяют стабильность реализации и рассматриваются отдельно от исходного дизайна.

## Проверки

- Полный Storybook: 1683 passed в light/dark/preferences.
- Unit UI/charts: 1527 passed (1440+87).
- SSR: 450 render +449 hydrate passed после последних правок Chip/Image.
- Types пакетов и корневого проекта passed; lint всего проекта и git diff --check passed.
- Пакеты: build, attw и publint passed. Storybook build и registry76 passed.
- Demo production webpack: passed. 29 E2E passed; включает обе темы, axe, взаимодействия/сохранение, mobile390, исходные размеры карточек/Sign In/графиков и проверку отсутствия дублированных линий.
- Полный Linux/arm64 visual compare:1014 passed,56 intentional skips;16 ожидаемых различий DateRangePicker/Recipes Dashboard просмотрены и обновлены, независимый повторный compare этих групп:26 passed/2 skip. Все1030 применимых снимков подтверждены полным прогоном и повтором затронутых групп.

## Практические границы

Демо использует локальное состояние и демонстрационные действия; реального backend для authentication/payment/plugins нет. Мобильная версия — адаптивная web-композиция существующих страниц. Исходные платформенные iOS/macOS приложения не входят в задачу.

Native scrollbars зависят от движка: WebKit —4px thumb/8px hover, Firefox —native thin. Восстановлено исходное скрытие до hover, с сохранением focus-within. CSS corner-shape для Image зависит от поддержки браузером; сглаживание углов и rasterization текста не являются попиксельным совпадением Figma на всех движках.

Turbopack в этой среде возвращает Operation not permitted при binding port, включая запуск с escalation. Проверена production-сборка webpack. JS budgets не ослаблялись.

Финальные first-load JS (compressed): Dashboard388.3KiB при бюджете420, Settings280.1KiB при290, SignIn218.7KiB при275. Все пороги passed без ослабления. Итоговая дополнительная проверка полного Account Settings фрейма и сохранения скриншотов:2 passed.
