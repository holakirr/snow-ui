import { AIWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const AIIcon: Icon = (props) => <IconBase {...props} weights={AIWeights} />;

AIIcon.displayName = "AIIcon";
export { AIIcon };
