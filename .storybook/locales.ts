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
const RESULT_FORMS: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: 'результат',
  few: 'результата',
}
const results = (count: number) =>
  RESULT_FORMS[ruPlural.select(count)] ?? 'результатов'

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
    results: (count) => `${count} ${results(count)}`,
  },
  datePicker: {
    placeholder: 'Выберите дату',
    rangePlaceholder: 'Выберите период',
    dialog: 'Выбор даты',
    rangeDialog: 'Выбор периода',
    clear: 'Очистить дату',
    range: (start, end) => `${start} – ${end}`,
    date: 'Дата',
    startDate: 'Дата начала',
    endDate: 'Дата окончания',
    time: 'Время',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    year: 'Год',
    month: 'Месяц',
    day: 'День',
    hour: 'Часы',
    minute: 'Минуты',
    second: 'Секунды',
    dayPeriod: 'AM/PM',
    empty: 'Пусто',
    thisMonth: 'Этот месяц',
    thisYear: 'Этот год',
    systemTime: 'Текущее время',
    back: 'Назад',
    chooseMonth: (month) => `${month}, выбрать месяц`,
    chooseYear: (year) => `${year}, выбрать год`,
    previousYear: 'Предыдущий год',
    nextYear: 'Следующий год',
  },
  dialog: {
    close: 'Закрыть',
  },
  dropdownMenu: {
    search: 'Поиск',
    empty: 'Ничего не найдено',
  },
  input: {
    clear: 'Очистить',
    progress: 'Проверка',
    success: 'Верно',
  },
  link: {
    external: '(откроется в новой вкладке)',
  },
  listCards: {
    notifications: 'Уведомления',
    activities: 'Активность',
    contacts: 'Контакты',
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
    // Russian puts a (narrow no-break) space before the percent sign.
    value: (value, min, max) =>
      `${Math.round(max > min ? ((value - min) / (max - min)) * 100 : 0)}\u202f%`,
  },
  spinner: {
    label: 'Загрузка',
  },
  table: {
    filtered: 'Отфильтровано',
    selected: (count) => `Выбрано: ${count}`,
    delete: 'Удалить',
    duplicate: 'Дублировать',
    copy: 'Копировать',
    copied: 'Скопировано',
    pageSize: 'Строк на странице',
    results: (count) => `${count} ${results(count)}`,
    loadingMore: 'Загрузка строк',
  },
  tag: {
    remove: (label) => `Удалить тег ${label}`,
  },
  textarea: {
    count: (length, maxLength) =>
      maxLength === undefined
        ? `Символов: ${length}`
        : `Символов: ${length} из ${maxLength}`,
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
