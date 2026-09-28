import { HorizontalScreenWeights } from '../defs/HorizontalScreen'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const HorizontalScreenIcon: Icon = (props) => (
  <IconBase {...props} weights={HorizontalScreenWeights} />
)

export { HorizontalScreenIcon }
