import { RectangleWeights } from "../defs/Rectangle";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const RectangleIcon: Icon = (props) => <IconBase {...props} weights={RectangleWeights} />;

export { RectangleIcon };
