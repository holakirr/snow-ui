import type { CustomIcon } from "@types";
import { LineWeights } from "../defs";
import { CustomIconBase } from "../lib";

const LineIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={LineWeights} />;

LineIcon.displayName = "LineIcon";
export { LineIcon };
