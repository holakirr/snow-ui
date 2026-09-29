'use server'

import { cookies } from 'next/headers'
import {
  DIR_COOKIE,
  type Dir,
  isDir,
  isLang,
  LANG_COOKIE,
  type Lang,
  PREFERENCE_COOKIE_MAX_AGE,
} from '@/lib/preferences'

const cookieOptions = {
  path: '/',
  maxAge: PREFERENCE_COOKIE_MAX_AGE,
  sameSite: 'lax',
} as const

/**
 * Server Actions that store the language and direction. Setting a cookie in
 * an action re-renders the current route, so `<html lang dir>`, the
 * `SnowUIProvider` props and every translated Server Component update in the
 * same round trip.
 */
export async function setLanguage(lang: Lang) {
  if (!isLang(lang)) return
  ;(await cookies()).set(LANG_COOKIE, lang, cookieOptions)
}

export async function setDirection(dir: Dir) {
  if (!isDir(dir)) return
  ;(await cookies()).set(DIR_COOKIE, dir, cookieOptions)
}
