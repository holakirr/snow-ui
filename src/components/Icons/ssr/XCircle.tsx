import type { CustomIcon } from "../../../types";
import { XCircleWeights } from "../defs";
import { CustomIconBase } from "../lib";

const XCircleIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={XCircleWeights} />;

XCircleIcon.displayName = "XCircleIcon";
export { XCircleIcon };
