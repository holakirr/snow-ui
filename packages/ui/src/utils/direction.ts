/**
 * A logical side (`start` / `end`) as the physical side for the text
 * direction; physical sides are returned as they are.
 */
export const resolveSide = <S extends string>(
  side: S | 'start' | 'end',
  dir: 'ltr' | 'rtl',
): Exclude<S, 'start' | 'end'> | 'left' | 'right' => {
  if (side === 'start') return dir === 'rtl' ? 'right' : 'left'
  if (side === 'end') return dir === 'rtl' ? 'left' : 'right'
  return side as Exclude<S, 'start' | 'end'>
}
