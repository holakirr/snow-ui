import { LineWeights } from '../defs/Line'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const LineIcon: Icon = (props) => <IconBase {...props} weights={LineWeights} />

export { LineIcon }
