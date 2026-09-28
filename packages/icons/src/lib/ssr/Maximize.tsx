import { MaximizeWeights } from '../defs/Maximize'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const MaximizeIcon: Icon = (props) => (
  <IconBase {...props} weights={MaximizeWeights} />
)

export { MaximizeIcon }
