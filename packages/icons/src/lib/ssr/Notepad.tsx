import { NotepadWeights } from '../defs/Notepad'
import { IconBase } from '../IconBase'
import type { Icon } from '../types'

const NotepadIcon: Icon = (props) => (
  <IconBase {...props} weights={NotepadWeights} />
)

export { NotepadIcon }
