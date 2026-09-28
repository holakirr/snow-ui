import { VariablesWeights } from '../defs/Variables'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const VariablesIcon: Icon = (props) => (
  <IconBase {...props} weights={VariablesWeights} />
)

export { VariablesIcon }
