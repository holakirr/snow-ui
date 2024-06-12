import type { CustomIcon } from "../../../types";
import { RightbarWeights } from "../defs";
import { CustomIconBase } from "../lib";

const RightbarIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={RightbarWeights} />;

RightbarIcon.displayName = "RightbarIcon";
export { RightbarIcon };
