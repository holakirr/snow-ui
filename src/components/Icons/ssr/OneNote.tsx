import type { CustomIcon } from "@types";
import { OneNoteWeights } from "../defs";
import { CustomIconBase } from "../lib";

const OneNoteIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={OneNoteWeights} />;

OneNoteIcon.displayName = "OneNoteIcon";
export { OneNoteIcon };
