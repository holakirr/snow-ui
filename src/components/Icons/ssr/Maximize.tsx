import type { CustomIcon } from "@types";
import { MaximizeWeights } from "../defs";
import { CustomIconBase } from "../lib";

const MaximizeIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={MaximizeWeights} />;

MaximizeIcon.displayName = "MaximizeIcon";
export { MaximizeIcon };
