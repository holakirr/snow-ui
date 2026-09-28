import { RightBarWeights } from '../defs/RightBar'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const RightBarIcon: Icon = (props) => (
  <IconBase {...props} weights={RightBarWeights} />
)

export { RightBarIcon }
