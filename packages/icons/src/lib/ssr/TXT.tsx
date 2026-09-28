import { TXTWeights } from '../defs/TXT'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const TXTIcon: Icon = (props) => <IconBase {...props} weights={TXTWeights} />

export { TXTIcon }
