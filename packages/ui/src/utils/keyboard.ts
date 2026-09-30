import type { KeyboardEvent } from 'react'

/**
 * Whether a key belongs to an IME composition: `isComposing`, or the
 * `keyCode` 229 WebKit gives the Enter that commits one (it arrives after
 * `compositionend`, with `isComposing` false: WebKit bug 165004).
 */
export const isComposingKey = (event: KeyboardEvent<HTMLElement>) =>
  event.nativeEvent.isComposing || event.keyCode === 229
