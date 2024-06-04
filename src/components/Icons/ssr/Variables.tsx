import type { CustomIcon } from "@types";
import { VariablesWeights } from "../defs";
import { CustomIconBase } from "../lib";

const VariablesIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={VariablesWeights} />
);

VariablesIcon.displayName = "VariablesIcon";
export { VariablesIcon };
