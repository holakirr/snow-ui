import { twMerge } from 'tailwind-merge'
import { ROLES } from '../../constants'

/**
 * Link component displays a link with a hover underline effect.
 */
const Link = ({ className, ...props }: React.ComponentProps<'a'>) => (
  <a
    className={twMerge(
      'cursor-pointer text-black/40 hover:text-black  focus:underline focus:text-black transition-all relative text-xs',
      className,
    )}
    role={ROLES.link}
    tabIndex={0}
    {...props}
  />
)

Link.displayName = 'Link'
export { Link }
