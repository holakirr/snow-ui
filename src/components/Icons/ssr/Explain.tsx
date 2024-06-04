import type { CustomIcon } from "@types";
import { ExplainWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ExplainIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={ExplainWeights} />;

ExplainIcon.displayName = "ExplainIcon";
export { ExplainIcon };
