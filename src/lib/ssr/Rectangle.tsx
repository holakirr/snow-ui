import { RectangleWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const RectangleIcon: Icon = (props) => <IconBase {...props} weights={RectangleWeights} />;

RectangleIcon.displayName = "RectangleIcon";
export { RectangleIcon };
