import { DefaultIconWeights } from '../defs/DefaultIcon'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const DefaultIcon: Icon = (props) => (
  <IconBase {...props} weights={DefaultIconWeights} />
)

export { DefaultIcon }
