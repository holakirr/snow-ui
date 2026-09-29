/**
 * The demo's user preferences.
 *
 * - Language and direction are cookies: the root layout (a Server Component)
 *   reads them to render `<html lang dir>` and the translated server markup,
 *   so a reload never flashes the other language or direction.
 * - The theme is in localStorage and applied by an inline script before the
 *   first paint (see `themeScript`); the server doesn't need it, because the
 *   SnowUI tokens switch on `data-theme` in CSS.
 */

export const LANGS = ['en', 'ru'] as const
export type Lang = (typeof LANGS)[number]

export const DIRS = ['ltr', 'rtl'] as const
export type Dir = (typeof DIRS)[number]

export const THEMES = ['light', 'dark', 'system'] as const
export type Theme = (typeof THEMES)[number]

export const LANG_COOKIE = 'snow-demo-lang'
export const DIR_COOKIE = 'snow-demo-dir'
export const THEME_STORAGE_KEY = 'snow-demo-theme'

/** One year: the preference cookies outlive the session. */
export const PREFERENCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const DEFAULT_LANG: Lang = 'en'
export const DEFAULT_DIR: Dir = 'ltr'

/** The locale of `Intl` formatting (numbers, dates) in each language. */
export const intlLocale = (lang: Lang) => (lang === 'ru' ? 'ru-RU' : 'en-US')

export const isLang = (value: unknown): value is Lang =>
  LANGS.includes(value as Lang)
export const isDir = (value: unknown): value is Dir =>
  DIRS.includes(value as Dir)
export const isTheme = (value: unknown): value is Theme =>
  THEMES.includes(value as Theme)

/**
 * Runs in `<head>` before the body is parsed: pins `data-theme` on `<html>`
 * when the user picked light or dark. Without it (system) the SnowUI tokens
 * follow `prefers-color-scheme`.
 *
 * A literal, with no interpolation: nothing but this source ends up in the
 * inline script (CodeQL flags interpolated values). The key must match
 * `THEME_STORAGE_KEY`.
 */
export const themeScript =
  '(function(){try{var t=localStorage.getItem("snow-demo-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()'
