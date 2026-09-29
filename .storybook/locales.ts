import { ru } from 'react-day-picker/locale'
import type {
  Messages,
  SnowUIProviderProps,
} from '../packages/ui/src/components/SnowUIProvider'

/**
 * An example translation of every built-in string (`Messages`), used by the
 * Storybook "Locale" toolbar. It isn't part of the package: apps own their
 * translations. Messages with values are functions, so a translation can
 * inflect: Russian has three plural forms.
 */
const ruPlural = new Intl.PluralRules('ru')
const YEAR_FORMS: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: 'год',
  few: 'года',
}
const years = (count: number) => YEAR_FORMS[ruPlural.select(count)] ?? 'лет'

export const ruMessages: Messages = {
  alert: {
    dismiss: 'Закрыть',
    info: 'Информация',
    success: 'Успешно',
    warning: 'Предупреждение',
    error: 'Ошибка',
  },
  alertDialog: {
    cancel: 'Отмена',
  },
  avatarGroup: {
    more: (count) => `Ещё ${count}`,
  },
  badge: {
    label: 'Значок уведомления',
  },
  breadcrumb: {
    label: 'Навигационная цепочка',
    more: 'Другие страницы',
  },
  calendar: {
    navigation: 'Навигация по месяцам',
    previousMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    today: 'Сегодня',
    lastSelection: 'Последний выбор',
    previousYears: (count) => `Предыдущие ${count} ${years(count)}`,
    nextYears: (count) => `Следующие ${count} ${years(count)}`,
  },
  charts: {
    empty: 'Нет данных',
    loading: 'Загрузка диаграммы',
    keyboardHint: 'Стрелки влево и вправо переходят между точками данных.',
    navigation: 'Точки данных',
    value: 'Значение',
    point: 'Точка',
  },
  combobox: {
    empty: 'Ничего не найдено',
    loading: 'Загрузка',
    clear: 'Очистить',
    create: (query) => `Создать «${query}»`,
    selected: (labels) => `Выбрано: ${labels.join(', ')}`,
    removed: (label) => `Удалено: ${label}`,
    required: 'Выберите элемент из списка.',
    requiredMultiple: 'Выберите хотя бы один элемент из списка.',
  },
  commandPalette: {
    label: 'Поиск',
    placeholder: 'Поиск',
    empty: 'Ничего не найдено',
    loading: 'Загрузка',
  },
  datePicker: {
    placeholder: 'Выберите дату',
    rangePlaceholder: 'Выберите период',
    dialog: 'Выбор даты',
    rangeDialog: 'Выбор периода',
    clear: 'Очистить дату',
    range: (start, end) => `${start} – ${end}`,
  },
  dialog: {
    close: 'Закрыть',
  },
  link: {
    external: '(откроется в новой вкладке)',
  },
  pagination: {
    label: 'Навигация по страницам',
    previous: 'Предыдущая страница',
    next: 'Следующая страница',
    more: 'Другие страницы',
  },
  progress: {
    label: 'Ход выполнения',
    // Russian puts a (narrow no-break) space before the percent sign.
    value: (value, max) => `${Math.round((value / max) * 100)}\u202f%`,
  },
  search: {
    placeholder: 'Поиск',
    clear: 'Очистить поиск',
  },
  sheet: {
    close: 'Закрыть',
  },
  sidebar: {
    toggle: 'Показать или скрыть боковую панель',
    title: 'Боковая панель',
    description: 'Боковая панель на мобильных устройствах.',
  },
  slider: {
    minimum: (label) => `${label}, минимум`,
    maximum: (label) => `${label}, максимум`,
    thumb: (label, position, count) => `${label}, ${position} из ${count}`,
  },
  spinner: {
    label: 'Загрузка',
  },
  tag: {
    remove: (label) => `Удалить тег ${label}`,
  },
  toast: {
    close: 'Закрыть',
    label: 'Уведомление',
    region: 'Уведомления ({hotkey})',
  },
}

export type StoryLocale = 'en' | 'ru'

/** The `SnowUIProvider` props of each toolbar locale. */
export const storyLocales: Record<
  StoryLocale,
  Pick<SnowUIProviderProps, 'messages' | 'locale'> & { lang: string }
> = {
  // The defaults: English messages, date-fns' enUS.
  en: { lang: 'en' },
  // react-day-picker's locales extend date-fns' with translated day labels.
  ru: { lang: 'ru', messages: ruMessages, locale: ru },
}
