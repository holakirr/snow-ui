import type { CustomIcon } from "../../../types";
import { ArrowLineDownWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineDownIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowLineDownWeights} />
);

ArrowLineDownIcon.displayName = "ArrowLineDownIcon";
export { ArrowLineDownIcon };
