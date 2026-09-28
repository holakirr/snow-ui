import { ArrowFallWeights } from '../defs/ArrowFall'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const ArrowFallIcon: Icon = (props) => (
  <IconBase {...props} weights={ArrowFallWeights} />
)

export { ArrowFallIcon }
