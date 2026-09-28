import { ClipboardWeights } from '../defs/Clipboard'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const ClipboardIcon: Icon = (props) => (
  <IconBase {...props} weights={ClipboardWeights} />
)

export { ClipboardIcon }
