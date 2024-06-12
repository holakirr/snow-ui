import type { CustomIcon } from "../../../types";
import { CloseWeights } from "../defs";
import { CustomIconBase } from "../lib";

const CloseIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={CloseWeights} />;

CloseIcon.displayName = "CloseIcon";
export { CloseIcon };
