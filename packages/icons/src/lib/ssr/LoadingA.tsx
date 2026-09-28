import { LoadingAWeights } from '../defs/LoadingA'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

// The only stroke-based icon: it draws with `stroke`, so it opts into a root stroke matching `color`.
const LoadingAIcon: Icon = ({ color = 'currentColor', ...props }) => (
  <IconBase stroke={color} {...props} color={color} weights={LoadingAWeights} />
)

export { LoadingAIcon }
