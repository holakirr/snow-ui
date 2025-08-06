import { VerticalScreenWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const VerticalScreenIcon: Icon = (props) => <IconBase {...props} weights={VerticalScreenWeights} />;

VerticalScreenIcon.displayName = "VerticalScreenIcon";
export { VerticalScreenIcon };
