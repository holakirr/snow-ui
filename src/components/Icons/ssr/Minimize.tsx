import type { CustomIcon } from "@types";
import { MinimizeWeights } from "../defs";
import { CustomIconBase } from "../lib";

const MinimizeIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={MinimizeWeights} />;

MinimizeIcon.displayName = "MinimizeIcon";
export { MinimizeIcon };
