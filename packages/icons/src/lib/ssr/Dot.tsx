import { DotWeights } from '../defs/Dot'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const DotIcon: Icon = (props) => <IconBase {...props} weights={DotWeights} />

export { DotIcon }
