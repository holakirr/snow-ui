import { cookies } from 'next/headers'
import {
  DEFAULT_DIR,
  DEFAULT_LANG,
  DIR_COOKIE,
  type Dir,
  isDir,
  isLang,
  LANG_COOKIE,
  type Lang,
} from '../preferences'
import { type Dictionary, getDictionary } from './dictionaries'

export type RequestPreferences = {
  lang: Lang
  dir: Dir
  dict: Dictionary
}

/**
 * The language and direction of this request (from the preference cookies)
 * and the matching dictionary, for Server Components. Reading cookies makes
 * the route dynamic, which is what lets the server render the right language
 * with no flash.
 */
export const getRequestPreferences = async (): Promise<RequestPreferences> => {
  const store = await cookies()
  const langCookie = store.get(LANG_COOKIE)?.value
  const dirCookie = store.get(DIR_COOKIE)?.value
  const lang = isLang(langCookie) ? langCookie : DEFAULT_LANG
  const dir = isDir(dirCookie) ? dirCookie : DEFAULT_DIR
  return { lang, dir, dict: getDictionary(lang) }
}
