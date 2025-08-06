import { ExplainWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const ExplainIcon: Icon = (props) => <IconBase {...props} weights={ExplainWeights} />;

ExplainIcon.displayName = "ExplainIcon";
export { ExplainIcon };
