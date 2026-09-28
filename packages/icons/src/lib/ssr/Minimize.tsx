import { MinimizeWeights } from '../defs/Minimize'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const MinimizeIcon: Icon = (props) => (
  <IconBase {...props} weights={MinimizeWeights} />
)

export { MinimizeIcon }
