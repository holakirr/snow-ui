import type { Messages } from '@holakirr/snow-ui'

/**
 * Russian translations of the SnowUI components' built-in strings. Messages
 * with values are functions, so this module is only imported by the client
 * `Providers` (a Server Component can't pass functions to a client one).
 * English uses the library's defaults.
 */
const ruPlural = new Intl.PluralRules('ru')
const years = (count: number) => {
  const form = ruPlural.select(count)
  return form === 'one' ? 'год' : form === 'few' ? 'года' : 'лет'
}

export const ruMessages: Messages = {
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
  commandPalette: {
    label: 'Поиск',
    placeholder: 'Поиск',
    empty: 'Ничего не найдено',
    loading: 'Загрузка',
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
  tag: {
    remove: (label) => `Удалить тег ${label}`,
  },
  toast: {
    close: 'Закрыть',
    label: 'Уведомление',
    region: 'Уведомления ({hotkey})',
  },
}
