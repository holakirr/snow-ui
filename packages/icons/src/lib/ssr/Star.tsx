import { StarWeights } from '../defs/Star'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const StarIcon: Icon = (props) => <IconBase {...props} weights={StarWeights} />

export { StarIcon }
