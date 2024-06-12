import type { CustomIcon } from "../../../types";
import { CopyWeights } from "../defs";
import { CustomIconBase } from "../lib";

const CopyIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={CopyWeights} />;

CopyIcon.displayName = "CopyIcon";
export { CopyIcon };
