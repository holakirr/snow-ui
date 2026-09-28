import { TextAWeights } from '../defs/TextA'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const TextAIcon: Icon = (props) => (
  <IconBase {...props} weights={TextAWeights} />
)

export { TextAIcon }
