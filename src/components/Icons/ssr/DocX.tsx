import type { CustomIcon } from "@types";
import { DocXWeights } from "../defs";
import { CustomIconBase } from "../lib";

const DocXIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={DocXWeights} />;

DocXIcon.displayName = "DocXIcon";
export { DocXIcon };
