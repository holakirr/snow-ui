import { VariablesWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const VariablesIcon: Icon = (props) => <IconBase {...props} weights={VariablesWeights} />;

VariablesIcon.displayName = "VariablesIcon";
export { VariablesIcon };
