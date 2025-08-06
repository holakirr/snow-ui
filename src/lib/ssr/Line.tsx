import { LineWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const LineIcon: Icon = (props) => <IconBase {...props} weights={LineWeights} />;

LineIcon.displayName = "LineIcon";
export { LineIcon };
