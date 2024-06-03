import type { CustomIcon } from "@types";
import { NotepadWeights } from "../defs";
import { CustomIconBase } from "../lib";

const NotepadIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={NotepadWeights} />;

NotepadIcon.displayName = "NotepadIcon";
export { NotepadIcon };
