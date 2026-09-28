import { HelpWeights } from "../defs/Help";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const HelpIcon: Icon = (props) => <IconBase {...props} weights={HelpWeights} />;

export { HelpIcon };
