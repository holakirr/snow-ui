import type { CustomIcon } from "../../../types";
import { ArrowLineUpDownWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineUpDownIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowLineUpDownWeights} />
);

ArrowLineUpDownIcon.displayName = "ArrowLineUpDownIcon";
export { ArrowLineUpDownIcon };
