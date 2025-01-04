import { twMerge } from 'tailwind-merge'
import { ROLES } from '../../constants'

/**
 * Link component displays a link with a hover underline effect.
 */
const Link = ({ className, ...props }: React.ComponentProps<'a'>) => (
  <a
    className={twMerge(
      'cursor-pointer text-black hover:underline underline-offset-4 hover:text-indigo focus:underline focus:text-indigo transition-all relative',
      className,
    )}
    role={ROLES.link}
    tabIndex={0}
    {...props}
  />
)

Link.displayName = 'Link'
export { Link }
