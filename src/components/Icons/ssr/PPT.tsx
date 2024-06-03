import type { CustomIcon } from "@types";
import { PPTWeights } from "../defs";
import { CustomIconBase } from "../lib";

const PPTIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={PPTWeights} />;

PPTIcon.displayName = "PPTIcon";
export { PPTIcon };
