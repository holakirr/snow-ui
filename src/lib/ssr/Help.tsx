import { HelpWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const HelpIcon: Icon = (props) => <IconBase {...props} weights={HelpWeights} />;

HelpIcon.displayName = "HelpIcon";
export { HelpIcon };
