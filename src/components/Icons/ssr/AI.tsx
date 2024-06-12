import type { CustomIcon } from "../../../types";
import { AIWeights } from "../defs";
import { CustomIconBase } from "../lib";

const AIIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={AIWeights} />;

AIIcon.displayName = "AIIcon";
export { AIIcon };
