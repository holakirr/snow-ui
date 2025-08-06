import { GotoWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const GotoIcon: Icon = (props) => <IconBase {...props} weights={GotoWeights} />;

GotoIcon.displayName = "GotoIcon";
export { GotoIcon };
