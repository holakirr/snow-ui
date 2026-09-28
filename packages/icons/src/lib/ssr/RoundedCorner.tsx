import { RoundedCornerWeights } from '../defs/RoundedCorner'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const RoundedCornerIcon: Icon = (props) => (
  <IconBase {...props} weights={RoundedCornerWeights} />
)

export { RoundedCornerIcon }
