import { XCircleWeights } from '../defs/XCircle'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const XCircleIcon: Icon = (props) => (
  <IconBase {...props} weights={XCircleWeights} />
)

export { XCircleIcon }
