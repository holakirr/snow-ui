import type { CustomIcon } from "@types";
import { DotWeights } from "../defs";
import { CustomIconBase } from "../lib";

const DotIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={DotWeights} />;

DotIcon.displayName = "DotIcon";
export { DotIcon };
