import type { CustomIcon } from "../../../types";
import { GotoWeights } from "../defs";
import { CustomIconBase } from "../lib";

const GotoIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={GotoWeights} />;

GotoIcon.displayName = "GotoIcon";
export { GotoIcon };
